app.controller('UserdeleteController', function($scope, $rootScope, $http, $window, toaster, $uibModal) {
    var MESSAGE_TITLE = 'User Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
    $scope.box_height = 'height: ' + ($window.innerHeight - 130) + 'px; overflow-y: auto;';
    $scope.tableState = {};
    $scope.user = {};

    // pip
    $scope.isLoading = false;
    $scope.datalist = [];

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 0,
        pageSize: 20,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };


    $scope.getDataList = function getDataList(tableState) {

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
        request.searchtext = $scope.searchtext;
        request.cond = 'deleted';


        $http({
            method: 'POST',
            url: '/backend/user/list',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $rootScope.usercount = response.data.totalcount;
                $scope.datalist = response.data.datalist;

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


    $scope.onSearch = function() {
        $scope.paginationOptions.pageNumber = 0;
        $scope.getDataList();
    }


    //modal view and edit user
    $scope.onEditUser = function(row) {
        var size = 'lg';
        var modalInstance = $uibModal.open({
            templateUrl: 'UserDetailModal.html',
            controller: 'UserDetailController',
            size: size,
            resolve: {
                user: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function (comment) {
            if( comment == undefined || comment.length < 1 )
            {
                toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                return;
            }

            row.comment = comment;
            row.approval_temp = 'Waiting For Approval';

        }, function () {

        });
    }

    //delete user (only change field val)
    $scope.onResumeUser =  function(row) {
        var request = {};
        request.id = row.id;
        $http({
            method: 'POST',
            url: '/backend/user/resume',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.getDataList();
            }).catch(function(response) {
            console.error('Gists error', response.status, response.data);
        })
    }

    //forever delete
    $scope.onRemoveUser = function (row) {
        var request = {};
        request.id = row.id;
        request.picture = row.picture;
        $http({
            method: 'POST',
            url: '/backend/user/remove',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.getDataList();
            }).catch(function(response) {
            console.error('Gists error', response.status, response.data);
        })
    }

});

app.controller('UserDetailController', function ($scope, $uibModalInstance, $http, user) {
    $scope.user = user;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
