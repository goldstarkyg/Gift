app.controller('DepartmentrequestEditController', function ($scope, $rootScope, $http, $interval, toaster, GuestService, AuthService, $filter) {
    $scope.tasks = [];
    $scope.location = {};

    var MESSAGE_TITLE = 'Change Department Task';
    var SELECT_ACTION = '--Select Action--';
    var COMPLETE_ACTION = 'Complete';
    var OPEN_ACTION = 'Open';
    var EXTEND_ACTION = 'Extend';
    var HOLD_ACTION = 'Hold';
    var RESUME_ACTION = 'Resume';
    var CANCEL_ACTION = 'Cancel';
    var SCHEDULED_ACTION = 'Scheduled';
    var REASSIGN = 'Reassign';
    var CLOSE_ACTION = 'Close';

    $scope.$on('$destroy', function() {
        if( $scope.timer )
        {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    });

    $scope.StatusCss = function(action)
    {
        if( action == COMPLETE_ACTION )    // complete
            return 'bg-status-completed';
        if( action == OPEN_ACTION )    // Open
            return 'bg-status-assigned';
        if( action == 'Escalated' )    // Escalated
            return 'bg-urgency-medium';
        if( action == CANCEL_ACTION )    // cancel
            return 'bg-status-cancelled';
        if( action == HOLD_ACTION )    // hold
            return 'btn-danger';
        if( action == EXTEND_ACTION )    // extend
            return 'bg-status-assigned';
        if( action == RESUME_ACTION )    // resume
            return 'bg-status-assigned';
        if( action == SCHEDULED_ACTION )    // Scheduled
            return 'bg-status-onhold';
        if( action == CLOSE_ACTION )    // Closed
            return 'bg-status-completed';
    }

    $scope.init = function(task) {
        $scope.ticket_id = sprintf('D%05d', task.id);

        if( task.id == 0 )
            return;

        if( task.type != 2 )
            return;

        $scope.task = angular.copy(task);

        $scope.active = 0;
        var picture_array = JSON.parse(task.picture_path);
        if( picture_array )
        {
            $scope.slides = [];
            for(var i = 0; i < picture_array.length; i++)
            {
                var slide = {};
                slide.id = i;
                slide.image = '/' + picture_array[i];

                $scope.slides.push(slide);
            }
        }



        var start_time = new Date(Date.parse($scope.task.start_date_time));
        $scope.task.date = start_time;
        $scope.task.time = start_time;
        $scope.task.username = '';

        $scope.backuptask = angular.copy(task);
        $scope.task.extend_time_flag = false;

        $scope.location.name = task.lgm_name;
        $scope.location.type = task.lgm_type;
        $scope.location.requester_name = task.requester_name;
        $scope.location.requester_job_role = task.requester_job_role;
        $scope.location.request_time = task.start_date_time;
        $scope.location.notify_flag = task.requester_notify_flag == 1 ? true : false;
        $scope.location.requester_mobile = task.requester_mobile;
        $scope.location.requester_email = task.requester_email;

        getGuestMessageList(task.id);

        $scope.initActionList($scope.task);

        getStaffList($scope.task);

        getNotificationHistory();
        $scope.remain_time_style = 0 ;
        $scope.timer = $interval(function() {
            $scope.remain_time = GuestService.getRemainTime($scope.task);
            $scope.remain_time_style = GuestService.getTicketStatusStyle($scope.task);
        }, 1000);
    }

    var getStaffList = function(task){
        var item = task.task_list;
        //var location = 1;
        //GuestService.getTaskInfo($item.id, $scope.selected_room.location_group.location_grp)
        GuestService.getLocationGroup(task.location_id)
            .then(function(response){
                var location = response.data.group;
                GuestService.getTaskInfo(item, location)
                    .then(function(response){
                        console.log(response);
                        $scope.task.userlist = response.data.staff_list;
                    });
            });
    }

    $scope.$on('guest_ticket_event', function(event, args) {
        var ticket_id = args.content.notification_id;
        if( ticket_id != $scope.task.id )
            return;

        $http.get('/frontend/guestservice/ticketdetail?id=' + ticket_id )
            .then(function(response) {
                $scope.init(response.data);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {

            });
    });

    var getGuestMessageList = function(task_id) {

        var request = {};
        request.task_id = task_id;
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/messagelist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.messageList = response.data.data;

            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.initActionList = function(task)
    {
        $scope.actions = [];
        switch(task.status_id) {
            case 1: // Open
                if( task.running == 1 )     // running
                {
                    $scope.actions = [
                        SELECT_ACTION,
                        COMPLETE_ACTION,
                        CANCEL_ACTION,
                        HOLD_ACTION,
                        EXTEND_ACTION,
                    ];
                }
                else
                {
                    $scope.actions = [
                        SELECT_ACTION,
                        RESUME_ACTION,
                        CANCEL_ACTION,
                    ];
                }

                if( AuthService.isValidModule('app.guestservice.reassign')  )
                    $scope.actions.push(REASSIGN);

                break;
            case 2: // Escalated
                if( task.running == 1 )     // running
                {
                    $scope.actions = [
                        SELECT_ACTION,
                        COMPLETE_ACTION,
                        CANCEL_ACTION,
                        HOLD_ACTION,
                    ];
                }
                else
                {
                    $scope.actions = [
                        SELECT_ACTION,
                        RESUME_ACTION,
                        CANCEL_ACTION,
                    ];
                }

                if( AuthService.isValidModule('app.guestservice.reassign')  )
                    $scope.actions.push(REASSIGN);

                break;
            case 3: // Timeout
                if( task.closed_flag == 0 )     // not closed
                {
                    $scope.actions = [
                        SELECT_ACTION,
                        CLOSE_ACTION,
                    ];
                }
                
                break;        
            case 5: // Scheduled
                $scope.actions = [
                    SELECT_ACTION,
                    SCHEDULED_ACTION,
                    OPEN_ACTION
                ];
                break;
        }

        if( $scope.actions.length > 0 )
            task.action =  $scope.actions[0];
    }

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 20,
        sort: 'asc',
        field: 'id',
    };

    $scope.onChangeAction = function(action) {
        console.log(action);
        $scope.task.action = angular.copy(action);
        
        if(action == RESUME_ACTION || action == CLOSE_ACTION) 
            $scope.changeTask();
    }

    $scope.onStaffSelect = function($item, $model, $label) {
        console.log($item);
        $scope.task.reassign = $item;        
    };

    $scope.onReassign = function() {
        var data = {};

        var profile = AuthService.GetCredentials();

        if( !$scope.task.reassign || !($scope.task.reassign.id > 0) )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please select reassigner');
            return;
        }

        data.assign_id = $scope.task.reassign.id;        
        data.property_id = profile.property_id;
        data.start_date_time = moment().format('YYYY-MM-DD HH:mm:ss');
        data.status_id = 1; // Open State
        data.running = 1;
        data.log_type = 'Reassigned';
        data.max_time = $scope.task.max_time;

        data.task_id = $scope.task.id;
        data.comment = $scope.task.reason;

        data.original_status_id = $scope.task.status_id;


        $rootScope.myPromise = GuestService.changeTaskState(data)
            .then(function(response) {
                if( response.data.code && response.data.code == 200 )
                {
                    $scope.$emit('onTicketChange', $scope.task);
                    toaster.pop('success', MESSAGE_TITLE, 'Task is changed successfully');
                    $scope.task = response.data.ticket;
                    $scope.init($scope.task);
                }
                else
                    toaster.pop('error', MESSAGE_TITLE, response.data.message );                
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Task is fail to change');
            })
            .finally(function() {

            });
    }

    $scope.onForward = function() {
        var request = $scope.task;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/forward',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            toaster.pop('success', MESSAGE_TITLE, 'Ticket is forwarded to duty manager');
            $scope.task.forward_flag = 1;
            $scope.$emit('onChangedComplaint', response.data);
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to forward ticket.');
        })
        .finally(function() {

        });
    }

    $scope.changeTask = function() {
        var data = {};

        if( $scope.task.action == SELECT_ACTION )
        {
            toaster.pop('error', 'Change ticket', 'Please select action');
            return;
        }

        var data = {};

        var profile = AuthService.GetCredentials();
        data.property_id = profile.property_id;

        data.start_date_time = $scope.start_date_time;

        if( $scope.task.action == COMPLETE_ACTION )
        {
            if( !($scope.task.dispatcher > 0) )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set dispatcher' );
                return;
            }

            data.status_id = 0; // Complete State
            data.running = 0;
            data.log_type = 'Completed';
            data.user_id = $scope.task.dispatcher;

        }
        else if( $scope.task.action == CANCEL_ACTION )
        {
            if( !$scope.task.reason )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                return;
            }
            data.status_id = 4;     // Cancel state
            data.running = 0;
            data.log_type = 'Canceled';
        }
        else if( $scope.task.action == EXTEND_ACTION )
        {
            if( $scope.task.max_time <= 0 )    // not extended
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set max time bigger than 0' );
                return;
            }

            if( !$scope.task.reason )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                return;
            }

            data.status_id = 1; // Open State
            data.running = 0;
            data.log_type = 'Extended';
        }
        else if( $scope.task.action == OPEN_ACTION )
        {
            var date = new Date();
            data.start_date_time = date.format('yyyy-MM-dd HH:mm:ss');
            data.status_id = 1; // Open State
            data.running = 1;
            data.log_type = 'Assigned';
        }
        else if( $scope.task.action == SCHEDULED_ACTION )
        {
            var date = '';
            if( $scope.task.date instanceof Date )
                date = $scope.task.date.format('yyyy-MM-dd');
            else
                date = $scope.task.date;

            var time = $scope.task.time.format('HH:mm:ss');
            data.start_date_time = date + ' ' + time;
            data.status_id = 5; // schedule state
            data.running = 0;
            data.log_type = 'Scheduled';
            data.max_time = $scope.task.max_time;
        }
        else if( $scope.task.action == HOLD_ACTION )
        {
            if( !$scope.task.reason )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                return;
            }

            data.running = 0;
            data.status_id = $scope.task.status_id; // restore original state
            data.log_type = 'On-Hold';
        }
        else if( $scope.task.action == RESUME_ACTION )
        {
            data.running = 1;
            data.status_id = $scope.task.status_id; // restore original state
            data.log_type = 'Resume';
        }
        else if( $scope.task.action == CLOSE_ACTION )
        {
            data.status_id = 3;
            data.log_type = 'Closed';
            data.user_id = profile.id;
        }

        data.task_id = $scope.task.id;
        data.max_time = $scope.task.max_time;
        data.comment = $scope.task.reason;

        data.original_status_id = $scope.task.status_id;


        $rootScope.myPromise = GuestService.changeTaskState(data)
            .then(function(response) {
                if( response.data.code && response.data.code == 200 )
                {
                    $scope.$emit('onTicketChange', $scope.task);
                    toaster.pop('success', MESSAGE_TITLE, 'Task is changed successfully');
                    $scope.task = response.data.ticket;
                    $scope.init($scope.task);
                }
                else
                    toaster.pop('error', MESSAGE_TITLE, response.data.message );  

            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Task is fail to change');
            })
            .finally(function() {

            });
    }

    $scope.cancelChangeTask = function() {
        $scope.task = angular.copy($scope.backuptask);
    }

    $scope.notifylist = [];
       
    var getNotificationHistory = function() {
        $rootScope.myPromise = GuestService.getNotificationHistoryList($scope.task.id, 1, 1000000, 'id', 'asc' )
            .then(function(response) {
                $scope.notifylist = response.data.datalist;              
                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {

            });
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.format = 'yyyy-MM-dd';

});

app.controller('DatetimeController', function ($scope) {
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.disabled = function(date, mode) {
        var cur_date = new Date();
        return cur_date.getTime() >= date.getTime();
    };
});