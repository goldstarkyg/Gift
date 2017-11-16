app.controller('GuestinfoController', function($scope, $rootScope, $http, $window, $uibModal, $timeout, AuthService, toaster) {
    var MESSAGE_TITLE = 'Guest Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
    $scope.box_height = 'height: ' + ($window.innerHeight - 160) + 'px; overflow-y: auto;';
    $scope.tableState = undefined;
    var search_option = '';
    $scope.checkout_states = [
        'All',
        'Checkin',
        'Checkout',
    ];

    $scope.checkout_flag = $scope.checkout_states[0];


    // pip
    $scope.isLoading = false;
    $scope.alarmlist = [];

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };
     var filter = 'Total';
    $scope.onFilter = function getFilter(param) {
        filter = param;
        $scope.getGuestList();
    }

    $scope.getGuestList = function getAlarmList(tableState) {
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
        request.filter = filter;

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.checkout_flag = $scope.checkout_flag;
        request.searchoption = search_option;

        $http({
                method: 'POST',
                url: '/frontend/guestservice/guestlist',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
            .then(function(response) {
                $scope.guestlist = response.data.guestlist;
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

    //confirm SMS after send sms
    $scope.$on('guestdetail', function(event, args) {
        console.log(args);
        for(var i = 0; i < $scope.guestlist .length; i++ )
        {
            if( $scope.guestlist[i].id == args.notify_id)
            {
                //if ack is 2 on first time when connect new guest from opera.
                if($scope.guestlist[i].ack != 2) {
                    $scope.guestlist[i].ack = args.ack;
                }
                break;
            }
        }
    });

    $scope.getDate = function(row) {
        return moment(row.time).format('YYYY-MM-DD');
    }

    $scope.getTime = function(row) {
        return moment(row.time).format('h:mm::ss a');
    }

    $scope.onChangeCheckout = function() {
        $scope.getGuestList();
    }

    $scope.viewDetail = function (guest) {
        var modalInstance = $uibModal.open({
            templateUrl: 'guest_detail.html',
            controller: 'GuestDetailCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                guest: function () {
                    return guest;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.onSwapDatabase = function() {
        var message = {};

        message.title = 'Database swap';
        message.content = 'Do you want to swap database?';

        var modalInstance = $uibModal.open({
            templateUrl: 'confirm_modal.html',
            controller: 'ModalConfirmCtrl',
            resolve: {
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function (ret) {
            if( ret == 'ok' )
            {
                $scope.swapDatabase();
            }
        }, function () {

        });
    }

    $scope.swapDatabase = function() {
        var data = {};

        var profile = AuthService.GetCredentials();
        data.property_id = profile.property_id;

        $rootScope.myPromise = $http({
            method: 'POST',
            url: '/interface/process/databaseswapfromhotlync',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {

                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.searchtext = '';
    $scope.onSearch = function() {
        search_option = $scope.searchtext;
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getGuestList();
    }

    var roomlist = [];

    function getRoomList() {
        var profile = AuthService.GetCredentials();
        $http.get('/list/roomlist?property_id=' + profile.property_id)
            .then(function(response){
                roomlist = response.data;
            });
    }
    getRoomList();

    $scope.onShowManualPosting = function (guest) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/guestservice/modal/manual_posting.html',
            controller: 'ManualPostingCtrl',
            windowClass: 'app-modal-window',
            resolve: {         
                roomlist: function () {
                    return roomlist;
                }       
            }
        });

        modalInstance.result.then(function () {
            
        }, function () {

        });
    };

});

app.controller('GuestDetailCtrl', function($scope, $uibModalInstance, guest, AuthService, $http, toaster) {
    $scope.guest = guest;
    var profile = AuthService.GetCredentials();
    var property_id = profile.property_id;
    $scope.history = {};

    $scope.sendSMS = function () {
        var request = {};
        request = angular.copy(guest);
        request.user_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/sendguestsms',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                if(response.data == '200') {
                    toaster.pop('success', "Send SMS", 'SMS sent to guest successfully.');
                }else {
                    toaster.pop('error', "Send SMS", 'SMS flag option is OFF.' );
                }
                $scope.getSMSHistory();
                console.log(response);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }


    $scope.getSMSHistory = function () {
        var request = {};
        request = angular.copy(guest);
        request.user_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/guestservice/getguestsmshistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.history = response.data.history;
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    }

    $scope.getSMSHistory();

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('ModalConfirmCtrl', function($scope, $uibModalInstance, message) {
    $scope.message = message;
    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('close');
    };
});

app.controller('ManualPostingCtrl', function($scope, $uibModalInstance, $http, AuthService, toaster, roomlist) {
    $scope.guest = {};
    $scope.roomlist = roomlist;
    var profile = AuthService.GetCredentials();

    $scope.pbx_action_type_list = [
        'Checkin',
        'Checkout',
        'Guest Change',
        'Message Lamp',
        'Class Of Service',
        'Do Not Disturb',
    ];

    $scope.pms_action_type_list = [
        'Call Charge',
        'Room Status',        
    ];

    $scope.call_type_list = [
        { id: 0, name: 'Incoming'},
        { id: 1, name: 'Internal'},
        { id: 2, name: 'Missed'},
        { id: 3, name: 'Outgoing'},        
    ];

    $scope.guest.action = 'Checkin';
    $scope.guest.property_id = profile.property_id;
    $scope.guest.call_type = $scope.call_type_list[0].id;

    $scope.onRoomSelect = function ($item, $model, $label) {
        $scope.guest.room_id = $item.id;
    }

    $scope.onPostPBX = function () {
        var request = $scope.guest;
        $http({
            method: 'POST',
            url: '/frontend/guestservice/manualpost',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(function(response) {
            if( response.data.code == 200 )
                toaster.pop('success', 'Manual Posting', response.data.message);
            else
                toaster.pop('erro', 'Manual Posting', response.data.message);

            console.log(response);
        }).catch(function(response) {
            console.error('Gists error', response.status, response.data);
        })
        .finally(function() {
            
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('close');
    };
});
