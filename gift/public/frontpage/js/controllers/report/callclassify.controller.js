app.controller('CallclassifyReportController', function($scope, $rootScope, $http, $httpParamSerializer, $window, $timeout, $uibModal, AuthService, toaster, liveserver) {
    var MESSAGE_TITLE = 'Schedule Report Page';

    $scope.$on('$destroy', function() {
        if (angular.isDefined($scope.checkdownload)) {
            $interval.cancel($scope.checkdownload);
            $scope.checkdownload = undefined;
        }
    });

    var profile = AuthService.GetCredentials();

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
   
    $scope.iframe_style1 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 450) + 'px;';
    $scope.iframe_style2 = 'margin:0px;padding:0px;overflow:hidden;height: ' + ($window.innerHeight - 100) + 'px;';
    $scope.iframe_style =  $scope.iframe_style1;
    $scope.onGetFrameHeight = function() {
        if(!$scope.isHidden)  $scope.iframe_style =  $scope.iframe_style1;
        else  $scope.iframe_style =  $scope.iframe_style2;
    }

    $scope.tableState = undefined;
    $scope.param = '';

    $scope.calltypes = [
        {id: 0, label: 'Local'},
        {id: 1, label: 'Mobile'},
        {id: 2, label: 'National'},
        {id: 3, label: 'International'},
    ];
    $scope.calltypes_hint = {buttonDefaultText: 'Select Call Type'};
    $scope.calltypes_hint_setting = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    $scope.call_type = [];

    $scope.approvals = [
        'All',
        'Waiting For Approval',
        'Pre-Approved',
        'Approved',
        'Rejected',
        'Returned',
        'Closed',
    ];
    $scope.approval = $scope.approvals[0];;

    $scope.reporttypes = [
        'Detailed',
        'Summary',
    ];
    $scope.report_type = $scope.reporttypes[0];

    $scope.reportby_list = [
        'Call Date',
        'Department',
        'Destination',
        'Extension',
        'User',
    ];

    $scope.report_by = $scope.reportby_list[0];

    $scope.classifys = [
        'All',
        'Business',
        'Personal',
        'Unclassified',
    ];

    $scope.classify = $scope.classifys[0];

    $scope.stafflist = [];
    $http.get('/frontend/call/stafflist?property_id=' + profile.property_id)
        .then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
                var user = {};
                user.id = response.data[i].id;
                user.label = response.data[i].wholename;
                $scope.stafflist.push(user);
            }
        });

    $scope.stafflist_hint = {buttonDefaultText: 'Select User'};
    $scope.stafflist_hint_setting = {
        smartButtonMaxItems: 3,
        scrollable: true,
        scrollableHeight: '250px',
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    $scope.staff_ids = [];


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
    $scope.valid_flag = [true];
    $scope.onChangeReportBy = function () {
        switch($scope.report_by) {
            case 'Call Date':
                $scope.valid_flag = [false];
                break;
            case 'Department':
                $scope.valid_flag = [true];
                break;
            case 'Extension':
                $scope.valid_flag = [false];
                break;
            case 'Destination':
                $scope.valid_flag = [false];
                break;
            case 'User':
                $scope.valid_flag = [false];
                break;
        }
    }

    $scope.onChangeReportBy();

    var property_id = profile.property_id;
    $scope.loadFilters = function(query, filter_name) {
        var filter = {};

        filter.property_id = profile.property_id;
        filter.filter_name = filter_name;
        filter.filter = query;

        var param = $httpParamSerializer(filter);

        return $http.get('/frontend/report/filterlist?' + param);
    };
    $scope.onChangeRoom = function() {
        console.log($scope.room_tags);
    }

    $scope.approval_view = false;
    $scope.changeClassify = function () {
        if($scope.classify == 'Unclassified') $scope.approval_view = true;
        else $scope.approval_view = false;
    }

    function generateFilter() {
        $scope.filter.creator_id = profile.id;
        $scope.filter.timestamp = new Date().getTime();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.report_type = $scope.report_type;
        var calltypelist = [];
        for(var i = 0; i < $scope.call_type.length; i++)
            calltypelist.push($scope.calltypes[$scope.call_type[i].id].label);
        $scope.filter.call_type = JSON.stringify(calltypelist);
        $scope.filter.classify = $scope.classify;

        var approvals =[];
        if($scope.approval != 'All')  approvals.push($scope.approval);
        // if($scope.approval == "Awaiting")
        //     approvals.push('Waiting For Approval');
        // if($scope.approval == "Closed")
        //     approvals.push('Closed');
        // if($scope.approval == "Approved")
        //     approvals.push('Approved');
        // if($scope.approval == "Unapproved") {
        //     approvals.push('Waiting For Approval');
        //     approvals.push('Rejected');
        //     approvals.push('Returned');
        // }
        // if($scope.approval == "Pre-Approved")
        //     approvals.push('Pre-Approved');

        if($scope.classify == 'Unclassified') approvals = [];

        $scope.filter.approval = JSON.stringify(approvals);

        // if($scope.approval == "Unmarked")
        //     $scope.filter.classify = 'Unclassified';

        var stafflist = [];
        for(var i = 0; i < $scope.staff_ids.length; i++)
            stafflist.push($scope.staff_ids[i].id);
        $scope.filter.user_id = JSON.stringify(stafflist);
        $scope.filter.report_by = $scope.report_by;
        $scope.filter.start_time = $scope.start_time;
        $scope.filter.end_time = $scope.end_time;

        if( $scope.valid_flag[0] )
            $scope.filter.section_tags = generateFilters($scope.section_tags);
        else
            $scope.filter.section_tags = [];
        return $scope.filter;
    }

    $scope.onGenerateReport = function() {
        var filter = generateFilter();
        console.log($httpParamSerializer(filter));
        $scope.param = '/frontend/report/callclassify_generatereport?' + $httpParamSerializer(filter);
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
            data.report_type = 'callclassify';
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
        filter.report_target = 'callclassify';
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }

    $scope.onDownloadExcel = function() {
        var filter = generateFilter();

        $window.location.href = '/frontend/report/callcalssify_excelreport?' + $httpParamSerializer(filter);

        $scope.generateDownloadChecker(filter);
    }


    $scope.myDatetimeRange =
    {
        date: {
            from: new Date(), // start date ( Date object )
            to: new Date() // end date ( Date object )
        },
        time: {
            from: 0, // default start time (in minutes)
            to: new Date(), // default end time (in minutes)
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
