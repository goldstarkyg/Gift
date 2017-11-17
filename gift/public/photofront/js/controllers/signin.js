'use strict';

  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','AuthService', function($scope, $http, $state, AuthService) {
    $scope.user = {};
    $scope.authError = null;

    //login
    $scope.login = function() {
        $scope.authError = null;
        var data = {};
        data.email = $scope.user.email;
        data.password = $scope.user.password;

        $http({
            method: 'POST',
            url: '/backend/sign',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                var home_page='app.signin';
                if (response.data.code == '200') {
                    AuthService.SetCredentials(response.data.user);
                    home_page = 'app.dashboard';
                    $state.go(home_page);
                } else {
                    $scope.authError = response.data.message;
                }
            }).catch(function(response) {
                $scope.authError = response.data.message;
            });
    };
    //

  }]);