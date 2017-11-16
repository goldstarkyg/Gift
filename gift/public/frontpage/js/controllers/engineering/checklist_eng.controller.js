app.controller('ChecklistEngController', function($scope, $rootScope, $http,$httpParamSerializer, $window,  AuthService, toaster) {
    var MESSAGE_TITLE = 'Check List Page';

    var profile = AuthService.GetCredentials();
    var client_id = profile.client_id;
    $scope.work_order_types = [
        'Repairs',
        'Requests',
        'Preventive',
        'Upgrade',
        'New',
    ];
    $scope.getEquipGroupList = function(val) {
        if( val == undefined )
            val = "";
        return promiss = $http.get('/frontend/equipment/grouplist?group_name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };

    $scope.onEquipGroupSelect = function (equipment, $item, $model, $label) {
        var equipments = {};
        $scope.equip_group_id = $item.id;
        $scope.equip_group_name = $item.name;
    };

    $scope.getLocationList = function($query) {
        return $http.get('/list/locationtotallist?location=' +$query + '&client_id=' + client_id)
            .then(function(response){
                // console.log(JSON.stringify(response));
                var locations = response.data;
                var list = [];
                for(var i=0; i <  locations.length; i++) {
                    var check_val = false;
                    for(var j = 0, len = list.length; j < len; j++) {
                        if( list[ j ].key === locations[i].name +"_"+ locations[i].type) {
                            check_val = true;
                            continue;
                        }
                    }
                    if(check_val == false) {
                        list.push({'id':locations[i].id ,
                            'name': locations[i].name,
                            'type': locations[i].type,
                            'lg_id' : locations[i].lg_id,
                            'location_grp' : locations[i].location_grp,
                            'type_id' : locations[i].type_id,
                            'key':locations[i].name +"_"+ locations[i].type});
                    }
                }
                 return locations = list;
            });
    };


    $scope.onLocationSelect = function ($item, $model, $label) {
        $scope.location = $item;
        $scope.location_group_member_id = $item.id;
    };


    $scope.total_room_type = [];
    function initData() {
        $scope.id = 0;
        $scope.check_list_name = '';
        $scope.location_tags = [];
        $scope.equipment = {equip_id: 0, equip_name: ''};
        $scope.action_button = 'Add';
    }

    initData();

    $scope.getCheckListItemFilter = function(query) {
        if( query == undefined )
            query = "";

        return $scope.check_list_items.filter(function(type) {
            return type.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    $scope.add = function() {
        var request = {};

        request.id = $scope.id;

        var profile = AuthService.GetCredentials();

        request.property_id = profile.property_id;
        request.equip_group_id = $scope.equip_group_id;
        request.name = $scope.check_list_name;
        request.work_order_type = $scope.work_order_type;

        if( request.name == '' )
            return;
         // if( request.job_role_id < 1 )
        // {
        //     toaster.pop('error', MESSAGE_TITLE, 'Please select job role');
        //     return;
        // }

        var location_type = [];
        for(var i = 0; i < $scope.location_tags.length; i++) {
            var location = {};
            location = {'id':$scope.id,
                'location_id':$scope.location_tags[i].id,
                'name':$scope.location_tags[i].name,
                'type':$scope.location_tags[i].type,
                'lg_id':$scope.location_tags[i].lg_id,
                'location_grp':$scope.location_tags[i].location_grp,
                'type_id':$scope.location_tags[i].type_id} ;
            location_type.push(location);
        }


        request.location = JSON.stringify(location_type);


        $http({
            method: 'POST',
            url: '/frontend/equipment/createequipcheckList',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Check list have been created successfully');
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

    $scope.edit = function(row) {
        $scope.id = row.id;
        $scope.check_list_name = row.name;
        $scope.locations_tags = row.locations;
        // $scope.locations_tags = getArrayfromID(row.locations, $scope.location_tags);

        $scope.equipment = {};
        $scope.equipment.equip_id = row.equip_id;
        $scope.equipment.equip_name = row.equip_name;
        $scope.work_order_type = row.work_order_type;

        $scope.action_button = 'Update';
    }

    $scope.delete = function(row) {
        var request = {};
        request.id = row.id;

        $http({
            method: 'DELETE',
            url: '/frontend/equipment/deletequipchecklist',
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


    $scope.isLoading = false;

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
        request.dept_id = profile.dept_id;
        request.property_id = profile.property_id;

        request.page = $scope.paginationOptions.pageNumber;
        request.pagesize = $scope.paginationOptions.pageSize;
        request.field = $scope.paginationOptions.field;
        request.sort = $scope.paginationOptions.sort;

        $http({
            method: 'POST',
            url: '/frontend/equipment/getengchecklistnames',
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

                // $scope.total_room_type = response.data.room_type;
                // $scope.room_type = [];
                // $scope.job_roles = response.data.job_roles;
                $scope.check_list_items = response.data.check_list_items;

                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };
   

    $scope.onClickRow = function(row, index) {
        row.collapse = !row.collapse;
        for(var i = 0; i < $scope.datalist.length; i++)
        {
            if( i == index )
                continue;

            $scope.datalist[i].collapse = false;
        }
    }

    $scope.addCheckListItem = function(row) {
        var exist = false;
        for(var i = 0; i < row.items.length; i++)
        {
            if( row.items[i].name == row.item_name )
            {
                exist = true;
                break;
            }
        }

        if( exist == false )
            row.items.push({id: 0, name: row.item_name});
        $scope.cancelItem(row);
    }

    $scope.onDeleteCheckListItem = function(rows, item) {
        // var index = row.items.indexOf(item);
        for(var i=0; i < rows.items.length;i++) {
            var id = rows.items[i].id;
            if(id == item.id) {
                 rows.items.splice(i, 1);
            }
        }
        // if( index >= 0 )
        //     row.items.splice(index, 1);
    }

    $scope.saveItems = function(row) {
        var request = {};

        request.checklist_id = row.id;
        request.items = row.items;

        $http({
            method: 'POST',
            url: '/frontend/equipment/postengchecklistitems',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.cancelItem(row);
                $scope.check_list_items = response.data.check_list_items;
                toaster.pop('success', MESSAGE_TITLE, 'Check list Item have been changed successfully');
                
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.cancelItem = function(row) {
        row.item_name = '';
    }
    $scope.getRoomTypes = function(row) {
        return getValuefromID(row.room_type, $scope.total_room_type, 'type');
    }



    function getValuefromID(ids, values, key)
    {
        var ids = JSON.parse(ids);
        var result = '';
        var index = 0;
        for(var i = 0; i < ids.length; i++)
        {
            for( var j = 0; j < values.length; j++)
            {
                if( ids[i] == values[j].id )
                {
                    if( index > 0 )
                        result += ', ';
                    result +=  values[j][key];
                    index++;
                    break;
                }
            }
        }

        return result;
    }

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
