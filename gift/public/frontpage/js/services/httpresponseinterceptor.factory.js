'use strict';
app.factory('myHttpInterceptor', function ($q, $location, $rootScope, $localStorage, $sessionStorage) {
    var $storage = $sessionStorage;
    return {
        response: function (response) {
            //// do something on success
            //if(response.headers()['content-type'] === "application/json"){
            //    // Validate response, if not ok reject
            //    return $q.reject(response);
            //}
            return response;
        },
        responseError: function (response) {
            // do something on error
            if( response.status == 401 ) {
                event.preventDefault();
                // clear login info
                $rootScope.globals = {};
                delete $storage.globals;

                console.log(response.data);

                $location.path('/access/signin');
                setTimeout(function() {
                    alert(response.data);
                }, 1000);
                
            }
            return $q.reject(response);            
        }
    };
});
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});