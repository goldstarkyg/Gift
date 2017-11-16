app.controller('EngRequestValidationController', function ($scope, $rootScope, $http, $httpParamSerializer, $window, $interval, $uibModal, AuthService, GuestService, toaster ,liveserver) {
    var MESSAGE_TITLE = 'Duty Manager';

    $scope.full_height = $window.innerHeight - 125;

    $scope.eng = {};
    $scope.guest_history = {};

    $scope.init = function(eng) {
        var profile = AuthService.GetCredentials();

        $scope.eng = eng;

        if( eng.path )
            $scope.eng.download_array = eng.path.split("|");
        else
            $scope.eng.download_array = [];


        var profile = AuthService.GetCredentials();
        $scope.eng.modified_by = profile.id;

        getRequestorHistory();
    }

    $scope.onDownloadPDF = function(){
        var filter = {};
        filter.report_by = 'complaint';
        filter.report_type = 'Detailed';
        filter.report_target = 'complaint';
        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.id = $scope.eng_request.id;
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);
    }

    function getRequestorHistory() {
        var profile = AuthService.GetCredentials();
        var request = {};
        request.requestor_id = $scope.eng.requestor_id;
        request.property_id = profile.property_id;
        if( request.requestor_id < 1 )
        {
            $scope.requestor_history = [];
            return;
        }

        $http({
            method: 'POST',
            url: '/frontend/eng/requestorhistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            //console.log(response);
            $scope.requestor_history = response.data.datalist;
        }).catch(function(response) {

            })
            .finally(function() {

            });
    }

    $scope.viewRequestorHistory = function() {
        $scope.eng.history_view = true;
    }

    $scope.hideRequestorHistory = function() {
        $scope.eng.history_view = false;
    }

    $scope.getRequestNumber = function(ticket){
        if(!ticket)
            return 'E00000';
        return sprintf('E%05d', ticket.id);
    }

    $scope.showRequest = function(row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'request_detail.html',
            controller: 'RequestDetailCtrl',
            scope: $scope,
            resolve: {
                eng: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    }

    $scope.accept = function(row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'request_workorder.html',
            controller: 'RequestWorkorderCtrl',
            scope: $scope,
            resolve: {
                eng: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    }
    $scope.onReject = function (eng) {
            var profile = AuthService.GetCredentials();
            var data = {};
            data.request_id  = eng.id;
            data.requestor_id = eng.requestor_id;
            data.subject = eng.subject;
            data.location = eng.lgm_type+"-"+eng.lgm_name;
            data.category_name = eng.category_name;
            data.sub_category_name = eng.subcategory_name;
            data.requestor_name = eng.wholename;
            data.property_id = profile.property_id;
            data.user_id = profile.id;
            data.status = 'Rejected';

            $http({
                method: 'POST',
                url: '/frontend/eng/updaterequest',
                data: data,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function(response) {
                    $scope.$emit('request_refresh');

                }).catch(function(response) {
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to created wokorder');
                })
                .finally(function() {
                });

    }

});

app.controller('RequestDetailCtrl', function($scope, $uibModalInstance, $http, AuthService, eng) {
    $scope.eng = eng;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.getTicketNumber = function (ticket) {
        if(!ticket)
            return 'E00000';

        return sprintf('E%05d', ticket.id);
    };

    $scope.getTime = function(row) {
        return moment(row.created_at).fromNow();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});


//- - - -create  work order from request- - -//
app.controller('RequestWorkorderCtrl', function($scope, $uibModalInstance, $uibModal, $http, AuthService, toaster, eng) {
    $scope.eng = eng;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.getTicketNumber = function (ticket) {
        if(!ticket)
            return 'E00000';

        return sprintf('E%05d', ticket.id);
    };

    $scope.getTime = function(row) {
        return moment(row.created_at).fromNow();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    var MESSAGE_TITLE = 'Workorder Create';

    //var client_id = $stateParams.client_id;
    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;
    $scope.workorder = {};
    $scope.datetime = {};
    $scope.part_group = [];
    $scope.datetime.date = new Date();
    $scope.workorder.start_date = moment($scope.datetime.date).format('YYYY-MM-DD');
    $scope.workorder.end_date = moment($scope.datetime.date).format('YYYY-MM-DD');

    $scope.frequency_units = [
        'Days',
        'Weeks',
        'Months',
        'Years',
    ];

    // $scope.prioritys = [
    //     'Low',
    //     'Medium',
    //     'High',
    //     'Urgent'
    // ];

    $scope.prioritys = [];
    $scope.prioritys[0] =  eng.priority;
    for(var i =0 ; i < $scope.prioritys.length; i ++) {
        if($scope.prioritys[i] == eng.priority)
            $scope.workorder.priority = $scope.prioritys[i];
    }

    $scope.workorder.description = eng.comment;
    $scope.workorder.request_id = eng.id;
    $scope.workorder.name = 'Request-'+$scope.getTicketNumber(eng);
    $scope.workorder.equipment_location = {};
    $scope.workorder.equipment_location.name = eng.lgm_name;
    $scope.workorder.equipment_location.type = eng.lgm_type;
    $scope.location_id = eng.loc_id;


    $scope.workorder.request_flag = 1; //request=1, workroder=2, preventivve =3

    $scope.workorder.frequency_unit = $scope.frequency_units[0];

    $scope.work_order_types = [
        //'Repairs',
        'Requests',
        //'Preventive',
        //'Upgrade',
        //'New',
    ];
    $scope.workorder.work_order_type = $scope.work_order_types[0];
    $scope.workorder.frequency_unit = $scope.frequency_units[0];

    $scope.getEquipmentList = function(val) {
        if( val == undefined )
            val = "";

        return $http.get('/list/equipmentlist?equipment=' + val + '&property_id=' + property_id+'&location_id='+eng.loc_id)
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
        data.property_id = profile.property_id;
        data.user_id = profile.id;
        if($scope.workorder.equipment_name == null) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter equipment name.');
            return ;
        }
        $http({
            method: 'POST',
            url: '/frontend/eng/createworkorder',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, ' Workorder has been created successfully');
                //update request status from Default to pending
                $scope.updateRequest();

            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created wokorder');
            })
            .finally(function() {
            });
    }

    $scope.updateRequest = function () {
        var data = {};
        data.request_id  = eng.id;
        data.requestor_id = eng.requestor_id;
        data.property_id = profile.property_id;
        data.user_id = profile.id;
        data.status = 'Pending';

        $http({
            method: 'POST',
            url: '/frontend/eng/updaterequest',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.$emit('request_refresh');
                $uibModalInstance.dismiss();

            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created wokorder');
            })
            .finally(function() {
            });

    }

    $scope.cancelWorkorder = function(){
        $scope.workorder = {};
        $scope.part_group = [];
        $uibModalInstance.dismiss();
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

});

//- - -check duplicate for work order part- - -//
app.controller('WorkorderPartCtrl', function($scope, $uibModalInstance, $http, AuthService, toaster) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});


