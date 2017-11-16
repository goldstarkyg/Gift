app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
}]);

app.controller('CallloggerDashboardController', function($scope, $rootScope, $http, $state, $httpParamSerializer, $window, AuthService, toaster, $timeout, $uibModal, $timeout, toaster, $interval) {
    var MESSAGE_TITLE = 'Guest Service Dashboard';

    //$scope.full_height = 'height: ' + ($window.innerHeight - 50) + 'px; overflow-y: auto;';
    //$scope.box_height = 'height: ' + ($window.innerHeight - 130) + 'px; overflow-y: auto;';
    $scope.box_height1 = 'height: ' + ($window.innerHeight - 70) + 'px; overflow-y: auto;';

    $scope.two_height = ($window.innerHeight - 55 - 52 - 4 - 109 - 10 - 10) / 2;
    $scope.three_height = ($window.innerHeight - 55 - 52 - 4 - 109 - 10 - 20) / 3;

    $scope.table_body_style = {
            "height": ($scope.two_height) + 'px'
        };
    
    $scope.d1_1 = [[1,1]];
    $scope.d1_2 = [[1,1]];
    $scope.d1_3 = [[1,1]];

    var average_time = [[1,1]];
    var call_count = [[1,1]];

    $scope.xaxis = {font: { color: '#ccc' }};
    $scope.yaxis = {font: { color: '#ccc' }};

    $scope.loading = true;

    $scope.avg_time_answer = [{ data: average_time, label: 'Gouresh1', points: { show: true, radius: 6}, lines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 } }];
    $scope.total_call_account = [{ data: call_count, label: 'Gouresh1', points: { show: true, radius: 6}, lines: { show: true, tension: 0.45, lineWidth: 3, fill: 0 } }];

    $rootScope.fullmode = false;

    $scope.fullScreen = function(fullmode) {
        $rootScope.fullmode = fullmode;
        if( fullmode == true ) {
            $scope.two_height = ($window.innerHeight - 52 - 4 - 109 - 10 - 10) / 2;
            $scope.three_height = ($window.innerHeight - 52 - 4 - 109 - 10 - 20) / 3;
        }
        else
        {
            $scope.two_height = ($window.innerHeight - 55 - 52 - 4 - 109 - 10 - 10) / 2;
            $scope.three_height = ($window.innerHeight - 55 - 52 - 4 - 109 - 10 - 20) / 3;
        }

        //$('.nv-legend').attr('transform', 'translate(80px, 280px)');
        //$('.nv-legendWrap').attr('transform', 'translate(10,270)');

        $scope.call_status_options.chart.height = $scope.two_height - 20;
        $scope.agent_status_options.chart.height = $scope.two_height - 20;
        $scope.hourly_options.chart.height = $scope.two_height - 20;
        $scope.call_success_options.chart.height = $scope.three_height - 20;
        $scope.call_type_options.chart.height = $scope.three_height - 20;
        $scope.call_classify_options.chart.height = $scope.three_height - 20;

        $scope.table_body_style = {
            "height": ($scope.two_height) + 'px'
        };

        //$scope.getTicketStatistics();

    }
    $scope.onEnterCallModule = function() {
        //var agentstatus = {};
        //var profile = AuthService.GetCredentials();
        //agentstatus.agent_id = profile.id;
        //agentstatus.status = 'Online';
        //    $http({
        //        method: 'POST',
        //        url: '/frontend/call/changestatus',
        //        data: agentstatus,
        //        headers: {'Content-Type': 'application/json; charset=utf-8'}
        //    })
        //        .then(function(response) {
        //            //$rootScope.agent_status.status = response.data.status;
        //            //$rootScope.agent_status.created_at = response.data.created_at;
        //              $window.document.title = 'HotLync | Ennovatech';
        //        }).catch(function(response) {
        //            console.error('Gists error', response.status, response.data);
        //        })
        //        .finally(function() {
        //            $scope.isLoading = false;
        //        });
    }

    $scope.$watch('dateFilter', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        $scope.getTicketStatistics();
    });

    $scope.$watch('daterange', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        $scope.getTicketStatistics();
    });

    //$scope.timer = $interval(function() {
    //    $scope.getTicketStatistics();
    //}, 1000*1);

    //$scope.timer = $interval(function() {
    //    $window.location.reload();
    //}, 1000*60*30);



    $scope.$on('$destroy', function() {
        if ($scope.timer != undefined) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    });

    $scope.dateFilter = 'Today';

    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };

    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;

    $scope.filter = {};

    $scope.getTicketStatistics = function() {
        var profile = AuthService.GetCredentials();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.period = $scope.dateFilter;

        switch($scope.filter.period)
        {
            case 'Today':
                $scope.xaxis.ticks = [];
                for(var i = 0; i < 12; i++) {
                    var time = sprintf('%02d:00', i * 2);
                    $scope.xaxis.ticks.push([i, time]);
                }
                break;
            case 'Weekly':
                $scope.xaxis.ticks = [];
                for(var i = 0; i < 7; i++) {
                    var time = moment().subtract(6-i,'d').format('dddd');
                    $scope.xaxis.ticks.push([i, time]);
                }
                $scope.filter.during = 7;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Monthly':
                $scope.xaxis.ticks = [];
                for(var i = 0; i < 30; i++) {
                    var time = moment().subtract(29-i,'d').format('MM-DD');
                    $scope.xaxis.ticks.push([i, time]);
                }

                $scope.filter.during = 30;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Yearly':
                $scope.xaxis.ticks = [];
                for(var i = 0; i < 12; i++) {
                    var time = moment().subtract(11-i,'month').format('YYYY-MM');
                    $scope.xaxis.ticks.push([i, time]);
                }

                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Custom Days':
                $scope.filter.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
                $scope.filter.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
                var a = moment($scope.filter.start_date);
                var b = moment($scope.filter.end_date);
                $scope.filter.during = b.diff(a, 'days');

                $scope.xaxis.ticks = [];
                for(var i = 0; i < $scope.filter.during; i++) {
                    var time = moment().subtract($scope.filter.during - 1 - i,'d').format('MM-DD');
                    $scope.xaxis.ticks.push([i, time]);
                }

                if( $scope.filter.during > 45 )
                {
                    toaster.pop('error', MESSAGE_TITLE, "You cannot select days longer than 45 days");
                    return;
                }
                break;
        }

        var param = $httpParamSerializer($scope.filter);

        $scope.loading = true;
        $http.get('/frontend/call/statistics?' + param)
            .then(function(response) {
                console.log(response.data);

                $scope.showStatistics(response.data);

            }).catch(function(response) {

            })
            .finally(function() {
                $scope.loading = false;
            });
    }

    $scope.getTicketStatistics();

    $scope.showStatistics = function(data) {
        $scope.total_queue_count = data.total_queue_count;
        $scope.total_answered_count = data.total_answered_count;
        $scope.total_abandoned_count = data.total_abandoned_count;
        $scope.total_count = data.total_count;
        $scope.total_callback_count = data.total_callback_count;
		$scope.total_missed_count = data.total_missed_count;
        $scope.total_follow_count = data.total_follow_count;

        $scope.datalist = data.agent_list;

        showCallStatisticsGraph(data.agent_list);
        showAgentStatisticsGraph(data.agent_list);
        showHourlyStatistics(data.hourly_statistics, data.agent_list);
        showSuccessStatistics(data.by_call_type);
        showCalltypeStatistics(data.by_call_type);
        showClassifyTypeStatistics(data.by_classify_type);
        //showRepeatStatistics(data.new_calls, data.repeat_calls);
    }

    $scope.statusIcon = function (val) {
        var style = '';
        if(val == 'Online') style = '<i class="icon-power"></i>&nbsp;&nbsp;Online';
        return style;
    }

    $scope.getDuration = function(row) {
        return 0 + moment.utc(moment().diff(moment(row.created_at,"YYYY-MM-DD HH:mm:ss")));
    }

    $scope.onDownloadPDF = function() {
        html2canvas($('.stretch'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL("image/png");
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 800,
                    }],
                    pageSize: 'A4',
                    pageOrientation: 'landscape',
                    pageMargins: [ 10, 10, 10, 10 ],
                };

                var filename = 'Call Center Dashboard ' + moment().format('YYYY-MM-DD') + '.pdf';
                pdfMake.createPdf(docDefinition).download(filename);
            }
        });
    }

    $scope.$on('call_event', function(event, args) {
        console.log(args);
        $scope.getTicketStatistics();
    });

    $scope.$on('agent_status_change', function(event, args) {
        console.log(args);
        $scope.getTicketStatistics();
    });

    $scope.$on('callback_event', function(event, args) {
        console.log(args);
        if( !(args.user_id > 0) )
            $scope.getTicketStatistics();
    });

    function getTicks(max, count) {
        // calculate x-axis
        var base_scale = 10;
        var scale = [];
        for(var i = 0; i < 10; i++)
        {
            for(var j = 1; j < 10; j++)
            {
                scale.push(base_scale * j);
            }
            base_scale *= 10;
        }

        var start = 10;
        for( var i = 1; i < scale.length; i++)
        {
            if( scale[i] > max ) {
                start = scale[i];
                break;
            }
        }

        var xticks = [];
        start = start / 5;
        for(var i = 0; i < count; i++ )
        {
            xticks.push(String(start * i));
        }

        return xticks;
    }

    $scope.call_status_options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: $scope.two_height - 20,
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
                },
                fontSize: 7
            },
            legendPosition: 'bottom',
            stacked: true,
        },

        title: {
            enable: true,
            text: 'Call Statistics',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showCallStatisticsGraph(datalist) {


        var answered = [];
        var abandoned = [];
        var callback = [];

        for(var i = 0 ; i < datalist.length; i++)
        {
            answered.push({label: datalist[i].agent, value: Number(datalist[i].answered)});
            abandoned.push({label: datalist[i].agent, value: Number(datalist[i].abandoned)});
            callback.push({label: datalist[i].agent, value: Number(datalist[i].callback)});
        }

        $scope.call_status_data = [
            {
                "key": "Answered",
                "color": "#27c24c",
                "values": answered
            },
            {
                "key": "Abandoned",
                "color": "#f05050",
                "values": abandoned
            },
            {
                "key": "Callback",
                "color": "#F89406",
                "values": callback
            },
        ]
    }

    $scope.agent_status_options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: $scope.two_height - 20,
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
            text: 'Agent Statistics',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showAgentStatisticsGraph(datalist) {


        var online = [];
        var available = [];
        var on_break = [];
        var busy = [];
        var idle = [];
        var wrapup = [] ;

        for(var i = 0 ; i < datalist.length; i++)
        {
            var gap1 = 0, gap2 = 0, gap3 = 0, gap4 = 0, gap5 = 0, gap6 = 0;

            var elapse_time = 0 + moment.utc(moment().diff(moment(datalist[i].created_at,"YYYY-MM-DD HH:mm:ss")));
            elapse_time = elapse_time / 1000;

            if( datalist[i].status == 'Online')
                gap1 = elapse_time;
            if( datalist[i].status == 'Available')
                gap2 = elapse_time;
            if( datalist[i].status == 'On Break')
                gap3 = elapse_time;
            if( datalist[i].status == 'Busy')
                gap4 = elapse_time;
            if( datalist[i].status == 'Idle')
                gap5 = elapse_time;
            if( datalist[i].status == 'Wrapup')
                gap6 = elapse_time;

            online.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].online) + gap1) / 60)});
            available.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].available) + gap2) / 60)});
            on_break.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].on_break) + gap3) / 60)});
            busy.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].busy) + gap4) / 60)});
            idle.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].idle) + gap5) / 60)});
            wrapup.push({label: datalist[i].agent, value: Math.round((Number(datalist[i].wrapup) + gap6) / 60)});
        }

        $scope.agent_status_data = [
            {
                "key": "Online",
                "color": "#23b7e5",
                "values": online
            },
            {
                "key": "Avaliable",
                "color": "#27c24c",
                "values": available
            },
            {
                "key": "On Break",
                "color": "#6254b2",
                "values": on_break
            },
            {
                "key": "Busy",
                "color": "#f05050",
                "values": busy
            },
            {
                "key": "Idle",
                "color": "#f89406",
                "values": idle
            },
            {
                "key": "Wrapup",
                "color": "#beb411",
                "values": wrapup
            },
        ]
    }

    $scope.hourly_options = {
        chart: {
            type: 'lineChart',
            height: $scope.two_height - 20,
            margin : {
                top: 5,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            xAxis: {
                ticks: [24],

            },
            yAxis: {
                ticks: [5],
                tickFormat: function(d) {
                    return Math.round(d);
                }
            },
            //forceY: value_max,
            legend: {
                rightAlign: false,
                margin: {
                    left: 50,
                    top: 10
                }
            },
            //legendPosition: 'bottom',
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            callback: function(chart){
                console.log("!!! lineChart callback !!!");
            },
            legendPosition: 'bottom',
        },
        title: {
            enable: true,
            text: 'Calls',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showHourlyStatistics(datalist, agentlist) {
        var scale = 0;
        for(var i = 0; i < agentlist.length; i++)
        {
            var sec = moment.duration(agentlist[i].avg_time, "HH:mm:ss: A").asSeconds();
            scale += sec;
        }

        if( agentlist.length > 0 )
            scale /= agentlist.length;

        if( scale < 1 )
            scale = 4;

        var max = 0;

        var answered = [];
        var abandoned = [];
        var missed = [];
        var tta = [];
        var waiting = [];

        for(var i = 0; i < datalist.calls.length; i++ )
        {
            answered.push({x:i, y:Number(datalist.answered[i])});
            abandoned.push({x:i, y:Number(datalist.abandoned[i])});
            missed.push({x:i, y:Number(datalist.missed[i])});
            tta.push({x:i, y:Number(datalist.tta[i]) / scale});
            waiting.push({x:i, y:Number(datalist.waiting[i]) / scale});

            if( answered[i].y > max ) max = answered[i].y;
            if( abandoned[i].y > max ) max = abandoned[i].y;
            if( missed[i].y > max ) max = missed[i].y;
            if( tta[i].y > max ) max = tta[i].y;
            if( waiting[i].y > max ) max = waiting[i].y;
        }

        var value_max = (Math.round(max / 10) + 1) * 10;

        $scope.hourly_data = [
            {
                values: answered,
                key: 'Answered',
                color: '#27c24c',
            },
            {
                values: abandoned,
                key: 'Abandoned',
                color: '#F44336',
            },
            {
                values: missed,
                key: 'Missed',
                color: '#FF9100',
            },
            {
                values: tta,
                key: 'TTA',
                color: '#23b7e5',
            },
            {
                values: waiting,
                key: 'Waiting',
                color: '#7266ba',
            },

        ];


    }

    $scope.call_success_options = {
        chart: {
            type: 'discreteBarChart',
            height: $scope.three_height - 20,
            margin : {
                top: 20,
                right: 20,
                bottom: 14,
                left: 30
            },
            x: function(d){return d.label;},
            y: function(d){return Math.round(d.value);},
            showValues: true,
            valueFormat: function(d){
                return Math.round(d);
            },
            duration: 500,
            xAxis: {
                fontSize: 8
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            },
        },
        title: {
            enable: true,
            text: 'Call Stats',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };


    function showSuccessStatistics(datalist) {

        $scope.call_success_data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "Abandoned" ,
                        "value" : $scope.total_abandoned_count,
                        color: '#F44336',
                    } ,
                    {
                        "label" : "Answered" ,
                        "value" : $scope.total_answered_count,
                        color: '#4CAF50',
                    } ,
                    {
                        "label" : "Missed" ,
                        "value" : $scope.total_missed_count,
                        color: '#FF9100',
                    } ,
                    {
                        "label" : "Call Back" ,
                        "value" : $scope.total_callback_count,
                        color: '#FFEA00',
                    } ,
                ]
            }
        ]
    }

    $scope.call_type_options = {
        chart: {
            type: 'discreteBarChart',
            height: $scope.three_height - 20,
            margin : {
                top: 20,
                right: 20,
                bottom: 14,
                left: 30
            },
            x: function(d){return d.label;},
            y: function(d){return Math.round(d.value);},
            showValues: true,
            valueFormat: function(d){
                return Math.round(d);
            },
            duration: 500,
            xAxis: {
                fontSize: 8
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            },
        },
        title: {
            enable: true,
            text: 'Call Type',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showCalltypeStatistics(datalist) {


        $scope.call_type_data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "Local" ,
                        "value" : Number(datalist.local),
                        color: '#9C27B0',
                    } ,
                    {
                        "label" : "Mobile" ,
                        "value" : Number(datalist.mobile),
                        color: '#3F51B5',
                    } ,
                    {
                        "label" : "Internal" ,
                        "value" : Number(datalist.internal),
                        color: '#FF5722',
                    } ,
                    {
                        "label" : "International" ,
                        "value" : Number(datalist.international),
                        color: '#009688',
                    } ,
                    {
                        "label" : "National" ,
                        "value" : Number(datalist.national),
                        color: '#ee900a',
                    } ,
                ]
            }
        ]
    }

    $scope.call_classify_options = {
        chart: {
            type: 'discreteBarChart',
            height: $scope.three_height - 20,
            margin : {
                top: 20,
                right: 20,
                bottom: 14,
                left: 30
            },
            x: function(d){return d.label;},
            y: function(d){return Math.round(d.value);},
            showValues: true,
            valueFormat: function(d){
                return Math.round(d);
            },
            duration: 500,
            xAxis: {
                fontSize: 8
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            },
        },
        title: {
            enable: true,
            text: 'Type',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showClassifyTypeStatistics(datalist) {


        $scope.call_classify_data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "Booking" ,
                        "value" : Number(datalist.booking),
                        color: '#9C27B0',
                    } ,
                    {
                        "label" : "Inquiry" ,
                        "value" : Number(datalist.inquiry),
                        color: '#3F51B5',
                    } ,
                    {
                        "label" : "Other" ,
                        "value" : Number(datalist.other),
                        color: '#FF5722',
                    } ,
                    {
                        "label" : "Followup" ,
                        "value" : Number(datalist.followup),
                        color: '#009688',
                    } ,
                ]
            }
        ]
    }

    function showRepeatStatistics(new_calls, repeat_calls) {
        var s11 = [Number(repeat_calls), Number(new_calls)];
        $scope.calls2_count = s11;
        var xticks = ['Repeat', 'New'];
        var max = s11[0] > s11[1] ? s11[0] : s11[1];
        var yticks = getTicks(max, 5);
        var series_array = [{ label:'Answered'}, { label:"Abandoned"}, { label:"Call Back"}];
        $scope.calls2_option = {
            //title:'Calls',
			title:{
				text:"Calls",
				fontSize: 12,
			},
            stackSeries: true,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                shadowAngle: 135,
                rendererOptions: {
                    highlightMouseDown: true,
                    barWidth: 25,
                },
                pointLabels: {show: true, formatString: '%d'}
            },
            grid: {
                drawGridLines: true,
                gridLineColor: '#6b6a6a',
                background: '#2a2a2a',
                borderColor: '#595959'
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    ticks:  xticks,
                },
                yaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks:  yticks,
                    tickOptions:{
                        showGridline: false,
                        textColor: '#ffffff'
                    },
                },
            },
            seriesColors: [ "#9C27B0", "#3F51B5" ],
            series: series_array,

        };
    }

    $scope.onChangeCallStatusLogOut = function(row) {
        var agentstatus = {};
        var profile = AuthService.GetCredentials();
        agentstatus.agent_id = row.user_id;
        agentstatus.status = "Log out";
        agentstatus.extension = row.extension;
        agentstatus.property_id = profile.property_id;
            $http({
                method: 'POST',
                url: '/frontend/call/changestatus',
                data: agentstatus,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function(response) {
                    toaster.pop('success', MESSAGE_TITLE, 'Agent status has been Log Out successfully');
                    row.status = 'Log out';
                    console.log(response);
                }).catch(function(response) {
                    toaster.pop('error', MESSAGE_TITLE, 'Failed to add Agent status');
                    console.error('Log Out status error', response.status, response.data);
                })
                .finally(function() {

                });

    }

});
