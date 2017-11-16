app.controller('MinibarGuestController', function($scope, $rootScope, $http, $window, AuthService, toaster, liveserver,$httpParamSerializer) {
    var MESSAGE_TITLE = 'Guest Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
    $scope.box_height = 'height: ' + ($window.innerHeight - 130) + 'px; overflow-y: auto;';
    $scope.tableState = undefined;

    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };

    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

    angular.element('#dateranger').on('apply.daterangepicker', function(ev, picker) {
        $scope.daterange = picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD');
        $scope.getDataList();
    });

    // pip
    $scope.isLoading = false;
    $scope.datalist = [];
    $scope.minibar_item = {};

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

    $scope.loadMinibarItems = function(datalist) {
        $scope.minibar_item = {};
        datalist.forEach( function(value, index, ar) {
            $scope.minibar_item[value.id] = value;
        });
    }

    $scope.changeMinibarItemFormat = function() {
        $scope.datalist.forEach( function(value, index, ar) {
            var item_ids = JSON.parse(value.item_ids);
            var quantity = JSON.parse(value.quantity);
            value.minibar_items = [];
            item_ids.forEach( function(id, index, items){
                var data = angular.copy($scope.minibar_item[id]);
                data.quantity = quantity[index];
                value.minibar_items.push(data);
            });
        });
    }

    $scope.getDataList = function getDataList(tableState) {
        //here you could create a query string from tableState
        //fake ajax call
        $scope.isLoading = true;

        if( tableState != undefined )
        {
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            $scope.paginationOptions.pageNumber = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.paginationOptions.pageSize = pagination.number || $scope.paginationOptions.pageSize;  // Number of entries showed per page.
            $scope.paginationOptions.field = tableState.sort.predicate;
            $scope.paginationOptions.sort = tableState.sort.reverse ? 'desc' : 'asc';
        }

        var request = {};
        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        request.searchtext = $scope.searchtext;

        $http({
            method: 'POST',
            url: '/frontend/minibar/guest',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.loadMinibarItems(response.data.minibar_item_list);

                $scope.datalist = response.data.datalist;
                $scope.changeMinibarItemFormat();

                $scope.paginationOptions.totalItems = response.data.totalcount;

                var numberOfPages = 0;

                if( $scope.paginationOptions.totalItems < 1 )
                    numberOfPages = 0;
                else
                    numberOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);

                if( tableState != undefined )
                    tableState.pagination.numberOfPages = numberOfPages;
                else
                    $scope.tableState.pagination.numberOfPages = numberOfPages;

                $scope.paginationOptions.countOfPages = numberOfPages;

                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.getDateFormat = function(val) {
        return moment(val).format('DD MMM YYYY');
    }
    $scope.getDate = function(row) {
        return moment(row.created_at).format('YYYY-MM-DD');
    }

    $scope.getTime = function(row) {
        return moment(row.created_at).format('h:mm:ss a');
    }


    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Accordion group header - #1',
            content: 'Dynamic group body - #1'
        },
        {
            title: 'Accordion group header - #2',
            content: 'Dynamic group body - #2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.detaillist = [];
    $scope.getViewDetail = function getViewDetail(row, index) {
        var request = {};
        request.guest_id = row.guest_id;
        request.room_id = row.room_id;
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        request.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        $http({
            method: 'POST',
            url: '/frontend/minibar/detail',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.detaillist = response.data.datalist;
                for(var i = 0; i < $scope.datalist.length; i++) {
                    if(i == index) $scope.datalist[i].view = true;
                    else $scope.datalist[i].view = false;
                }
                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });

    }
    $scope.onDownloadPDF = function(row) {
        var filter = {};
        filter.report_target = 'minibar_guest';
        filter.guest_id = row.guest_id;
        filter.checkin = row.checkin;
        filter.checkout = row.checkout;
        filter.room_id = row.room_id;
        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
        filter.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);
    }


    $scope.onSearch = function() {
        $scope.paginationOptions.pageNumber = 0;
        $scope.getDataList();
    }
});