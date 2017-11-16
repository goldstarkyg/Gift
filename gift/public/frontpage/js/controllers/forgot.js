'use strict';

/* Controllers */
// signin controller
app.controller('ForgotFormController', function($scope, $rootScope, $http, $state, $location, AuthService) {
    var MESSAGE_TITLE = 'Forgot Password';
    $scope.user = {};
    $scope.authError = '';
    $scope.user.id = 0;

    $scope.gotoSignPage = function () {
        $location.path('access.signin');
    }
    $scope.sendMessage = function () {

      if($scope.user.email == null) {
          $scope.authError = 'Please enter email.';
          return;
      }
        $http.post('/auth/forgotsendpassword', {email: $scope.user.email})
            .then(function (response) {
               if(response.data == '401') {
                   $scope.authError = 'Please contact the system administrator to Reset your password.';
               }else if(response.data == '200') {
                   $scope.authError = 'Please check your email to use new password.';
               }

            }).catch(function (response) {

            })
            .finally(function () {

            });
    }
})
;