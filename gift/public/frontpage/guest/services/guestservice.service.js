app.service('GuestService', function ($rootScope, $http, AuthService) {
    this.getTicketFilterList = function(attendant) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var promiss = $http.get('/frontend/guestservice/filterlist?attendant=' + attendant+'&property_id=' + property_id);

        return promiss;
    }

    this.getRoomList = function(room) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var promiss = $http.get('/frontend/guestservice/roomlist?room=' + room + '&property_id=' + property_id);

        return promiss;
    }
    this.getRoomId = function(room_name) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var promiss = $http.get('/frontend/guestservice/roomid?room=' + room_name + '&property_id=' + property_id);

        return promiss;
    }

    this.getPriorityList = function() {
        var promiss = $http.get('/guest/guestservice/prioritylist');

        return promiss;
    }

    this.getGuestName = function(room_info) {
        var promiss = $http.get('/guest/guestservice/guestname?room_id=' + room_info.id);

        return promiss;
    }

    this.getTaskList = function(task, property_id, type) {
        var promiss = $http.get('/guest/guestservice/tasklist?task=' + task + '&property_id=' + property_id + '&type=' + type);

        return promiss;
    }

    this.getTaskListForGuest = function(task, property_id, type) {
        var promiss = $http.get('/guest/guestservice/tasklist?task=' + task + '&property_id=' + property_id + '&type=' + type + '&by_guest=1');

        return promiss;
    }

    this.getOneTaskInfo = function(task_id, property_id, type) {
        var promiss = $http.get('/frontend/guestservice/onetaskinfo?task_id=' + task_id + '&property_id=' + property_id + '&type=' + type);

        return promiss;
    }

    this.getTaskListInDepartment = function(task, property_id, dept_func_id, type) {
        var promiss = $http.get('/frontend/guestservice/tasklist?task=' + task + '&property_id=' + property_id + '&dept_func_id=' + dept_func_id + '&type=' + type);

        return promiss;
    }

    this.getQuickTaskList = function(type, property_id) {
        var promiss = $http.get('/guest/guestservice/quicktasklist?type=' + type + '&property_id=' + property_id);

        return promiss;
    }

    this.addTask = function(task) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var promiss = $http.get('/frontend/guestservice/addtask?task=' + task + '&property_id=' + property_id);

        return promiss;
    }
    this.getLocationGroupFromRoom = function(room_id) {
        var promiss = $http.get('/guest/guestservice/locationgroup?room_id=' + room_id);

        return promiss;
    }

    this.getTaskInfo = function(task_id, lg_id) {
        var promiss = $http.get('/guest/guestservice/taskinfo?task_id=' + task_id + '&location_group=' + lg_id);

        return promiss;
    }

    this.getDepartList = function() {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var promiss = $http.get('/frontend/guestservice/departlist?property_id=' + property_id);
        return promiss;
    }

    this.getDeptFuncList = function(val, dept_id) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var promiss = $http.get('/frontend/guestservice/deptfunclist?property_id=' + property_id + '&dept_id=' + dept_id + '&val=' + val);
        return promiss;
    }

    this.getDepartSearchList = function(val) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var promiss = $http.get('/frontend/guestservice/departsearchlist?department='+val+'&property_id=' + property_id);
        return promiss;
    }

    this.getLocationGroup = function(location_id) {
        var promiss = $http.get('/frontend/guestservice/getlocationgroup?location_id=' + location_id );

        return promiss;
    }

    this.getMaxTicketNo = function() {
        var promiss = $http.get('/frontend/guestservice/maxticketno');

        return promiss;
    }

    this.createTaskList = function(tasklist) {
        var promiss =
            $http({
                method: 'POST',
                url: '/guest/guestservice/createtasklist',
                data: tasklist,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.createQuickTaskList = function(tasklist) {
        return  $http({
            method: 'POST',
            url: '/frontend/guestservice/createquicktasklist',
            data: tasklist,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        });
    }

    this.getTicketList = function(pagenum, pagesize, field, sort, filtername, searchoption) {
        var profile = AuthService.GetCredentials();

        var request = {};
        request.page = pagenum;
        request.pagesize = pagesize;
        request.field = field;
        request.sort = sort;
        request.filtername = filtername;
        request.searchoption = searchoption;
        request.property_id = profile.property_id;
        request.attendant = profile.id;

        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/ticketlist',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.getLocationList = function(value) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var promiss = $http.get('/frontend/guestservice/locationlist?location=' + value + '&property_id=' + property_id);

        return promiss;
    }

    this.getStaffList = function(value) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        var promiss = $http.get('/frontend/guestservice/stafflist?value=' + value + '&property_id=' + property_id);

        return promiss;
    }

    this.getNotificationHistoryList = function(task_id, pagenum, pagesize, field, sort) {
        var request = {};
        request.task_id = task_id;
        request.page = pagenum;
        request.pagesize = pagesize;
        request.field = field;
        request.sort = sort;

        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/notifylist',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.getPreviousHistoryList = function(guest_id) {
        var request = {};
        request.guest_id = guest_id;
        var promiss =
            $http({
                method: 'POST',
                url: '/guest/guestservice/historylist',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });
        return promiss;
    }

    this.changeTaskState = function(task) {
        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/changetask',
                data: task,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.commentCompensationState = function(task) {
        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/commentcompensation',
                data: task,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.getComplaintItemList = function(property_id) {
        var promiss = $http.get('/frontend/guestservice/complaintitems?property_id=' + property_id);

        return promiss;
    }

    this.createComplaintItem = function(data)
    {
        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/createcomplaintitem',
                data: data,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }

    this.createComplaint = function(data) {
        var promiss =
            $http({
                method: 'POST',
                url: '/frontend/guestservice/createcomplaint',
                data: data,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

        return promiss;
    }


    this.getStatus = function(row)
    {
        var status_name = ['Completed', 'Open', 'Escalated','Timeout', 'Canceled', 'Scheduled', 'Assigned', 'Waiting Escalated', 'Unattnded' ];
        var pause_name = ['Paused', '' ];
        if( row.type == 1 ||  row.type == 2 )
        {
            if( row.queued_flag == 1 && row.status_id == 1 )
                return 'Queued';
            else
                return status_name[row.status_id];
        }

        status_name = ['Resolved', 'Open', 'Escalated','Timeout', 'Canceled', 'Scheduled' ];
        if( row.type == 3 )
            return status_name[row.status_id];

        status_name = ['Completed', 'Open', 'Escalated','Timeout', 'Canceled', 'Scheduled' ];
        if( row.type == 4 )
            return status_name[row.status_id];
    }

    this.getCompensationStatus = function(row)
    {
        var status_name = ['Completed Approved', 'On-Route', 'Reject','Return', 'Pending' ];

        return status_name[row.compensation_status];
    }

    this.getPauseState = function(row)
    {
        if( row.status_id == 1 || row.status_id == 2 )
            return row.running == 1 ? false : true;
        else
            return false;
    }


    this.getStatusCss = function(row)
    {
        if( row.active )
            return 'grid-selected';

        if( row.status_id == 0 )    // complete
            return 'grid-complete';
        if( row.status_id == 1 )    // Open
        {
            if( row.running == 1)
                return 'grid-open';
            else
                return 'grid-pause';
        }

        if( row.status_id == 2 )    // Escalated
        {
            if( row.running == 1)
                return 'grid-escalated';
            else
                return 'grid-pause';
        }

        if( row.status_id == 3 )    // timeout
            return 'grid-timeout';

        if( row.status_id == 4 )    // cancel
            return 'grid-cancel';

        if( row.status_id == 5 )    // scheduled
            return 'grid-scheduled';
    }

    this.getStatusCssInEdit = function(row)
    {
        if( row.status_id == 0 )    // complete
            return 'bg-status-completed';
        if( row.status_id == 1 )    // Open
        {
            if( row.running == 1)
                return 'bg-status-assigned';
            else
                return 'bg-status-onhold';
        }

        if( row.status_id == 2 )    // Escalated
        {
            if( row.running == 1)
                return 'bg-status-escalated';
            else
                return 'lime-400';
        }

        if( row.status_id == 3 )    // timeout
            return 'bg-urgency-high';

        if( row.status_id == 4 )    // cancel
            return 'bg-status-cancelled';

        if( row.status_id == 5 )    // Scheduled
            return 'bg-status-scheduled';

        if( row.status_id == 6 )    // Assigned
            return 'bg-status-t-assigned';

        if( row.status_id == 7 )    // Assigned
            return 'bg-status-t-escalated';

        if( row.status_id == 8 )    // Unattended
            return 'bg-status-t-unattended';
    }

    this.getPriorityCss = function(row)
    {
        if( row.priority == 1 )    // Medium
            return 'bg-priority-low';

        if( row.priority == 2 )    // Medium
            return 'bg-priority-medium';

        if( row.priority == 3 )    // High
            return 'bg-priority-high';


    }
    this.getLevelCss = function(row)
    {
        if( row.status_id == 0 )    // complete
        {

        }

        var css_name = ['bg-level1', 'bg-level2', ''];

        var cur_time = new Date().getTime();;
        var start_time = new Date(row.start_date_time);
        var endtime = start_time.getTime() + row.max_time;

        if( cur_time > endtime )    // time is escalape
            return '';
        if( endtime - cur_time < 50000 )
            return  'bg-level2';


        return 'bg-level1';
    }

    this.getTicketTypeCss = function(row)
    {
        var status_name = ['b-l-guest', 'b-l-department', 'b-l-complaint', 'b-l-managedtask', 'b-l-reservation'];

        return status_name[row.type - 1];
    }

    this.getTicketTypeColor = function(row)
    {
        var colors = ['#00B0FF', '#1DE9B6', 'red', '#F50057', 'yellow'];
        //blue , green, red, violet, yellow
        return colors[row.type - 1];
    }

    this.getTicketNumber = function(ticket){
        if( ticket == undefined )
            return 0;
        if( ticket.id == undefined )
            return 0;

        if( ticket.type == 1 )
            return sprintf('G%05d', ticket.id);
        if( ticket.type == 2 )
            return sprintf('D%05d', ticket.id);
        if( ticket.type == 3 )
            return sprintf('C%05d', ticket.id);
        if( ticket.type == 4 )
            return sprintf('M%05d', ticket.id);
        if( ticket.type == undefined )
            return sprintf('R%05d', ticket.id);
    }

    this.getTicketName = function(ticket){
        if( ticket.type == 1 )
            return ticket.task_name;
        if( ticket.type == 2 )
            return ticket.task_name;
        if( ticket.type == 3 )
            return ticket.complaint;
        if( ticket.type == 4 )
            return ticket.task_name;
        if( ticket.type == undefined )
            return ticket.task_name;
    }

    this.getTicketRequestName = function(ticket){
        if( ticket.type == 1 )
            return 'Request for ' + ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == 2 )
            return 'Request for ' + ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == 3 ) {
            if( !ticket.approver )
                return 'Complaint for ' + ticket.complaint;
            else
                return 'Approve for ' + ticket.compensation + ' : Cost = ' + ticket.cost;
        }
        if( ticket.type == 4 )
            return 'Request for ' + ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == undefined )
            return 'Request for ' + ticket.quantity + ' X ' + ticket.task_name;
    }

    this.getTicketNameForList = function(ticket){
        if( ticket.type == 1 )
            return ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == 2 )
            return ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == 3 ) {
            if( !ticket.approver )
                return 'Complaint for ' + ticket.complaint;
            else
                return 'Approve for ' + ticket.compensation + ' : Cost = ' + ticket.cost;
        }
        if( ticket.type == 4 )
            return ticket.quantity + ' X ' + ticket.task_name;
        if( ticket.type == undefined )
            return ticket.quantity + ' X ' + ticket.task_name;
    }

    this.getTicketStatusStyle = function(row) {
        var remain_time = this.getRemainTime(row);
        var percent = remain_time/(row.max_time * 1000/100);
        var style = '' ;
        if( Math.round(percent) > 20 ) style = 'color:#2E7D32';
        if(Math.round(percent) > 0 && Math.round(percent) < 21  ) style = 'color:#827717';
        if(Math.round(percent) <= 0) style = 'color:#B71C1C';
        return style;
    }

    this.getRemainTime = function(row) {
        var remain_time = 0;

        if((row.status_id == 1 || row.status_id == 2) && row.running == 0){     // Open|Escalated & Hold
            if(row.evt_start_time != null&& row.evt_end_time != null) {
                // end time - start time
                remain_time = moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss") - moment(row.evt_start_time, "YYYY-MM-DD HH:mm:ss") + 0;
            }
        }
        else if(row.status_id == 1 && row.running == 1 && row.evt_end_time != null) {    // Open & Running
            // end time - cur time
            remain_time = moment.utc(moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss").diff(moment())) + 0;
        }
        else if( row.status_id == 2 )   // escalated
        {
            remain_time = moment.utc(moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss").diff(moment())) + 0;
        }
        else if(row.status_id == 4 || row.status_id == 0){ // canceled || completed
            // max time - elapsed time(end time - start time)
            var remain_time = 0;
            remain_time = moment(row.end_date_time, "YYYY-MM-DD HH:mm:ss")-moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss") + 0;
            remain_time = row.max_time*1000 -remain_time;
        }
        else if(row.status_id == 5){     // Schedule
            if(row.start_date_time) {
                // end time - start time
                remain_time = moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss") - moment() + 0;
            }
        }
        else if(row.status_id == 6 || row.status_id == 7) {    // Assigned or Escalated or Unattended
            // end time - cur time
            remain_time = moment.utc(moment(row.evt_end_time, "YYYY-MM-DD HH:mm:ss").diff(moment())) + 0;
        }
        else {
            // max time - elapsed time(cur time - start time)
            remain_time = row.start_duration * 1000 - moment.utc(moment().diff(moment(row.start_date_time, "YYYY-MM-DD HH:mm:ss")));
        }

        if( remain_time < 0 )
            remain_time = 0;

        return remain_time;
    }
});