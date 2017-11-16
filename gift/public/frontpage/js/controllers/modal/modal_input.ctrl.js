'use strict';

/* Controllers */
app.controller('ModalInputCtrl', function($scope, $rootScope, $uibModalInstance, title) {
    $scope.data = {};

    $scope.title = title;
    $scope.data.comment = '';

    $scope.save = function () {
        $uibModalInstance.close($scope.data.comment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});