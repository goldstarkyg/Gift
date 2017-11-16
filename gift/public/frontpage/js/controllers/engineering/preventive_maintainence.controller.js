app.controller('preventiveMaintainenceController', function($scope, $rootScope, $http,  $timeout,  $uibModal,  $window, $interval, $httpParamSerializer, toaster, AuthService, GuestService) {

    var MESSAGE_TITLE = 'Preventive Maintenance';
    $scope.$watch('vm.daterange', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;
        $scope.getDataList();
    });

    $scope.preventive = {};


    $scope.isLoading = false;
    $scope.preventive.types = ['Major','Minor','Check'];
    $scope.preventive.type =  $scope.preventive.types[0];


    $scope.preventive.frequency_units = [
        'Days',
        'Months',
        'Years'
    ];
    $scope.preventive.frequency_unit = $scope.preventive.frequency_units[0];

    $scope.getEquipmentOrGroupList = function (val) {
        if( val == undefined )
            val = "";        
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        return promiss = $http.get('/frontend/eng/getequipmentorgrouplist?name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    }

    $scope.onEquipmentOrGroupSelect = function (equipment, $item, $model, $label) {
        $scope.preventive.equip_id = $item.id;
        $scope.preventive.equip_name = $item.name;
        $scope.preventive.equip_type = $item.type;
    };

    function initData() {
        $scope.id = 0;
        $scope.preventive = {};
        $scope.preventive.name = '';
        $scope.preventive.equip_id = 0;
        $scope.preventive.equip_name = '';
        $scope.preventive.equip_type = 'group';
        $scope.preventive.checklist_id = 0;
        $scope.preventive.checklist_name = '';
        $scope.preventive.types = ['Major','Minor','Check'];
        $scope.preventive.type = $scope.preventive.types[0];
        $scope.preventive.frequency_units = [
            'Days',
            'Months',
            'Years'
        ];
        $scope.preventive.frequency = 0;
        $scope.preventive.frequency_unit = $scope.preventive.frequency_units[0];
        $scope.preventive.inspection = true;
        $scope.preventive.sms = 1;
        $scope.preventive.email = 1;
        $scope.action_button = 'Add';
        $scope.preventive.parts_tags = [];
    }
    initData();

    $scope.getCheckListFromPreventive = function (val) {
        if( val == undefined )
            val = "";
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var id = $scope.preventive.equip_id;
        var type = $scope.preventive.equip_type;
        return promiss = $http.get('/frontend/eng/getchecklistfrompreventive?name='+val+
                    "&property_id="+property_id+"&id="+id+"&type="+type)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    }
    $scope.onChecklistFromPreventiveSelect = function (equipment, $item, $model, $label) {
        $scope.preventive.checklist_id = $item.id;
        $scope.preventive.checklist_name = $item.name;
    };


    // $scope.getPartGroupList = function(query) {
    //     if( query == undefined )
    //         query = "";
    //     return promiss = $http.get('/frontend/equipment/partgrouplist?part_group_name='+query)
    //         .then(function(response){
    //             var part_tags = response.data;
    //             return part_tags.filter(function(type) {
    //                 return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
    //             });
    //         });
    // };

    $scope.getPartGroupList = function (val) {
        if( val == undefined )
            val = "";
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        return promiss = $http.get('/frontend/equipment/partgrouplist?part_group_name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    }

   
    $scope.onPartGroupSelect = function (equipment, $item, $model, $label) {
        $scope.part_id =  $item.id;
        $scope.part_name = $item.name;
        $scope.part_stock = $item.quantity;
        $scope.part_type = $item.type;
    };

   
    $scope.part_init = function(){
        $scope.part_id = 0;
        $scope.part_name = '';
        $scope.part_quantity = 0;
        $scope.part_stock = 0;
        $scope.part_type = '';
    }
    $scope.part_init();
    $scope.CreateParts = function () {
        if($scope.part_quantity > $scope.part_stock) {
            toaster.pop('error', MESSAGE_TITLE, 'A quantity of part can not big than the stock' );
            return;
        }
        if($scope.part_quantity == 0) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter quantity of part.' );
            return;
        }
        var part = {};
        part.id = $scope.part_id;
        part.name = $scope.part_name;
        part.quantity = $scope.part_quantity;
        part.type = $scope.part_type;
        $scope.preventive.parts_tags.push(part);
        $scope.part_init();
    }

    $scope.RemoveParts = function(part_name) {
        for( var i= 0 ; i< $scope.preventive.parts_tags.length ; i++) {
            if(part_name ==  $scope.preventive.parts_tags[i].name) {
                $scope.preventive.parts_tags.splice(i, 1);
            }
        }
    }


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

    //datr filter option
    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };
    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

    angular.element('#dateranger').on('apply.daterangepicker', function(ev, picker) {
        $scope.daterange = picker.startDate.format('YYYY-MM-DD ') + ' - ' + picker.endDate.format('YYYY-MM-DD');
        $scope.start_time =  picker.startDate.format('YYYY-MM-DD HH:mm:ss');
        $scope.end_time = picker.endDate.format('YYYY-MM-DD HH:mm:ss');
        $scope.time_range = $scope.start_time + ' - ' + $scope.end_time;
        $scope.getDataList();
    });
    //  pagination

    $scope.tableState = {};
    $scope.tableState.pagination = {};
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 8,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

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
        var profile = AuthService.GetCredentials();
        request.attendant = profile.id;
        request.property_id = profile.property_id;

        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;
        if($scope.start_time == undefined) $scope.start_time = $scope.dateRangeOption.startDate;
        if($scope.end_time == undefined) $scope.end_time = $scope.dateRangeOption.endDate;
        request.start_date = $scope.start_time;
        request.end_date = $scope.end_time;
        request.searchtext = $scope.searchtext;

        $http({
            method: 'POST',
            url: '/frontend/eng/getpreventivemaintenancelist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
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

    $scope.add = function() {
        var request = {};
        if( $scope.preventive.name.length < 1 || $scope.preventive.equip_type.length < 1 )
        {
            toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
            return;
        }

        if($scope.preventive.equip_id == 0) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter equipment' );
            return;
        }
        if($scope.preventive.checklist_id == 0) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter correct checklist' );
            return;
        }

        if($scope.preventive.parts_tags == null) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter correct parts' );
            return;
        }

        if($scope.preventive.staff_tags == null) {
            toaster.pop('error', MESSAGE_TITLE, 'Please enter correct staff' );
            return;
        }

        request.id = $scope.preventive.id;
        if($scope.preventive.id == undefined) request.id = 0;
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.approver = profile.id;

        request.type = $scope.preventive.type;
        request.name = $scope.preventive.name;
        request.equip_id = $scope.preventive.equip_id;
        request.equip_type = $scope.preventive.equip_type;
        request.checklist_id = $scope.preventive.checklist_id;

        request.parts = $scope.preventive.parts_tags;
        request.staffs = $scope.preventive.staff_tags;

        request.frequency = $scope.preventive.frequency;
        request.frequency_unit = $scope.preventive.frequency_unit;

        request.inspection = $scope.preventive.inspection ? 1 : 0;
        request.sms = $scope.preventive.sms ? 1 : 0;
        request.email = $scope.preventive.email ? 1 : 0;

        $http({
            method: 'POST',
            url: '/frontend/eng/createpreventivemaintenance',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Tasks have been created successfully');
                $scope.cancel();
                $scope.getDataList();
                

                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.cancel = function() {
        initData();
    }

    $scope.delete = function(row) {
        var request = {};
        request.id = row.id;

        $http({
            method: 'DELETE',
            url: '/frontend/eng/deletepreventivemaintenance',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Tasks have been deleted successfully');
                $scope.cancel();
                $scope.getDataList();
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.edit = function(row) {
        $scope.preventive.id = row.id;
        $scope.preventive.type = row.type;
        $scope.preventive.name = row.name;
        $scope.preventive.equip_id = row.equip_id;
        $scope.preventive.equip_name = row.equip_name;
        $scope.preventive.equip_type = row.equip_type;
        $scope.preventive.checklist_name = row.checklist_name;
        $scope.preventive.checklist_id = row.checklist_id;

        $scope.preventive.parts_tags = row.part;
        $scope.preventive.staff_tags = row.staff;

        $scope.preventive.frequency = row.frequency;
        $scope.preventive.frequency_unit = row.frequency_unit;
        $scope.preventive.inspection = row.inspection == 1 ? true : false;
        $scope.preventive.sms = row.sms == 1 ? true : false;
        $scope.preventive.email = row.email == 1 ? true : false;

        $scope.action_button = 'Update';
    }

    function getArrayfromID(ids, values)
    {
        var ids = JSON.parse(ids);
        var result = [];
        for(var i = 0; i < ids.length; i++)
        {
            for( var j = 0; j < values.length; j++)
            {
                if( ids[i] == values[j].id )
                {
                    result.push(values[j]);
                    break;
                }
            }
        }

        return result;
    }

    $scope.searchtext = '';
    $scope.onSearch = function() {
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();
    }

    //-----------------------------------------------------------------------//

    //
    // $scope.loadRoomTypeFilters = function(query) {
    //     return $scope.room_type.filter(function(type) {
    //         return type.type.toLowerCase().indexOf(query.toLowerCase()) != -1;
    //     });
    // };
    //
    // $scope.loadHskpStatusFilters = function(query) {
    //     return $scope.room_status.filter(function(type) {
    //         return type.status.toLowerCase().indexOf(query.toLowerCase()) != -1;
    //     });
    // };
    //
    // $scope.loadGuestTypeFilters = function(query) {
    //     return $scope.guest_type.filter(function(type) {
    //         return type.guest_type.toLowerCase().indexOf(query.toLowerCase()) != -1;
    //     });
    // };
    //
    // $scope.loadNotifyGroupFilters = function(query) {
    //     return $scope.user_group.filter(function(type) {
    //         return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
    //     });
    // };
    //
    // $scope.getTaskList = function(val) {
    //     if( val == undefined )
    //         val = "";
    //
    //     var profile = AuthService.GetCredentials();
    //
    //     return GuestService.getTaskList(val, profile.property_id, 0)
    //         .then(function(response){
    //             return response.data.map(function(item){
    //                 return item;
    //             });
    //         });
    // };
    //
    // $scope.add = function() {
    //     var request = {};
    //
    //     request.id = $scope.id;
    //     var profile = AuthService.GetCredentials();
    //     request.attendant = profile.id;
    //
    //     request.room_status = [];
    //     for(var i = 0; i < $scope.status_tags.length; i++)
    //         request.room_status.push($scope.status_tags[i].id);
    //
    //     request.room_status = JSON.stringify(request.room_status);
    //
    //     request.room_type = [];
    //     for(var i = 0; i < $scope.type_tags.length; i++)
    //         request.room_type.push($scope.type_tags[i].id);
    //
    //     request.room_type = JSON.stringify(request.room_type);
    //
    //     request.guest_type = [];
    //     for(var i = 0; i < $scope.guesttype_tags.length; i++)
    //         request.guest_type.push($scope.guesttype_tags[i].id);
    //
    //     request.guest_type = JSON.stringify(request.guest_type);
    //
    //     request.inspection = $scope.inspection ? 1 : 0;
    //     request.sms = $scope.sms ? 1 : 0;
    //     request.email = $scope.email ? 1 : 0;
    //
    //     request.notifygroup_flag = $scope.notifygroup_flag ? 1 : 0;
    //
    //     if( $scope.notifygroup_flag > 0 && $scope.notifytype_tags.length < 1 )
    //     {
    //         toaster.pop('error', MESSAGE_TITLE, 'You must select at least notify group');
    //         return;
    //     }
    //     request.notify_group = [];
    //     for(var i = 0; i < $scope.notifytype_tags.length; i++)
    //         request.notify_group.push($scope.notifytype_tags[i].id);
    //
    //     request.notify_group = JSON.stringify(request.notify_group);
    //
    //     request.task_id = $scope.task.id;
    //
    //     console.log(request);
    //
    //     $http({
    //         method: 'POST',
    //         url: '/frontend/hskp/createtriggertask',
    //         data: request,
    //         headers: {'Content-Type': 'application/json; charset=utf-8'}
    //     })
    //         .then(function(response) {
    //             toaster.pop('success', MESSAGE_TITLE, 'Tasks have been created successfully');
    //             $scope.cancel();
    //             $scope.getDataList();
    //
    //             console.log(response);
    //         }).catch(function(response) {
    //             console.error('Gists error', response.status, response.data);
    //         })
    //         .finally(function() {
    //             $scope.isLoading = false;
    //         });
    // }
    //
    // $scope.isLoading = false;
    //
    // //  pagination
    // $scope.paginationOptions = {
    //     pageNumber: 1,
    //     pageSize: 20,
    //     sort: 'desc',
    //     field: 'id',
    //     totalItems: 0,
    //     numberOfPages : 1,
    //     countOfPages: 1
    // };
    //
    // $scope.getDataList = function getDataList(tableState) {
    //     //here you could create a query string from tableState
    //     //fake ajax call
    //     $scope.isLoading = true;
    //
    //     if( tableState != undefined )
    //     {
    //         $scope.tableState = tableState;
    //         var pagination = tableState.pagination;
    //
    //         $scope.paginationOptions.pageNumber = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    //         $scope.paginationOptions.pageSize = pagination.number || $scope.paginationOptions.pageSize;  // Number of entries showed per page.
    //         $scope.paginationOptions.field = tableState.sort.predicate;
    //         $scope.paginationOptions.sort = tableState.sort.reverse ? 'desc' : 'asc';
    //     }
    //
    //
    //     var request = {};
    //     var profile = AuthService.GetCredentials();
    //     request.attendant = profile.id;
    //     request.property_id = profile.property_id;
    //
    //     request.page = $scope.paginationOptions.pageNumber;
    //     request.pagesize = $scope.paginationOptions.pageSize;
    //     request.field = $scope.paginationOptions.field;
    //     request.sort = $scope.paginationOptions.sort;
    //
    //     $http({
    //         method: 'POST',
    //         url: '/frontend/hskp/triggertasklist',
    //         data: request,
    //         headers: {'Content-Type': 'application/json; charset=utf-8'}
    //     })
    //         .then(function(response) {
    //             $scope.datalist = response.data.datalist;
    //             for(var i = 0; i < $scope.datalist.length; i++)
    //                 $scope.datalist[i].active_flag = $scope.datalist[i].active == 1 ? true : false;
    //
    //             $scope.paginationOptions.totalItems = response.data.totalcount;
    //
    //             var numberOfPages = 0;
    //
    //             if( $scope.paginationOptions.totalItems < 1 )
    //                 numberOfPages = 0;
    //             else
    //                 numberOfPages = parseInt(($scope.paginationOptions.totalItems - 1) / $scope.paginationOptions.pageSize + 1);
    //
    //             if( tableState != undefined )
    //                 tableState.pagination.numberOfPages = numberOfPages;
    //             else
    //                 $scope.tableState.pagination.numberOfPages = numberOfPages;
    //
    //             $scope.paginationOptions.countOfPages = numberOfPages;
    //
    //             $scope.room_type = response.data.room_type;
    //             $scope.room_status = response.data.room_status;
    //             $scope.guest_type = response.data.guest_type;
    //             $scope.user_group = response.data.user_group;
    //
    //             console.log(response);
    //         }).catch(function(response) {
    //             console.error('Gists error', response.status, response.data);
    //         })
    //         .finally(function() {
    //             $scope.isLoading = false;
    //         });
    // };
    //
    // $scope.cancel = function() {
    //     initData();
    // }
    //
    // $scope.getRoomStatus = function(row) {
    //     return getValuefromID(row.room_status, $scope.room_status, 'status');
    // }
    //
    // $scope.getRoomTypes = function(row) {
    //     return getValuefromID(row.room_type, $scope.room_type, 'type');
    // }
    //
    // $scope.getGuestType = function(row) {
    //     return getValuefromID(row.guest_type, $scope.guest_type, 'guest_type');
    // }
    //
    // $scope.getNotifyGroup = function(row) {
    //     return getValuefromID(row.notify_group, $scope.user_group, 'name');
    // }
    //
    // $scope.edit = function(row) {
    //     $scope.id = row.id;
    //     $scope.status_tags = getArrayfromID(row.room_status, $scope.room_status);
    //
    //     $scope.type_tags = getArrayfromID(row.room_type, $scope.room_type);
    //     $scope.guesttype_tags = getArrayfromID(row.guest_type, $scope.guest_type);
    //     $scope.inspection = row.inspection == 1 ? true : false;
    //     $scope.sms = row.sms == 1 ? true : false;
    //     $scope.email = row.email == 1 ? true : false;
    //     $scope.notifygroup_flag = row.notifygroup_flag == 1 ? true : false;
    //     $scope.notifytype_tags = getArrayfromID(row.notify_group, $scope.user_group);
    //     $scope.task = {};
    //     $scope.task.id = row.task_id;
    //     $scope.task.task = row.task_name;
    //
    //     $scope.action_button = 'Update';
    // }
    //
    // $scope.delete = function(row) {
    //     var request = {};
    //     request.id = row.id;
    //
    //     $http({
    //         method: 'DELETE',
    //         url: '/frontend/hskp/deletetriggertask',
    //         data: request,
    //         headers: {'Content-Type': 'application/json; charset=utf-8'}
    //     })
    //         .then(function(response) {
    //             toaster.pop('success', MESSAGE_TITLE, 'Tasks have been deleted successfully');
    //             $scope.cancel();
    //             $scope.getDataList();
    //         }).catch(function(response) {
    //             console.error('Gists error', response.status, response.data);
    //         })
    //         .finally(function() {
    //             $scope.isLoading = false;
    //         });
    // }
    //
    // $scope.onTotalActiveChange = function() {
    //     console.log($scope.active_flag);
    //     updateActiveState(0, $scope.active_flag);
    // }
    //
    // $scope.onActiveChange = function(row) {
    //     updateActiveState(row.id, row.active_flag);
    // }
    //
    // function updateActiveState(id, active_flag) {
    //     var request = {};
    //
    //     var profile = AuthService.GetCredentials();
    //     request.id = id;
    //     request.attendant = profile.id;
    //     request.property_id = profile.property_id;
    //     request.active = active_flag  ? 1 : 0;
    //
    //     $http({
    //         method: 'POST',
    //         url: '/frontend/hskp/activetriggertask',
    //         data: request,
    //         headers: {'Content-Type': 'application/json; charset=utf-8'}
    //     })
    //         .then(function(response) {
    //             if( active_flag == true )
    //             {
    //                 toaster.pop('success', MESSAGE_TITLE, 'Triggers have been activated');
    //             }
    //             else
    //             {
    //                 toaster.pop('success', MESSAGE_TITLE, 'Triggers have been inactivated');
    //             }
    //             for(var i = 0; i < $scope.datalist.length; i++)
    //                 $scope.datalist[i].active_flag = active_flag;
    //
    //             //$scope.getDataList();
    //
    //             console.log(response);
    //         }).catch(function(response) {
    //             console.error('Gists error', response.status, response.data);
    //         })
    //         .finally(function() {
    //             $scope.isLoading = false;
    //         });
    // }
    // function getValuefromID(ids, values, key)
    // {
    //     var ids = JSON.parse(ids);
    //     var result = '';
    //     var index = 0;
    //     for(var i = 0; i < ids.length; i++)
    //     {
    //         for( var j = 0; j < values.length; j++)
    //         {
    //             if( ids[i] == values[j].id )
    //             {
    //                 if( index > 0 )
    //                     result += ', ';
    //                 result +=  values[j][key];
    //                 index++;
    //                 break;
    //             }
    //         }
    //     }
    //
    //     return result;
    // }
    //
    // function getArrayfromID(ids, values)
    // {
    //     var ids = JSON.parse(ids);
    //     var result = [];
    //     for(var i = 0; i < ids.length; i++)
    //     {
    //         for( var j = 0; j < values.length; j++)
    //         {
    //             if( ids[i] == values[j].id )
    //             {
    //                 result.push(values[j]);
    //                 break;
    //             }
    //         }
    //     }
    //
    //     return result;
    // }

});
