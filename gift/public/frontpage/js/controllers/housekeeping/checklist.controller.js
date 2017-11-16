app.controller('ChecklistController', function($scope, $rootScope, $http, $window, $uibModal, AuthService, toaster) {
    var MESSAGE_TITLE = 'Check List Page';

    $scope.total_room_type = [];
    function initData() {
        $scope.id = 0;
        $scope.check_list_name = '';
        $scope.type_tags = [];
        $scope.job_role = {id: 0, job_role: ''};
        $scope.action_button = 'Add';
    }

    initData();

    $scope.getJobRoleFilter = function(query) {
        if( query == undefined )
            query = "";

        return $scope.job_roles.filter(function(type) {
            return type.job_role.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

    $scope.loadRoomTypeFilters = function(query) {
        return $scope.room_type.filter(function(type) {
            return type.type.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    };

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
        request.dept_id = profile.dept_id;

        request.name = $scope.check_list_name;

        if( request.name == '' )
            return;

        request.job_role_id = $scope.job_role.id;
        if( request.job_role_id < 1 )
        {
            toaster.pop('error', MESSAGE_TITLE, 'Please select job role');
            return;
        }

        //if( $scope.type_tags.length < 1 )
        //{
        //    toaster.pop('error', MESSAGE_TITLE, 'Please select room type');
        //    return;
        //}

        request.room_type = [];
        for(var i = 0; i < $scope.type_tags.length; i++)
            request.room_type.push($scope.type_tags[i].id);

        request.room_type = JSON.stringify(request.room_type);


        $http({
            method: 'POST',
            url: '/frontend/hskp/createchecklist',
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
        $scope.type_tags = getArrayfromID(row.room_type, $scope.total_room_type);

        $scope.job_role = {};
        $scope.job_role.id = row.jr_id;
        $scope.job_role.job_role = row.job_role;

        $scope.onSelectJobrole($scope.job_role, {}, {});

        $scope.action_button = 'Update';
    }

    $scope.delete = function(row) {
        var request = {};
        request.id = row.id;

        $http({
            method: 'DELETE',
            url: '/frontend/hskp/deletechecklist',
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
            url: '/frontend/hskp/checklistnames',
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

                $scope.total_room_type = response.data.room_type;
                $scope.room_type = [];
                $scope.job_roles = response.data.job_roles;
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

    $scope.onDeleteCheckListItem = function(row, item) {
        var index = row.items.indexOf(item);
        if( index >= 0 )
            row.items.splice(index, 1);
    }

    $scope.saveItems = function(row) {
        var request = {};

        request.name_id = row.id;
        request.items = row.items;

        $http({
            method: 'POST',
            url: '/frontend/hskp/postchecklistitems',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.cancelItem(row);
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

    $scope.onSelectJobrole = function($item, $model, $label) {
        console.log($item);
        $scope.type_tags = [];

        var request = $item;
        $http({
            method: 'POST',
            url: '/frontend/hskp/roomtypelist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.room_type = response.data;
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
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


});
