app.controller('DepartmentrequestController', function ($scope, $rootScope, $http, $interval, $uibModal, toaster, GuestService, AuthService) {
    var MESSAGE_TITLE = 'Create Department Task';

    $scope.tasks = [];
    $scope.location = {};
    $scope.quicktasks = [];

    GuestService.getMaxTicketNo()
        .then(function(response) {
            $scope.max_ticket_no = response.data.max_ticket_no + $scope.newTickets.length - 1;
            $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);
        });

    var date = new Date();
    $scope.location.request_time = date.format("HH:mm:ss");
    $scope.timer = $interval(function() {
        var date = new Date();
        $scope.location.request_time = date.format("HH:mm:ss");
    }, 1000);

    $scope.onLocationSelect = function ($item, $model, $label) {
        $scope.location = angular.copy($item);

        var profile = AuthService.GetCredentials();
        $scope.location.requester = profile;
        $scope.location.requester.wholename = profile.first_name + ' ' + profile.last_name;

        $scope.addMainTask();

        GuestService.getQuickTaskList(2, $item.property_id)
            .then(function(response){
                $scope.quicktasks = response.data;
            });
    };

    $scope.$on('room_selected', function(event, args){        
        GuestService.getLocationGroupFromRoom(args.id)
            .then(function(response){
                var location = response.data;
                location.name = args.room;
                location.property_id = args.property_id;
                $scope.onLocationSelect(location, null, null);
            });
    });

    $scope.getStaffList = function(val) {
        if( val == undefined )
            val = "";

        return GuestService.getStaffList(val)
            .then(function(response){
                return response.data.filter(function(item, index, attr){
                    return index < 10;
                });
            });
    };

    $scope.onRequesterSelect = function ($item, $model, $label) {
        $scope.location.requester = $item;

    };

    $scope.addMainTask = function() {
        var date = new Date();

        $scope.main_task = {
            ticket_no : $scope.max_ticket_no + 1,
            task_name : "",
            qunatity : 1,
            department : "",
            dept_func : "",
            dept_staff : "",
            device : "",
            priority_id : $scope.prioritylist[0].id,
            max_duration : "",
            custom_message : "",
            start_date_time : date.format("yyyy-MM-dd HH:mm:ss"),
            date : moment().format("YYYY-MM-DD HH:mm:ss"),
            schedule_flag: false
        }
    }


    $scope.getTaskList = function(val) {
        if( val == undefined )
            val = "";
        return GuestService.getTaskList(val, $scope.location.property_id, 2)
            .then(function(response){
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

    $scope.onMainTaskSelect = function (task, $item, $model, $label) {
        console.log($item);

        if( !$scope.location )
        {
            toaster.pop('error', MESSAGE_TITLE, 'There is no location group' );
            return;
        }

        $scope.addMainTask();

        if( checkDuplicatedTask($item) )
            return;

        $scope.main_task.schedule_flag = false;
        $scope.main_task.quantity = 1;
        $scope.main_task.tasklist = $item;

        GuestService.getTaskInfo($item.id, $scope.location.location_grp)
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

        var task = $scope.main_task;

        var task = $scope.main_task;

        task.department = $item.department;        
        task.department_id = $item.id;
        task.dept_func = null;

        // getSelectedDepartmentInfo($item);
    };

    $scope.onMainDeptFuncSelect = function (task, $item, $model, $label) {
        console.log($item);

        if( !$scope.location )
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
        request.location_group_id = $scope.location.location_grp;
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
        data.type = 2;
        data.priority = task.priority_id;

        var date = new Date();

        if( task.schedule_flag == false ) {
            data.start_date_time = date.format("yyyy-MM-dd HH:mm:ss");
            data.status_id = 1;
            data.running = 1;
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
        }

        data.end_date_time = '0000-00-00 00:00:00';

        data.dispatcher = task.dispatcher.user_id;
        data.attendant = profile.id;

        if( $scope.location.type == 'Room' )
            data.room = $scope.location.type_id;
        else
            data.room = 0;

        data.task_list = task.tasklist.id;
        data.max_time = task.max_duration;
        data.quantity = task.quantity;
        data.custom_message = task.custom_message;
        data.guest_id = 0;
        data.location_id = $scope.location.id;

        data.self_start_status = task.tasklist.self_start_flag;
        if( task.tasklist.self_start_flag == 1 && data.status_id == 1 )    // self started && normal start
        {
            data.status_id = 6;  // Assigned
            data.start_duration = task.tasklist.start_duration;
        }

        data.requester_id = $scope.location.requester.id;
        data.requester_name = $scope.location.requester.wholename;
        data.requester_job_role = $scope.location.requester.job_role;

        data.requester_notify_flag = $scope.location.notify_flag ? 1 : 0;
        data.requester_email = $scope.location.requester.email;
        data.requester_mobile = $scope.location.requester.mobile;


        return data;
    }
    
    $scope.createTasks = function (flag) {
        if( !($scope.location.id > 0 && $scope.location.requester && $scope.location.requester.wholename.length > 0) )
        {
            toaster.pop('error', MESSAGE_TITLE, 'Please select location and requester')
            return;
        }

        $scope.addTask(false);

        var tasklist = [];
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
                $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);

                $scope.$emit('onTicketChange', tasklist);

                if (flag == 0) // Create
                {
                    $scope.location = {};
                    $scope.$emit('onTicketCreateFinished', 2);      // Department Request
                }
                if (flag == 1) // Create Create & add another for same room
                {
                    // refresh quick task list
                    $scope.onLocationSelect($scope.location);
                }

                if (flag == 2) // Create Create & add another for same room
                {
                    $scope.location = {};
                }
            }
            else {
                toaster.pop('error', 'Create Task', 'Task is already created for ' + $scope.location.type + ' ' + $scope.location.name);
            }
        }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Tasks have been failed to create');
            })
            .finally(function() {

            });
        
    }

    $scope.addQuickTask = function (task) {
        if( !($scope.location.id > 0 && $scope.location.requester && $scope.location.requester.wholename.length > 0) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }

        GuestService.getTaskInfo(task.id, $scope.location.location_grp)
            .then(function(response){
                console.log(response);
                var date = new Date();

                var profile = AuthService.GetCredentials();

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
                quicktask_data.type = 2;
                quicktask_data.priority = $scope.prioritylist[0].id;
                quicktask_data.start_date_time = date.format("yyyy-MM-dd HH:mm:ss");
                quicktask_data.end_date_time = '0000-00-00 00:00:00';

                quicktask_data.dispatcher = data.staff_list[0].user_id;
                quicktask_data.attendant = profile.id;

                if( $scope.location.type == 'Room' )
                    quicktask_data.room = $scope.location.type_id;
                else
                    quicktask_data.room = 0;

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

                quicktask_data.running = 1;
                quicktask_data.guest_id = 0;

                quicktask_data.location_id = $scope.location.id;
                quicktask_data.requester_id = $scope.location.requester.id;
                quicktask_data.requester_name = $scope.location.requester.wholename;
                quicktask_data.requester_job_role = $scope.location.requester.job_role;

                quicktask_data.requester_notify_flag = $scope.location.notify_flag ? 1 : 0;
                quicktask_data.requester_email = $scope.location.requester.email;
                quicktask_data.requester_mobile = $scope.location.requester.mobile;

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
                        $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);

                        $scope.$emit('onTicketChange', tasklist);

                        $scope.onLocationSelect($scope.location);

                        if( quicktask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', 'Task is already assigned to ' + $scope.main_task.username);
                    }
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
            });

    }
    $scope.addQuickTaskq = function (task) {
	    if( !($scope.location.id > 0 && $scope.location.requester && $scope.location.requester.wholename.length > 0) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }
        
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/guestservice/ticket/guestDmodal.html',
            controller: 'DeptModalCtrl',
            resolve: {
              task: function () {

                    return task;
                },
                location: function () {

                    return $scope.location;
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
        
        $scope.$on('onaddQuickDTaskq', function(event, args){
        //toaster.pop('error', 'Balls');

        $scope.onLocationSelect(args);
        //toaster.pop('error', 'Refreshed');
    });


    $scope.addSystemTask = function (task) {
        if( !($scope.location.id > 0 && $scope.location.requester && $scope.location.requester.wholename.length > 0) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }

        GuestService.getTaskInfo(task.id, $scope.location.location_grp)
            .then(function(response){
                console.log(response);
                var date = new Date();

                var profile = AuthService.GetCredentials();

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
                systemtask_data.type = 2;
                systemtask_data.priority = $scope.prioritylist[0].id;
                systemtask_data.start_date_time = date.format("yyyy-MM-dd HH:mm:ss");
                systemtask_data.end_date_time = '0000-00-00 00:00:00';

                systemtask_data.dispatcher = data.staff_list[0].user_id;
                systemtask_data.attendant = profile.id;

                if( $scope.location.type == 'Room' )
                    systemtask_data.room = $scope.location.type_id;
                else
                    systemtask_data.room = 0;

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

                systemtask_data.running = 1;
                systemtask_data.guest_id = 0;

                systemtask_data.location_id = $scope.location.id;
                systemtask_data.requester_id = $scope.location.requester.id;
                systemtask_data.requester_name = $scope.location.requester.wholename;
                systemtask_data.requester_job_role = $scope.location.requester.job_role;

                systemtask_data.requester_notify_flag = $scope.location.notify_flag ? 1 : 0;
                systemtask_data.requester_email = $scope.location.requester.email;
                systemtask_data.requester_mobile = $scope.location.requester.mobile;

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
                        $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);

                        $scope.$emit('onTicketChange', tasklist);

                        $scope.onLocationSelect($scope.location);

                        if( systemtask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', $scope.tasks[0].tasklist.task + ' is assigned to Staff ' + $scope.tasks[0].dispatcher.wholename);
                        else
                            if( task.schedule_flag == false )
                                toaster.pop('error', 'Create Task', $scope.tasks[0].tasklist.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', 'Task is already assigned to ' + $scope.tasks[0].dispatcher.wholename);
                    }
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
            });

    }
    
    $scope.addSystemTaskq = function (task) {
        if( !($scope.location.id > 0 && $scope.location.requester && $scope.location.requester.wholename.length > 0) )
        {
            toaster.pop('error', 'Task error', 'Please select room and guest');
            return;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/guestservice/ticket/guestDmodal.html',
            controller: 'DeptSystemModalCtrl',
            resolve: {
              task: function () {

                    return task;
                },
                location: function () {

                    return $scope.location;
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

});

app.controller('DeptModalCtrl', function($scope, $rootScope, $http, AuthService, GuestService, $interval, toaster, $timeout, $uibModalInstance, task, guest, location, prioritylist) {


$scope.quantity=1;
$scope.custom_message='';
        $scope.cancel = function () {
        $uibModalInstance.dismiss();
        };
        
        GuestService.getTaskInfo(task.id, location.location_grp)
            .then(function(response){
                console.log(response);
                var date = new Date();

                var profile = AuthService.GetCredentials();

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
                quicktask_data.type = 2;
                quicktask_data.priority = prioritylist[0].id;
                quicktask_data.start_date_time = date.format("yyyy-MM-dd HH:mm:ss");
                quicktask_data.end_date_time = '0000-00-00 00:00:00';

                quicktask_data.dispatcher = data.staff_list[0].user_id;
                quicktask_data.attendant = profile.id;

                if( location.type == 'Room' )
                    quicktask_data.room = location.type_id;
                else
                    quicktask_data.room = 0;

                quicktask_data.task_list = task.id;
                quicktask_data.max_time = data.taskgroup.max_time;
               
                quicktask_data.status_id = 1;
                quicktask_data.self_start_status = task.self_start_flag;
                if( task.self_start_flag == 1 )    // self started
                {
                    quicktask_data.status_id = 6;  // Assigned
                    quicktask_data.start_duration = task.start_duration;
                }

                quicktask_data.running = 1;
                quicktask_data.guest_id = 0;

                quicktask_data.location_id = location.id;
                quicktask_data.requester_id = location.requester.id;
                quicktask_data.requester_name = location.requester.wholename;
                quicktask_data.requester_job_role = location.requester.job_role;

                quicktask_data.requester_notify_flag = location.notify_flag ? 1 : 0;
                quicktask_data.requester_email = location.requester.email;
                quicktask_data.requester_mobile = location.requester.mobile;
                
                
                
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
                        $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);

                        $rootScope.$broadcast('onTicketChange', tasklist);

                        $rootScope.$broadcast('onaddQuickDTaskq', location);

                        if( quicktask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', 'Task is already assigned to ' + $scope.main_task.username);
                    }
                    $uibModalInstance.dismiss();
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
                    };
            });
            
              });
              
     app.controller('DeptSystemModalCtrl', function($scope, $rootScope, $http, AuthService, GuestService, $interval, toaster, $timeout, $uibModalInstance, task, guest, location, prioritylist) {
	     $scope.quantity=1;
	     $scope.custom_message='';
        $scope.cancel = function () {
        $uibModalInstance.dismiss();
        };
        GuestService.getTaskInfo(task.id, location.location_grp)
            .then(function(response){
                console.log(response);
                var date = new Date();

                var profile = AuthService.GetCredentials();

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
                systemtask_data.type = 2;
                systemtask_data.priority = prioritylist[0].id;
                systemtask_data.start_date_time = date.format("yyyy-MM-dd HH:mm:ss");
                systemtask_data.end_date_time = '0000-00-00 00:00:00';

                systemtask_data.dispatcher = data.staff_list[0].user_id;
                systemtask_data.attendant = profile.id;

                if( location.type == 'Room' )
                    systemtask_data.room = location.type_id;
                else
                    systemtask_data.room = 0;

                systemtask_data.task_list = task.id;
                systemtask_data.max_time = data.taskgroup.max_time;
/*
                systemtask_data.quantity = 1;
                systemtask_data.custom_message = '';
*/
                systemtask_data.status_id = 1;
                systemtask_data.self_start_status = task.self_start_flag;
                if( task.self_start_flag == 1 )    // self started
                {                    
                    systemtask_data.status_id = 6;  // Assigned
                    systemtask_data.start_duration = task.start_duration;
                }

                systemtask_data.running = 1;
                systemtask_data.guest_id = 0;

                systemtask_data.location_id = location.id;
                systemtask_data.requester_id = location.requester.id;
                systemtask_data.requester_name = location.requester.wholename;
                systemtask_data.requester_job_role = location.requester.job_role;

                systemtask_data.requester_notify_flag = location.notify_flag ? 1 : 0;
                systemtask_data.requester_email = location.requester.email;
                systemtask_data.requester_mobile = location.requester.mobile;
                
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
                        $scope.ticket_id = sprintf('D%05d', $scope.max_ticket_no + 1);

                       $rootScope.$broadcast('onTicketChange', tasklist);

                        $rootScope.$broadcast('onaddQuickDTaskq', location);

                        if( systemtask_data.dispatcher > 0 )
                            toaster.pop('success', 'Create Task', task.task + ' is assigned to Staff ' + staff_name);
                        else
                            if( task.schedule_flag == false )
                                toaster.pop('error', 'Create Task', task.task + ' will be escalated to Managers.');
                    }
                    else {
                        toaster.pop('error', 'Create Task', 'Task is already assigned to ' +$scope.main_task.username);
                    }
                    $uibModalInstance.dismiss();
                }).catch(function(response) {
                        toaster.pop('error', 'Create Task', 'Tasks have been failed to create');
                    })
                    .finally(function() {

                    });
                    };
            });
            
              });

        
    
  app.directive('sgldclick', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
              var fn = $parse(attr['sgldclick']);
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



        
        