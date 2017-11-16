app.controller('MinibarReportController', function($scope, $http, $httpParamSerializer, $window, $timeout, $uibModal, AuthService, toaster, liveserver) {
    var MESSAGE_TITLE = 'Shift Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';


    $scope.iframe_style1 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 390) + 'px;';
    $scope.iframe_style2 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 150) + 'px;';
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
        //'Guest ID',
        'Room',
        'Posted by',
        'Service Item',
    ];
    $scope.report_by = $scope.reportby_list[0];

    // pip
    $scope.isLoading = false;
    $scope.ticketlist = [];

    $scope.filter = {};

    $scope.report_tags = [];
    $scope.room_tags = [];
    $scope.staff_tags = [];
    $scope.item_tags = [];

    $scope.onChangeReportBy = function () {
        $scope.report_tags = [];
    }

    $scope.loadFilters = function(query , option) {
        var filter = {};

        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.filter_name = option;
        filter.filter = query;

        var param = $httpParamSerializer(filter);

        return $http.get('/frontend/report/filterlist?' + param);
    };

    $scope.onGenerateReport = function() {
        var filter = generateFilter();
        console.log($httpParamSerializer(filter));

        $scope.param = '/frontend/report/minibar_generatereport?' + $httpParamSerializer(filter);
    }

    $scope.onDownloadPDF = function() {
        var filter = generateFilter();
        filter.report_target = 'minibar';
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }

    $scope.onDownloadExcel = function() {
        var filter = generateFilter();
        $window.location.href = '/frontend/report/minibar_excelreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
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

    function generateFilter() {

        var profile = AuthService.GetCredentials();

        $scope.filter.creator_id = profile.id;
        $scope.filter.timestamp = new Date().getTime();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.report_type = $scope.report_type;
        $scope.filter.report_by = $scope.report_by;
        $scope.filter.start_time = $scope.start_time;
        $scope.filter.end_time = $scope.end_time;

        var room_tags = [];
        for(var i = 0; i < $scope.room_tags.length; i++)
            room_tags.push($scope.room_tags[i].text);

        $scope.filter.room_tags = JSON.stringify(room_tags);

        var staff_tags = [];
        for(var i = 0; i < $scope.staff_tags.length; i++)
            staff_tags.push($scope.staff_tags[i].text);

        $scope.filter.staff_tags = JSON.stringify(staff_tags);

        var item_tags = [];
        for(var i = 0; i < $scope.item_tags.length; i++)
            item_tags.push($scope.item_tags[i].text);

        $scope.filter.item_tags = JSON.stringify(item_tags);


        return $scope.filter;
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
            data.report_type = 'minibar';
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

