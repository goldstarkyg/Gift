app.controller('ScheduleReportController', function ($scope,  $uibModalInstance, toaster, filter) {
    $scope.schedule = {};
    $scope.schedule.filter = filter;
    $scope.schedule.name = '';
    $scope.schedule.frequency='Daily';
    $scope.schedule.recipient = '';
    $scope.schedule.date = new Date();
    $scope.schedule.time =  new Date(2016, 11, 17, 0, 0);
    $scope.days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    $scope.schedule.sel_day = $scope.days[0];

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.open = function($event) {
        $scope.schedule.opened = true;
    };

    $scope.onSaveSchedule = function() {
        console.log($scope.schedule);
        $scope.schedule.date = moment($scope.schedule.date).format("YYYY-MM-DD");
        $scope.schedule.day = $scope.schedule.sel_day;
        if($scope.schedule.repeat == true) $scope.schedule.repeat_flag = 1;
        if($scope.schedule.repeat == false) $scope.schedule.repeat_flag = 0;
        $scope.schedule.time = moment($scope.schedule.time).format('HH:mm:ss');
        $uibModalInstance.close($scope.schedule);
    }

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.canselModalReport = function() {
        $uibModalInstance.close();
    }
});
