app.controller('ReasonController', function ($scope, $uibModalInstance, toaster, ticket, $filter) {
    $scope.ticket = ticket;
    $scope.save = function () {
        $uibModalInstance.close($scope.ticket.comment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('GuestServiceController', function ($scope, $rootScope,  $http, $aside, $timeout, $interval, $uibModal, $window, $stateParams,  toaster, hotkeys, GuestService, DateService, AuthService) {
    console.log($stateParams);

    $scope.statuses = [
        {id: 0, label: 'Completed'},
        {id: 1, label: 'Open'},
        {id: 2, label: 'Escalated'},
        {id: 3, label: 'Timeout'},
        {id: 4, label: 'Canceled'},
        {id: 5, label: 'Scheduled'},
        {id: 6, label: 'Assigned'},
        {id: 7, label: 'Waiting Escalated'},
        {id: 8, label: 'Unattended'},
    ];

    $scope.status_filter = {};

    $scope.tickets = [
        'All Tickets',
        //'Todays Tickets' ,
        'Last 24 Hours',
        'Tickets created by me',
    ];
    $scope.ticket_filter = {};

    $scope.priorities = [];
    $scope.priority_filter = {};

    $scope.departments = [];
    $scope.department_filter = {};

    $scope.types = [
        {id:1, type : 'Guest Request'},
        {id:2, type : 'Department Request'},
        {id:4, type : 'Managed Task'}
    ];
    $scope.type_filter = {};



    var ticket_id = $stateParams.ticket_id;
    if( ticket_id > 0 )
    {
        $http.get('/frontend/guestservice/ticketdetail?id=' + ticket_id)
            .then(function(response) {
                $scope.onSelectTicket(response.data);
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {

            });
    }

    $scope.prioritylist = [];
    GuestService.getPriorityList()
        .then(function(response) {
           $scope.prioritylist = response.data;
        });

    $scope.room_list = [];
    GuestService.getRoomList("")
        .then(function(response){
            $scope.room_list = response.data;
        });    

    $scope.location_list = [];    
    GuestService.getLocationList("")
        .then(function(response){
            $scope.location_list = response.data;
        });    

    $scope.staff_list = [];    
    GuestService.getStaffList("")
        .then(function(response){
            $scope.staff_list = response.data;
        });

    $scope.dept_list = [];        
    GuestService.getDepartList()
        .then(function(response) {
            $scope.dept_list = response.data.departlist;
        });    

    $scope.usergroup_list = [];    
    $http.get('/frontend/guestservice/usergrouplist')
        .then(function(response){
            $scope.usergroup_list = response.data;
        });    
    
    $scope.system_task_list = [];
    var profile = AuthService.GetCredentials();
    $http.get('/frontend/guestservice/systemtasklist?property_id=' + profile.property_id)
        .then(function(response) {
            $scope.system_task_list = response.data;               
        }).catch(function(response) {
            console.error('Gists error', response.status, response.data);
        })
        .finally(function() {

        });


    var MESSAGE_TITLE = 'Ticket Change';

    $scope.show = false;
    $scope.changeFilterShow = true;

    $scope.newTickets = [];
    $scope.selectedTickets = [];
    $scope.chat_room_list = [];

    
    $scope.max_ticket_no = 0;

    $scope.gs = GuestService;
    $scope.ds = DateService;

    $scope.viewmode = 1;

    $scope.setting = {};
    $scope.setting.auto_refresh = true;

    function showTicketFilter(response)
    {
        $scope.guestservices = response.data.filterlist;

        if(response.data.profile !=null)
            $scope.guest_profile =  response.data.profile;
        //check status
        for( var i = 0; i < $scope.statuses.length; i++) {
            $scope.status_filter[$scope.statuses[i].id] = false;
            if($scope.guest_profile != null) {
                var profile_status = JSON.parse($scope.guest_profile.status_id);
                for(var m = 0 ; m < profile_status.length ; m++  ) {
                    if(profile_status[m] == $scope.statuses[i].id ) $scope.status_filter[$scope.statuses[i].id] = true;
                }
            }
        }
        //check ticket
        for( var i = 0; i < $scope.tickets.length; i++) {
            if($scope.guest_profile != null) {
                var ticket = $scope.guest_profile.ticket;
                if (ticket == $scope.tickets[i]) $scope.ticket_filter = ticket;

            }else {
                if (i == 0)     $scope.ticket_filter = $scope.tickets[i] ;
            }
        }

        //check priority
        $scope.priorities = response.data.priority;
        for( var i = 0; i < $scope.priorities.length; i++) {

            $scope.priority_filter[$scope.priorities[i].id] = false;

            if($scope.guest_profile != null) {
                var profile_priority = JSON.parse($scope.guest_profile.priority);
                for(var m = 0 ; m < profile_priority.length ; m++  ) {
                    if (profile_priority[m] == $scope.priorities[i].id) $scope.priority_filter[$scope.priorities[i].id] = true;
                }
            }
        }

        //check department
        $scope.departments = response.data.department;
        for( var i = 0; i < $scope.departments.length; i++) {
            $scope.department_filter[$scope.departments[i].id] = false;

            if($scope.guest_profile != null) {
                var profile_department = JSON.parse($scope.guest_profile.department_id);
                for(var m = 0 ; m < profile_department.length; m++) {
                    if(profile_department[m] == $scope.departments[i].id ) $scope.department_filter[$scope.departments[i].id] = true;
                }
            }
        }

        //check type
        for( var i = 0; i < $scope.types.length; i++) {
            $scope.type_filter[$scope.types[i].id] = false;

            if($scope.guest_profile != null) {
                var profile_type = JSON.parse($scope.guest_profile.type_id);
                for(var m = 0 ; m < profile_type.length; m++) {
                    if(profile_type[m] == $scope.types[i].id ) $scope.type_filter[$scope.types[i].id] = true;
                }
            }
        }
    }

    $scope.getTicketFilter = function() {
        var profile = AuthService.GetCredentials();
        var attendant = profile.id;
        $rootScope.myPromise = GuestService.getTicketFilterList(attendant);

        $rootScope.myPromise.then(function(response) {
            showTicketFilter(response);
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {

            });
    }

    $scope.getTicketFilter();


    function getChatRoomList() {
        var profile = AuthService.GetCredentials();

        var request = {};
        request.property_id = profile.property_id;
        request.status = 'Active';
        request.agent_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/chatsessionlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.chat_room_list = response.data;
            for(var i = 0; i < $scope.chat_room_list.length; i++ )
            {
                $scope.chat_room_list[i].width = 300;
                $scope.chat_room_list[i].height = 400;   
                $scope.chat_room_list[i].minimized = false;   
                $scope.chat_room_list[i].chat_height = $scope.chat_room_list[i].height - 100;
            }
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.$on('guest_chat_event', function(event, args){
        var message = args;

        if( message.sub_type == 'request_chat' )
            getChatRoomList();

        if( message.sub_type == 'accept_chat' )
            getChatRoomList();

        if( message.sub_type == 'end_chat' )
            getChatRoomList();

        if( message.sub_type == 'logout_chat' )
            getChatRoomList();

        if( message.sub_type == 'transfer_chat' )
            getChatRoomList();

        if( message.sub_type == 'cancel_transfer' )
            getChatRoomList();
    });

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

    getChatRoomList();
    getGuestTaskItemList();

    $scope.onChangeViewMode = function() {
        $scope.viewmode = 1 - $scope.viewmode;
    }

    $scope.refresh = $interval(function() {
        if( $scope.setting.auto_refresh == true )
            $scope.pageChanged();
    }, 20 * 1000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined($scope.refresh)) {
            $interval.cancel($scope.refresh);
            $scope.refresh = undefined;
        }
    });


    GuestService.getMaxTicketNo().then(function(response) {
        $scope.max_ticket_no = response.data.max_ticket_no;
    });



    $rootScope.asideState = {
        open: false
    };

    $scope.getDeptFuncList = function(val, dept_id) {
        if( !val )
            val = '';
        
        return GuestService.getDeptFuncList(val, dept_id)
            .then(function(response) {
                return response.data.deptfunclist.filter(function(item, index, attr){
                    return index < 10;
                });
            });
    };

    $scope.openFilterPanel = function(position, backdrop) {
        $rootScope.asideState = {
            open: true,
            position: position
        };

        function postClose(filter) {

            $rootScope.asideState.open = false;
            if( filter[0].ticket == undefined )
                return;

            //$scope.currentFilter = filter;
            $scope.guest_profile = filter[0];
            $scope.filter_value = '';
            $scope.$emit('erase_search');

            $scope.refreshTickets();
        }

        $aside.open({
            templateUrl: 'tpl/toolbar/ticketfilter.aside.html',
            placement: position,
            scope: $scope,
            size: 'sm',
            backdrop: backdrop,
            controller: function($scope, $uibModalInstance) {
                $scope.ok = function(e) {
                    $uibModalInstance.close();
                    e.stopPropagation();
                };
                $scope.cancel = function(e) {
                    $uibModalInstance.dismiss();
                    e.stopPropagation();
                };
                $scope.onSelectFilter = function(filter) {
                    $uibModalInstance.close(filter);
                }
                
                $scope.onChangeradio = function(ticket) {
                    $scope.ticket_filter = ticket;
                }
                $scope.saveTicketFilter = function() {
                    var filter = {};

                    filter.user_id = $scope.profile.id;
                    filter.ticket = $scope.ticket_filter;
                    var statuslist = [];
                    for(var i = 0; i < $scope.statuses.length; i++)
                        if($scope.status_filter[$scope.statuses[i].id] == true) statuslist.push(parseInt($scope.statuses[i].id));
                     filter.status_id = JSON.stringify(statuslist);

                    var prioritylist = [];
                    for(var i = 0; i < $scope.priorities.length; i++)
                        if($scope.priority_filter[$scope.priorities[i].id] == true ) prioritylist.push(parseInt($scope.priorities[i].id));
                    filter.priority = JSON.stringify(prioritylist);

                    var departmentlist = [];
                    for(var i = 0; i < $scope.departments.length; i++)
                        if($scope.department_filter[$scope.departments[i].id] == true) departmentlist.push(parseInt($scope.departments[i].id));
                    filter.department_id = JSON.stringify(departmentlist);

                    var typelist = [];
                    for(var i = 0; i < $scope.types.length; i++)
                        if($scope.type_filter[$scope.types[i].id] == true) typelist.push(parseInt($scope.types[i].id));
                    filter.type_id = JSON.stringify(typelist);

                    $http({
                        method: 'POST',
                        url: '/frontend/guestservice/storetasklistprofile',
                        data: filter,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    }).then(function(response) {
                        filter = response.data;
                        $uibModalInstance.close(filter);
                    }).catch(function(response) {
                            console.error('Gists error', response.status, response.data);
                        })
                        .finally(function() {
                        });
                }
            },
        }).result.then(postClose, postClose);
    }

    $scope.full_height = 'height: ' + ($window.innerHeight - 90) + 'px; overflow-y: auto';
    $scope.tab_full_height = 'height: ' + ($window.innerHeight - 85) + 'px; overflow-y: auto';
    $scope.ticketlist_height = $window.innerHeight - 88;
    
    // pip
    $scope.isLoading = false;
    $scope.ticketlist = [];

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.getTicketData = function getTicketData(tableState) {
        //here you could create a query string from tableState
        //fake ajax call
        $scope.isLoading = true;

        if( tableState != undefined )
        {
            var pagination = tableState.pagination;

            $scope.paginationOptions.pageNumber = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.paginationOptions.pageSize = pagination.number || $scope.paginationOptions.pageSize;  // Number of entries showed per page.
            $scope.paginationOptions.field = tableState.sort.predicate;
            $scope.paginationOptions.sort = tableState.sort.reverse ? 'desc' : 'asc';
        }

        console.log(tableState);

        // var filtername = '';
        // if( $scope.currentFilter != undefined )
        //     filtername = $scope.currentFilter.name;
        var filtername = {};
        filtername = $scope.guest_profile;
        GuestService.getTicketList($scope.paginationOptions.pageNumber, $scope.paginationOptions.pageSize, $scope.paginationOptions.field, $scope.paginationOptions.sort, filtername, $scope.filter_value)
            .then(function(response) {
                $scope.ticketlist = response.data.ticketlist;
                $scope.ticketlist.forEach(function(item, index) {
                    item.onlytime = moment(item.start_date_time).format('HH:mm A');
                    item.onlydate = moment(item.start_date_time).format('DD MMM YYYY');
                    item.status_css = GuestService.getStatusCss(item);
                    item.ticket_no = GuestService.getTicketNumber(item);
                    item.ticket_type_color = GuestService.getTicketTypeColor(item);
                    item.priority_css = GuestService.getPriorityCss(item);
                    item.ticket_item_name = GuestService.getTicketNameForList(item);                    
                    item.status_style = GuestService.getTicketStatusStyle(item);
                    item.status = GuestService.getStatus(item);
                    item.status_css_edit = GuestService.getStatusCssInEdit(item);
                    item.level_css = GuestService.getLevelCss(item);
                    item.type_css = GuestService.getTicketTypeCss(item);
                    item.requested_name = GuestService.getTicketRequestName(item);
                    item.user_name = item.type == 1 ? item.guest_name : '' + ' ' + item.type == 2 ? item.requester_name : '';
                });

                $scope.checkSelection($scope.ticketlist);

                $scope.paginationOptions.totalItems = response.data.totalcount;

                if( tableState != undefined )
                {
                    if( $scope.paginationOptions.totalItems < 1 )
                        tableState.pagination.numberOfPages = 0;
                    else
                        tableState.pagination.numberOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);

                    $scope.paginationOptions.countOfPages = tableState.pagination.numberOfPages;
                }

                console.log(response);                
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };
    //get ticket refresh event from broadcast of main.js
    $scope.$on('guest_ticket_event', function(event, args) {
        console.log(args);
        $scope.getTicketData();
    });

    $scope.$on('guestservice', function(event, args) {
        console.log(args);
        for(var i = 0; i < $scope.ticketlist .length; i++ )
        {
            if( $scope.ticketlist[i].id == args.table_id)
            {
                $scope.ticketlist[i].ack = args.ack; 
                break;
            }
        }        
    });


    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.paginationOptions.numberOfPages);

        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        // var filtername = '';
        // if( $scope.currentFilter != undefined )
        //     filtername = $scope.currentFilter.name;
        var filtername = {};
        filtername = $scope.guest_profile;
        $scope.ticketlist = [];
        GuestService.getTicketList($scope.paginationOptions.pageNumber, $scope.paginationOptions.pageSize, $scope.paginationOptions.field, $scope.paginationOptions.sort, filtername, $scope.filter_value)
            .then(function(response) {
                $scope.ticketlist = response.data.ticketlist;
                $scope.ticketlist.forEach(function(item, index) {
                    item.onlytime = moment(item.start_date_time).format('HH:mm A');
                    item.onlydate = moment(item.start_date_time).format('DD MMM YYYY');
                    item.status_css = GuestService.getStatusCss(item);
                    item.ticket_no = GuestService.getTicketNumber(item);
                    item.ticket_type_color = GuestService.getTicketTypeColor(item);
                    item.priority_css = GuestService.getPriorityCss(item);
                    item.ticket_item_name = GuestService.getTicketNameForList(item);                    
                    item.status_style = GuestService.getTicketStatusStyle(item);
                    item.status = GuestService.getStatus(item);
                    item.status_css_edit = GuestService.getStatusCssInEdit(item);
                    item.level_css = GuestService.getLevelCss(item);
                    item.type_css = GuestService.getTicketTypeCss(item);
                    item.requested_name = GuestService.getTicketRequestName(item);
                    item.user_name = item.type == 1 ? item.guest_name : '' + ' ' + item.type == 2 ? item.requester_name : '';
                });
                $scope.checkSelection($scope.ticketlist);
                $scope.paginationOptions.totalItems = response.data.totalcount;

                if( $scope.paginationOptions.totalItems < 1 )
                    $scope.paginationOptions.countOfPages = 0;
                else
                    $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);

                console.log(response);
                console.log(response.data.time);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });

    };

    $scope.onPrevPage = function() {
        if( $scope.paginationOptions.numberOfPages <= 1 )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages - 1;

        $scope.isLoading = true;
        $scope.pageChanged();
    }

    $scope.onNextPage = function() {
        if( $scope.paginationOptions.totalItems < 1 )
            $scope.paginationOptions.countOfPages = 0;
        else
            $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize) + 1;

        if( $scope.paginationOptions.numberOfPages >= $scope.paginationOptions.countOfPages )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages + 1;
        $scope.isLoading = true;
        $scope.pageChanged();
    }

    $scope.$on('search-list', function(event, args) {
        console.log(args);
        search_option = args.filter;

        $scope.paginationOptions.numberOfPages = 1;
        $scope.refreshTickets();
    });

    $scope.searchTicket = function(filter_value) {
        $scope.filter_value = filter_value;
        $scope.paginationOptions.numberOfPages = 1;
        $scope.refreshTickets();
    }

    function unique(arr) {
        var result = [];

        nextInput:
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i]; // для каждого элемента
                for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                    if (result[j] == str) continue nextInput; // если да, то следующий
                }
                result.push(str);
            }

        return result;
    }
    $scope.width = '100px';

    $scope.newTicket1 = {
        "id" : 0,
        "Number" : 1,
        "groupName" : "Guest",
    }
    $scope.newTicket2 = {
        "id" : 1,
        "Number" : 2,
        "groupName" : "Department",
    }
    $scope.newTicket3 = {
        "id" : 2,
        "Number" : 3,
        "groupName" : "Complaints",
    }
    $scope.newTicket4 = {
        "id" : 3,
        "Number" : 4,
        "groupName" : "Managed Tasks",
    }
//    $scope.newTicket5 = {
//        "id" : 4,
//        "Number" : 5,
//        "groupName" : "Reservations",
//    }

    $scope.selectedTicketInTasks = "";

    $scope.selectNewTicketInTasks = function(item) {
        $scope.selectedTicketInTasks = item;
    }

    $scope.selectTicketInTasks = function(item) {
        $scope.selectedTicketInTasks = item;
    }
    // remove tab
    $scope.removeNewSelectTicket = function(item) {
        $timeout(function() {
            var index = $scope.newTickets.indexOf(item);
            $scope.newTickets.splice(index, 1);

            if( $scope.newTickets.length > 0 )
            {
                if(index == 0) {    // removed first task
                    $scope.selectedTicketInTasks = $scope.newTickets[0];
                }
                else
                {
                    $scope.selectedTicketInTasks = $scope.newTickets[index - 1];
                }
            }
            else
            {
                if( $scope.selectedTickets.length == 0 )    // no exist other selected ticket.
                {
                    $scope.selectedTicketInTasks = null;
                }
                else
                {
                    $scope.selectedTicketInTasks = $scope.selectedTickets[0];
                }
            }
        }, 100);    
    }

    $scope.removeSelectTicket = function(item, $index) {
        if( !$scope.ticketlist )
            return;

        $timeout(function() {
            var index = -1;
            for(var i = 0; i < $scope.ticketlist.length; i++)
            {
                if( item.id == $scope.ticketlist[i].id )
                {
                    index = i;
                    $scope.ticketlist[i].active = false;
                }
            }

            $scope.selectedTickets.splice($index, 1);
        }, 100);
    }
    $scope.onSendMessage = function(row) {
        if( row.status_id == 3 || row.status_id == 4 ) // canceled or timeout
            return;
        
        var data = angular.copy(row);
        var profile = AuthService.GetCredentials();
        data.property_id = profile.property_id;
        $http({
            method: 'POST',
            url: '/frontend/guestservice/resendmessage',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.getTicketData();
                toaster.pop('success', MESSAGE_TITLE, ' Notification has been resend successfully');
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to resend notification');
            })
            .finally(function() {
            });
        
    }
    $scope.onRemoveOldSelectTicket = function(index) {
        if( $scope.selectedTickets.length > 0 )
        {
            if(index == 0) {    // removed first task
                $scope.selectedTicketInTasks = $scope.selectedTickets[0];
            }
            else
            {
                $scope.selectedTicketInTasks = $scope.selectedTickets[index - 1];
            }
        }
        else
        {
            if( $scope.newTickets.length == 0 )    // no exist other selected ticket.
            {
                $scope.selectedTicketInTasks = null;
            }
            else
            {
                $scope.selectedTicketInTasks = $scope.newTickets[$scope.newTickets.length - 1];
            }
        }
    }


    $scope.changeFilterShow = true;
    $scope.changeFilterView = function(){
        if($scope.changeFilterShow == false)
        {
            $scope.changeFilterShow = true;
        }
        else {
            $scope.changeFilterShow = false;
        }
    }

    hotkeys.add({
        combo: 'g',
        description: 'This one goes to 11',
        callback: function() {
            $scope.showRequest(1);
        }
    });

    hotkeys.add({
        combo: 'd',
        description: 'This one goes to 11',
        callback: function() {
            $scope.showRequest(2);
        }
    });
    hotkeys.add({
        combo: 'c',
        description: 'This one goes to 11',
        callback: function() {
            $scope.showRequest(3);
        }
    });
    hotkeys.add({
        combo: 'm',
        description: 'This one goes to 11',
        callback: function() {
            $scope.showRequest(4);
        }
    });
//    hotkeys.add({
//        combo: 'r',
//        description: 'This one goes to 11',
//        callback: function() {
//            $scope.showRequest(5);
//        }
//    });
    $scope.showRequest = function(index) {
        switch (index) {
            case 1 :
                $scope.newTickets.push($scope.newTicket1);
                $scope.selectedTicketInTasks = $scope.newTicket1;
                break;
            case 2 :
                $scope.newTickets.push($scope.newTicket2);
                $scope.selectedTicketInTasks = $scope.newTicket2;
                break;
            case 3 :
                $scope.newTickets.push($scope.newTicket3);
                $scope.selectedTicketInTasks = $scope.newTicket3;
                break;
            case 4 :
                $scope.newTickets.push($scope.newTicket4);
                $scope.selectedTicketInTasks = $scope.newTicket4;
                break;
            case 5 :
                $scope.newTickets.push($scope.newTicket5);
                $scope.selectedTicketInTasks = $scope.newTicket5;
                break;

            default:
                $scope.newTickets.push($scope.newTicket1);
                $scope.selectedTicketInTasks = $scope.newTicket1;
                break;
        }

        $scope.newTickets = unique($scope.newTickets);

        $timeout(function(){
            $scope.active = $scope.selectedTicketInTasks.Number;
        }, 100);
    }

    $scope.showRequestWithRoomAndTask = function(index, room, task) {
        $scope.showRequest(index);
        $timeout(function(){
            $scope.$broadcast('room_selected', room);
            $timeout(function() {
                $scope.$broadcast('create_new_task', task);
            }, 1000);
        }, 100);
    }

    $scope.groupedBy = [
        {
            "name": "Department",
            "subitems" : [
                {
                    "name" : "All"
                },
                {
                    "name" : "Housekeeping"
                },
                {
                    "name" : "IT Management"
                }
            ]
        },
        {
            "name": "Function",
            "subitems" : [
                {
                    "name" : "ALL"
                },
                {
                    "name" : "Frontdesc"
                },
                {
                    "name" : "IT"
                }
            ]
        }
    ]

    $scope.$watch('selectedTicketInTasks', function(newValue, oldValue){
        $scope.$broadcast('onSelectTickets', newValue );
    }, true);

    $scope.refreshTickets = function(){
        $scope.getTicketFilter();

        $scope.isLoading = true;
        $scope.pageChanged();
    }

    $scope.$on('onTicketChange', function(event, args){
        $scope.refreshTickets();
    });

    $scope.$on('onTicketCreateFinished', function(event, args){
        if( args == 1 )
            $scope.removeNewSelectTicket($scope.newTicket1);
        else if( args == 2 )
            $scope.removeNewSelectTicket($scope.newTicket2);
        else if( args == 5 )
            $scope.removeNewSelectTicket($scope.newTicket5t);
    });

    $scope.onSelectTicket = function(ticket){
        $timeout(function(){

            // check select ticket
            var index = -1;
            for(var i = 0; i < $scope.selectedTickets.length; i++)
            {
                if( ticket.id == $scope.selectedTickets[i].id )
                {
                    index = i;
                    break;
                }
            }

            if( index < 0 )    // not selected
            {
                //ticket.active = 1;
                $scope.selectedTickets.push(angular.copy(ticket));
            }
            else {
                //ticket.active = false;
                $scope.selectedTickets.splice(index, 1);
            }

            $timeout(function(){
                if( index < 0 )
                    $scope.active = 6 + ticket.id;
            }, 100);
        }, 100);   
    }

    $scope.onCloseChatRoom = function(chat){
        $timeout(function(){
            // check select ticket
            var index = -1;
            for(var i = 0; i < $scope.chat_room_list.length; i++)
            {
                if( chat.id == $scope.chat_room_list[i].id )
                {
                    index = i;
                    break;
                }
            }

            $scope.chat_room_list.splice(index, 1);
        }, 100);   
    }

    $scope.onMinimize = function($index) {
        $scope.chat_room_list[$index].minimized = true;
        $scope.chat_room_list[$index].height = 50;
    }

    $scope.onMaximize = function($index) {
        $scope.chat_room_list[$index].minimized = false;
        $scope.chat_room_list[$index].height = 400;
    }

    $scope.onClosed = function($index) {
        $scope.endChat($scope.chat_room_list[$index]);
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
            
        }).catch(function (response) {
        })
        .finally(function () {
            
        });
    }

    $scope.$on("angular-resizable.resizing", function (event, args) {        
        if( args.height )
        {
            $scope.chat_room_list[args.index].height = args.height;            
            $scope.chat_room_list[args.index].chat_height = args.height - 100;
        }
    });

    $scope.$on("angular-resizable.resizeEnd", function (event, args) {
        if( args.width )
            $scope.chat_room_list[args.index].width = args.width;
        if( args.height )
        {
            $scope.chat_room_list[args.index].height = args.height;                
            $scope.chat_room_list[args.index].chat_height = args.height - 100;
        }
    });

    $scope.checkSelection = function(ticketlist){
        if( !ticketlist )
            return;

        for(var i = 0; i < ticketlist.length; i++)
        {
            var index = -1;
            var ticket = ticketlist[i];
            for(var j = 0; j < $scope.selectedTickets.length; j++)
            {
                if( ticket.id == $scope.selectedTickets[j].id )
                {
                    index = j;
                    break;
                }
            }

            ticket.active = index < 0 ? false : true;
        }
    }

    $scope.onCompleteTicket = function(ticket) {
        if( ticket.comment_flag == 0 )  // no comment
        {
            completeTicket(ticket, '');
            return;
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input comment';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                completeTicket(ticket, comment);
            }, function () {

            });
    }

    function completeTicket(ticket, comment) {
        if( ticket.comment_flag == 1 && !comment )
        {
            toaster.pop('error', MESSAGE_TITLE, 'When complete this ticket, you should provide comment.' );
            return;            
        }
        
        console.log(ticket);
        var data = {};

        data.status_id = 0; // Complete State
        data.running = 0;
        if( ticket.type == 1 || ticket.type == 2 || ticket.type == 4 )
            data.log_type = 'Completed';
        if( ticket.type == 3 )
            data.log_type = 'Resolved';

        data.user_id = ticket.dispatcher;

        data.task_id = ticket.id;
        data.max_time = ticket.max_time;
        data.comment = comment;

        data.original_status_id = ticket.status_id;

        if( ticket.type == 1 || ticket.type == 2 || ticket.type == 3 )
            $rootScope.myPromise = GuestService.changeTaskState(data)
        if( ticket.type == 4 )
            $rootScope.myPromise = $http({
                method: 'POST',
                url: '/frontend/guestservice/changemanagedtask',
                data: data,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });


        $rootScope.myPromise.then(function(response) {

                console.log(response.data);

                if( response.data.code && response.data.code == 200 )
                {
                    $scope.refreshTickets();
                    toaster.pop('success', MESSAGE_TITLE, 'Task has been updated successfully');
                }
                else
                    toaster.pop('error', MESSAGE_TITLE, response.data.message );

            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to update Task');
            })
            .finally(function() {

            });
    }

    $scope.cancelTicket = function(ticket) {
        console.log(ticket);

        var size = '';
        var modalInstance = $uibModal.open({
            templateUrl: 'cancelReasonModal.html',
            controller: 'ReasonController',
            size: size,
            resolve: {
                ticket: function () {
                    return ticket;
                }
            }
        });

        modalInstance.result.then(function (comment) {
            if( comment == undefined || comment.length < 1 )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set a reason for Cancellation' );
                return;
            }

            var data = {};

            data.status_id = 4;     // Cancel state
            data.running = 0;
            data.log_type = 'Canceled';

            data.task_id = ticket.id;
            data.max_time = ticket.max_time;
            data.comment = comment;

            data.original_status_id = ticket.status_id;

            if( ticket.type == 1 || ticket.type == 2 || ticket.type == 3 )
                $rootScope.myPromise = GuestService.changeTaskState(data)
            if( ticket.type == 4 )
                $rootScope.myPromise = $http({
                    method: 'POST',
                    url: '/frontend/guestservice/changemanagedtask',
                    data: data,
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                });


            $rootScope.myPromise.then(function(response) {
                    console.log(response.data);

                    $scope.refreshTickets();

                    if( response.data.code && response.data.code == 'NOTSYNC' )
                        toaster.pop('error', MESSAGE_TITLE, 'Ticket data is not synced' );
                    if( response.data.code && response.data.code == 'SUCCESS' )
                        toaster.pop('success', MESSAGE_TITLE, 'Task has been updated successfully');

                }).catch(function(response) {
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to Update Task.');
                })
                .finally(function() {

                });

        }, function () {

        });

    }

    $scope.onTicketCancelStatust = function (row) {
        //var remain_time = row.max_time * 1000 - row.elaspse_time * 1000;
        if(row.status_id == 4 || row.status_id == 0) {
            var remain_time = 0;
            remain_time = moment(row.end_date_time, "YYYY-MM-DD HH:mm:ss") - moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss");
            remain_time = row.max_time * 1000 - remain_time;
            if (remain_time < 0)
                remain_time = 0;
            return remain_time;
        }else {
            return;
        }
    }


    $scope.onTicketCancelStatust_5 = function (row) {
        //var remain_time = row.max_time * 1000 - row.elaspse_time * 1000;
        if(row.status_id ==5) {
            var remain_time = 0;
            var currentdate = new Date();
            var now = moment(currentdate).format('YYYY-MM-DD HH:mm:ss');
            remain_time = 0+moment.utc(moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss").diff(moment(now, "YYYY-MM-DD HH:mm:ss")));
            if (remain_time < 0)
                remain_time = 0;
            return remain_time;
        }else {
            return;
        }
    }

    $scope.onTicketHoldStatust = function (row) {
        //var remain_time = row.max_time * 1000 - row.elaspse_time * 1000;
        if(row.status_id ==1 && row.running == 0) {
            var remain_time = 0;
            if (row.evt_start_time != null && row.evt_end_time != null)
                remain_time = moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss") - moment(row.evt_start_time, "YYYY-MM-DD HH:mm:ss");
            if (remain_time < 0)
                remain_time = 0;
            return remain_time;
        }else {
            return;
        }
    }

    $scope.onTicketStatust = function (row) {
             // var elapse = 0;
             // if(row.elaspse_time != null) elapse = row.elaspse_time * 1000;
        if((row.status_id ==1 && row.running == 1) || row.status_id ==2 || row.status_id ==3 ) {
            var remain_time = 0;
            if (row.evt_start_time != null) {
                var max_time = moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss") - moment(row.evt_start_time, "YYYY-MM-DD HH:mm:ss");
                remain_time = max_time - moment.utc(moment().diff(moment(row.evt_start_time, "YYYY-MM-DD HH:mm:ss")));
            }
            else
                remain_time = row.max_time * 1000 - moment.utc(moment().diff(moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss")));
            if (remain_time < 0)
                remain_time = 0;
            return remain_time;
        }else {
            return;
        }
    }

    $scope.remainTime = function(row) {
        // return 1000;
        return GuestService.getRemainTime(row);
    }

});
