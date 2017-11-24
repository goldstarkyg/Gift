'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', 'AuthService',
      function ($rootScope,   $state,   $stateParams, AuthService) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          var layout = "tpl/app.html";
          if(window.location.href.indexOf("material") > 0){
            layout = "tpl/blocks/material.layout.html";
            $urlRouterProvider
              .otherwise('/app/dashboard-v3');
          }else{
            $urlRouterProvider
              .otherwise('/app/dashboard');
          }
          
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: layout
              })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'tpl/app_dashboard.html',
                  resolve: load(['js/controllers/chart.js'])
              })
              .state('app.signin', {
                 url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: load( ['js/controllers/signin.js'] )
              })
              .state('app.signup', {
                 url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: load( ['js/controllers/signup.js'] )
              })
              .state('app.inquiry', {
                 url: '/inquiry',
                  templateUrl: 'tpl/page_list.html',
                  resolve: load( ['js/controllers/inquiry.js'] )
              })
              .state('app.terms', {
                 url: '/terms',
                  templateUrl: 'tpl/page_terms.html',
                  resolve: load( ['js/controllers/terms.js'] )
              })
              .state('app.privacy', {
                 url: '/pricacy',
                  templateUrl: 'tpl/page_privacy.html',
                  resolve: load( ['js/controllers/privacy.js'] )
              })  


              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              });
              
          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );
