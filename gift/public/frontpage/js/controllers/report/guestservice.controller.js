app.controller('GuestserviceReportController', function($scope, $http, $httpParamSerializer, $window, $timeout, $uibModal, AuthService, toaster, liveserver) {
    var MESSAGE_TITLE = 'Schedule Report Page for guest service';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
    
   
    $scope.iframe_style1 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 460) + 'px;';
    $scope.iframe_style2 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 100) + 'px;';
    $scope.iframe_style =  $scope.iframe_style1;
    $scope.onGetFrameHeight = function() {
        if(!$scope.isHidden)  $scope.iframe_style =  $scope.iframe_style1;
        else  $scope.iframe_style =  $scope.iframe_style2;
    }

    $scope.tableState = undefined;
    $scope.param = '';

    $scope.yearview = false;
    $scope.monthview = false;
    $scope.dateview = true;
    $scope.status_flag = false;
    $scope.escalated_flag = false;
    $scope.chart_graph_flag = false;

    $scope.reporttypes = [
        'Detailed',
        'Summary',
    ];
    $scope.report_type = $scope.reporttypes[0];

    $scope.reportby_list = [
        'Date',
        'Status',
        'Department',
        'Ticket Type',
        //'Staff',
        'Item',
        //'Department Function',
        'Location',
        'Staff',
        //'Shift',
        //'Room',
    ];
    $scope.report_by = $scope.reportby_list[0];

    $scope.status_tags = [
        {id: 0, label: 'Completed'},
        {id: 1, label: 'Open'},
        {id: 2, label: 'Escalated'},
        {id: 3, label: 'Timeout'},
        {id: 4, label: 'Canceled'},
        {id: 5, label: 'Scheduled'},
    ];
    $scope.status_tags_hint = {buttonDefaultText: 'Select Status'};
    $scope.status_tags_hint_setting = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };
    $scope.status = [];

    $scope.ticket_type_tags = [
        {id: 1, label : 'Guest Request'},
        {id: 2, label : 'Department Request'},
        //{id: 3, label : 'Complaints'},
        {id: 4, label : 'Managed Task'},
    ];
    $scope.ticket_type_tags_hint = {buttonDefaultText: 'Select Ticket type'};
    $scope.ticket_type_tags_hint_setting = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };
    // $scope.tickettypes = [
    //     {id: 1, 'name' : 'Guest Request'},
    //     {id: 2, 'name' : 'Department Request'},
    //     {id: 3, 'name' : 'Complaints'},
    //     {id: 4, 'name' : 'Managed Task'},
    // ];
    $scope.ticket_type = [];

    // pip
    $scope.isLoading = false;
    $scope.ticketlist = [];

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 20,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.filter = {};

    $scope.report_tags = [];
    $scope.valid_flag = [true, true, true, true, true, true, false];
    $scope.onChangeReportBy = function () {

        if($scope.report_by == 'Staff') {
            $scope.valid_flag = [false, false, true, false, false, false,true];
        }else {
            $scope.valid_flag = [true, true, true, true, true, true,false];
        }
        $scope.report_tags = [];
    }

    // TODO
    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;

    var promiss = $http.get('/frontend/callaccount/guestext?property_id=' + property_id)
        .then(function(response) {

        }).catch(function(response) {

        })
        .finally(function() {

        });
    $scope.department_tags = [];
    $scope.loadFiltersValue = function(query, value) {
	    if($scope.escalated_flag == true)
	    {
		    $scope.status_flag = true;
	    }
	    else
	       $scope.status_flag = false;

        var filter = {};

        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.filter_name = value;
        filter.filter = query;

        if(value == 'Department Function') {
            filter.filter_department = generateFilters($scope.department_tags);
        }
        var param = $httpParamSerializer(filter);

        if(value == 'Department')
            $scope.getStaffList();

        return $http.get('/frontend/report/filterlist?' + param);

    };

    $scope.stafflist = [];
    $scope.getStaffList = function() {
        $scope.stafflist= [];
        var deptartmetns = generateFilters($scope.department_tags);
        $http.get('/frontend/guestservice/getstafflistfromdepat?property_id=' + profile.property_id+'&depts='+deptartmetns)
            .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    var user = {};
                    user.id = response.data[i].id;
                    user.label = response.data[i].wholename;
                    $scope.stafflist.push(user);
                }
            });
    }
    $scope.getStaffList();
    $scope.stafflist_hint = {buttonDefaultText: 'Select Staff'};
    $scope.stafflist_hint_setting = {
        smartButtonMaxItems: 3,
        scrollable: true,
        scrollableHeight: '250px',
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    $scope.staff_ids = [];



    // $scope.onDepartmentSelect = function ($item, $model, $label) {
    //     $scope.department = $model;
    // };

    $scope.getLocationList = function($query) {
        var profile = AuthService.GetCredentials();
        var client_id =  profile.client_id
        return $http.get('/list/locationtotallist?location=' +$query + '&client_id=' + client_id)
            .then(function(response){
                // console.log(JSON.stringify(response));
                var locations = response.data;
                var list = [];
                for(var i=0; i <  locations.length; i++) {
                    var check_val = false;
                    for(var j = 0, len = list.length; j < len; j++) {
                        if( list[ j ].key === locations[i].name +"_"+ locations[i].type) {
                            check_val = true;
                            continue;
                        }
                    }
                    if(check_val == false) {
                        list.push({'id':locations[i].id ,
                            'name': locations[i].name,
                            'type': locations[i].type,
                            'lg_id' : locations[i].lg_id,
                            'location_grp' : locations[i].location_grp,
                            'type_id' : locations[i].type_id,
                            'key':locations[i].name +"_"+ locations[i].type});
                    }
                }
                return locations = list;
            });
    };
    // $scope.loadFilters = function(query) {
    //     var filter = {};
    //
    //     var profile = AuthService.GetCredentials();
    //     filter.property_id = profile.property_id;
    //     filter.filter_name = $scope.report_by;
    //     filter.filter = query;
    //
    //     var param = $httpParamSerializer(filter);
    //
    //     return $http.get('/frontend/report/filterlist?' + param);
    // };

    function generateFilter() {
        var profile = AuthService.GetCredentials();

        $scope.filter.creator_id = profile.id;
        $scope.filter.timestamp = new Date().getTime();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.report_type = $scope.report_type;
        var statuslist = [];
        if($scope.status_flag == true)
        {
	        $scope.status = [{id: 2, label: 'Escalated'}];
	        
        }
        
        for(var i = 0; i < $scope.status.length; i++)
            statuslist.push($scope.status_tags[$scope.status[i].id].id);
        $scope.filter.status_tags = JSON.stringify(statuslist);

        var ticket_typelist = [];
        for(var i = 0; i < $scope.ticket_type.length; i++)
            ticket_typelist.push($scope.ticket_type[i].id);
        $scope.filter.ticket_type_tags = JSON.stringify(ticket_typelist);

        $scope.filter.report_by = $scope.report_by;

        if($scope.report_year_month_by == 'Year End') {
            $scope.start_time = $scope.datetime.time+"-01-01 00:00:00";
            $scope.end_time = $scope.datetime.time+"-12-31 23:59:59";
        }
        if($scope.report_year_month_by == 'Month End') {
            $scope.start_time = $scope.datetime.time+"-01 00:00:00";
            var date = new Date($scope.datetime.time), y = date.getFullYear(), m = date.getMonth();
            var lastDay = new Date(y, m + 1, 0);
            $scope.end_time =lastDay.getFullYear()+"-"+(lastDay.getMonth() + 1)+"-"+lastDay.getDate()+" "+"23:59:59";
        }
        $scope.filter.start_time = $scope.start_time;
        $scope.filter.end_time = $scope.end_time;
        $scope.filter.id = $scope.profile.id;
        //window.alert($scope.profile.id);


        $scope.filter.location_tags = JSON.stringify($scope.location_tags);
        $scope.filter.item_tags = generateFilters($scope.item_tags);
        $scope.filter.department_tags = generateFilters($scope.department_tags);
        $scope.filter.department_function_tags = generateFilters($scope.department_function_tags);
        $scope.filter.escalated_flag = $scope.escalated_flag;

        var stafflist = [];
        for(var i = 0; i < $scope.staff_ids.length; i++)
            stafflist.push($scope.staff_ids[i].id);
        $scope.filter.staff_tags = JSON.stringify(stafflist);
        $scope.filter.chart_graph_flag = $scope.chart_graph_flag;

        return $scope.filter;
    }

    function generateFilters(tags) {
        var report_tags = [];
        if( tags )
        {
            for(var i = 0; i < tags.length; i++)
                report_tags.push(tags[i].text);
        }

        return JSON.stringify(report_tags);
    }

    $scope.onGenerateReport = function() {
        var filter = generateFilter();
        console.log($httpParamSerializer(filter));
        $scope.param = '/frontend/report/guestservice_generatereport?' + $httpParamSerializer(filter);

        // $scope.generateDownloadChecker(filter);
    }

    $scope.onDownloadPDF = function() {
        var filter = generateFilter();
        filter.report_target = 'guestservice';
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }
    $scope.onDownloadExcel = function() {
        var filter = generateFilter();
        $window.location.href = '/frontend/report/guestservice_excelreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }
    // $scope.onGenerateReport = function() {
    //     $scope.filter.report_type = $scope.report_type;
    //     $scope.filter.ticket_type = JSON.stringify($scope.ticket_type);
    //     $scope.filter.report_by = $scope.report_by;
    //     $scope.filter.start_time = $scope.start_time;
    //     $scope.filter.end_time = $scope.end_time;
    //
    //     var report_tags = [];
    //     switch($scope.report_by)
    //     {
    //         case 'Status':
    //             var status_ids = {
    //                 Completed: 0,
    //                 Open: 1,
    //                 Escalated: 2,
    //                 Timeout: 3,
    //                 Canceled: 4,
    //                 Scheduled: 5,
    //             };
    //
    //             for(var i = 0; i < $scope.report_tags.length; i++)
    //                 report_tags.push(status_ids[$scope.report_tags[i].text]);
    //             break;
    //         default:
    //             for(var i = 0; i < $scope.report_tags.length; i++)
    //                 report_tags.push($scope.report_tags[i].text);
    //             break;
    //     }
    //
    //     $scope.filter.report_tags = JSON.stringify(report_tags);
    //
    //     $scope.param = '/frontend/report/guestservice_generatereport?' + $httpParamSerializer($scope.filter);
    // }

    var hour = moment().format("H");
    var minute = moment().format("m");
    var total_minute = parseInt(hour) * 60 + parseInt(minute);

    $scope.myDatetimeRange =
    {
        date: {
            from: new Date(), // start date ( Date object )
            to: new Date() // end date ( Date object )
        },
        time: {
            from: 0, // default start time (in minutes)
            to: total_minute, // default end time (in minutes)
            step: 15, // step width
            minRange: 15, // min range
            hours24: false // true = 00:00:00 | false = 00:00 am/pm
        },
        "hasDatePickers": true,
        "hasTimeSliders": true
    }
    $scope.myDatetimeLabels =
    {
        date: {
            from: 'Start date',
            to: 'End date'
        }
    }

    $scope.time_range = '';

    $scope.$watch('myDatetimeRange.date.from', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
    });
    $scope.$watch('myDatetimeRange.date.to', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
    });
    $scope.$watch('myDatetimeRange.time.from', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
    });
    $scope.$watch('myDatetimeRange.time.to', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;

        $scope.getTimeRange();
    });

    $scope.getTimeRange = function() {
        var start_time = moment($scope.myDatetimeRange.date.from)
            .set({
                'hour' : 0,
                'minute'  : 0,
                'second' : 0
            })
            .add('minute', $scope.myDatetimeRange.time.from)
            .format('YYYY-MM-DD HH:mm:ss');

        var end_time = moment($scope.myDatetimeRange.date.to)
            .set({
                'hour' : 0,
                'minute'  : 0,
                'second' : 0
            })
            .add('minute', $scope.myDatetimeRange.time.to)
            .format('YYYY-MM-DD HH:mm:ss');

        $scope.start_time = start_time;
        $scope.end_time = end_time;
        $scope.time_range = start_time + ' - ' + end_time;
    }

    $scope.getTimeRange();

    $scope.yearview = false;
    $scope.monthview = false;
    $scope.dateview = true;
    $scope.$watch('datetime.date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.datetime.time = moment(newValue).format('YYYY-MM');
    });

    $scope.$watch('datetime.year', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.datetime.time = moment(newValue).format('YYYY');
    });


    $scope.periodView = function(val){
        if($scope.datetime != null) $scope.datetime = "";
        if(val == 'Year End'){
            $scope.yearview = true;
            $scope.monthview = false;
            $scope.dateview = false;
        }
        if(val == 'Month End'){
            $scope.yearview = false;
            $scope.monthview = true;
            $scope.dateview = false;
        }
        if(val == 'None') {
            $scope.yearview = false;
            $scope.monthview = false;
            $scope.dateview = true;
        }
    }

    $scope.onShowSchedule = function() {
        var size = 'lg';
        var filter = generateFilter();
        var modalInstance = $uibModal.open({
            templateUrl: 'scheduleReportModal.html',
            controller: 'ScheduleReportController',
            size: size,
            resolve: {
                filter: function () {
                    return filter;
                }
            }
        });

        modalInstance.result.then(function (schedule) {
            if(schedule == undefined)
                return;
            var data = angular.copy(schedule);
            data.report_type = 'guestservice';
            var profile = AuthService.GetCredentials();
            data.property_id = profile.property_id;
            data.submitter = profile.id;
            $http({
                method: 'POST',
                url: '/frontend/report/createschedulereport',
                data: data,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function(response) {
                    console.log(response.data);
                    toaster.pop('success', MESSAGE_TITLE, 'Schedule report has been added successfully');
                }).catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to add Schedule report');
                })
                .finally(function() {
                });

        }, function () {

        });
    }


});

app.directive('ngMultiselectDisabled', function() {
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {
      var $btn;
      $btn = $element.find('button');
      return $scope.$watch($attrs.ngMultiselectDisabled, function(newVal) {
        return $btn.attr('disabled', newVal);
      });
    }
  };
});
