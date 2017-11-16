app.controller('GuestrequestController', function ($scope, $rootScope, $http, $interval, toaster, $uibModal, GuestService, AuthService, $timeout) {
    var MESSAGE_TITLE = 'Create Guest Ticket';

    $scope.tasks = [];
    $scope.guest = {};
    $scope.main_task = {};
    $scope.quicktasks = [];
    $scope.selected_room = {};
    $scope.datetime = {};


    GuestService.getMaxTicketNo()
        .then(function(response) {
            var new_ticket_length = 0;
            if( $scope.newTickets )
                new_ticket_length = $scope.newTickets.length;
            $scope.max_ticket_no = response.data.max_ticket_no + new_ticket_length - 1;
            $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);
        });

    $scope.guest.request_time = moment().format("HH:mm:ss");
    $scope.timer = $interval(function() {        
        $scope.guest.request_time = moment().format("HH:mm:ss");
    }, 1000);

    $scope.$on('$destroy', function() {
        if($scope.timer != undefined) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    });

    $scope.onRoomSelect = function ($item, $model, $label) {
        console.log($item);
        $scope.selected_room = angular.copy($item);

        GuestService.getGuestName($item)
            .then(function(response){
                if(response.data.checkout_flag == 'checkout') {
                    $scope.showRequest(2);
                    $timeout(function(){
                        $rootScope.$broadcast('room_selected', $item);
                    }, 1000);
                    
                    $scope.$emit('onTicketCreateFinished', 1);      // Close Guest Request Tab
                    return;
                }
                if( response.data )
                {
                    $scope.guest = response.data;
                }
                else
                    $scope.guest.guest_name = 'Admin task';

                var date = new Date();
                $scope.guest.request_time = moment().format("HH:mm:ss");

                $scope.addMainTask();
                $scope.alert = {};

                getGuestHistory();
            });

        GuestService.getQuickTaskList(1, $item.property_id)
            .then(function(response){
                $scope.quicktasks = response.data;
            });

        GuestService.getLocationGroupFromRoom($item.id)
            .then(function(response){
                $scope.selected_room.location_group = response.data;
            });


    };

    $scope.history = {};
    function getGuestHistory() {
        //get history count
        $scope.history.limit = 0;
        GuestService.getPreviousHistoryList($scope.guest.guest_id)
            .then(function (response) {
                $scope.historylist = response.data.datalist;
            }).catch(function (response) {

        });
        //
    }

    $scope.loadMoreHistory = function() {
        $scope.history.limit += 10;
    }

    $scope.$on('room_selected', function(event, args){        
        var item = {};

        item.id = args.room_id;
        item.room = args.room;
        item.property_id = args.property_id;
        
        $scope.onRoomSelect(item, null, null);
    });

    $scope.taskbtnview = false;
    $scope.getTaskList = function(val) {
        if( val == undefined )
            val = "";
        return GuestService.getTaskList(val, $scope.selected_room.property_id, 1)
            .then(function(response){
                if(response.data.length == 0) $scope.taskbtnview = true;
                return response.data.filter(function(item, index, attr){
                    return index < 10;
                });
            });
    };

    function checkDuplicatedTask($item) {
        var exist = false;

        for(var i = 0; i < $scope.tasks.length; i++ )
        {
            if( $item.id == $scope.tasks[i].tasklist.id )
            {
                exist = true;
                break; 
            }
        }
        
        if( exist == true )
        {
            toaster.pop('error', MESSAGE_TITLE, 'Task is already added, Please increase quantity instead' );
            return true;
        }

        return false;
    }

    $scope.$on('select_new_task', function(event, args){        
        $scope.onMainTaskSelect(null, args, null, null);
    });  

    $scope.onMainTaskSelect = function (task, $item, $model, $label) {
        console.log($item);

        if( !$scope.selected_room.location_group )
        {
            toaster.pop('error', MESSAGE_TITLE, 'There is no location group' );
            return;
        }

        $scope.addMainTask();

        if( checkDuplicatedTask($item) )
            return;

        $scope.main_task.schedule_flag = false;
        $scope.main_task.quantity = 1;
        $scope.main_task.tasklist = angular.copy($item);

        GuestService.getTaskInfo($item.id, $scope.selected_room.location_group.location_grp)
            .then(function(response){
                console.log(response);

                showSelectedDepartmentInfo(response.data);
            });
    };

    $scope.onAddTask = function(){
        var task = $scope.main_task.tasklist.task;
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var request = {};

        request.property_id = profile.property_id;
        request.task = task;
        request.type = 0;
        
        $http({
            method: 'POST',
            url: '/frontend/guestservice/addtask',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.addMainTask();

            $scope.main_task.department_edit_flag = true;
            $scope.main_task.tasklist = response.data.task;
            $scope.main_task.quantity = 1;
            
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }


    $scope.getDepartList = function(val) {
        return GuestService.getDepartList()
            .then(function(response) {
                return response.data.departlist.map(function(item){
                    return item;
                });
            });
    };

    $scope.onMainDepartSelect = function (task, $item, $model, $label) {
        console.log($item);

        if( !$scope.selected_room.location_group )
        {
            toaster.pop('error', MESSAGE_TITLE, 'There is no location group' );
            return;
        }

        var task = $scope.main_task;

        task.department = $item.department;        
        task.department_id = $item.id;
        task.dept_func = null;

        // getSelectedDepartmentInfo($item); 
    };

    $scope.onMainDeptFuncSelect = function (task, $item, $model, $label) {
        console.log($item);

        if( !$scope.selected_room.location_group )
        {
            toaster.pop('error', MESSAGE_TITLE, 'There is no location group' );
            return;
        }

        getSelectedDepartmentInfo($item);        
    };

    function getSelectedDepartmentInfo($item) {
        var task = $scope.main_task;

        task.dept_func = {};

        if( !($item.dept_func_id > 0) )
        {
            toaster.pop('error', MESSAGE_TITLE, 'There is valid default department function for this departmetn' );
            return;
        }

        task.dept_func.id = $item.dept_func_id;
        task.dept_func.function = $item.function;
        
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var request = {};

        request.property_id = profile.property_id;
        request.task_id = task.tasklist.id;
        request.dept_func_id = $item.dept_func_id;
        request.location_group_id = $scope.selected_room.location_group.location_grp;
        request.type = 0;
        
        $http({
            method: 'POST',
            url: '/frontend/guestservice/taskinfowithgroup',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            showSelectedDepartmentInfo(response.data);
        }).catch(function(response) {
        })
        .finally(function() {

        });    
    }

    function showSelectedDepartmentInfo(data) {
        var task = $scope.main_task;

        if( data.department == undefined )
        {
            toaster.pop('error', 'Task error', 'There is no department');
            return;
        }

        task.department = data.department.department;
        task.department_id = data.department.id;
        task.dept_func = data.deptfunc;
        task.userlist = data.staff_list;
        task.max_duration = data.taskgroup.max_time;
        task.priority_id = $scope.prioritylist[0].id;

        if( task.userlist.length < 1 )
        {
            toaster.pop('error', 'Task error', 'No Staff is on shift');
            task.userlist.push({id: 0, user_id: 0, wholename: 'No Staff is on shift'});
        }
        task.dispatcher = task.userlist[0];
        task.username = task.dispatcher.wholename;
        task.device = task.dispatcher.mobile;
    }


    

    $scope.getSecondTaskList = function(val) {
        if( val == undefined )
            val = "";

        if( !$scope.selected_room.property_id )
            return;

        return GuestService.getTaskListInDepartment(val, $scope.selected_room.property_id, $scope.main_task.dept_func.id, 1)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
   

    $scope.addMainTask = function() {
        var date = new Date();

        var new_task = {
            ticket_no : $scope.max_ticket_no + 1,
            task_name : "",
            qunatity : 1,
            department : "",
            department_edit_flag: false,
            dept_func : "",
            dept_staff : "",
            task_group_id : 0,
            device : "",
            priority_id : $scope.prioritylist[0].id,
            max_duration : "",
            custom_message : "",
            start_date_time : moment().format("YYYY-MM-DD HH:mm:ss"),
            date : moment().format("YYYY-MM-DD HH:mm:ss"),
            schedule_flag: false,
            repeat_end_date : moment($scope.guest.departure).toDate(),
            // repeat_end_date : new Date(),
            repeat_flag: false,
            until_checkout_flag : false
        }

        $scope.main_task = new_task;        
    }

    $scope.onStaffSelect = function (task, $item, $model, $label) {
        console.log($item);
        task.dispatcher = $item;
        task.device = $item.mobile;
    };

    $scope.addTask = function(message_flag) {
        var task = angular.copy($scope.main_task);
        if( isValidTask(task, message_flag) == false )
            return;

        $scope.tasks.push(task);

        // init main task
        $scope.addMainTask();
    }

    $scope.removeTask = function(item) {
        $scope.tasks.splice($scope.tasks.indexOf(item),1);
    }

    $scope.addSystemTask = function (task) {
        if( !($scope.selected_room.id > 0 && $scope.guest.guest_name) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }

        GuestService.getTaskInfo(task.id, $scope.selected_room.location_group.location_grp)
            .then(function(response){
                console.log(response);
                var profile = AuthService.GetCredentials();

                var date = new Date();

                var data = response.data;
                if( data.department == undefined )
                {
                    toaster.pop('error', 'Task error', 'There is no department');
                    return;
                }

                if( data.staff_list.length < 1 )
                {
                    toaster.pop('error', 'Task error', 'No Staff is on shift');
                    data.staff_list.push({id: 0, user_id: 0, wholename: 'No Staff is on shift'});
                }

                var staff_name = data.staff_list[0].wholename;

                var systemtask_data = {};

                systemtask_data.property_id = profile.property_id;
                systemtask_data.dept_func = data.deptfunc.id;
                systemtask_data.department_id = data.department.id;
                systemtask_data.type = 1;
                systemtask_data.priority = $scope.prioritylist[$scope.prioritylist.length - 1].id;  // high priority
                systemtask_data.start_date_time = moment().format("YYYY-MM-DD HH:mm:ss");
                systemtask_data.end_date_time = '0000-00-00 00:00:00';
                systemtask_data.dispatcher = data.staff_list[0].user_id;

                systemtask_data.attendant = profile.id;
                systemtask_data.room = $scope.guest.room_id;
                systemtask_data.task_list = task.id;
                systemtask_data.max_time = data.taskgroup.max_time;
                systemtask_data.quantity = 1;
                systemtask_data.custom_message = '';
                systemtask_data.status_id = 1;
                systemtask_data.self_start_status = task.self_start_flag;
                if( task.self_start_flag == 1 )    // self started
                {
                    systemtask_data.status_id = 6;  // Assigned
                    systemtask_data.start_duration = task.start_duration;
                }

                systemtask_data.guest_id = $scope.guest.guest_id;
                systemtask_data.location_id = $scope.selected_room.location_group.id;

                var tasklist = [];
                tasklist.push(systemtask_data);

                $rootScope.myPromise = GuestService.createTaskList(tasklist);
                $rootScope.myPromise.then(function(response) {
                    console.log(response);
                    if( response.data.count > 0) {
                        $scope.main_task = {};
                        $scope.tasks = [];
                        $scope.quicktasks = [];
                        $scope.max_ticket_no = response.data.max_ticket_no;
                        $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);

                        $scope.$emit('onTicketChange', tasklist);

                        $scope.onRoomSelect($scope.selected_room);

                        if( systemtask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', task.task + ' is already opened for Room ' + $scope.selected_room.room);
                    }
                    $scope.selected_room.room = '';
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
            });

    }
    
    $scope.addSystemTaskq = function (task) {
        if( !($scope.selected_room.id > 0 && $scope.guest.guest_name) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }
         var modalInstance = $uibModal.open({
            templateUrl: 'tpl/guestservice/ticket/guestmodal.html',
            controller: 'GuestSystemModalCtrl',
            resolve: {
              task: function () {

                    return task;
                },
                selected_room: function () {

                    return $scope.selected_room;
                },
                guest: function () {

                    return $scope.guest;
                },
                prioritylist: function () {

                    return $scope.prioritylist;
                }
                }
            
        });
        }

    $scope.$on('create_new_task', function(event, args){        
        $scope.addQuickTask(args);
    });    
    
    $scope.addQuickTask = function (task) {
        if( !($scope.selected_room.id > 0 && $scope.guest.guest_name) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }

        GuestService.getTaskInfo(task.id, $scope.selected_room.location_group.location_grp)
            .then(function(response){
                console.log(response);
                var profile = AuthService.GetCredentials();

                var date = new Date();

                var data = response.data;
                if( data.department == undefined )
                {
                    toaster.pop('error', 'Task error', 'There is no department');
                    return;
                }

                if( data.staff_list.length < 1 )
                {
                    toaster.pop('error', 'Task error', 'No Staff is on shift');
                    data.staff_list.push({id: 0, user_id: 0, wholename: 'No Staff is on shift'});
                }

                var staff_name = data.staff_list[0].wholename;

                var quicktask_data = {};

                quicktask_data.property_id = profile.property_id;
                quicktask_data.dept_func = data.deptfunc.id;
                quicktask_data.department_id = data.department.id;
                quicktask_data.type = 1;
                quicktask_data.priority = $scope.prioritylist[0].id;
                quicktask_data.start_date_time = moment().format("YYYY-MM-DD HH:mm:ss");
                quicktask_data.end_date_time = '0000-00-00 00:00:00';
                quicktask_data.dispatcher = data.staff_list[0].user_id;

                quicktask_data.attendant = profile.id;
                quicktask_data.room = $scope.guest.room_id;
                quicktask_data.task_list = task.id;
                quicktask_data.max_time = data.taskgroup.max_time;
                quicktask_data.quantity = 1;
                quicktask_data.custom_message = '';
                quicktask_data.status_id = 1;
                quicktask_data.self_start_status = task.self_start_flag;
                if( task.self_start_flag == 1 )    // self started
                {
                    quicktask_data.status_id = 6;  // Assigned
                    quicktask_data.start_duration = task.start_duration;
                }

                quicktask_data.guest_id = $scope.guest.guest_id;
                quicktask_data.location_id = $scope.selected_room.location_group.id;

                var tasklist = [];
                tasklist.push(quicktask_data);

                $rootScope.myPromise = GuestService.createTaskList(tasklist);
                $rootScope.myPromise.then(function(response) {
                    console.log(response);
                    if( response.data.count > 0) {
                        $scope.main_task = {};
                        $scope.tasks = [];
                        $scope.quicktasks = [];
                        $scope.max_ticket_no = response.data.max_ticket_no;
                        $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);

                        $scope.$emit('onTicketChange', tasklist);

                        $scope.onRoomSelect($scope.selected_room);

                        if( quicktask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', task.task + ' is already opened for Room ' + $scope.selected_room.room);
                    }
                    $scope.selected_room.room = '';
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
            });

    }
    
     $scope.addQuickTaskq = function (task) {
        if( !($scope.selected_room.id > 0 && $scope.guest.guest_name) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }
        //$scope.quantity=1;

           var modalInstance = $uibModal.open({
            templateUrl: 'tpl/guestservice/ticket/guestmodal.html',
            controller: 'GuestModalCtrl',
            resolve: {
              task: function () {

                    return task;
                },
                selected_room: function () {

                    return $scope.selected_room;
                },
                guest: function () {

                    return $scope.guest;
                },
                prioritylist: function () {

                    return $scope.prioritylist;
                }
                }
            
        });
        }
         $scope.$on('onaddQuickTaskq', function(event, args){
        //toaster.pop('error', 'Balls');

        $scope.onRoomSelect(args);
        //toaster.pop('error', 'Refreshed');
    });


    function isValidTask(task, message_flag) {
        var data = {};

        if( !task.tasklist )
        {
            if( message_flag == true )
                toaster.pop('error', 'Error', 'Please select task list');
            return false;
        }

        if( !task.dept_func || !task.dispatcher )
        {
            if( message_flag == true )
                toaster.pop('error', 'Validate Error', 'Please input all fields');
            return false;
        }

        return true;
    }

    function getTaskData(task) {
        var profile = AuthService.GetCredentials();

        var data = {};

        data.property_id = profile.property_id;

        if( !task.tasklist )
        {
            return;
        }

        if( !task.dept_func || !task.dispatcher )
        {
            return;
        }
        data.dept_func = task.dept_func.id;
        data.department_id = task.department_id;
        data.type = 1;
        data.priority = task.priority_id;

        var date = new Date();
        var date1 = angular.copy(date);

        if( task.schedule_flag == false ) {
            data.start_date_time = moment().format("YYYY-MM-DD HH:mm:ss");
            data.status_id = 1;            
            data.running = 1;
            data.dispatcher = task.dispatcher.user_id;              
        }
        else {
            var date = '';
            if( task.date instanceof Date )
                date = task.date.format('yyyy-MM-dd');
            else
                date = task.date;

            data.start_date_time = date;
            data.status_id = 5; // schedule state
            data.running = 0;
            data.dispatcher = 0;
        }

        data.repeat_flag = task.repeat_flag;
        data.until_checkout_flag = task.until_checkout_flag;
        if(task.until_checkout_flag == true) {
            data.repeat_end_date = date1.format("yyyy-MM-dd");
        }else {
            if( task.repeat_end_date instanceof Date )
               data.repeat_end_date = task.repeat_end_date.format("yyyy-MM-dd");
            else
                data.repeat_end_date = task.repeat_end_date;
        }

        data.end_date_time = '0000-00-00 00:00:00';

        data.attendant = profile.id;
        //data.room = $scope.guest.room_id;
        data.room = $scope.selected_room.id;
        data.task_list = task.tasklist.id;

        data.self_start_status = task.tasklist.self_start_flag;
        if( task.tasklist.self_start_flag == 1 && data.status_id == 1 )    // self started && normal start
        {
            data.status_id = 6;  // Assigned
            data.start_duration = task.tasklist.start_duration;
        }

        if( task.dispatcher.user_id > 0 )
            data.max_time = task.max_duration;
        else
            data.max_time = 0;

        data.quantity = task.quantity;
        data.custom_message = task.custom_message;
        data.guest_id = $scope.guest.guest_id;
        data.location_id = $scope.selected_room.location_group.id;

        return data;
    }

    $scope.createTasks = function (flag) {  // 0: only create, 1: Create and another for same room, 2: Create and another for diff room
        var tasklist = [];
        if( !($scope.selected_room.id > 0 && $scope.guest.guest_name) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }

       
        $scope.addTask();

        for( var i = 0; i < $scope.tasks.length; i++)
        {
            var task = $scope.tasks[i];
            var data = getTaskData(task);
            if( !data )
                continue;

            tasklist.push(data);
        }

        if( tasklist.length < 1 )
        {
            toaster.pop('error', 'Task error', 'Please add a task at least');
            return;   
        }

       
        $rootScope.myPromise = GuestService.createTaskList(tasklist);
        $rootScope.myPromise.then(function(response) {
            console.log(response);

            if( response.data.count > 0) {
                toaster.pop('success', MESSAGE_TITLE, 'Tasks are created successfully');

                $scope.main_task = {};
                $scope.tasks = [];
                $scope.quicktasks = [];

                $scope.max_ticket_no = response.data.max_ticket_no;
                $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);

                $scope.$emit('onTicketChange', tasklist);

                if( flag == 0 ) // Create
                {
                    $scope.selected_room = {};
                    $scope.room_num = '';
                    $scope.guest = {};
                    $scope.$emit('onTicketCreateFinished', 1);      // Guest Request
                }
                if( flag == 1 ) // Create Create & add another for same room
                {
                    // refresh quick task list
                    $scope.onRoomSelect($scope.selected_room);
                }

                if( flag == 2 ) // Create Create & add another for another room
                {
                    $scope.selected_room = {};
                    $scope.room_num = '';
                    $scope.guest = {};
                }

            }
            else {
                toaster.pop('error', 'Create Task', $scope.tasks[0].tasklist.task + ' is already opened for Room ' + $scope.selected_room.room);
            }


        }).catch(function(response) {
            toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
        })
        .finally(function() {

        });
    }

    $scope.$watch('datetime.date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.main_task.date = newValue.format('yyyy-MM-dd HH:mm:ss');
    });


    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        if( $view == 'day' )
        {
            var activeDate = moment().subtract('days', 1);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
        else if( $view == 'minute' )
        {
            var activeDate = moment().subtract('minute', 5);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
    }

    $scope.history_view = false;
    $scope.historylist = {};    
    $scope.showGuestHisotry = function(guest_name) {
        $scope.history_view = true;        
        $scope.history.limit = 10;
    }

    $scope.getHistoryType = function(type_id){
        if(type_id == 1) return 'Guest';
        if(type_id == 3) return 'Complaints';
    }

    $scope.hideGuestHisotry = function(){
        $scope.history_view = false;
        $scope.history.limit = 0;
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        dateDisabled: disabled,
        class: 'datepicker'
    };

    function disabled(data) {
        var date = data.date;
        var sel_date = moment(date).format('YYYY-MM-DD');
        var disabled = true;
        if( moment().add(1, 'days').format('YYYY-MM-DD') <= sel_date && sel_date <= $scope.guest.departure )
            disabled = false;
        else
            disabled = true;

        mode = data.mode;
        return mode === 'day' && disabled;
    }

    $scope.select = function(date) {
        console.log(date);

        $scope.opened = false;
    }
   
});

app.controller('GuestModalCtrl', function($scope, $rootScope, $http, AuthService, GuestService, $interval, toaster, $timeout, $uibModalInstance, task, guest, selected_room, prioritylist) {
/*
           $scope.ok = function () {
        $uibModalInstance.close($scope.sub);
        };
*/
$scope.quantity=1;
$scope.custom_message='';
        $scope.cancel = function () {
        $uibModalInstance.dismiss();
        };

                GuestService.getTaskInfo(task.id, selected_room.location_group.location_grp)
            .then(function(response){
                console.log(response);
                var profile = AuthService.GetCredentials();

                var date = new Date();

                var data = response.data;
                if( data.department == undefined )
                {
                    toaster.pop('error', 'Task error', 'There is no department');
                    return;
                }

                if( data.staff_list.length < 1 )
                {
                    toaster.pop('error', 'Task error', 'No Staff is on shift yes');
                    data.staff_list.push({id: 0, user_id: 0, wholename: 'No Staff is on shift '});
                }

                var staff_name = data.staff_list[0].wholename;

                var quicktask_data = {};

                quicktask_data.property_id = profile.property_id;
                quicktask_data.dept_func = data.deptfunc.id;
                quicktask_data.department_id = data.department.id;
                quicktask_data.type = 1;
                quicktask_data.priority = prioritylist[0].id;
                quicktask_data.start_date_time = moment().format("YYYY-MM-DD HH:mm:ss");
                quicktask_data.end_date_time = '0000-00-00 00:00:00';
                quicktask_data.dispatcher = data.staff_list[0].user_id;

                quicktask_data.attendant = profile.id;
                quicktask_data.room = guest.room_id;
                quicktask_data.task_list = task.id;
                quicktask_data.max_time = data.taskgroup.max_time;
                quicktask_data.status_id = 1;
                quicktask_data.self_start_status = task.self_start_flag;
                if( task.self_start_flag == 1 )    // self started
                {
                    quicktask_data.status_id = 6;  // Assigned
                    quicktask_data.start_duration = task.start_duration;
                }

                quicktask_data.guest_id =guest.guest_id;
                quicktask_data.location_id = selected_room.location_group.id;
                
                
                $scope.create = function(){
                quicktask_data.quantity = $scope.quantity;
                
                
                quicktask_data.custom_message = $scope.custom_message;
                
                var tasklist = [];
                tasklist.push(quicktask_data);

                $rootScope.myPromise = GuestService.createTaskList(tasklist);
                $rootScope.myPromise.then(function(response) {
                    console.log(response);
                    if( response.data.count > 0) {
                        $scope.main_task = {};
                        $scope.tasks = [];
                        $scope.quicktasks = [];
                        $scope.max_ticket_no = response.data.max_ticket_no;
                        $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);

                        $rootScope.$broadcast('onTicketChange', tasklist);
                        $rootScope.$broadcast('onaddQuickTaskq', selected_room);
                        //$scope.onRoomSelect($scope.selected_room);

                        //$scope.$emit('onRoomSelect', selected_room);
                        //$scope.$emit('onTicketCreateFinished', 1);

                        if( quicktask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', task.task + ' is already opened for Room ' + selected_room.room);
                    }
                    selected_room.room = '';
                    
                    $uibModalInstance.dismiss();
                   /// $scope.refreshTickets(); 
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Task creation unsucessful');
                    })
                    .finally(function() {

                    });
                     };
            });
           

    });
    
 app.controller('GuestSystemModalCtrl', function($scope, $rootScope, $http, AuthService, GuestService, $interval, toaster, $timeout, $uibModalInstance, task, guest, selected_room, prioritylist) {
/*
           $scope.ok = function () {
        $uibModalInstance.close($scope.sub);
        };
*/
$scope.quantity=1;
$scope.custom_message='';
        $scope.cancel = function () {
        $uibModalInstance.dismiss();
        };

                GuestService.getTaskInfo(task.id, selected_room.location_group.location_grp)
            .then(function(response){
                console.log(response);
                var profile = AuthService.GetCredentials();

                var date = new Date();

                var data = response.data;
                if( data.department == undefined )
                {
                    toaster.pop('error', 'Task error', 'There is no department');
                    return;
                }

                if( data.staff_list.length < 1 )
                {
                    toaster.pop('error', 'Task error', 'No Staff is on shift');
                    data.staff_list.push({id: 0, user_id: 0, wholename: 'No Staff is on shift'});
                }

                var staff_name = data.staff_list[0].wholename;

                var systemtask_data = {};

                systemtask_data.property_id = profile.property_id;
                systemtask_data.dept_func = data.deptfunc.id;
                systemtask_data.department_id = data.department.id;
                systemtask_data.type = 1;
                systemtask_data.priority = prioritylist[prioritylist.length - 1].id;  // high priority
                systemtask_data.start_date_time = moment().format("YYYY-MM-DD HH:mm:ss");
                systemtask_data.end_date_time = '0000-00-00 00:00:00';
                systemtask_data.dispatcher = data.staff_list[0].user_id;

                systemtask_data.attendant = profile.id;
                systemtask_data.room = guest.room_id;
                systemtask_data.task_list = task.id;
                systemtask_data.max_time = data.taskgroup.max_time;
/*
                systemtask_data.quantity = 1;
                systemtask_data.custom_message = '';
*/
                systemtask_data.status_id = 1;
                systemtask_data.self_start_status = task.self_start_flag;  // Assigned
                if( task.self_start_flag == 1 )    // self started
                {
                    systemtask_data.status_id = 6;  // Assigned
                    systemtask_data.start_duration = task.start_duration;
                }

                systemtask_data.guest_id = guest.guest_id;
                systemtask_data.location_id = selected_room.location_group.id;
                
                $scope.create = function(){
                systemtask_data.quantity = $scope.quantity;
                
                
                systemtask_data.custom_message = $scope.custom_message;

                var tasklist = [];
                tasklist.push(systemtask_data);

                $rootScope.myPromise = GuestService.createTaskList(tasklist);
                $rootScope.myPromise.then(function(response) {
                    console.log(response);
                    if( response.data.count > 0) {
                        $scope.main_task = {};
                        $scope.tasks = [];
                        $scope.quicktasks = [];
                        $scope.max_ticket_no = response.data.max_ticket_no;
                        $scope.ticket_id = sprintf('G%05d', $scope.max_ticket_no + 1);

                       $rootScope.$broadcast('onTicketChange', tasklist);
                        $rootScope.$broadcast('onaddQuickTaskq', selected_room);

                        if( systemtask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', task.task + ' is already opened for Room ' + selected_room.room);
                    }
                    selected_room.room = '';
                    $uibModalInstance.dismiss();
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });

                     };
            });
           

    });

    
  app.directive('sglclick', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
              var fn = $parse(attr['sglclick']);
              var delay = 300, clicks = 0, timer = null;
              element.on('click', function (event) {
                clicks++;  //count clicks
                if(clicks === 1) {
                  timer = setTimeout(function() {
                    scope.$apply(function () {
                        fn(scope, { $event: event });
                    }); 
                    clicks = 0;             //after action performed, reset counter
                  }, delay);
                  } else {
                    clearTimeout(timer);    //prevent single-click action
                    clicks = 0;             //after action performed, reset counter
                  }
              });
            }
        };
    }]);



