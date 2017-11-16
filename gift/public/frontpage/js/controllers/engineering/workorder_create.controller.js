app.controller('WorkorderCreateController', function ($scope, $rootScope, $http, $interval, $uibModal, $stateParams, $httpParamSerializer, AuthService, GuestService, toaster) {
    var MESSAGE_TITLE = 'Workorder Create';

    //var client_id = $stateParams.client_id;
    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;
    $scope.workorder = {};
    $scope.datetime = {};
    $scope.part_group = [];
    $scope.staff_group = [];
    $scope.datetime.date = new Date();
    $scope.workorder.start_date = moment($scope.datetime.date).format('YYYY-MM-DD');
    $scope.workorder.end_date = moment($scope.datetime.date).format('YYYY-MM-DD');

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
    $scope.workorder.priority = $scope.prioritys[0];
    
    $scope.workorder.frequency_unit = $scope.frequency_units[0];

    $scope.work_order_types = [
        'Repairs',
        'Requests',
        'Preventive',
        'Upgrade',
        'New',
    ];
    $scope.workorder.work_order_type = $scope.work_order_types[0];
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
        $scope.workorder.equipment_location = $item.location;
    };

    $scope.getCheckList = function(val) {
        if( val == undefined )
            val = "";
        var equipment_id = $scope.workorder.equipment_id;
        var work_order_type = $scope.workorder.work_order_type;
        var location_id = $scope.workorder.equipment_location.id;
        return promiss = $http.get('/frontend/equipment/getchecklist?name='+val+
            '&equipment_id='+equipment_id+
            '&work_order_type='+work_order_type+
            '&location_id='+location_id)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
    $scope.onChecklistSelect = function (workorder, $item, $model, $label) {
        $scope.workorder.checklist_id = $item.id;
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
        $scope.workorder.start_date = moment(newValue).format('YYYY-MM-DD');
    });

    $scope.$watch('datetime.end_date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.workorder.end_date = moment(newValue).format('YYYY-MM-DD');
    });

    $scope.createWorkorder = function(){
        var data = angular.copy($scope.workorder);
        data.part_group = $scope.part_group;
        data.staff_group = $scope.staff_group;
        data.property_id = profile.property_id;
        data.user_id = profile.id;
        console.log(JSON.stringify(data));
        $http({
            method: 'POST',
            url: '/frontend/eng/createworkorder',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, ' Workorder has been created successfully');
                $scope.pageChanged();
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created wokorder');
            })
            .finally(function() {
            });
    }

    $scope.cancelWorkorder = function(){
        $scope.workorder = {};
        $scope.part_group = [];
        $scope.staff_group = [];
    }
    $scope.CreateParts = function(){
        var parts = {};
        if( $scope.workorder.part_number == undefined) return ;

        parts.part_id = $scope.workorder.part_id;
        parts.part_name = $scope.workorder.part_name;
        parts.part_number = $scope.workorder.part_number;
        parts.part_number_original = 0;
        parts.part_stock = $scope.workorder.part_stock;
        parts.part_cost = $scope.workorder.part_cost;

        $scope.part_duplicate = false;
        for(var i = 0 ; i<$scope.part_group.length ; i++ ) {
            if($scope.part_group[i].part_id == parts.part_id) {
                $scope.part_duplicate = true;
            }
        }

        $scope.partstock = parts.part_stock;

        if( parts.part_number == 0 || parts.part_number > parts.part_stock || $scope.part_duplicate == true) {
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
            $scope.part_group.push(parts);
        }
    }
    $scope.deleteParts = function (part_id) {
        for(var i=0; i < $scope.part_group.length;i++) {
            var id = $scope.part_group[i].part_id;
            if(id == part_id) $scope.part_group.splice(i,1);
        }
    }

    $scope.CreateStaffs = function(){
        var staff = {};
        $scope.staff_duplicate = false;
        staff.staff_id = $scope.workorder.staff_id ;
        staff.staff_cost = $scope.workorder.staff_cost;
        staff.staff_name = $scope.workorder.staff_name;
        staff.staff_type = $scope.workorder.staff_type;
        for(var i = 0 ; i<$scope.staff_group.length ; i++ ) {
            if($scope.staff_group[i].staff_id == staff.staff_id) {
                $scope.staff_duplicate = true;
                break;
            }
        }
        if($scope.staff_duplicate == true) return;
        $scope.staff_group.push(staff);
    }
    $scope.deleteStaffs = function (staff_id) {
        for(var i=0; i < $scope.staff_group.length;i++) {
            var id = $scope.staff_group[i].staff_id;
            if(id == staff_id) $scope.staff_group.splice(i,1);
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

