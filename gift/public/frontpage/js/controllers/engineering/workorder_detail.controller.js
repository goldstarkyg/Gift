app.controller('WorkorderDetailController', function ($scope, $rootScope, $http, $uibModal, $interval, $stateParams, $httpParamSerializer, AuthService, GuestService, toaster) {
    var MESSAGE_TITLE = 'Part Detail';

    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;
    $scope.part_group = $scope.workorder.part_group;
    $scope.getWorkorderDetail = function () {
        var request = {};

        request.workorder_id = $scope.workorder.id;
        request.property_id = property_id;
        var url = '/frontend/eng/getworkorderdetail';
        $http({
            method: 'POST',
            url: url,
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.workorder = response.data.datalist[0];
        }).catch(function(response) {
                console.error('Gists error', response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });

    }
    //$scope.getWorkorderDetail();

   
    $scope.UpdateWorkorder = function(){
        var data = angular.copy($scope.workorder);
        $http({
            method: 'POST',
            url: '/frontend/eng/updateworkorder',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                //toaster.pop('success', MESSAGE_TITLE, 'Part has been updated successfully');
                $scope.pageChanged();
            }).catch(function(response) {
                //toaster.pop('error', MESSAGE_TITLE, 'Failed to created notification');
            })
            .finally(function() {
            });
    }

    $scope.changeStatus = function(val) {
        switch (val) {
            case 'Pending':
                $scope.pendingcolor='btn-danger';
                $scope.progresscolor='btn-grey';
                $scope.holdcolor='btn-grey';
                $scope.completcolor='btn-grey';
                break;
            case 'In Progress':
                $scope.pendingcolor='btn-grey';
                $scope.progresscolor='btn-progres';
                $scope.holdcolor='btn-grey';
                $scope.completcolor='btn-grey';
                break;
            case 'On Hold':
                $scope.pendingcolor='btn-grey';
                $scope.progresscolor='btn-grey';
                $scope.holdcolor='btn-hold';
                $scope.completcolor='btn-grey';
                break;
            case 'Completed':
                $scope.pendingcolor='btn-grey';
                $scope.progresscolor='btn-grey';
                $scope.holdcolor='btn-grey';
                $scope.completcolor='btn-success';
                break;

        }
        $scope.workorder.status = val;
    }

    $scope.changeStatus($scope.workorder.status);

    $scope.confirmChangeStatus = function(status) {
        var curretnstatus = $scope.workorder.status;
        if(status == 'Pending') {
            if( curretnstatus == 'In Progress' || curretnstatus == 'On Hold' || curretnstatus == 'Completed'  ) return false;
            else false;
        }
        if(status == 'In Progress') {
            if( curretnstatus == 'Pending' || curretnstatus == 'On Hold' ) return true;
            else return false;
        }
        if(status == 'On Hold') {
            if( curretnstatus == 'In Progress' ) return true;
            else return false;
        }
        if(status == 'Completed') {
            if( curretnstatus == 'In Progress' || curretnstatus == 'On Hold') return true;
            else return false;
        }

        return false;

    }
    $scope.changeStatusWorkOrder = function(val) {
        if($scope.confirmChangeStatus(val) == true) {
            $scope.changeStatus(val);
            $scope.UpdateWorkorder();
        }
    }

    $scope.$watch('workorder.status', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;
        $scope.changeStatus(newValue);
    });


});
