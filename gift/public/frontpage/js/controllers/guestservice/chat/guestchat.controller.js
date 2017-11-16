app.controller('GuestChatController', function ($scope, $window, $http, $uibModal, $timeout, $interval, $compile, AuthService, toaster, TranslateService, socket, GuestService, DateService) {
	var profile = AuthService.GetCredentials();
	$scope.agent_id = profile.id;

    $scope.onFilterReset = function() {
        $scope.dateRangeOption = {
            format: 'YYYY-MM-DD',
            startDate: moment().subtract(1,'d').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD')
        };

        $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

        $scope.agent_tags = [];
        $scope.room_tags = [];       
    };

    function initChatSessionFilter() {
        $scope.status_filter_list = [
                                    'Today',
                                    'All',
                                    'Waiting',
                                    'Active',
                                    'Ended',
                                ];
        $scope.status_filter = $scope.status_filter_list[0];
       
        $scope.filter_is_open = false; 

        $scope.onFilterReset();
    }
    
    initChatSessionFilter();

    function getGuestTaskItemList() {
        var profile = AuthService.GetCredentials();

        var request = {};
        request.property_id = profile.property_id;
        request.type = 1;
       
        $http({
            method: 'POST',
            url: '/frontend/guestservice/tasklist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.task_list_item = response.data;
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });
    }

    getGuestTaskItemList();


    $scope.refresh = $interval(function() {
        if( $scope.current_session && $scope.current_session.id > 0 ) {
            if( $scope.current_session.status == 'Waiting' )
            {
                $scope.current_session.duration = '00:00:00';
                $scope.current_session.start_time = '--:--';
                var diff_time = moment() - moment($scope.current_session.updated_at, "YYYY-MM-DD HH:mm:ss") + 0;
                $scope.current_session.wait_time = moment("2015-01-01").startOf('day')
                                                        .seconds(diff_time / 1000)
                                                        .format('HH:mm:ss');                  
            }

            if( $scope.current_session.status == 'Active' )
            {
                var diff_time = moment() - moment($scope.current_session.start_time, "YYYY-MM-DD HH:mm:ss") + 0;
                $scope.current_session.duration = moment("2015-01-01").startOf('day')
                                                        .seconds(diff_time / 1000)
                                                        .format('HH:mm:ss');                
            }
        }
    }, 1 * 1000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined($scope.refresh)) {
            $interval.cancel($scope.refresh);
            $scope.refresh = undefined;
        }
    });

    $scope.prioritylist = [];
    GuestService.getPriorityList()
        .then(function(response) {
           $scope.prioritylist = response.data;
        });


    function getChatSessionList(refresh_flag) {
        var profile = AuthService.GetCredentials();

        var request = {};
        request.property_id = profile.property_id;
        request.status = $scope.status_filter;
        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);

        request.agent_ids = [];
        for(var i = 0; i < $scope.agent_tags.length; i++ )
            request.agent_ids.push($scope.agent_tags[i].id);

        request.room_ids = [];
        for(var i = 0; i < $scope.room_tags.length; i++ )
            request.room_ids.push($scope.room_tags[i].id);

        var unread_count = {};
       
        if( $scope.chat_session_list )
        {
            for(var i = 0; i < $scope.chat_session_list.length; i++)
                unread_count[$scope.chat_session_list[i].id] = $scope.chat_session_list[i].unread;            
        }
        
        
        $http({
            method: 'POST',
            url: '/frontend/guestservice/chatsessionlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.chat_session_list = response.data;  

            // set unread count          
            for(var i = 0; i < $scope.chat_session_list.length; i++)
            {
                if( unread_count[$scope.chat_session_list[i].id] )
                    $scope.chat_session_list[i].unread = unread_count[$scope.chat_session_list[i].id];
            }

            if( $scope.chat_session_list.length > 0 && refresh_flag == true )
            {
            	$scope.current_session = $scope.chat_session_list[0];
                getChatHistory();
            }
            else
                clearCurrentSession();

            if( refresh_flag == false )
            {
                var exist_flag = false;
            	for(var i = 0; i < $scope.chat_session_list.length; i++)
            	{
            		if( $scope.current_session.id == $scope.chat_session_list[i].id )
            		{
            			$scope.current_session = $scope.chat_session_list[i];
                        exist_flag = true;
            			break;
            		}
            	}

                if( exist_flag == false )   // select default one
                {
                    if( $scope.chat_session_list.length > 0 )
                    {
                        $scope.current_session = $scope.chat_session_list[0];
                        getChatHistory();
                    }
                    else
                        clearCurrentSession();
                }
            }
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });
    }

    getChatSessionList(true);

    $scope.onSelectStatus = function(status) {
        $scope.status_filter = status;
        getChatSessionList(true);
    }

    function clearCurrentSession() {
        $scope.current_session = {};
        $scope.current_session.id = 0;
        $scope.current_session.status = 'Ended';
        $scope.current_session.lang_code = 'en';
    }

    $scope.$on('guest_chat_event', function(event, args){
  		var message = args;

  		if( message.sub_type == 'request_chat' )
			getChatSessionList(false);

		if( message.sub_type == 'accept_chat' )
			getChatSessionList(false);

		if( message.sub_type == 'end_chat' )
			getChatSessionList(false);

		if( message.sub_type == 'logout_chat' )
			getChatSessionList(false);

		if( message.sub_type == 'transfer_chat' )
			getChatSessionList(false);

		if( message.sub_type == 'cancel_transfer' )
			getChatSessionList(false);
    });

    $scope.onSelectChatSession = function(row) {
    	$scope.current_session = row;
        getChatHistory();
    }

    $scope.onSelectChatHistorySession = function(row) {
        var profile = AuthService.GetCredentials();

        $scope.guest_history_messages = [];
        $scope.history_chat_session = row;

        var request = {};

        request.session_id = row.id;
        request.property_id = profile.property_id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/chathistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.guest_history_messages = response.data;                
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to get Chat History.');
        })
        .finally(function() {

        });
    }

    $scope.onAcceptChat = function(session) {
    	$scope.acceptChat(session);
    }

    $scope.acceptChat = function(session) {
        var request = {};
        var profile = AuthService.GetCredentials();

        request.session_id = session.id;
        request.agent_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/acceptchat',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(function (response) {
            var data = response.data;

            if( data.code != 200)
            {
                toaster.pop('info', data.message);
                return;
            }
        }).catch(function (response) {
        })
        .finally(function () {
            
        });
    }

    $scope.onEndChat = function(session) {
    	$scope.endChat(session);
    }

    $scope.endChat = function(session) {
        var request = {};
        var profile = AuthService.GetCredentials();

        request.session_id = session.id;
        request.agent_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/endchatfromagent',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(function (response) {
            var data = response.data;

            if( data.code != 200)
            {
                toaster.pop('error', data.message);
                return;
            }
        }).catch(function (response) {
        })
        .finally(function () {
            
        });
    }

    $scope.onTransferRequest = function (session) {
        var modalInstance = $uibModal.open({
            templateUrl: 'transfer_select_dialog.html',
            controller: 'TransferSelectDialogCtrl',
            resolve: {
                                                
            }
        });

        modalInstance.result.then(function (agent) {
            transferChatToOtherAgent(agent);
        }, function () {

        });
    }

    function transferChatToOtherAgent(agent) {
    	var request = {};
        var profile = AuthService.GetCredentials();

        request.session_id = $scope.current_session.id;
        request.origin_agent_id = profile.id;
        request.new_agent_id = agent.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/transferchat',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(function (response) {
            var data = response.data;

            if( data.code != 200)
            {
                toaster.pop('error', data.message);
                return;
            }
        }).catch(function (response) {
        })
        .finally(function () {
            
        });
    }

    $scope.onTransferCancel = function (session) {
        var request = {};
        var profile = AuthService.GetCredentials();

        request.session_id = $scope.current_session.id;
        
        $http({
            method: 'POST',
            url: '/frontend/guestservice/canceltransfer',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(function (response) {
            var data = response.data;

            if( data.code != 200)
            {
                toaster.pop('error', data.message);
                return;
            }
        }).catch(function (response) {
        })
        .finally(function () {
            
        });
    }

    $scope.onSendMessage = function(message) {
        if( !message )
            return;

        var profile = AuthService.GetCredentials();
        var msg = {};

        msg.property_id = profile.property_id;
        msg.session_id = $scope.current_session.id;
        msg.agent_id = profile.id;
        msg.guest_id = $scope.current_session.guest_id;
        msg.lang_code = $scope.current_session.lang_code;
        msg.agent_name = profile.first_name + ' ' + profile.last_name;
        
        msg.text = message;
        msg.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        msg.direction = 1;  // outgoing

        if( msg.lang_code != 'en')
        {
            TranslateService.translate(msg.text, 'en', msg.lang_code)
            .then(function(response) {
                var data = response.data.data;
                msg.text_trans = data.translations[0].translatedText;
            }).catch(function(response) {               
            })
            .finally(function() {              
                $scope.messages.push(msg);        
                socket.emit('agent_msg', msg);
            });    
        }
        else
        {
            msg.text_trans = '';
            $scope.messages.push(msg);   
            socket.emit('agent_msg', msg);
        }

        $scope.current_session.chat = '';
    }

    $scope.onChangeChat = function(message) {
        console.log('input is changed');
        
        if( !$scope.pause )
        {
            console.log('typing is started'); 

            sendTypingEvent(0);
        }

        $timeout.cancel($scope.pause);
        $scope.pause = $timeout(function() {        
            console.log('typing is ended');   
            $scope.pause = null;

            sendTypingEvent(1);

        }, 6000);
    }

    function sendTypingEvent(typing_flag) {
        var profile = AuthService.GetCredentials();

        var msg = {};

        msg.property_id = profile.property_id;
        msg.session_id = $scope.current_session.id;
        msg.agent_id = profile.id;
        msg.guest_id = $scope.current_session.guest_id;
        msg.typing_flag = typing_flag;  // type start

        socket.emit('agent_typing', msg);        
    }

    $scope.$on('guest_message', function(event, args){
        if(args.session_id != $scope.current_session.id )
        {
            for(var i = 0; i < $scope.chat_session_list.length; i++) 
            {
                if( $scope.chat_session_list[i].id == args.session_id )
                {
                    if( !$scope.chat_session_list[i].unread )
                        $scope.chat_session_list[i].unread = 0;
                    
                    $scope.chat_session_list[i].unread++;
                    break;
                }
            }
            return;
        }

        var message = angular.copy(args);

        $scope.current_session.typing_flag = 1;

        message.direction = 0; // incoming

        $scope.current_session.lang_code = message.language;
        
        for(var i = 0; i < $scope.task_list_item.length; i++)
            message.text = message.text.replace($scope.task_list_item[i].task, '<a ng-dblclick="onCreateTask(' + i + ', \'' + $scope.task_list_item[i].task + '\')" ng-sglclick="onSelectTask(' + i + ', \'' + $scope.task_list_item[i].task + '\')">' + $scope.task_list_item[i].task + '</a>');

        // $compile(message.text)($scope);
        $scope.messages.push(message);  
       
    });

    $scope.$on('guest_typing', function(event, args){
        var message = args;
        if(message.session_id != $scope.current_session.id )
            return;

        $scope.current_session.typing_flag = message.typing_flag;
    });

    $scope.$on('agent_message', function(event, args){
        var message = args;
        if(message.session_id != $scope.current_session.id )    // current sessio's guest message
            return;

        if( message.agent_id == $scope.agent_id)    // self send message
            return;
       
        // for(var i = 0; i < $scope.task_list_item.length; i++)
        //     message.text = message.text.replace($scope.task_list_item[i].task, '<a ng-click="onCreateTask(' + $scope.task_list_item[i].id + ', \'' + $scope.task_list_item[i].task + '\')">' + $scope.task_list_item[i].task + '</a>');

        $scope.messages.push(message);  
    });

    function getChatHistory() {
        var profile = AuthService.GetCredentials();

        $scope.messages = [];

        var request = {};

        request.session_id = $scope.current_session.id;
        request.property_id = profile.property_id;

        if( !(request.session_id > 0) )
            return;

        $scope.current_session.lang_code = $scope.current_session.language;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/chathistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.messages = response.data;     
            for(var i = $scope.messages.length - 1; i >= 0; i-- )
            {
                if( $scope.messages[i].direction == 0 ) // incoming guest message
                {
                    $scope.current_session.lang_code = $scope.messages[i].language;
                    break;
                }
            } 
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to get Chat History.');
        })
        .finally(function() {

        });

        $scope.current_session.unread = 0;

        $scope.$broadcast('room_selected', $scope.current_session);
        getChatSessionHistory();
    }

    function getChatSessionHistory() {
        var profile = AuthService.GetCredentials();

        $scope.chat_session_history_list = [];

        $scope.chat_table_style = {};

        var request = {};

        request.guest_id = $scope.current_session.guest_id;
        request.property_id = profile.property_id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/chatsessionhistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.chat_session_history_list = response.data;                 
            var chat_table_height = ($window.innerHeight - 410);
            var limit = chat_table_height / 28;
            if( response.data.length > limit )
            {
                $scope.chat_table_style = {
                    'height': chat_table_height + 'px',
                    'overflow-y': 'auto'
                };
            } 
            else
            {
                $scope.chat_table_style = {};  
            }
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to get Chat History.');
        })
        .finally(function() {

        });
    }

    $scope.loadAgentFilters = function(query) {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.property_id = profile.property_id;
        request.filter = query;
        request.agent_id = 0;

        return $http({
            method: 'POST',
            url: '/frontend/guestservice/chatagentlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        });
    };

    $scope.loadRoomFilters = function(query) {
        var request = {};

        var profile = AuthService.GetCredentials();

        request.property_id = profile.property_id;
        request.room = query;

        return $http.get('/list/roomlist?property_id=' + profile.property_id + '&room=' + query);
    };

    $scope.onFilterClose = function() {
        $scope.filter_is_open = false;        
    };


    $scope.onFilterSearch = function() {
        $scope.onFilterClose();

        getChatSessionList(true);

        $scope.onFilterReset();
    };

    $scope.onCreateTask = function(num, task_name) { 
        $scope.$broadcast('create_new_task', $scope.task_list_item[num]);
    }

    $scope.onSelectTask = function(num, task_name) { 
        $scope.$broadcast('select_new_task', $scope.task_list_item[num]);
    }

});

app.controller('TransferSelectDialogCtrl', function($scope, $http, AuthService, $uibModalInstance) {
	$scope.selected_agent = {};
	var profile = AuthService.GetCredentials();	

    var request = {};

    request.property_id = profile.property_id;
    request.agent_id = profile.id;

    $http({
        method: 'POST',
        url: '/frontend/guestservice/chatactiveagentlist',
        data: request,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    }).then(function(response) {
        console.log(response);  
        $scope.agent_list = response.data;

    }).catch(function(response) {
    })
    .finally(function() {

    });

    $scope.onSelectAgent = function(row) {
    	$scope.selected_agent = row;
    }

    $scope.ok = function () {            	
    	if( $scope.selected_agent.id > 0 )
        	$uibModalInstance.close($scope.selected_agent);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    
});