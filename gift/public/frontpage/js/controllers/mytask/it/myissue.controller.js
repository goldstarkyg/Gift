app.controller('MyIssueController', function ($scope, $rootScope, $http, $timeout, $uibModal, $window, hotkeys, $interval, $aside, toaster, GuestService, AuthService, DateService, uiGridConstants) {
    var MESSAGE_TITLE = 'Issue';

    $scope.gs = GuestService;

    $scope.tab_full_height = 'height: ' + ($window.innerHeight - 190) + 'px; overflow-y: auto';
    $scope.table_container_height = 'height: ' + ($window.innerHeight - 140) + 'px; overflow-y: auto';
    $scope.count=0;


    $scope.uploadexcel = {};
    $scope.uploadexcel.src = '';
    $scope.uploadexcel.name = '';
    $scope.uploadexcel.type = '';
    $scope.searchoptions = ['Status','Department','Location','Manufacture','Supplier'];
    $scope.searchoption = $scope.searchoptions[0];
    $scope.statuses = [
        {name: 'Pending', level: '1'},
        {name: 'In-Progress', level: '2'},
        {name: 'Resolved', level: '3'},
        {name: 'Closed', level: '4'},
        {name: 'Rejected', level: '5'}
    ];

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

    $scope.select_status = [true, false, false];
    $scope.onChangeStatus = function (val) {
        switch(val) {
            case 'edit':
                $scope.select_status = [false, true, false];
                break;
            case 'detail':
                $scope.select_status = [false, false, true];
                break;
        }
    }



    $scope.list_view_height = 'height: ' + ($window.innerHeight - 140) + 'px; overflow-y: auto;';
    $scope.detail_view_height = 'height: ' + ($window.innerHeight - 115) + 'px; overflow-y: auto;';

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
    $scope.issue_name = '';

    $scope.issue = {};
/*
       $scope.init = function(issue){
	       $scope.issue=issue;
	       //$scope.getTicketNumber(ticketlist[0]);
	       window.alert(ticketlist[0].id+"yes");
	       
       }
*/
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
        $scope.count++;       
        
        $scope.ticketlist = [];

        $scope.paginationOptions.pageNumber = ($scope.paginationOptions.numberOfPages - 1) * $scope.paginationOptions.pageSize;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.


        var request = {};
        request.searchoption = $scope.searchoption;
        request.searchtext = $scope.searchtext;
        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;


        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.dispatcher = profile.id;
        request.dept_id = profile.dept_id;
        request.job_role_id = profile.job_role_id;
        request.filter = filter;


        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        

        var url = '/frontend/it/issuelist';
         

        $http({
            method: 'POST',
            url: url,
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.ticketlist = response.data.datalist;
            //window.alert($scope.ticketlist[0].id);
            if($scope.count==1)
            $scope.onSelectTicket($scope.ticketlist[0], event, 1);
            //window.alert("YES");

            $scope.paginationOptions.totalItems = response.data.totalcount;
            
           

            if( $scope.paginationOptions.totalItems < 1 )
                $scope.paginationOptions.countOfPages = 0;
            else
                $scope.paginationOptions.countOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);
            console.log(response);
        }).catch(function(response) {
                console.error('Gists error', response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };
    $scope.$on('onpageChanged', function(event, args){
        //toaster.pop('error', 'Balls');

        $scope.pageChanged();;
        //toaster.pop('error', 'Refreshed');
    });

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

  
    $scope.refreshTickets();

    $scope.getTicketNumber = function(ticket){
        if(!ticket)
            return 'IT00000';
        return sprintf('IT%05d', ticket.id);
    }
    
   


    $scope.onSelectTicket = function(ticket, event, type){
        ticket.type = type;
        $scope.selectedTicket = [];
        $scope.selectedTicket[0] = ticket;
        $scope.selectedNum = 0;
        //window.alert(event.name);
           // window.alert("Yes");
        
        $scope.issue_name = ticket.subject;
        //window.alert(ticket.subject);
        $scope.issue = ticket;
        //window.alert($scope.issue.upload);
         if( $scope.issue.upload )
            $scope.issue.sub_download_array = $scope.issue.upload.split("|");
        else
            $scope.issue.sub_download_array = [];
        //window.alert($scope.issue.status);
/*
        if(ticket.critical_flag == 1) $scope.equipment.critical_flag = true;
        if(ticket.critical_flag == 0) $scope.equipment.critical_flag = false;
        if(ticket.external_maintenance == 1) $scope.equipment.external_maintenance = true;
        if(ticket.external_maintenance == 0) $scope.equipment.external_maintenance = false;
*/
        var request = {};
        request.issue_id = ticket.id;
        $http({
            method: 'POST',
            url: '/frontend/it/issueinformlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            if(response.data.filelist != null) $scope.issue.filelist = response.data.filelist;
            $scope.checkSelection($scope.ticketlist);
            //console.log(response);
           // $rootScope.$broadcast('equipment_workorder');
        }).catch(function(response) {
                console.error('Gists error', response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }
    $scope.checkSelection = function(ticketlist){
        if( !ticketlist )
            return;
        //$scope.onChangeStatus('detail');
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

    
});

