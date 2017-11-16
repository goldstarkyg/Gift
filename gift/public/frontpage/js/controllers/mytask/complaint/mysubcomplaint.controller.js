app.controller('MySubcomplaintController', function ($scope, $rootScope, $http, $timeout, $uibModal, $window, $interval, $aside, toaster, AuthService) {
    var MESSAGE_TITLE = 'My Complaint';

    $scope.tab_full_height = 'height: ' + ($window.innerHeight - 120) + 'px; overflow-y: auto';
    $scope.table_container_height = 'height: ' + ($window.innerHeight - 140) + 'px; overflow-y: auto';

    $scope.filter_option = {};

    $scope.complaint_filters = [
        {name: 'Approvals', badge: '2'},
        {name: 'Complaints', badge: '2'},
        {name: 'Returned', badge: '2'},
    ];

    $scope.filter_list = [
            'All Tickets',
            'Last 24 Hours',
            'Acknowledged by me',
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

    $scope.currentFilter = $scope.complaint_filters[1];

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

    $scope.filter = undefined;
    function setFilterPanel(filter) {
        filter.departure_date = moment(filter.departure_date).toDate();
        $scope.filter = filter;        
    }

    $scope.openFilterPanel = function(position, backdrop) {
        $rootScope.asideState = {
            open: true,
            position: position
        };

        function postClose(filter, mode) {
            $rootScope.asideState.open = false;
            if( filter.mode == 1 ) // complaint
            {
                if( filter.name == undefined )
                    return;

                $scope.currentFilter = filter;    
            }

            if( filter.mode == 2 ) 
            {

            }
            
            search_option = '';
            $scope.$emit('erase_search');

            $scope.refreshTickets();
        }

        $aside.open({
            templateUrl: 'tpl/toolbar/mycomplaintfilter.aside.html',
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
                $scope.onSelectFilter = function(filter) {  // filter sort
                    if( filter.name == 'Complaints' )
                    {
                        $scope.currentFilter.name = 'Complaints';
                        return;
                    }

                    filter.mode = 1;
                    $uibModalInstance.close(filter);
                }

                $scope.saveTicketFilter = function() {          // filter setting             
                    filter.mode = 2;
                    $uibModalInstance.close({}, 2);
                }   
            },
        }).result.then(postClose, postClose);
    }


    $scope.onSelectItem = function(item) {
        $scope.currentFilter = item;
        filter = 'Total';
        $scope.initPageNum();
        $scope.refreshTickets();
    }

    $scope.detail_view_height = $window.innerHeight - 85;

    $scope.paginationOptions = {
        pageNumber: 0,
        pageSize: 20,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.ticketlist = [];
    $scope.selectedTicket = [];

    var filter = 'Total';
    $scope.onFilter = function getFilter(param) {
        filter = param;
        $scope.pageChanged();
    }


    $scope.initPageNum = function(){
        $scope.paginationOptions.numberOfPages = 1;
    }

    $scope.pageChanged = function(preserve) {
        console.log('Page changed to: ' + $scope.paginationOptions.numberOfPages);

        $scope.ticketlist = [];

        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

        var filtername = '';
        if( $scope.currentFilter != undefined )
            filtername = $scope.currentFilter.name;

        var request = {};
        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;
        request.filtername = $scope.currentFilter.name;

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.dispatcher = profile.id;
        request.dept_id = profile.dept_id;
        request.job_role_id = profile.job_role_id;
        // request.filter = filter;
        request.filter = $scope.filter;

        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        
        var url = '';
        if( $scope.currentFilter.name == 'Returned' )
            url = '/frontend/guestservice/compensationlist';
        else if( $scope.currentFilter.name == 'Approvals' )
            url = '/frontend/complaint/onroutemylist';
        else if( $scope.currentFilter.name == 'Complaints' )
            url = '/frontend/complaint/submylist';        
      
        $http({
            method: 'POST',
            url: url,
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.ticketlist = response.data.datalist;

            var type = 1;

            if( $scope.currentFilter.name == 'Approvals' ||
                $scope.currentFilter.name == 'Returned' )
                type = 2;
            else if( $scope.currentFilter.name == 'Complaints' )
                type = 3;
            
            for(var i = 0; i < $scope.ticketlist.length; i++)
            {
                $scope.ticketlist[i].type = type;
            }

            if( $scope.ticketlist.length > 0 && !(preserve == true) ) {
                $scope.selectedTicket = [];
                $scope.selectedTicket[0] = $scope.ticketlist[0];
               
                $scope.selectedNum = 0;
            }
            $scope.checkSelection($scope.ticketlist);
            $scope.paginationOptions.totalItems = response.data.totalcount;

            if( $scope.paginationOptions.totalItems < 1 )
                $scope.paginationOptions.countOfPages = 0;
            else
                $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);

            setFilterPanel(response.data.filter);

            console.log(response);
        }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });

        getFilterList();    

    };

    $scope.onPrevPage = function() {
        if( $scope.paginationOptions.numberOfPages <= 1 )
            return;

        $scope.paginationOptions.numberOfPages = $scope.paginationOptions.numberOfPages - 1;
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
        $scope.pageChanged();
    }

    $scope.refreshTickets = function(){
        $scope.pageChanged();        
    }

    $scope.onChangeFlagFilter = function() {
        $scope.pageChanged();           
    }

    var category_list = [];
    var profile = AuthService.GetCredentials();
    function getComplaintCategoryList() {
        category_list = [];
     
        var request = {};
        request.dept_id = profile.dept_id;

        $http({
            method: 'POST',
            url: '/frontend/complaint/categorylist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            category_list = response.data;            
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    var subcategory_list = [];
    function getComplaintSubcategoryList(category_id) {
        subcategory_list = [];
     
        var request = {};
        request.category_id = 0;
        request.dept_id = profile.dept_id;

        $http({
            method: 'POST',
            url: '/frontend/complaint/subcategorylist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            subcategory_list = response.data;                        
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    getComplaintCategoryList();
    getComplaintSubcategoryList();


    $scope.loadCategoryFilters = function(query) {
        return category_list.filter(function(type) {
            return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    $scope.loadSubcategoryFilters = function(query) {
        return subcategory_list.filter(function(type) {
            return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    function getFilterList() {
        var profile = AuthService.GetCredentials();
        
        var request = {};
        request.property_id = profile.property_id;
        request.dept_id = profile.dept_id;    
        request.dispatcher = profile.id;
        request.job_role_id = profile.job_role_id;

        $http({
            method: 'POST',
            url: '/frontend/complaint/myfilterlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.complaint_filters = response.data;
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });    
    }

    $scope.refreshTickets();

    $scope.checkSelection = function(ticketlist){
        if( !ticketlist )
            return;

        for(var i = 0; i < ticketlist.length; i++)
        {
            var index = -1;
            for(var j = 0; j < $scope.selectedTicket.length; j++ )
            {
                if( ticketlist[i].id == $scope.selectedTicket[j].id)
                {
                    index = j;
                    break;
                }
            }
            ticketlist[i].active = index >= 0 ? true : false;
        }
    }

    $scope.onSelectTicket = function(ticket, event, type){
       
        $scope.selectedTicket = [];
        $scope.selectedTicket[0] = ticket;
        $scope.selectedNum = 0;
     
        $scope.checkSelection($scope.ticketlist);
    }


    $scope.getTicketNumber = function(ticket){
        if(!ticket)
            return 'C00000';

        if( ticket.type == 3 )
            return $scope.getSubComplaintTicketNumber(ticket);
        else
            return $scope.getCompensationTicketNumber(ticket);
    }

    $scope.getSubComplaintTicketNumber = function(ticket){
        if(!ticket)
            return 'C00000';

        return sprintf('C%05d%s', ticket.parent_id, ticket.sub_label);      
    }

    $scope.getCompensationTicketNumber = function(ticket){
        if(!ticket)
            return 'C00000';
        return sprintf('C%05d', ticket.task_id);      
    }

    $scope.$on('onChangedSubComplaint', function(event, args){
        if( $scope.currentFilter.name == 'Complaints' ||
            $scope.currentFilter.name == 'Approvals'
            )
            $scope.pageChanged(true);        
    });

    $scope.$on('subcomplaint_assigned', function(event, args){
        if( $scope.currentFilter.name == 'Complaints' )
            $scope.pageChanged(true);        
    });

    $scope.$on('subcomplaint_escalated', function(event, args){
        if( $scope.currentFilter.name == 'Complaints' )
            $scope.pageChanged(true);        
    });


    $scope.$on('compensation_post', function(event, args){
        if( $scope.currentFilter.name == 'Approvals' || $scope.currentFilter.name == 'Returned' )
            $scope.pageChanged(true);        
    });
});




