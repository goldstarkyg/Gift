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

                //$rootScope.$on('$locationChangeStart', function (event, next, current) {
                //    // redirect to login page if not logged in
                //    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                //        $location.path('/login');
                //    }
                //});

                $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
                    if (toState.name.indexOf('access') < 0 && !AuthService.isAuthenticated()) {
                        event.preventDefault();
                        $state.go('access.signin');
                    }
                    else
                    {
                        if( toState.name.indexOf('access') < 0 ) {
                            $rootScope.profile = AuthService.GetCredentials();
                            if (AuthService.isValidModule(toState.name) == false) {
                                event.preventDefault();
                                $state.go('access.signin');
                            }
                        }
                    }
                });

            }
        ]
    )
    .config(
        [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
            function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {

                var layout = "tpl/blocks/app.layout.html";
                $urlRouterProvider
                    .otherwise('/access/signin');

                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: layout
                    })
                    //.state('app.mytask', {
                    //    url: '/mytask',
                    //    template: '<div ui-view></div>',
                    //})
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signin', {
                        url: '/signin',
                        templateUrl: 'tpl/page_signin.html',
                        resolve: load( [
                            'js/controllers/signin.js',
                        ] )
                    })
                    .state('access.signup', {
                        url: '/signup',
                        templateUrl: 'tpl/page_signup.html',
                        resolve: load( ['js/controllers/signup.js'] )
                    })
                    .state('access.forgotpwd', {
                        url: '/forgotpwd',
                        templateUrl: 'tpl/page_forgotpwd.html',
                        resolve: load( ['js/controllers/forgot.js'] )
                    })
                    .state('access.changepass', {
                        url: '/changepass',
                        templateUrl: 'tpl/page_changepass.html',
                        resolve: load( [
                            'js/controllers/profile/changepass.js',
                        ] )
                    })
                    .state('access.404', {
                        url: '/404',
                        templateUrl: 'tpl/page_404.html'
                    })
                    .state('access.guestanswer', {
                        url: '/guestanswer',
                        templateUrl: 'tpl/guestsurvey/guest_answer.html',
                        resolve: load( [
                            'toaster',
                            'js/controllers/guestsurvey/guest_answer.controller.js',
                        ] )
                    })
                    .state('access.complaint', {
                        url: '/complaint/:client_id',
                        templateUrl: 'tpl/complaint/complaint_post.html',
                        resolve: load( [
                            'toaster', 'ngFileUpload', 'ui.bootstrap.datetimepicker',
                            'js/services/guestservice.service.js',
                            'js/controllers/complaint/complaint_post.controller.js',
                        ] )
                    })
                    .state('access.it', {
                        url: '/it/:client_id',
                        templateUrl: 'tpl/it/it_post.html',
                        resolve: load( [
                            'toaster', 'ngFileUpload', 'ui.bootstrap.datetimepicker',
                            'js/services/guestservice.service.js',
                            'js/controllers/it/it_post.controller.js',
                        ] )
                    })
                    .state('access.engineering', {
                        url: '/engineering/:client_id',
                        templateUrl: 'tpl/engineering/engineering_post.html',
                        resolve: load( [
                            'toaster', 'ngFileUpload', 'ui.bootstrap.datetimepicker',
                            'js/services/guestservice.service.js',
                            'js/controllers/engineering/engineering_post.controller.js',
                        ] )
                    })
                    .state('app.mytask', {
                        url: '/mytask',
                        template: '<div ui-view></div>',                        
                    })
                    .state('app.mytask.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/mytask/dashboard.html',
                        resolve: load([
                            'toaster', 'smart-table','nvd3', 'ui.jq',                            
                            'js/controllers/mytask/dashboard.controller.js',
                            'js/services/imageutils.service.js',
                        ])
                    })
                    .state('app.mytask.guestservice', {
                        url: '/guestservice',
                        templateUrl: 'tpl/mytask/guest/guest.html',
                        resolve: load([
                            'js/controllers/mytask/guest/myguestservice.controller.js',
                            'js/controllers/guestservice/tickets/guestrequest_edit.controller.js',
                            'js/controllers/guestservice/tickets/departmentrequest_edit.controller.js',
                            'js/controllers/mytask/guest/mymanagedtask_edit.controller.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'toaster', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.contextMenu', 'cfp.hotkeys', 'ui.jq', 'ngAside', 
                             'moment'   ])
                    })
                    .state('app.mytask.complaint', {
                        url: '/complaint',
                        templateUrl: 'tpl/mytask/complaint/complaint.html',
                        resolve: load([
                            'js/controllers/mytask/complaint/mysubcomplaint.controller.js',
                            'js/controllers/complaint/subcomplaint_edit.controller.js',
                            'js/controllers/complaint/myapproval_edit.controller.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'toaster', 'ui.jq', 'ngAside', 'ngFileUpload', 'moment', 'angular-highlight', 'ngTagsInput'  ])
                    })
                    .state('app.mytask.it', {
                        url: '/it',
                        templateUrl: 'tpl/mytask/it/it.html',
                        resolve: load([
                            'js/controllers/mytask/it/myissue.controller.js',
                            'js/controllers/it/issue_edit.controller.js',
                            'js/controllers/it/issue_detail.controller.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'toaster', 'ui.jq', 'ngAside', 'ngFileUpload', 'moment', 'angular-highlight','rgkevin.datetimeRangePicker', 'ui.bootstrap.datetimepicker',
                            'js/services/date.service.js','ui.bootstrap.contextMenu', 'cfp.hotkeys', 'ui.chart', 'ui.jq', 'ngAside',
                                'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns'])
                    })
                    .state('app.guestservice', {
                        url: '/guestservice',
                        template: '<div ui-view></div>',
                        resolve: load(['js/controllers/guestservice/guestservice.controller.js'])
                    })
                    .state('app.guestservice.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/guestservice/dashboard.html',
                        resolve: load([
                            'smart-table', 'toaster', 'moment', 'ui.jq', 'nvd3',
                            'js/controllers/guestservice/dashboard.controller.js',
                            'js/services/imageutils.service.js',
                            '/libs/svgtoimage/canvas-toBlob.js',
                            '/libs/svgtoimage/FileSaver.min.js',
                            ])
                    })
                    .state('app.guestservice.ticket', {
                        url: '/ticket/:ticket_id',
                        templateUrl: 'tpl/guestservice/ticket.html',
                        //params:      ['ticket_id'],
                        resolve: load(['js/controllers/guestservice/guestservice.controller.js',
                            'js/controllers/guestservice/tickets/guestrequest_new.controller.js',
                            'js/controllers/guestservice/tickets/guestrequest_edit.controller.js',
                            'js/controllers/guestservice/tickets/departmentrequest_new.controller.js',
                            'js/controllers/guestservice/tickets/departmentrequest_edit.controller.js',
                            'js/controllers/complaint/complaint_duty_create.controller.js',
                            'js/controllers/complaint/complaint_duty_validate.controller.js',
                            'js/controllers/guestservice/tickets/managedtask_new.controller.js',
                            'js/controllers/guestservice/tickets/managedtask_edit.controller.js',
                            'js/controllers/guestservice/chat/chat_session.controller.js',
                            'js/services/date.service.js',
                            'js/services/guestservice.service.js',
                            'js/services/translate.service.js',
                            'smart-table', 'toaster', 'moment', 'ngAside', 'cfp.hotkeys', 'angular-duration-format', 'ngFileUpload',                            
                            'luegg.directives', 'ui.bootstrap.datetimepicker', 'angularResizable', 
                               ])
                    })
                    .state('app.guestservice.reservation', {
                        url: '/reservation',
                        templateUrl: 'tpl/guestservice/reservation.html',
                        resolve: load([
                            'js/controllers/guestservice/reservation.controller.js',
                            'js/controllers/guestservice/reservation/reservation_dashboard.controller.js',
                            'js/controllers/guestservice/reservation/reservation_new.controller.js',
                            'js/controllers/guestservice/reservation/reservation_edit.controller.js',
                            'js/services/guestservice.service.js',
                            'js/services/date.service.js',
                            'smart-table', 'toaster',
                            'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'moment'   ])
                    })
                    .state('app.guestservice.shift', {
                        url: '/shifts',
                        templateUrl: 'tpl/guestservice/shift.html',
                        resolve: load(['moment','fullcalendar','ui.calendar', 'toaster',
                            'js/controllers/guestservice/shift.controller.js',
                            'js/services/date.service.js',
                        ])
                    })
                    .state('app.guestservice.alarm', {
                        url: '/alarm',
                        templateUrl: 'tpl/guestservice/alarm.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table',
                            'js/controllers/guestservice/alarm.controller.js'
                        ])
                    })
                    .state('app.guestservice.guestinfo', {
                        url: '/guestinfo',
                        templateUrl: 'tpl/guestservice/guest_info.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table',
                            'js/controllers/guestservice/guestinfo.controller.js'
                        ])
                    })
                    .state('app.guestservice.guest_sms_template', {
                        url: '/guest_sms_template',
                        templateUrl: 'tpl/guestservice/guest_sms_template.html',
                        resolve: load([
                            'toaster', 
                            'js/controllers/guestservice/guest_sms_template.controller.js'
                        ])
                    })
                    .state('app.guestservice.wakeup', {
                        url: '/wakeup',
                        templateUrl: 'tpl/guestservice/wakeup.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table', 'ui.bootstrap.datetimepicker', 'moment',
                            'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns','ui.jq', 
                            'js/controllers/guestservice/wakeup.controller.js',
                            'js/controllers/guestservice/wakeup/wakeup_create.controller.js',
                            'js/controllers/guestservice/wakeup/wakeup_edit.controller.js',
                            'js/services/guestservice.service.js',
                        ])
                    })
                    .state('app.guestservice.chat', {
                        url: '/chat',
                        templateUrl: 'tpl/guestservice/chat/chatview.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table', 'luegg.directives', 'ui.jq',
                            'ui.bootstrap.datetimepicker', 'bootstrapLightbox', 'EXIF', 'ngFileUpload',
                            'js/services/guestservice.service.js',
                            'js/controllers/guestservice/chat/chatview.controller.js',
                            'js/controllers/guestservice/chat/guestchat.controller.js',
                            'js/controllers/guestservice/chat/agentchat.controller.js',
                            'js/controllers/guestservice/tickets/guestrequest_new.controller.js',                            
                            'js/services/translate.service.js',
                            'js/services/date.service.js',
                            'js/services/guestservice.service.js',
                        ])
                    })
                    .state('app.guestservice.promotion', {
                        url: '/promotion',
                        templateUrl: 'tpl/guestservice/promotion.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table', 'luegg.directives', 'ui.jq',
                            'ui.bootstrap.datetimepicker', 'bootstrapLightbox', 'EXIF', 'ngFileUpload','ngQuill','dndLists',
                            'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns',
                            'js/services/guestservice.service.js','js/services/text_html.service.js','js/services/text_html_esc.service.js',
                            'js/controllers/guestservice/promotion.controller.js',
                            'js/controllers/guestservice/promotion/promotion_create.controller.js',
                            'js/controllers/guestservice/promotion/promotion_edit.controller.js',
                        ])
                    })
                    .state('app.complaintmgnt', {
                        url: '/complaintmgnt',
                        template: '<div ui-view></div>',                        
                    })
                    .state('app.complaintmgnt.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/complaint/dashboard.html',
                        resolve: load([
                            'toaster', 'smart-table','nvd3', 'ui.jq',                            
                            'js/controllers/complaint/dashboard.controller.js',
                            'js/services/imageutils.service.js',
                        ])                      
                    })
                    .state('app.complaint', {
                        url: '/complaint',
                        template: '<div ui-view></div>',
                         resolve: load([
                           'angular-highlight',                           
                        ])
                    })
                    .state('app.complaint.complaint', {
                        url: '/complaint',
                        templateUrl: 'tpl/complaint/complaint_duty.html',
                        resolve: load([
                            'toaster', 'smart-table', 'ui.jq', 'ngFileUpload', 'ui.bootstrap.datetimepicker', 'ngTagsInput',
                            'ngAside', 'disableAll','angularjs-dropdown-multiselect',
                            'js/services/guestservice.service.js',
                            'js/controllers/complaint/complaint_duty.controller.js',
                            'js/controllers/complaint/complaint_duty_create.controller.js',
                            'js/controllers/complaint/complaint_duty_validate.controller.js'
                        ])
                    })
                    .state('app.complaint.briefing_mng', {
                        url: '/briefingmng',
                        templateUrl: 'tpl/complaint/complaint_brief_manager.html',
                        resolve: load([
                            'toaster', 'dndLists', 'ngAside', 'smart-table', 'ui.jq', 'ui.bootstrap.datetimepicker', 'duScroll',
                            'js/services/guestservice.service.js',
                            'js/controllers/complaint/complaint_brief_manager.controller.js',
                            'js/controllers/complaint/complaint_duty_validate.controller.js'
                        ])
                    })
                    .state('app.complaint.advance_briefing', {
                        url: '/advance_briefing',
                        templateUrl: 'tpl/complaint/complaint_advance_briefing.html',
                        resolve: load([
                            'toaster', 'smart-table', 'ui.jq', 'ngFileUpload', 'ui.bootstrap.datetimepicker', 'ngTagsInput',
                            'ngAside', 'disableAll', 'ui.utils.masks',
                            'js/controllers/complaint/complaint_advance_briefing.controller.js',                            
                        ])
                    })
                    .state('app.complaint.briefing_view', {
                        url: '/briefingview',
                        templateUrl: 'tpl/complaint/complaint_brief_view.html',
                        resolve: load([
                            'toaster', 'smart-table','nvd3', 'ui.jq',
                            'js/services/guestservice.service.js',
                            'js/controllers/complaint/complaint_briefing_view.controller.js'
                        ])
                    })
                    .state('app.marketing', {
                        url: '/marketing',
                        template: '<div ui-view></div>',
                         resolve: load([
                            
                        ])
                    })
                    .state('app.marketing.campaign', {
                        url: '/campaign',
                        templateUrl: 'tpl/marketing/campaign/campaign_manager.html',
                        resolve: load([
                            'toaster', 'smart-table', 'ui.jq', 'ngFileUpload', 'ui.bootstrap.datetimepicker', 'ngTagsInput',
                            'ngAside', 'ngQuill', 'ui.utils.masks',                          
                            'js/controllers/marketing/campaign/campaign_manager.controller.js',
                            'js/controllers/marketing/campaign/campaign_create.controller.js',
                            'js/controllers/marketing/campaign/campaign_edit.controller.js'
                        ])
                    })
                    .state('app.complaint.compensation_template', {
                        url: '/compensation_template',
                        templateUrl: 'tpl/complaint/compensation_template.html',
                        resolve: load([
                            'toaster', 'ngQuill',
                            'js/controllers/complaint/compensation_template.controller.js'
                        ])
                    })
                    .state('app.callaccounting', {
                        url: '/callaccounting',
                        template: '<div ui-view></div>',
                        resolve: load(['toaster', 'moment', 'smart-table'])
                    })
                    .state('app.callaccounting.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/callaccounting/callaccounting_dashboard.html',
                        resolve: load([
                            'js/controllers/callaccount/callaccounting_dashboard.controller.js',
                            'moment', 'ui.jq', 'ui.chart', 'nvd3',
                        ])
                    })
                    .state('app.callaccounting.livedata', {
                        url: '/livedata',
                        templateUrl: 'tpl/callaccounting/livedata.html',
                        resolve: load(['js/controllers/callaccount/livecall.controller.js',
                            'js/controllers/callaccount/guest_call.controller.js',
                            'js/controllers/callaccount/admin_call.controller.js',
							'js/controllers/callaccount/bc_call.controller.js',
                            'js/controllers/callaccount/manual_post.controller.js',
                        ])
                    })
                    .state('app.callaccounting.mycalls', {
                        url: '/mycalls',
                        templateUrl: 'tpl/callaccounting/classification.html',
                        resolve: load(['js/controllers/callaccount/mycall_classification.controller.js',
                            'js/services/date.service.js',
                            'smart-table', 'toaster', 'rgkevin.datetimeRangePicker', 'ui.jq',
                        ])
                    })
                    .state('app.callaccounting.myapproval', {
                        url: '/approval',
                        templateUrl: 'tpl/callaccounting/myapproval.html',
                        resolve: load(['js/controllers/callaccount/mycall_approval.controller.js',
                            'js/services/date.service.js',
                            'smart-table', 'toaster'
                        ])
                    })
                    .state('app.callaccounting.finance', {
                        url: '/finance',
                        templateUrl: 'tpl/callaccounting/finance.html',
                        resolve: load(['js/controllers/callaccount/mycall_finance.controller.js',
                            'js/services/date.service.js',
                            'smart-table', 'toaster'
                        ])
                    })
                    .state('app.minibar', {
                        url: '/minibar',
                        template: '<div ui-view></div>',
                        resolve: load(['toaster', 'moment', 'smart-table', 'ui.jq'])
                    })
                    .state('app.minibar.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/minibar/dashboard.html',
                        resolve: load(['nvd3', 'js/controllers/minibar/dashboard.controller.js'])
                    })
                    .state('app.minibar.logs', {
                        url: '/logs',
                        templateUrl: 'tpl/minibar/logs.html',
                        resolve: load(['js/controllers/minibar/logs.controller.js'])
                    })
                    .state('app.minibar.by_guest', {
                        url:'/guest',
                        templateUrl:'tpl/minibar/guest.html',
                        resolve: load(['js/controllers/minibar/guest.controller.js'])
                    })
                    .state('app.housekeeping', {
                        url: '/housekeeping',
                        template: '<div ui-view></div>',
                        resolve: load(['toaster', 'moment', 'smart-table', 'ui.jq',
                        ])
                    })
                    .state('app.housekeeping.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/housekeeping/dashboard.html',
                        resolve: load(['js/controllers/housekeeping/dashboard.controller.js'])
                    })
                    .state('app.housekeeping.logs', {
                        url: '/logs',
                        templateUrl: 'tpl/housekeeping/logs.html',
                        resolve: load(['js/controllers/housekeeping/logs.controller.js'])
                    })
                    .state('app.housekeeping.workflow', {
                        url: '/workflow',
                        templateUrl: 'tpl/housekeeping/workflow.html',
                        resolve: load([
                            'ngTagsInput',
                            'js/controllers/housekeeping/workflow.controller.js',
                            'js/controllers/housekeeping/notification.controller.js',
                            'js/controllers/housekeeping/checklist.controller.js',
                            'js/services/guestservice.service.js',
                        ])
                    })
                    .state('app.housekeeping.realtime', {
                        url: '/realtime',
                        templateUrl: 'tpl/housekeeping/realtime.html',
                        resolve: load([
                            'js/controllers/housekeeping/realtime.controller.js',
                            'js/controllers/housekeeping/logperroom.controller.js',
                            'js/controllers/housekeeping/logperfloor.controller.js',
                            'js/controllers/housekeeping/logperstaff.controller.js',
                            'js/controllers/housekeeping/logdashboard.controller.js',
                            'ngDragDrop',
                        ])
                    })
                    .state('app.housekeeping.assignment', {
                        url: '/roomassignment',
                        templateUrl: 'tpl/housekeeping/assignment.html',
                        resolve: load([
                            'ngTagsInput', 'ngListSelect',
                            'js/controllers/housekeeping/assignment.controller.js',
                            'dndLists',
                        ])
                    })
                    .state('app.housekeeping.turndown_assign', {
                        url: '/turndown_assign',
                        templateUrl: 'tpl/housekeeping/turndown_assign.html',
                        resolve: load([
                            'ngTagsInput', 'ngListSelect',
                            'js/controllers/housekeeping/turndown_assign.controller.js',
                            'dndLists',
                        ])
                    })
                    .state('app.calldistribution', {
                        url: '/calldistribution',
                        template: '<div ui-view></div>',
                    })
                    .state('app.calldistribution.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/calldistribution/dashboard.html',
                        resolve: load(['js/controllers/guestservice/guestservice.controller.js', 'ui.jq'])
                    }).state('app.calls', {
                        url: '/calls',
                        template: '<div ui-view></div>',
                    })
                    .state('app.calls.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/calls/dashboard.html',
                        resolve: load(['toaster', 'moment', 'smart-table', 'angular-duration-format', 'pdfmake', 'ui.jq', 'nvd3',
                            'js/controllers/calllogger/dashboard.controller.js'])
                    })
                    .state('app.calls.agentstatus', {
                        url: '/agentstatus',
                        templateUrl: 'tpl/calls/call_agentstatus.html',
                        resolve: load(['toaster', 'moment', 'smart-table', 'angular-duration-format',
                            'js/controllers/calllogger/call_agentstatus.controller.js',
                            'js/controllers/calllogger/call_imageload.controller.js',
                            'js/services/country.service.js',])
                    })
                    .state('app.calls.managecall', {
                        url: '/managecall',
                        templateUrl: 'tpl/calls/call_managecall.html',
                        resolve: load(['toaster', 'moment', 'smart-table', 'angular-duration-format',
                            'js/controllers/calllogger/call_managecall.controller.js',
                            'js/services/country.service.js',])
                    })
                    .state('app.calls.logger', {
                        url: '/logger',
                        templateUrl: 'tpl/calls/call_logger.html',
                        resolve: load(['toaster', 'moment', 'smart-table', 'ui.jq',
                            'js/controllers/calllogger/call_logger.controller.js',
                            'js/controllers/calllogger/log_detail.controller.js',
                        ])
                    })
                    
                    .state('app.engineering', {
                        url: '/engineering',
                        template: '<div ui-view></div>',
                    })
                    .state('app.engineering.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/engineering/dashboard.html',
                        resolve: load(['toaster', 'smart-table','nvd3', 'ui.jq','nvd3',
                                    'js/controllers/guestservice/guestservice.controller.js', 
                                    'js/controllers/engineering/dashboard.controller.js' ])
                    })
                    .state('app.engineering.request', {
                        url: '/request',
                        templateUrl: 'tpl/engineering/request_list.html',
                        resolve: load([
                            'toaster', 'smart-table', 'ui.jq', 'ngFileUpload', 'ui.bootstrap.datetimepicker', 'ngTagsInput',
                            'js/services/guestservice.service.js',
                            'js/controllers/engineering/request_list.controller.js',
                            'js/controllers/engineering/request_validate.controller.js'
                        ])
                    })

                    .state('app.engineering.preventive', {
                        url: '/preventive',
                        templateUrl: 'tpl/engineering/preventive.html',
                        resolve: load([
                            'ngTagsInput','toaster',
                            'js/controllers/engineering/preventive.controller.js',
                            'js/controllers/engineering/preventive_maintainence.controller.js',
                            'js/controllers/engineering/checklist_eng.controller.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'ui.jq',
                        ])
                    })
                    .state('app.engineering.equipment', {
                        url: '/equipment',
                        templateUrl: 'tpl/engineering/equipment.html',
                        resolve: load(['moment', 'smart-table', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.datetimepicker',
                                'js/controllers/engineering/equipment.controller.js',
                                'js/controllers/engineering/equipment_create.controller.js',
                                'js/controllers/engineering/equipment_edit.controller.js',
                                'js/controllers/engineering/equipment_detail.controller.js',
                                'js/controllers/engineering/equipment_file.controller.js',
                                'js/controllers/engineering/equipment_workorder.controller.js',
                                'js/services/date.service.js',
                                'js/services/guestservice.service.js',
                                'smart-table', 'toaster', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.contextMenu', 'cfp.hotkeys', 'ui.chart', 'ui.jq', 'ngAside',
                                'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'moment'   ])
                    })
                    .state('app.engineering.part', {
                        url: '/part',
                        templateUrl: 'tpl/engineering/part.html',
                        resolve: load(['moment', 'smart-table', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.datetimepicker',
                            'js/controllers/engineering/part.controller.js',
                            'js/controllers/engineering/part_create.controller.js',
                            'js/controllers/engineering/part_edit.controller.js',
                            'js/controllers/engineering/part_detail.controller.js',
                            'js/controllers/engineering/part_workorder.controller.js',
                            'js/services/date.service.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'toaster', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.contextMenu', 'cfp.hotkeys', 'ui.chart', 'ui.jq', 'ngAside',
                            'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'moment'   ])
                    })
                    .state('app.engineering.workorder', {
                        url: '/workorder',
                        templateUrl: 'tpl/engineering/workorder.html',
                        resolve: load(['moment', 'smart-table', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.datetimepicker',
                            'js/controllers/engineering/workorder.controller.js',
                            'js/controllers/engineering/workorder_create.controller.js',
                            'js/controllers/engineering/workorder_edit.controller.js',
                            'js/controllers/engineering/workorder_detail.controller.js',
                            'js/controllers/engineering/workorder_update.controller.js',
                            'js/controllers/engineering/workorder_staff.controller.js',
                            'js/services/date.service.js',
                            'js/services/guestservice.service.js',
                            'smart-table', 'toaster', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.contextMenu', 'cfp.hotkeys', 'ui.chart', 'ui.jq', 'ngAside',
                            'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'moment'   ])
                    })
                    .state('app.engineering.checklist', {
                        url: '/checklist',
                        templateUrl: 'tpl/engineering/checklist.html',
                        resolve: load([
                            'ngTagsInput','toaster',
                            'js/controllers/engineering/checklist_eng.controller.js',
                            'js/services/guestservice.service.js'
                        ])
                    })

                    .state('app.guestsurvey', {
                        url: '/guestsurvey',
                        template: '<div ui-view></div>',
                        resolve: load(['toaster', 'moment', 'smart-table', 'ui.jq'])
                    })
                    .state('app.guestsurvey.dashboard', {
                        url: '/dashboard',
                        templateUrl: 'tpl/guestsurvey/dashboard.html',
                        resolve: load(['js/controllers/guestservice/guestservice.controller.js'])
                    })
                    .state('app.guestsurvey.setting', {
                        url: '/setting',
                        templateUrl: 'tpl/guestsurvey/setting.html',
                        resolve: load([
                            'ngTagsInput',
                            'js/controllers/guestsurvey/setting.controller.js'
                        ])
                    })
                    .state('app.guestsurvey.answer', {
                        url: '/answerlist',
                        templateUrl: 'tpl/guestsurvey/answerlist.html',
                        resolve: load([
                            'ngTagsInput',
                            'js/controllers/guestsurvey/answerlist.controller.js'
                        ])
                    })
                    .state('app.reports', {
                        url: '/reports',
                        templateUrl: 'tpl/reports/dashboard.html',
                        resolve: load(['ngTagsInput', 'toaster', 'moment', 'smart-table', 'rgkevin.datetimeRangePicker', 'ui.bootstrap.datetimepicker',
                            'angularjs-dropdown-multiselect', 'ui.jq', 
                            'js/controllers/report/report.controller.js',
                            'js/controllers/report/callaccount.controller.js',
                            'js/controllers/report/guestservice.controller.js',
                            'js/controllers/report/minibar.controller.js',
                            'js/controllers/report/hskp.controller.js',
                            'js/controllers/report/callcenter.controller.js',
                            'js/controllers/report/schdule_report_create.controller.js',
                            'js/controllers/report/scheduled_report.controller.js',
                            'js/controllers/report/day_report.controller.js',
                            'js/controllers/report/wakeupcall.controller.js',
                            'js/controllers/report/callclassify.controller.js',
                            'js/controllers/report/audit.controller.js',
                             'js/controllers/report/complaints.controller.js',
                        ])
                    })
                    .state('app.faq', {
                        url: '/faq',
                        templateUrl: 'tpl/faq.html',
                        resolve: load( ['ngQuill', 'toaster',
                            'js/services/text_html.service.js','js/services/text_html_esc.service.js',
                            'js/controllers/faq.controller.js',
                        ] )
                    })
                    .state('app.profile', {
                        url: '/profile',
                        templateUrl: 'tpl/profile/page_profile.html',
                        resolve: load( ['ngImgCrop', 'toaster', 'ui.jq',
                            'js/controllers/profile/page_profile.controller.js',
                        ] )
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