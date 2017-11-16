app.controller('MinibarDashboardController', function($scope, $rootScope, $http, $window, $uibModal, $timeout, AuthService, toaster) {
    var MESSAGE_TITLE = 'Guest Page';

    $scope.full_height = 'height: ' + ($window.innerHeight - 45) + 'px; overflow-y: auto;';
    $scope.box_height = 'height: ' + ($window.innerHeight - 130) + 'px; overflow-y: auto;';

    $scope.chart_height = ($window.innerHeight + 300) / 2;

    $scope.fullScreen = function(fullmode) {
        $rootScope.fullmode = fullmode;
        if( fullmode == true ) {
            $scope.chart_height = ($window.innerHeight + 1600) / 2;
        }
        else
        {
            $scope.chart_height = ($window.innerHeight + 200) / 2;
        }
    }

    $scope.loading = false;

    $scope.dateFilter = 'Today';

    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };

    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

    $scope.filter = {};

    $scope.$watch('dateFilter', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        $scope.getMinibarStatistics();
    });

    $scope.$watch('daterange', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        $scope.getMinibarStatistics();
    });

    $scope.getMinibarStatistics = function() {
        var profile = AuthService.GetCredentials();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.period = $scope.dateFilter;
       

        switch($scope.filter.period)
        {
            case 'Weekly':
                $scope.filter.during = 7;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Monthly':
                $scope.filter.during = 30;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Yearly':
                $scope.filter.during = 365;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Custom Days':
                $scope.filter.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
                $scope.filter.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
                var a = moment($scope.filter.start_date);
                var b = moment($scope.filter.end_date);
                $scope.filter.during = b.diff(a, 'days');

                if( $scope.filter.during > 45 )
                {
                    toaster.pop('error', MESSAGE_TITLE, "You cannot select days longer than 45 days");
                    return;
                }
                break;
        }

        $scope.loading = true;
        $http({
            method: 'POST',
            url: '/frontend/minibar/statistics',
            data: $scope.filter,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response.data);
            $scope.showMinibarStatistics(response.data);
        }).catch(function(response) {

            })
            .finally(function() {
                $scope.loading = false;
            });
    }

    //****revenue**//
    $scope.byrevenues_options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: $scope.chart_height,
            margin : {
                top: 0,
                right: 20,
                bottom: 40,
                left: 100
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showControls: false,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                fontSize: 11
            },
            yAxis: {
                tickFormat: function(d){
                    return Math.round(d);
                },
                fontSize: 11
            },
            legend: {
                rightAlign: false,
                margin: {
                    left: 50,
                    top: 5
                }
            },
            //legendPosition: 'bottom',
            stacked: true,
        },

        title: {
            enable: true,
            text: 'Items By Revenue',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    $scope.revenueList = function (datalist) {
        //1. Total Posted(total of the items posted)
        //2. Total Sale(total amount all the items posted)
        //3. Checkout Post(Total count of items that were posted after room checkout)
        //4. Lost Posting (Total amount of items posted after checkout)
        var posted = [], sale = [], checkout = [], posting = [];
        var count = 0;
        for(var key in datalist) {
            count++;
            if(count > 20) break;
            var obj = datalist[key];
            posted.push({label: key, value: Math.round(Number(obj.posted))});
            sale.push({label: key, value: Math.round(Number(obj.sale))});
            checkout.push({label: key, value: Math.round(Number(obj.checkout))});
            posting.push({label: key, value: Math.round(Number(obj.posting))});
        }

        $scope.byrevenues_data = [
            {
                "key": "Total Posted",
                "color": "#b535bd",
                "values": posted
            },
            {
                "key": "Total Sale",
                "color": "#6254b2",
                "values": sale
            },
            {
                "key": "Checkout",
                "color": "#27c24c",
                "values": checkout
            },
            {
                "key": "Lost Posting",
                "color": "#27c0c2",
                "values": posting
            }];
    };

    //****//
    $scope.byuser_options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: $scope.chart_height,
            margin : {
                top: 0,
                right: 20,
                bottom: 40,
                left: 100
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showControls: false,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false,
                fontSize: 11
            },
            yAxis: {
                tickFormat: function(d){
                    return Math.round(d);
                },
                fontSize: 11
            },
            legend: {
                rightAlign: false,
                margin: {
                    left: 50,
                    top: 5
                }
            },
            //legendPosition: 'bottom',
            stacked: true,
        },

        title: {
            enable: true,
            text: 'Items By User',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    $scope.userList = function (datalist) {
        //1. Total Posted(total of the items posted)
        //2. Total Sale(total amount all the items posted)
        //3. Checkout Post(Total count of items that were posted after room checkout)
        //4. Lost Posting (Total amount of items posted after checkout)
        var posted = [], sale = [], checkout = [], posting = [];
        var count = 0;
        for(var key in datalist) {
            count++;
            if(count > 10) break;
            var obj = datalist[key];
            posted.push({label: key, value: Math.round(Number(obj.posted))});
            sale.push({label: key, value: Math.round(Number(obj.sale))});
            checkout.push({label: key, value: Math.round(Number(obj.checkout))});
            posting.push({label: key, value: Math.round(Number(obj.posting))});
        }

        $scope.byuser_data = [
            {
                "key": "Total Posted",
                "color": "#b535bd",
                "values": posted
            },
            {
                "key": "Total Sale",
                "color": "#6254b2",
                "values": sale
            },
            {
                "key": "Checkout",
                "color": "#27c24c",
                "values": checkout
            },
            {
                "key": "Lost Posting",
                "color": "#27c0c2",
                "values": posting
            }];
    };
    //////
        $scope.showMinibarStatistics = function(data)
    {
        $scope.revenueList(data.by_revenue_count);
        $scope.userList(data.by_user_count);
        $scope.total_posted = data.total_posted;
        $scope.total_sale = data.total_sale;
        $scope.total_checkout = data.total_checkout;
        $scope.total_posting = data.total_posting;
    }

    $scope.getMinibarStatistics();

    

});