app.controller('DutyComplaintController', function ($scope, $rootScope, $http, $window, $httpParamSerializer, $timeout, $uibModal, AuthService, toaster, $aside, liveserver) {
    var MESSAGE_TITLE = 'Wakeup List';
   
    //$scope.full_height = 'height: ' + ($window.innerHeight - 40) + 'px; overflow-y: auto';
    $scope.tab_full_height = 'height: ' + ($window.innerHeight - 120) + 'px; overflow-y: auto';
    $scope.full_height = $window.innerHeight - 100;
    $scope.tab_height = $window.innerHeight - 125;

    $scope.subcount = {};

    $scope.filter_value = '';
    $scope.property_ids = [];

    $scope.subcount.pending = 0;
    $scope.subcount.resolved = 0;
    $scope.subcount.rejected = 0;
    $scope.subcount.escalated = 0;
    $scope.subcount.timeout = 0;
    $scope.subcount.total = 0;



    var profile = AuthService.GetCredentials();

    var userlist = [];
    var dept_list = [];
    $http.get('/list/dutymanagerlist?property_id=' + profile.property_id)
        .then(function(response) {
            userlist = response.data;    
        }).catch(function(response) {
            console.error('Gists error', response.status, response.data);
        })
        .finally(function() {            
        });

    $scope.country_list = [];    

    $http.get('/list/countrylist')
        .then(function(response){
            $scope.country_list = response.data;
        });    


    $scope.newTickets = [];
    $scope.selectedTickets = [];

    $scope.newTickets[0] = {
        "id" : 0,
        "Number" : 1,
        "groupName" : "Create Wakeup",
    };

    $timeout(function(){
        $scope.active = 1;
    }, 100);

    $scope.isLoading = false;
    $scope.datalist = [];

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

    $scope.$on('$destroy', function() {
        if ($scope.timer != undefined) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    });

    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };

    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

    angular.element('#dateranger').on('apply.daterangepicker', function(ev, picker) {
        $scope.daterange = picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD');
        $scope.pageChanged();
    });

    $scope.onClickDateFilter = function() {
        angular.element('#dateranger').focus();
    }

    $scope.filter_list = [
            'All Tickets',
            'Last 24 Hours',
            'Tickets created by me',
        ];

    $scope.status_list = [
            'Pending',
			'Resolved',
            'Acknowledge',
            'Closed',
            'Rejected',
            'Flagged',
            'Unresolved',            
        ];    


    $scope.config = {};
    $scope.config.opened = false;    

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        // dateDisabled: disabled,
        class: 'datepicker'
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.config.opened = true;
    };
    
    $scope.select = function(date) {
        console.log(date);

        $scope.config.opened = false;
    }    

    $scope.filter = undefined;
    function setFilterPanel(filter) {
        filter.departure_date = moment(filter.departure_date).toDate();
        $scope.filter = filter;        
    }

    $scope.openFilterPanel = function(position, backdrop) {
        $scope.config.opened = false;
        $rootScope.asideState = {
            open: true,
            position: position
        };

        function postClose() {
            $rootScope.asideState.open = false;
            $scope.pageChanged();
        }

        $aside.open({
            templateUrl: 'tpl/toolbar/complaintfilter.aside.html',
            placement: position,
            scope: $scope,
            size: 'sm',
            backdrop: backdrop,
            controller: function($scope, $uibModalInstance) {
                $scope.ok = function(e) {
                    $uibModalInstance.close();
                    e.stopPropagation();
                };
                $scope.cancel = function(e) {
                    $uibModalInstance.dismiss();
                    e.stopPropagation();
                };        

                $scope.saveTicketFilter = function() {                    
                    $uibModalInstance.close();
                }        
            },
        }).result.then(postClose, postClose);
    }
    
    $scope.loadDepartmentFilters = function(query) {
        return dept_list.filter(function(type) {
            return type.department.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    
    $scope.searchComplaint = function(value) {
        $scope.pageChanged();
    }

    $scope.pageChanged = function() {
        //here you could create a query string from tableState
        //fake ajax call
        $scope.isLoading = true;

        /////////////////////
        var request = {};
        request.page = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;

        request.filter = $scope.filter;
        if( request.filter )
            request.filter.departure_date = moment(request.filter.departure_date).format('YYYY-MM-DD');
        
        request.filter_value = $scope.filter_value;

        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;

        $scope.datalist = [];

        $http({
            method: 'POST',
            url: '/frontend/complaint/list',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.datalist = response.data.datalist;
                $scope.datalist.forEach(function(item, index) {
                    item.ticket_no = $scope.getTicketNumber(item);
                    item.created_at_time = moment(item.created_at).format('D MMM YYYY hh:mm a');
                    item.discuss_end_time_at = moment(item.discuss_end_time).format('DD MMM YYYY');
                });

                $scope.paginationOptions.totalItems = response.data.totalcount;
                $scope.subcount = response.data.subcount;
                $scope.property_ids = response.data.property_ids;
                $scope.filter_value = '';

                var numberOfPages = 0;

                if( $scope.paginationOptions.totalItems < 1 )
                    numberOfPages = 0;
                else
                    numberOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);
 
                $scope.paginationOptions.countOfPages = numberOfPages;

                checkSelectStatus();

                setFilterPanel(response.data.filter);

                dept_list = response.data.dept_list;

                console.log(response);
                console.log(response.data.time);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.pageChanged();
    

    function checkSelectStatus() {
        for(var j = 0; j < $scope.datalist.length; j++)
        {
            var ticket = $scope.datalist[j];
            var index = -1;
            for(var i = 0; i < $scope.selectedTickets.length; i++)
            {
                if( ticket.id == $scope.selectedTickets[i].id )
                {
                    index = i;
                    break;
                }
            }    
            ticket.active = index >= 0;            
        }        
    }

    $scope.getProcess = function(row) {
        if( row.total < 1 )
            return 0;
        return row.completed * 100 / row.total;
    }

    $scope.onPrevPage = function() {
        if( $scope.paginationOptions.numberOfPages <= 1 )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages - 1;
        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        $scope.isLoading = true;
        $scope.pageChanged();
    }

    $scope.onNextPage = function() {
        if( $scope.paginationOptions.totalItems < 1 )
            $scope.paginationOptions.countOfPages = 0;
        else
            $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize) + 1;

        if( $scope.paginationOptions.numberOfPages >= $scope.paginationOptions.countOfPages )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages + 1;
        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        $scope.isLoading = true;
        $scope.pageChanged();
    }

    $scope.getDate = function(row) {
        return moment(row.created_at).format('YYYY-MM-DD');
    }

    $scope.getTime = function(row) {
        return moment(row.created_at).format('DD-MMM-YYYY HH:mm:ss');
    }

    $scope.getDiscussTime = function(row) {
        return moment(row.discuss_end_time).format('DD MMM YYYY');
    }

    $scope.refreshLogs = function(){
        $scope.isLoading = true;
        $scope.pageChanged();
    }


    $scope.getRowCss = function(row) {
        if( row.active )
            return 'active';
        else
            return '';
    }

    $scope.getWakeupNumber = function(log){
        if( log == undefined )
            return 0;

        return sprintf('%05d', log.id);
    }

    $scope.getDurationInMinute = function(duration) {
        return moment.utc(duration * 1000).format("mm:ss");
    }

    $scope.removeTicket = function() {

    }

    $scope.onSelectTicket = function(ticket){
        // check select ticket
        $timeout(function(){
            var index = -1;
            for(var i = 0; i < $scope.selectedTickets.length; i++)
            {
                if( ticket.id == $scope.selectedTickets[i].id )
                {
                    index = i;
                    break;
                }
            }

            if( index < 0 )    // not selected
            {
                $scope.selectedTickets.push(angular.copy(ticket));                
            }
            else {
                $scope.selectedTickets.splice(index, 1);
                checkSelectStatus();
            }

            $timeout(function() {
                if( index < 0 )
                    $scope.active = 6 + ticket.id;
            }, 100);

        }, 100);
    }

    $scope.setReminder = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'complaint_reminder_dialog.html',
            controller: 'ComplaintReminderDialogCtrl',
            resolve: {
                complaint: function () {
                    return row;
                },
                userlist: function () {
                    return userlist;
                },                
            }
        });

        modalInstance.result.then(function (complaint) {
            saveReminder(complaint);
        }, function () {

        });
    }

    function saveReminder(row) {
        $http({
            method: 'POST',
            url: '/frontend/complaint/savereminder',
            data: row,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {                
                console.log(response);
                console.log(response.data.time);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.flagComplaint = function (row) {
        row.flag = 1 - row.flag;

        var request = {};        
        request.complaint_id = row.id;
        request.mark_flag = row.flag;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/flagmark',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                            
        }).catch(function(response) {
            // CASE 3: NO Asignee Found on shift : Default Asignee
        })
        .finally(function() {

        });

    }
    $scope.selected_depts=[];
    //$scope.selDept=[];
     $scope.loadDepts = function(row){
	     
	     var request = {};
        request.id = row.id;
	     $http({
            method: 'POST',
            url: '/frontend/complaint/deptlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
	        
            row.selected_depts = response.data.deptlist;
       
	       
           
        }).catch(function(response) {
            //toaster.pop('error', MESSAGE_TITLE, 'Failed to send departments.');
        })
        .finally(function() {

        });
       
    }

    
    $scope.getTicketNumber = function(ticket) {
        return sprintf('C%05d', ticket.id);
    }

    $scope.$on('onChangedComplaint', function(event, args){
        $scope.pageChanged();
    });

    $scope.$on('complaint_post', function(event, args){
        $scope.pageChanged();
    });

    $scope.$on('compensation_approve', function(event, args){
        $scope.pageChanged();
    });

    $scope.$on('onUpdateComplaint', function(event, args){
        var profile = AuthService.GetCredentials();
        for(var i = 0; i < $scope.datalist.length; i++)
        {
            if( $scope.datalist[i].id == args.id)
            {
                $scope.datalist[i] = args;
                break;
            }
        }
    });

    $scope.onDownloadPDF = function(){
        var profile = AuthService.GetCredentials();

        var filter = {};
        filter.user_id = profile.id;
        filter.report_by = 'Summary';
        filter.report_type = 'Summary';
        filter.report_target = 'complaint_summary';
        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        filter.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        filter.filter_value = $scope.filter_value;

        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);
    }
});

