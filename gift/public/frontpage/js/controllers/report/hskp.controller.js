app.controller('HskpReportController', function($scope, $http, $httpParamSerializer, $window, $timeout, AuthService, toaster) {
    var MESSAGE_TITLE = 'Shift Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
   
    $scope.iframe_style1 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 390) + 'px;';
    $scope.iframe_style2 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 100) + 'px;';
    $scope.iframe_style =  $scope.iframe_style1;
    $scope.onGetFrameHeight = function() {
        if(!$scope.isHidden)  $scope.iframe_style =  $scope.iframe_style1;
        else  $scope.iframe_style =  $scope.iframe_style2;
    }

    $scope.tableState = undefined;
    $scope.param = '';

    $scope.reporttypes = [
        'Detailed',
        'Summary',
    ];
    $scope.report_type = $scope.reporttypes[0];

    $scope.reportby_list = [
        'Date',
        'Room',
        'Housekeeping Status',
        'Posted by',
    ];
    $scope.report_by = $scope.reportby_list[0];

    // pip
    $scope.isLoading = false;
    $scope.ticketlist = [];

    $scope.filter = {};

    $scope.report_tags = [];
    $scope.onChangeReportBy = function () {
        $scope.report_tags = [];
    }

    $scope.loadFilters = function(query) {
        var filter = {};

        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.filter_name = $scope.report_by;
        filter.filter = query;

        var param = $httpParamSerializer(filter);

        return $http.get('/frontend/report/filterlist?' + param);
    };

    $scope.onGenerateReport = function() {
        $scope.filter.report_type = $scope.report_type;
        $scope.filter.report_by = $scope.report_by;
        $scope.filter.start_time = $scope.start_time;
        $scope.filter.end_time = $scope.end_time;

        var report_tags = [];
        for(var i = 0; i < $scope.report_tags.length; i++)
            report_tags.push($scope.report_tags[i].text);

        $scope.filter.report_tags = JSON.stringify(report_tags);

        $scope.param = '/frontend/report/hskp_generatereport?' + $httpParamSerializer($scope.filter);
    }

    $scope.myDatetimeRange =
    {
        date: {
            from: new Date('2016-06-01'), // start date ( Date object )
                to: new Date() // end date ( Date object )
        },
        time: {
            from: 480, // default start time (in minutes)
                to: 1020, // default end time (in minutes)
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

        // $scope.start_time = start_time;
        // $scope.end_time = end_time;
        // $scope.time_range = start_time + ' - ' + end_time;
        var time_range = $scope.time_range;
        time_range= time_range.substr(21, time_range.length);
        var hms = time_range.substr(12,time_range.length);
        var d = new Date(time_range);
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var end_time1 = moment($scope.myDatetimeRange.date.to)
            .set({
                'hour' : 0,
                'minute'  : 0,
                'second' : 0
            })
            .add('hour', h)
            .add('minute', m)
            .add('second', s)
            .format('YYYY-MM-DD HH:mm:ss');
        $scope.start_time = start_time;
        //$scope.end_time = end_time;
        if(hms == "00:00:00" || hms == "") {
            $scope.end_time = end_time;
            $scope.time_range = start_time + ' - ' + end_time;
        }else{
            $scope.end_time = end_time1;
            $scope.time_range = start_time + ' - ' + end_time1;
        }
    }

    $scope.getTimeRange();

});

