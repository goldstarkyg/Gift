app.controller('CallcenterReportController', function($scope, $rootScope, $http, $httpParamSerializer, $window, $timeout, $interval, $uibModal, AuthService, toaster, liveserver, $cookies,$cookieStore) {
    var MESSAGE_TITLE = 'Schedule Report Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';

    $scope.iframe_style1 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 400) + 'px;';
    $scope.iframe_style2 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 100) + 'px;';
    $scope.iframe_style =  $scope.iframe_style1;
    $scope.onGetFrameHeight = function() {
        if(!$scope.isHidden)  $scope.iframe_style =  $scope.iframe_style1;
        else  $scope.iframe_style =  $scope.iframe_style2;
    }

    $scope.tableState = undefined;
    $scope.param = '';
    $scope.chart_graph_flag = false;

    $scope.agentlist = [
        {id: 0, label: 'Internal'},
        {id: 1, label: 'Received'},
        {id: 2, label: 'Local'},
        {id: 3, label: 'Mobile'},
        {id: 4, label: 'National'},
        {id: 5, label: 'International'},
    ];
    $scope.agentlist_hint = {buttonDefaultText: 'Select Agents'};
    $scope.agentlist_hint_setting = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    $scope.agent_ids = [];


    $scope.call_types = [
        {id: 0, label: 'Booking'},
        {id: 1, label: 'Inquiry'},
        {id: 2, label: 'Other'},
    ];
    $scope.call_type_ids = [];
    $scope.call_type_hint = {buttonDefaultText: 'Select Call Types'};
    $scope.call_type_hint_setting = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    $scope.follow_ups = [
        'All',
        'Yes',
        'No',
    ];
    $scope.follow_up = $scope.follow_ups[0];

    $scope.call_durations = [
        '=',
        '>',
        '>=',
        '<',
        '<=',
    ]
    $scope.call_duration = $scope.call_durations[0];

    $scope.time_in_queues = [
        '=',
        '>',
        '>=',
        '<',
        '<=',
    ]
    $scope.time_in_queue = $scope.time_in_queues[0];

    $scope.statuses = [
        'All',
        'Answered',
        'Abandoned',
        'Missed',
        'Call Back',
    ];
    $scope.status = $scope.statuses[0];


    $scope.reporttypes = [
        'Detailed',
        'Summary',
    ];
    $scope.report_type = $scope.reporttypes[0];

    $scope.reportby_list = [
        //'Abandoned Summary',
        // 'Abandoned Detail',
        // 'Agent Call Detailed',
        // 'Agent Activity',
        // 'Call Type Summary by Agent',
        // 'Agent Activity Summary',
        // 'Call Trafic Time Analysis',
        'Agent',
        'Call Status',
        'Date',
        'Origin',
        'Per Hour',
        'Call Type',
        'Agent Status'
    ];
    $scope.report_by = $scope.reportby_list[0];

    var profile = AuthService.GetCredentials();

    $http.get('/frontend/call/agentlist?property_id=' + profile.property_id)
        .then(function(response) {
            $scope.agentlist = response.data;
        });


    $scope.filter = {};

    $scope.report_tags = [];
    $scope.valid_flag = [true, true, true, true, true, true];
    $scope.onChangeReportBy = function () {
        switch($scope.report_by) {
            case 'Property':
                $scope.valid_flag = [true, false, false, false, false, false];
                break;
            case 'Call Date':
                $scope.valid_flag = [true, true, true, true, true, true];
                break;
            case 'Room':
                $scope.valid_flag = [true, false, true, false, true, true];
                break;
            case 'Department':
                $scope.valid_flag = [true, true, false, true, true, true];
                break;
            case 'Extension':
                $scope.valid_flag = [true, true, false, true, true, true];
                break;
            case 'Destination':
                $scope.valid_flag = [true, true, true, true, true, true];
                break;
        }
    }

    $scope.onChangeReportBy();

    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;

    $scope.loadFilters = function(query, filter_name) {
        var filter = {};

        var profile = AuthService.GetCredentials();

        filter.property_id = profile.property_id;
        filter.filter_name = filter_name;
        filter.filter = query;

        var param = $httpParamSerializer(filter);

        return $http.get('/frontend/report/filterlist?' + param);
    };

    $scope.onChangeRoom = function() {
        console.log($scope.room_tags);
    }


    //$scope.call_time_start =  new Date(2016, 11, 17, 0, 0);
    $scope.call_time_start = new Date (new Date().toDateString() + ' ' + '00:00:00');
    $scope.call_time_end =  new Date(2016, 11, 17, 0, 0);

    function generateFilter() {
        var profile = AuthService.GetCredentials();

        $scope.filter.creator_id = profile.id;
        $scope.filter.timestamp = new Date().getTime();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.report_type = $scope.report_type;
        var agentlist = [];
        for(var i = 0; i < $scope.agent_ids.length; i++)
            agentlist.push($scope.agent_ids[i].id);
        $scope.filter.agent_tags = JSON.stringify(agentlist);
        $scope.filter.report_by = $scope.report_by;
        $scope.filter.start_time = $scope.start_time;
        $scope.filter.end_time = $scope.end_time;
        $scope.filter.caller_id = $scope.caller_id;

        var origin_tags = [];
        if($scope.origin_tags != null) {
            for (var i = 0; i < $scope.origin_tags.length; i++)
                origin_tags.push($scope.origin_tags[i].text);
        }
        $scope.filter.origin_tags = JSON.stringify(origin_tags);

        var call_type_ids = [];
        for(var i=0;i<$scope.call_type_ids.length;i++)
            call_type_ids.push($scope.call_types[$scope.call_type_ids[i].id].label);
        $scope.filter.call_type_ids = JSON.stringify(call_type_ids);

        $scope.filter.follow_up = $scope.follow_up;
        $scope.filter.status = $scope.status;
        $scope.filter.call_time_start = moment($scope.call_time_start).format('HH:mm:ss');
        $scope.filter.call_time_end = moment($scope.call_time_end).format('HH:mm:ss');
        $scope.filter.call_duration = $scope.call_duration;
        $scope.filter.call_duration_time = $scope.call_duration_time;
        $scope.filter.time_in_queue = $scope.time_in_queue;
        $scope.filter.time_in_queue_time = $scope.time_in_queue_time;
        $scope.filter.chart_graph_flag = $scope.chart_graph_flag;
        
        return $scope.filter;
    }

    $scope.onGenerateReport = function() {
        var filter = generateFilter();
        $scope.param = '/frontend/report/callcenter_generatereport?' + $httpParamSerializer(filter);

        // $scope.generateDownloadChecker(filter);
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
           data.report_type = 'callcenter';
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
                    toaster.pop('success', MESSAGE_TITLE, 'Shedule report has been added successfully');
                }).catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to add Shedule report');
                })
                .finally(function() {
                });

        }, function () {
           
        });
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

    function getBase64FromImageUrl(url) {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            console.log(dataURL);
        };

        img.src = url;
    }

    $scope.onDownloadPDF = function() {
        var filter = generateFilter();
        filter.report_target = 'callcenter';
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }

    $scope.onDownloadExcel = function() {
        var filter = generateFilter();

        $window.location.href = '/frontend/report/callcenter_excelreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }

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

});

