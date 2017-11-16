app.controller('LiveCallDataController', function ($scope, $window) {
    $scope.tab_full_height = 'height: ' + ($window.innerHeight - 145) + 'px; overflow-y: auto';
    $scope.table_container_height = 'height: ' + ($window.innerHeight - 140) + 'px; overflow-y: auto';

});

