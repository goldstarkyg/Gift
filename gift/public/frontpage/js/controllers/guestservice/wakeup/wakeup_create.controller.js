app.controller('WakeupCreateController', function ($scope, $rootScope, $http, $interval, $httpParamSerializer, AuthService, GuestService, toaster) {
    var MESSAGE_TITLE = 'Wakeup Create';

    $scope.model = {};
    $scope.selected_room = {};
    $scope.datetime = {};
    $scope.datetime.date = new Date();
    $scope.datetime.time = '';
    $scope.datetime.repeat = false;
    $scope.datetime.until_checkout_flag = false;
    $scope.datetime.repeat_end_date = moment().toDate();
    $scope.datetime.is_date_open = false;

    $scope.init = function(wakeup) {
        $scope.model = wakeup;
    }

    $scope.getRoomList = function(val) {
        if( val == undefined )
            val = "";

        return GuestService.getRoomList(val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };

    $scope.onRoomSelect = function ($item, $model, $label) {
        $scope.selected_room = $item;

        GuestService.getGuestName($item)
            .then(function(response){
                $scope.model = response.data;
                if( $scope.model.checkout_flag != 'checkin' )
                {
                    toaster.pop('error', MESSAGE_TITLE, 'Room not check in on HotLync');
                }
            });

    };

    $scope.loadFilters = function(query, filter_name) {
        var filter = {};

        var profile = AuthService.GetCredentials();

        filter.property_id = profile.property_id;
        filter.filter_name = filter_name;
        filter.filter = query;

        var param = $httpParamSerializer(filter);

        return $http.get('/frontend/report/filterlist?' + param);
    };

    $scope.onChangeRoom = function() {
        console.log($scope.room_tags);
    }

    $scope.$watch('datetime.date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.datetime.time = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
    });

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        if( $view == 'day' )
        {
            var activeDate = moment().subtract('days', 1);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
        else if( $view == 'minute' )
        {
            var activeDate = moment().subtract('minute', 0);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() < activeDate.valueOf())
                    $dates[i].selectable = false;
            }
        }
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datetime.is_date_open = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        dateDisabled: disabled,
        class: 'datepicker'
    };

    function disabled(data) {        
        var date = data.date;
        var sel_date = moment($scope.datetime.time).format('YYYY-MM-DD');
        var disabled = true;
        if( moment(data.date).format('YYYY-MM-DD') > sel_date )
            disabled = false;
        else
            disabled = true;

        mode = data.mode;
        return mode === 'day' && disabled;
    }

    $scope.select = function(date) {
        console.log(date);

        $scope.datetime.is_date_open = false;
    }

    $scope.createWakeupRequest = function(flag) {
        var request = {};

        var profile = AuthService.GetCredentials();

        request.property_id = profile.property_id;
        request.room_id = $scope.selected_room.id;
        request.guest_id = $scope.model.guest_id;
        request.time = $scope.datetime.time;
        request.status = 'Pending';
        request.set_by_id = profile.id;
        request.set_by = profile.first_name + ' ' + profile.last_name;
        request.set_by_id = profile.id;
        request.repeat_flag = $scope.datetime.repeat ? 1 : 0;
        request.until_checkout_flag = $scope.datetime.until_checkout_flag ? 1 : 0;
        request.repeat_end_date = moment($scope.datetime.repeat_end_date).format('YYYY-MM-DD');

        if( !request.room_id )
        {
            toaster.pop('info', MESSAGE_TITLE, 'You did not select room');
            return;
        }

        if( !request.time )
        {
            toaster.pop('info', MESSAGE_TITLE, 'You did not select time');
            return;
        }

        var request_date = moment(request.time).format('YYYY-MM-DD');
        if( request_date < $scope.model.arrival || request_date > $scope.model.departure )
        {
            toaster.pop('info', MESSAGE_TITLE, 'You can select date between ' + $scope.model.arrival + ' and ' + $scope.model.departure);
            return;
        }

        //if( $scope.model.checkout_flag == 'checkout')
        //{
        //    toaster.pop('info', MESSAGE_TITLE, 'You did not select time');
        //    return;
        //}

        $http({
            method: 'POST',
            url: '/frontend/wakeup/create',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);

            if( response.data.code != 200 )
            {
                toaster.pop('error', MESSAGE_TITLE, response.data.message);
                return;
            }

            $scope.$emit('onChangedWakeup', response.data);


            if( flag == 0 ) // Create
            {
                $scope.selected_room = {};
                $scope.model = {};
                $scope.$emit('onCreateFinishedWakeup', 1);      // Guest Request
            }
            if( flag == 1 ) // Create Create & add another for same room
            {
                // refresh quick task list
                $scope.onRoomSelect($scope.selected_room);
            }

            if( flag == 2 ) // Create Create & add another for another room
            {
                $scope.selected_room = {};
                $scope.model = {};
            }

            toaster.pop('success', MESSAGE_TITLE, 'Wakeup call have been successed to create');

            //$scope.datetime.date = new Date();
            $scope.datetime.time = '';
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Wakeup call have been failed to create');
        })
        .finally(function() {

        });

    }

    $scope.cancelWakeupRequest = function() {
        $scope.selected_room = {};
        $scope.model = {};
        $scope.datetime.time = '';
        $scope.datetime.repeat = 0;
    }

});