app.controller('ComplaintReminderDialogCtrl', function($scope, $http, AuthService, $uibModalInstance, complaint, userlist) {
    $scope.complaint = complaint;

    if( !$scope.complaint.reminder_time )
        $scope.complaint.reminder_time = moment().format("YYYY-MM-DD HH:mm:ss");

    $scope.complaint.reminder_flag = $scope.complaint.reminder_flag == 1;

    $scope.user_tags = [];
    var request = {};        
    request.userids = JSON.parse($scope.complaint.reminder_ids);
    
    $http({
        method: 'POST',
        url: '/userlistwithids',
        data: request,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    }).then(function(response) {
        console.log(response);  
        $scope.user_tags = response.data;

    }).catch(function(response) {
    })
    .finally(function() {

    });

    $scope.ok = function () {
        var reminder_ids = [];
        for(var i = 0; i < $scope.user_tags.length; i++)
        {
            reminder_ids.push($scope.user_tags[i].id);                    
        }

        $scope.complaint.reminder_ids = JSON.stringify(reminder_ids);
        $scope.complaint.reminder_flag = $scope.complaint.reminder_flag ? 1 : 0;

        $uibModalInstance.close($scope.complaint);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.loadUsernameFilters = function(query) {
        return userlist.filter(function(type) {
            return type.wholename.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    $scope.$watch('complaint.datetime', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.complaint.reminder_time = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
    });

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        if( $view == 'day' )
        {
            var activeDate = moment().subtract('days', 1);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
        else if( $view == 'minute' )
        {
            var activeDate = moment().subtract('minute', 5);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
    }
});

