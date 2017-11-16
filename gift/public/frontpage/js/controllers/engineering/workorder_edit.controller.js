app.controller('WorkorderEditController', function ($scope, $rootScope, $http, $uibModal, $interval, $stateParams, $httpParamSerializer, AuthService, GuestService, toaster) {
    var MESSAGE_TITLE = 'Part Edit';

    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;

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
    $scope.getWorkorderDetail();

    $scope.part_group = [];
    $scope.datetime = {};

    $scope.frequency_units = [
        'Days',
        'Weeks',
        'Months',
        'Years',
    ];

    $scope.prioritys = [
        'Low',
        'Medium',
        'High',
        'Urgent'
    ];

    $scope.work_order_types = [
        'Repairs',
        'Requests',
        'Preventive',
        'Upgrade',
        'New',
    ];

    $scope.init = function() {
        if ($scope.workorder.status == 'Pending') {
            $scope.view_property = false;
        } else {
            $scope.view_property = true;
        }

    }
    $scope.init();

    $scope.workorder.frequency_unit = $scope.frequency_units[0];


    $scope.getEquipmentList = function(val) {
        if( val == undefined )
            val = "";

        return $http.get('/list/equipmentlist?equipment=' + val + '&property_id=' + property_id)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };

    $scope.onEquipmentSelect = function (workorder, $item, $model, $label) {
        $scope.workorder.equipment_id = $item.id;
    };

    $scope.getCheckList = function(val) {
        if( val == undefined )
            val = "";
        return promiss = $http.get('/frontend/equipment/getchecklist?name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
    $scope.onChecklistSelect = function (workorder, $item, $model, $label) {
        $scope.workorder.checklist_id = $item.id;
        $scope.workorder.equipment_id = $item.equip_id;
        $scope.workorder.equipment_name = $item.equip_name;
        $scope.workorder.work_order_type = $item.work_order_type;
    };

    // $scope.getStaffList = function(val) {
    //     if( val == undefined )
    //         val = "";
    //     var profile = AuthService.GetCredentials();
    //     var property_id = profile.property_id;
    //     return GuestService.getStaffList(val)
    //         .then(function(response){
    //             return response.data.map(function(item){
    //                 return item;
    //             });
    //         });
    // };

    $scope.getStaffList = function(query) {
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

    $scope.onStaffSelect = function (workorder, $item, $model, $label) {
        $scope.workorder.staff_id = $item.id;
        $scope.workorder.staff_name = $item.name;
        $scope.workorder.staff_cost = $item.cost;
        if($scope.workorder.staff_cost == null) $scope.workorder.staff_cost = 0;
        $scope.workorder.staff_type = $item.type;
    };

    $scope.getPartList = function(val) {
        if( val == undefined )
            val = "";
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        return promiss = $http.get('/frontend/eng/partlist?part_name='+val+"&property_id="+property_id)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
    $scope.onPartelect = function (workorder, $item, $model, $label) {
        $scope.workorder.part_id = $item.id;
        $scope.workorder.part_stock = $item.quantity;
        $scope.workorder.part_cost = $item.purchase_cost;
    };

    $scope.$watch('datetime.start_date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.workorder.purpose_start_date = moment(newValue).format('YYYY-MM-DD');
    });

    $scope.$watch('datetime.end_date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.workorder.purpose_end_date = moment(newValue).format('YYYY-MM-DD');
    });


    $scope.UpdateWorkorder = function(){
        var data = angular.copy($scope.workorder);
        data.property_id = profile.property_id;
        $http({
            method: 'POST',
            url: '/frontend/eng/updateworkorder',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Part has been updated successfully');
                $scope.pageChanged();
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created notification');
            })
            .finally(function() {
            });
    }

    $scope.cancelWorkorder = function(){
        $scope.workorder = {};
        $scope.part_group = [];
    }
    $scope.CreateParts = function(){
        var parts = {};
        parts.part_id = $scope.workorder.part_id;
        parts.part_name = $scope.workorder.part_name;
        parts.part_number = $scope.workorder.part_number;
        parts.part_number_original = 0;
        parts.part_stock = $scope.workorder.part_stock;
        parts.part_cost = $scope.workorder.part_cost;

        $scope.part_duplicate = false;
        for(var i = 0 ; i<$scope.workorder.part_group.length ; i++ ) {
            if($scope.workorder.part_group[i].part_id == parts.part_id ) {
                $scope.part_duplicate = true;
                //parts.part_number = $scope.workorder.part_group[i]['part_number'] + parts.part_number;
                //parts.part_stock = $scope.workorder.part_group[i]['part_stock'];
                //parts.part_number_original = $scope.workorder.part_group[i]['part_number_original'];
                //$scope.deleteParts($scope.workorder.part_group[i]['part_id']);
            }
        }

        $scope.partstock = parts.part_stock;

        if(parts.part_number > parts.part_stock || $scope.part_duplicate == true ) {
            var modalInstance = $uibModal.open({
                templateUrl: 'workorder_part.html',
                controller: 'WorkorderPartCtrl',
                scope: $scope,
                resolve: {
                    workorder: function () {
                        return $scope.workorder;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        }else {
            $scope.workorder.part_group.push(parts);
        }
    }

    $scope.deleteParts = function (part_id) {
        for(var i=0; i < $scope.workorder.part_group.length;i++) {
            var id = $scope.workorder.part_group[i].part_id;
            if(id == part_id) $scope.workorder.part_group.splice(i,1);
        }
    }

    $scope.CreateStaffs = function(){
        var staff = {};
        $scope.staff_duplicate = false;
        staff.staff_id = $scope.workorder.staff_id ;
        staff.staff_cost = $scope.workorder.staff_cost;
        staff.staff_name = $scope.workorder.staff_name;
        staff.staff_type = $scope.workorder.staff_type;
        for(var i = 0 ; i<$scope.workorder.staff_group.length ; i++ ) {
            if($scope.workorder.staff_group[i].staff_id == staff.staff_id) {
                $scope.staff_duplicate = true;
                break;
            }
        }
        if($scope.staff_duplicate == true) return;
        $scope.workorder.staff_group.push(staff);
    }
    $scope.deleteStaffs = function (staff_id) {
        for(var i=0; i < $scope.workorder.staff_group.length;i++) {
            var id = $scope.workorder.staff_group[i].staff_id;
            if(id == staff_id) $scope.workorder.staff_group.splice(i,1);
        }
    }

});

app.controller('WorkorderPartCtrl', function($scope, $uibModalInstance, $http, AuthService, toaster) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});

