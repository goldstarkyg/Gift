app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
}]);

app.controller('AgentStatusController', function ($scope,  $rootScope, $http, $timeout, $window, $interval, AuthService, CountryService, toaster,$uibModal, liveserver, $filter) {
    var MESSAGE_TITLE = 'Call AgetnStatus';
    //$scope.screenheight = $window.innerHeight;
   // $scope.agent_status.status = 'Ringing';



    if( $rootScope.agent_status.caller == undefined )
        $rootScope.agent_status.caller = {};

    $scope.isHidden = true;

    $scope.ticket = {};

    var search_option = '';

    $scope.countrylist = CountryService.countrylist;

    $scope.ticket.type = 'Other';
    $scope.ticket.sendconfirm = 'Email';
    $scope.agent_profile = AuthService.GetCredentials();
    // pip
    $scope.isLoading = false;
    $scope.datalist = [];

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 20,
        sort: 'desc',
        field: 'vr.id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.isLoadingSecond = false;
    $scope.datalistSecond = [];
    //  pagination
    $scope.paginationOptionsSecond = {
        pageNumber: 1,
        pageSize: 20,
        sort: 'desc',
        field: 'vr.id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.statuses = [
        'Online',
        'Available',
        'On Break',
        'Not Available',
        'Log out'
    ];
    $scope.onShowImage = function() {
        var size = 'lg';
        var modalInstance = $uibModal.open({
            templateUrl: 'imageLoadModal.html',
            controller: 'ImgLoadCropCtrl',
            size: size
        });
    }

    function initData() {
        var request = {};
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        $http({
            method: 'POST',
            url: '/frontend/call/agentextlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.extensionlist = response.data;
            }).catch(function(response) {

            })
            .finally(function() {
            });

        $scope.select_status = $rootScope.agent_status.status;
    }

    initData();
    $scope.select_status_view = false;
    $scope.onClickStatus = function(status)
    {
      $scope.select_status = status;
      //  var propertyValue = item;
        if($scope.select_status == 'Online') {
            $scope.status_color = "background-color: #23b7e5; border: 1px solid #23b7e5; ";
            $scope.statuses = [
                'Online',
                'On Break',
                'Available',
                'Log out'
            ];
        }
        if($scope.select_status == 'Available') {
            $scope.status_color = "background-color: #27c24c; border: 1px solid #27c24c; ";
            $scope.statuses = [
                'Available',
                'On Break',
                'Log out',
            ];
        }
        if($scope.select_status == 'On Break') {
            $scope.status_color = "background-color: #fad733; border: 1px solid #fad733; ";
            $scope.statuses = [
                'On Break',
                'Available',
                'Log out'
            ];
        }
        if($scope.select_status == 'Log out') {
            $scope.status_color = "background-color: #cfd8dc; border: 1px solid #cfd8dc; ";
            $scope.statuses = [
                'Log out',
                'Online',
                'Available',
            ];
        }
        if($scope.select_status == 'Idle') {
            $scope.status_color = "background-color: #fad733; border: 1px solid #fad733; ";
            $scope.statuses = [
                'Idle',
                'Available',
                'On Break',
                'Log out'
            ];
        }

        if($scope.select_status == 'Ringing') {
            $scope.status_color = "background-color: #f05050; border: 1px solid #e4b9b9; ";
            $scope.statuses = [
                'Ringing',
            ];
        }

        if($scope.select_status == 'Outgoing') {
            $scope.status_color = "background-color: #f05050; border: 1px solid #e4b9b9; ";
            $scope.statuses = [
                'Outgoing',
            ];
        }
        if($scope.select_status == 'Wrapup') {
            $scope.status_color = "background-color: #337ab7; border: 1px solid #e4b9b9; ";
            $scope.statuses = [
                'Available',
                'On Break',
                'Log out',
                'Outgoing',
            ];
        }

        if($scope.select_status == 'Busy') {
            $scope.status_color = "background-color: #f05050; border: 1px solid #e4b9b9; ";
            $scope.statuses = [
                'Busy',
            ];
        }

        if($rootScope.agent_status.status == 'Available' ||
            $rootScope.agent_status.status ==  'Online'||
            $rootScope.agent_status.status == 'On Break' ||
            $rootScope.agent_status.status == 'Log out' ||
            $rootScope.agent_status.status == 'Idle' ||
            $rootScope.agent_status.status == 'Wrapup' ||
            $rootScope.agent_status.status == 'Not Available') $scope.select_status_view = false;
        else $scope.select_status_view = true;
    }
    $scope.onClickStatus($rootScope.agent_status.status);
    $scope.onChangeCallStatus = function(status) {

        var root_status = $rootScope.agent_status.status;
        var page_status = status;
        if(root_status == page_status) return ;
        var agentstatus = {};
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var first_name = profile.first_name;
        agentstatus.agent_id = profile.id;
        agentstatus.status = status;
        //agentstatus.extension = $rootScope.agent_status.extension;
        agentstatus.property_id = profile.property_id;

        if(agentstatus.status) {
            $http({
                method: 'POST',
                url: '/frontend/call/changestatus',
                data: agentstatus,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function(response) {
                    toaster.pop('success', MESSAGE_TITLE, 'Agent status has been added successfully');
                    $rootScope.agent_status.status = response.data.status;
                    $rootScope.agent_status.created_at = response.data.created_at;
                    $window.document.title = 'HotLync | Ennovatech';
                    $scope.onClickStatus($rootScope.agent_status.status);
                    if($rootScope.agent_status.status == 'Available' ||
                        $rootScope.agent_status.status == 'Log out') {
                        clickExtension(property_id, first_name, $rootScope.agent_status.status, $rootScope.agent_status.extension);
                    }
                    console.log(response);
                }).catch(function(response) {
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to add Agent status');
                    console.error('Gists error', response.status, response.data);
                })
                .finally(function() {
                    $scope.isLoading = false;
                });
        }
    }

    $scope.onChangeExtension = function(extension) {

        var profile = AuthService.GetCredentials();
        var agentstatus = {};
        agentstatus.agent_id = profile.id;
        agentstatus.extension = extension;
        agentstatus.property_id = profile.property_id;

        $http({
            method: 'POST',
            url: '/frontend/call/changeextension',
            data: agentstatus,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Agent extension has been added successfully');
                $rootScope.agent_status.extension = response.data.extension;
                console.log(response);
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to change Agent extension');
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });
    }

    $scope.extension_status = '';
    //$scope.extension_status = 'Transfer';
    $scope.transfer_number = '';
    $scope.onClickExtension = function() {
        $scope.extension_status = 'Transfer' ;
    }
    
    $scope.onClickTransfer = function () {
        $scope.transfer_number = $scope.dial.number ;
        if( $scope.transfer_number == '' )
        {
            toaster.pop('error', 'Please input Transfer Number');
            return;
        }

       // $scope.extension_status = '';

        // var request = {};
        // request.ticket_id = $rootScope.agent_status.ticket.id;
        // request.channel_id = $rootScope.agent_status.ticket.channel_id;
        // request.transfer_ext = $scope.transfer_number;
        // //$scope.transfer_number = '';
        // $http({
        //     method: 'POST',
        //     url: liveserver.api + 'transfer',
        //     data: request,
        //     headers: {'Content-Type': 'application/json; charset=utf-8'}
        // })
        //     .then(function(response) {
        //         console.log(response);
        //     }).catch(function(response) {
        //     })
        //     .finally(function() {
        //     });
    }

    $scope.onClickConference = function() {
        var request = {};
        $http({
            method: 'POST',
            url: liveserver.api + '/channels/' + $rootScope.agent_status.ticket.channel_id + '/hold',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
            }).catch(function(response) {
            })
            .finally(function() {
            });
    }

    $scope.onClickHoldResume = function() {
        var request = {};

        request.ticket_id = $rootScope.agent_status.ticket.id;
        request.channel_id = $rootScope.agent_status.ticket.channel_id;
        request.status = $rootScope.agent_status.ticket.dial_status;

        $http({
            method: 'POST',
            url: liveserver.api + 'holdresume',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
            }).catch(function(response) {
            })
            .finally(function() {
            });
    }

    $scope.onClickHangup = function() {
        var request = {};

        request.ticket_id = $rootScope.agent_status.ticket.id;
        request.channel_id = $rootScope.agent_status.ticket.channel_id;
        request.status = $rootScope.agent_status.ticket.dial_status;

        $http({
            method: 'POST',
            url: liveserver.api + 'hangup',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
            }).catch(function(response) {
            })
            .finally(function() {
            });
    }

    $scope.onClickMuteUnmute = function() {
        var request = {};

        request.ticket_id = $rootScope.agent_status.ticket.id;
        request.channel_id = $rootScope.agent_status.ticket.channel_id;
        request.status = $rootScope.agent_status.ticket.dial_status;
        if( $rootScope.agent_status.ticket.mute_flag == 0 )
            request.mute = 1;
        else
            request.mute = 0;

        $http({
            method: 'POST',
            url: liveserver.api + 'mute',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
            }).catch(function(response) {
            })
            .finally(function() {
            });
    }

    $scope.getCallTicketID = function(agent_status) {
        if( agent_status && agent_status.ticket )
            return sprintf('%06d', agent_status.ticket.id);
        else
            '';
    }

    $scope.onSaveProfile = function() {
        var request = {};
        var profile = AuthService.GetCredentials();
        request = angular.copy($rootScope.agent_status.caller);

        request.property_id = profile.property_id;
        request.callerid = $rootScope.agent_status.ticket.callerid;

        request.user_id = profile.id;
        request.ticket_id = $rootScope.agent_status.ticket.id;
        request.type = $scope.ticket.type;
        request.comment = $scope.ticket.comment;
        request.follow = $scope.ticket.follow;
        request.success = $scope.ticket.success;
        request.confirm = $scope.ticket.confirm;
        request.sendconfirm = $scope.ticket.sendconfirm;


        $http({
            method: 'POST',
            url: '/frontend/call/savecalllog',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
                toaster.pop('success', MESSAGE_TITLE, 'Caller profile has been added successfully');
                if($rootScope.agent_status.status == 'Outgoing')
                    $rootScope.agent_status.status = 'Available';
                $scope.ticket = {};
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isChildLoading = false;
            });
    }
    $scope.category = '';
    $scope.onSelectCategory = function (selCategory) {
        $scope.category = selCategory;
        $scope.getDataList();
    }

    $scope.answered = 0;
    $scope.abandoned = 0;
    $scope.followup = 0;
    $scope.callback = 0;
    $scope.getDataList = function getDataList(tableState) {
        //here you could create a query string from tableState
        //fake ajax call
        $scope.isLoading = true;

        if( tableState != undefined )
        {
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            $scope.paginationOptions.pageNumber = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.paginationOptions.pageSize = pagination.number || $scope.paginationOptions.pageSize;  // Number of entries showed per page.
            $scope.paginationOptions.field = tableState.sort.predicate;
            $scope.paginationOptions.sort = tableState.sort.reverse ? 'desc' : 'asc';
        }


        var request = {};
        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.user_id = profile.id;
        var day = new Date(); day = moment(day).format("YYYY-MM-DD");
        request.day = day;
        request.category = $scope.category;
        request.searchoption = search_option;

        $http({
            method: 'POST',
            url: '/frontend/call/agentcalllist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.datalist = response.data.datalist;
                $scope.paginationOptions.totalItems = response.data.totalcount;

                var numberOfPages = 0;

                if( $scope.paginationOptions.totalItems < 1 )
                    numberOfPages = 0;
                else
                    numberOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);

                if( tableState != undefined )
                    tableState.pagination.numberOfPages = numberOfPages;
                else
                    $scope.tableState.pagination.numberOfPages = numberOfPages;

                $scope.paginationOptions.countOfPages = numberOfPages;

                $scope.answered = response.data.subcount.answered;
                $scope.abandoned = response.data.subcount.abandoned;
                $scope.followup = response.data.subcount.followup;

                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.answered = 0;
    $scope.abandoned = 0;
    $scope.followup = 0;
    $scope.callback = 0;
    $scope.queue = 0;

    $scope.getDataListSecond = function getDataListSecond(tableState) {
        //here you could create a query string from tableState
        //fake ajax call
        if( tableState != undefined )
        {
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            $scope.paginationOptionsSecond.pageNumber = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.paginationOptionsSecond.pageSize = pagination.number || $scope.paginationOptionsSecond.pageSize;  // Number of entries showed per page.
            $scope.paginationOptionsSecond.field = tableState.sort.predicate;
            $scope.paginationOptionsSecond.sort = tableState.sort.reverse ? 'desc' : 'asc';
        }

        var request = {};
        request.page = $scope.paginationOptionsSecond.pageNumber;
        request.pagesize = $scope.paginationOptionsSecond.pageSize;
        request.field = $scope.paginationOptionsSecond.field;
        request.sort = $scope.paginationOptionsSecond.sort;

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.user_id = profile.id;
        if( $rootScope.agent_status && $rootScope.agent_status.ticket && $rootScope.agent_status.ticket.callerid )
        {
            $scope.isLoadingSecond = true;
            request.caller_id = $rootScope.agent_status.ticket.callerid;
            $http({
                method: 'POST',
                url: '/frontend/call/agentcalllist',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function(response) {
                    $scope.datalistSecond = response.data.datalist;
                    $scope.paginationOptionsSecond.totalItems = response.data.totalcount;

                    var numberOfPages = 0;

                    if( $scope.paginationOptionsSecond.totalItems < 1 )
                        numberOfPages = 0;
                    else
                        numberOfPages = parseInt(($scope.paginationOptionsSecond.totalItems - 1) / $scope.paginationOptionsSecond.pageSize + 1);

                    if( tableState != undefined )
                        tableState.pagination.numberOfPages = numberOfPages;
                    else
                        $scope.tableState.pagination.numberOfPages = numberOfPages;

                    $scope.paginationOptionsSecond.countOfPages = numberOfPages;

                    console.log(response);
                }).catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                })
                .finally(function() {
                    $scope.isLoadingSecond = false;
                });
        }
    };

    $scope.onPrevPage = function() {
        if( $scope.paginationOptions.numberOfPages <= 1 )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages - 1;
        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        $scope.isLoading = true;
        $scope.getDataList();
    }

    $scope.onNextPage = function() {
        if( $scope.paginationOptions.totalItems < 1 )
            $scope.paginationOptions.countOfPages = 0;
        else
            $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize) + 1;

        if( $scope.paginationOptions.numberOfPages >= $scope.paginationOptions.countOfPages )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages + 1;
        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        $scope.isLoading = true;
        $scope.getDataList();
    }

    $scope.isCallbackLoading = false;
    $scope.getCallbackList = function() {
        var request = {};
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        $scope.isCallbackLoading = true;
        $http({
            method: 'POST',
            url: '/frontend/call/callbacklist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.callbacklist = response.data.datalist;
                $scope.callback = response.data.callback;
                $scope.followup = response.data.followup;
                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isCallbackLoading = false;
            });
    }

    $scope.onTakeCallback = function(row) {
        var request = {};
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.user_id = profile.id;
        request.ticket_id = row.id;

        $http({
            method: 'POST',
            url: '/frontend/call/takecallback',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });
    }

    $scope.viewDay = function(day) {
        
    }
     $scope.Ticketnumber = function(ticket){
         return sprintf('%05d', ticket);
         if( ticket == undefined )
             return 0;
    }

    $scope.$on('call_event', function(event, args) {
        console.log(args);
        var profile = AuthService.GetCredentials();
        if(args.user_id != profile.id )
            return;

        $scope.getDataList();
        $scope.getDataListSecond();

        $scope.onClickStatus($rootScope.agent_status.status);
    });

    $scope.$on('agent_status_change', function(event, args) {
        console.log(args);
        var profile = AuthService.GetCredentials();
        if(args.user_id != profile.id )
            return;
        $scope.onClickStatus($rootScope.agent_status.status);
    });

    $scope.$on('callback_event', function(event, args) {
        console.log(args);
        $scope.getCallbackList();
    });

    $scope.dial = {};
    $scope.dial.number = '';
    var dialnumberorigin = '';
    //$scope.agent_status.status = 'Busy';
    //$scope.extension_status = 'Transfer';
    $scope.onDial = function(event,number) {
        var current_number = '';
        var keyCode = event.which || event.keyCode;
        if(number == 'key') {

        }
        if(number != 'key') {
            if ( $scope.dial.number == undefined)  $scope.dial.number = '';
            if (number == 'del') {
                $scope.dial.number = '';
            } else if (number == 'back') {
                $scope.dial.number =  $scope.dial.number.substr(0,  $scope.dial.number.length - 1);
            } else {
                current_number =  $scope.dial.number + number;
                $scope.dial.number = current_number;
                dialnumberorigin = $scope.dial.number;
            }
            focus('text');
        }
    }

    $scope.searchtext = '';
    $scope.onSearch = function() {
        search_option = $scope.searchtext;
        $scope.paginationOptions.pageNumber = 0;
        $scope.getDataList();
    }

});
