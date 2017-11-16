app.controller('WorkorderStaffController', function ($scope, $rootScope, $http, $timeout, $uibModal, $window, hotkeys, $interval, $aside, toaster, GuestService, AuthService, DateService, uiGridConstants) {
    var MESSAGE_TITLE = 'Work Order Staff';

    $scope.isLoading = false;
    $scope.staffs ={};
    $scope.saffstatus = 'create';
    $scope.getWorkOrderStaff = function getWorkOrderStaff() {

        $scope.isLoading = true;
        var request = {};
        request.workorder_id = $scope.workorder.id;

        var url = '/frontend/eng/getworkorderstafflist';
        $http({
            method: 'POST',
            url: url,
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.datalist = response.data.datalist;
        }).catch(function(response) {
                console.error('Gists error', response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.onDeleteStaffDetail = function (row) {
        if(row.id > 0) {
            var modalInstance = $uibModal.open({
                templateUrl: 'workorder_staff_delete.html',
                controller: 'WorkorderStaffDeleteCtrl',
                scope: $scope,
                resolve: {
                    row: function () {
                        return row;
                    }
                }
            });
    
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
    
            });
        }
    }

    $scope.onStaffEdit = function (row) {
        $scope.staffs = {};
        $scope.staffs = angular.copy(row);
        if(row.status == 'Pending')
            $scope.staffs.statff_statuss = ['Working','Hold','Finished'];
        if(row.status == 'Working')
            $scope.staffs.statff_statuss = ['Hold','Finished'];
        if(row.status == 'Hold')
            $scope.staffs.statff_statuss = ['Working','Finished'];
        $scope.staffs.status = $scope.staffs.statff_statuss[0];
        $scope.saffstatus = 'update';
    }

    $scope.onStaffCancel = function () {
        $scope.staffs = {};
        $scope.saffstatus = 'create';
    }

    $scope.getWorkorderStaffList = function(query) {
        if( query == undefined )
            query = "";
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        return promiss = $http.get('/frontend/eng/getstaffgrouplist?staff_group_name='+query+'&property_id='+property_id)
            .then(function(response){
                var staff_tags = response.data;
                return staff_tags.filter(function(type) {
                    return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
                });
            });
    };

    $scope.onWorkorderStaffSelect = function (staffs, $item, $model, $label) {

        $scope.staffs.staff_id = $item.id;
        $scope.staffs.staff_cost = $item.cost;
        if($scope.staffs.staff_cost == null) $scope.staffs.staff_cost = 0;
        $scope.staffs.staff_type = $item.type;

    };

    $scope.onCreateStaff = function() {
        var request = {};
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.workorder_id = $scope.workorder.id;
        request.user_id = profile.id;
        request.staff_id = $scope.staffs.staff_id;
        request.staff_type = $scope.staffs.staff_type;
        request.staff_cost = $scope.staffs.staff_cost;
        request.staff_name = $scope.staffs.staff_name;
        request.status = 'Pending';
        $http({
            method: 'POST',
            url: '/frontend/eng/createworkorderstaff',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function (response) {
            toaster.pop('success', MESSAGE_TITLE, ' Staff of workOrder has been created successfully');
            $scope.history_details = {};
            $scope.getWorkOrderStaff();
        }).catch(function (response) {

            })
            .finally(function () {

            });
    }

    $scope.onUpdateStaff = function() {
        var request = {};
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.id = $scope.staffs.id;
        request.workorder_id = $scope.workorder.id;
        request.user_id = profile.id;
        request.staff_id = $scope.staffs.staff_id;
        request.staff_type = $scope.staffs.staff_type;
        request.staff_cost = $scope.staffs.staff_cost;
        request.staff_name = $scope.staffs.staff_name;
        request.status = $scope.staffs.status;
        $http({
            method: 'POST',
            url: '/frontend/eng/updateworkorderstaff',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function (response) {
            toaster.pop('success', MESSAGE_TITLE, ' Staff of workOrder has been created successfully');
            $scope.history_details = {};
            $scope.getWorkOrderStaff();
        }).catch(function (response) {

            })
            .finally(function () {

            });
    }
    // $scope.staff = {};
    // $scope.staff_view = '';
    //
    // $scope.onSelectStaffDetail = function(row) {
    //     $scope.history_details = angular.copy(row);
    //     $scope.sendbutton = 'Post Update';
    //     if(row.status != 'Custom' ) // updated data from workorder detail page
    //         $scope.historydetail_view = 'true';
    //     else {
    //         //manualy updated data from this page
    //         $scope.historydetail_view = '';
    //     }
    // }
    //
    // $scope.onUpdateStaffDetail = function() {
    //     var request = {};
    //     if($scope.history_details.id > 0) {
    //         request = angular.copy($scope.history_details);
    //         request.description = $scope.history_details.description;
    //     }else{
    //         var profile = AuthService.GetCredentials();
    //         request.workorder_id = $scope.workorder.id;
    //         request.user_id = profile.id;
    //         request.description = $scope.history_details.description;
    //         request.status = 'Custom';
    //     }
    //     $http({
    //         method: 'POST',
    //         url: '/frontend/eng/updateworkorderhistory',
    //         data: request,
    //         headers: {'Content-Type': 'application/json; charset=utf-8'}
    //     }).then(function (response) {
    //         toaster.pop('success', MESSAGE_TITLE, ' WorkOrder has been deleted successfully');
    //         $scope.history_details = {};
    //         $scope.getWorkOrderHistory();
    //     }).catch(function (response) {
    //             // CASE 3: NO Asignee Found on shift : Default Asignee
    //         })
    //         .finally(function () {
    //
    //         });
    // }
    //
    // $scope.onCancelStaffDetail = function(){
    //     $scope.history_details = {};
    //     $scope.sendbutton = 'Post Create';
    // }
    //
    // $scope.onDeleteHistoryDetail = function (row) {
    //     if(row.workorder_id > 0) {
    //         var modalInstance = $uibModal.open({
    //             templateUrl: 'workorder_staff_delete.html',
    //             controller: 'WorkorderStaffDeleteCtrl',
    //             scope: $scope,
    //             resolve: {
    //                 row: function () {
    //                     return row;
    //                 }
    //             }
    //         });
    //
    //         modalInstance.result.then(function (selectedItem) {
    //             $scope.selected = selectedItem;
    //         }, function () {
    //
    //         });
    //     }
    // }

});

app.controller('WorkorderStaffDeleteCtrl', function($scope, $uibModalInstance, $http, AuthService, toaster , row) {
    var MESSAGE_TITLE = 'WorkOrder Staff ';
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.deleterow = function() {
        var profile = AuthService.GetCredentials();
        var request = {};
        request = angular.copy(row);
        $http({
            method: 'POST',
            url: '/frontend/eng/deleteworkorderstaff',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            toaster.pop('success', MESSAGE_TITLE, ' WorkOrder History has been deleted successfully');
            $uibModalInstance.close();
            $scope.staffs = {};
            $scope.getWorkOrderStaff();
        }).catch(function(response) {
                // CASE 3: NO Asignee Found on shift : Default Asignee
            })
            .finally(function() {

            });
    }
});
