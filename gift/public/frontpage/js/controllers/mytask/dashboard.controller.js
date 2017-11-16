app.controller('MytaskDashboardController', function ($scope, $rootScope,  $httpParamSerializer, $window, $http, $interval, $uibModal, $timeout, AuthService, ImageUtilsService, toaster) {
    var MESSAGE_TITLE = 'Validation';

    $scope.complaint = {};
  
    $scope.dateFilter = 'Today';

    $scope.dateRangeOption = {
        format: 'YYYY-MM-DD',
        startDate: moment().subtract(45,'d').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    };

    $scope.daterange = $scope.dateRangeOption.startDate + ' - ' + $scope.dateRangeOption.endDate;
    $scope.filter = {};

    $scope.filter.category_id = 0;

    var chart_height = ($window.innerHeight - 155) / 2;

    $scope.category_table_body_style = {
            "height": chart_height + 'px'
        };



    $rootScope.fullmode = false;
    $scope.fullScreen = function(fullmode) {
        $rootScope.fullmode = fullmode;
        layoutChartGraph(fullmode);
    }

    function getComplaintCategoryList() {
        $scope.category_list = [];
        var profile = AuthService.GetCredentials();

        var request = {};

        request.dept_id = 0;

        $http({
            method: 'POST',
            url: '/frontend/complaint/categorylist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            $scope.category_list = response.data;
            var alloption = {id: 0, name : '-- All Category --'};
            $scope.category_list.unshift(alloption);               
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    getComplaintCategoryList();

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

    $scope.getTicketStatistics = function() {
        var profile = AuthService.GetCredentials();
        $scope.filter.property_id = profile.property_id;
        $scope.filter.period = $scope.dateFilter;
        $scope.filter.dept_id = profile.dept_id;

        switch($scope.filter.period)
        {
            case 'Today':             
                break;
            case 'Weekly':             
                $scope.filter.during = 7;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Monthly':
                $scope.filter.during = 30;
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Yearly':
                $scope.filter.end_date = moment().format('YYYY-MM-DD');
                break;
            case 'Custom Days':
                $scope.filter.start_date = $scope.daterange.substring(0, '2016-01-01'.length);
                $scope.filter.end_date = $scope.daterange.substring('2016-01-01 - '.length, '2016-01-01 - 2016-01-01'.length);
                var a = moment($scope.filter.start_date);
                var b = moment($scope.filter.end_date);
                $scope.filter.during = b.diff(a, 'days');
                break;
        }

        var param = $httpParamSerializer($scope.filter);

        $scope.loading = true;
        $http.get('/frontend/complaint/mystatistics?' + param)
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
        showSeverityGraph(data);      
        showStatusGraph(data);  
        showGuestTypeGraph(data);
        showCategoryGraph(data);        
    }
    
    ///start dashboard///////
    //servirety
    $scope.severiy_options = {
        chart: {
            type: 'discreteBarChart',
            height: chart_height,
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
                fontSize: 10
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            }
        },
        title: {
            enable: true,
            text: 'Severity',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showSeverityGraph(data) {

        $scope.serveriy_data = [
            {
                key: "Cumulative Return",
                values: [                    
                ]
            }
        ];

        var severity = data.severity;
        var color = ['#23b7e5','#beb411','#ee900a','#FF5722','#f05050'];

        var count = 0;
        for (var key in severity) {
            if( count > color.length )
                count = color.length - 1;
            if (severity.hasOwnProperty(key)) {
                $scope.serveriy_data[0].values.push( {
                    "label" : key ,
                    "value" : Number(severity[key]),
                    color: color[count]
                });
                count++;
            }
        }
    }

    //status
    $scope.status_options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: chart_height,
            margin : {
                top: 0,
                right: 20,
                bottom: 40,
                left: 80
            },
            x: function(d){return d.label;},
            y: function(d){return Math.round(d.value);},
            showControls: false,
            showValues: true,
            showLabels: false,
            duration: 500,
            xAxis: {
                fontSize: 11
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            },            
            //legendPosition: 'bottom',
            stacked: true,
        },

        title: {
            enable: true,
            text: 'Status',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showStatusGraph(data) {
        $scope.status_data = [
            
        ];

        var status = data.status;
        var color = ['#23b7e5', '#9C27B0', '#FF5722', '#3F51B5', '#27c24c'];

        var keys = ['Pending', 'Resolved', 'Acknowledge', 'Unresolved', 'Closed'];

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var row = {};
            row.key = key;
            row.values= [];

            for(var j = 0; j < keys.length; j++)
            {
                if( j == i )
                {
                    row.values.push({
                        "label" : key,
                        "value" : Number(status[key]),
                        color: color[i]
                    });    
                }
                else
                {
                    row.values.push({
                        "label" : key,
                        "value" : 0,
                        color: color[i]
                    });       
                }

            }
            
            $scope.status_data.push(row);
        }
    }

    //Guest_type
    $scope.guest_type_options = {
        chart: {
            type: 'pieChart',
            height: chart_height,
            donut:true,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: false,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        },
        title: {
            enable: true,
            text: 'Guest Type',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showGuestTypeGraph(data) {
        $scope.guest_type_data = [           
        ];

        var guest_type_list = data.guest_type_list;
        for(var i = 0; i < data.guest_type_list.length; i++)
        {
            $scope.guest_type_data.push({
                key: data.guest_type_list[i], 
                y: data.guest_types['gt' + i]
            });
        }
    }

    //servirety
    $scope.category_options = {
        chart: {
            type: 'discreteBarChart',
            height: chart_height,
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
                fontSize: 10
            },
            yAxis: {
                fontSize: 11,
                tickFormat: function(d) {
                    return Math.round(d);
                }
            }
        },
        title: {
            enable: true,
            text: 'Subcomplaint by Category',
            css: {
                color: 'white',
                'font-size': 'small',
                'margin-top': 6
            }
        },
    };

    function showCategoryGraph(data) {

        $scope.category_data = [
            {
                key: "Cumulative Return",
                values: [                    
                ]
            }
        ];

        var subcomplaint_data = data.subcomplaint_data;        

        angular.forEach(subcomplaint_data, function(item) {
            if( !item.category_name )
                item.category_name = 'Unknown';
            
            $scope.category_data[0].values.push( {
                    "label" : item.category_name,
                    "value" : Number(item.cnt),       
                });
        });

        $scope.subcomplaint_list = subcomplaint_data;       
    }

   

    var chart_view_options = [
                                $scope.severiy_options, 
                                $scope.status_options, 
                                $scope.guest_type_options,
                                $scope.category_options,                                
                            ];

    var table_view_style = [
                                $scope.category_table_body_style
                            ];                        

    $scope.expand_flag = [false, false, false, false, false];
    $scope.visible_flag = [true, true, true, true, true];
    $scope.table_view_visible = [false, false, false, false, false];

    $scope.onExpandDashboard = function(num) {
        $scope.expand_flag[num] = !$scope.expand_flag[num];    
        for(var i = 0; i < $scope.expand_flag.length; i++)
        {
            if( $scope.expand_flag[num] == false )
            {
                $scope.visible_flag[i] = true;    
            }
            else
            {
                $scope.visible_flag[i] = i == num;                
            }       
        }

        layoutChartGraph($rootScope.fullmode);
    }

    function layoutChartGraph(fullmode) {
        if( fullmode == true ) 
            chart_height = ($window.innerHeight-120) / 2;
        else
            chart_height = ($window.innerHeight - 155) / 2;
        
        for(var i = 0; i < $scope.expand_flag.length; i++)
        {
            if( i == 0 )
                continue;

            if( $scope.expand_flag[i] )
            {
                if( fullmode == false )    
                    chart_view_options[i - 1].chart.height = $window.innerHeight-152;
                else
                    chart_view_options[i - 1].chart.height = $window.innerHeight-116;
            }
            else
            {
                if( fullmode == false )    
                    chart_view_options[i - 1].chart.height = chart_height;
                else
                    chart_view_options[i - 1].chart.height = chart_height + 3;

                $scope.table_view_visible[i] = false;
            }
        }

        for(var i = 0; i < table_view_style.length; i++)
        {           
             if( fullmode == false )    
                table_view_style[i].height = $window.innerHeight-138;
            else
                table_view_style[i].height = $window.innerHeight-102;            
        }

        $timeout(function() {
            // $scope.getTicketStatistics();
            // $scope.guest_type_api.refresh();
            var chart_api = [
                                $scope.severiy_api, 
                                $scope.status_api, 
                                $scope.guest_type_api,
                                $scope.category_api,                                
                            ];                        

            for(var i = 0; i < chart_api.length; i++)
            {
                chart_api[i].refresh();
            }
        }, 100);
    }

    $scope.onChangeChart = function(num) {
        $timeout(function() {
            // $scope.getTicketStatistics();
            // $scope.guest_type_api.refresh();
            var chart_api = [
                                $scope.severiy_api, 
                                $scope.status_api, 
                                $scope.guest_type_api,
                                $scope.category_api,                                
                            ];                        

            chart_api[num - 1].refresh();

        }, 100);
    }

    $scope.severity_callback = function(scope) {
        console.log(scope.svg);
    }

    $scope.onChangeSubcomplaintCategory = function() {
        $scope.getTicketStatistics();
    }

    var exported_file_name = [
        '',
        'Severity',
        'Status',
        'Guest Type',
        'Subcomplaint by Category',          
    ];

    function generateExportedFileName(num) {        
        var start = '';
        var end = '';
        switch($scope.filter.period)
        {
            case 'Today': 
                start = moment().format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');                
                break;
            case 'Weekly':             
                start = moment().subtract(7, "days").format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');                
                break;
            case 'Monthly':
                start = moment().subtract(30, "days").format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');                
                break;
            case 'Yearly':
                start = moment().subtract(1, "years").format('YYYY-MM-DD');
                end = moment().format('YYYY-MM-DD');                
                break;
            case 'Custom Days':
                start = $scope.filter.start_date;
                end = $scope.filter.end_date;                                
                break;
        }

        var filename = start + '_' + end;

        switch(num) {
            case 4: // Property vs Department
                filename += '_';
                if( $scope.filter.category_id == 0 )
                    filename += 'All Category';
                else
                {
                    for(var i = 0; i < $scope.category_list.length; i++)
                    {
                        if( $scope.filter.category_id == $scope.category_list[i].id)
                        {
                            filename += $scope.category_list[i].name;
                            break;
                        }
                    }
                }
                break;
        }

        return filename;
    }

    $scope.onExportToImage = function(num) {
        var selector = '';
        switch(num)
        {
            case 1:
                selector = '#severity';
                break;                
            case 2:
                selector = '#status';
                break;
            case 3:
                selector = '#guest_type';
                break;                    
            case 4:
                selector = '#category';
                break;                
        }
        var container = jQuery(selector),
        thesvg = container.find('svg');

        var cssStyleText = '';

        cssStyleText = '.tick line{ stroke: #e5e5e5; opacity: 0.2}';
        cssStyleText += 'svg text{ fill: white;}';
        cssStyleText += 'svg{ background-color: #2a2a2a;}';    // panel background color    
        cssStyleText += '.nvd3 .nv-legend text{ font: normal 10px Arial;}';
        cssStyleText += '.nvd3.nv-pie .nv-slice text{ fill: white !important;}';
        cssStyleText += '.nvd3 .nv-discretebar .nv-groups text, .nvd3 .nv-multibarHorizontal .nv-groups text{ fill: rgba(255,255,255,1);stroke: rgba(255,255,255,0);}';
        cssStyleText += '.status-view:hover{ color:#0b2ef4;}';
        cssStyleText += '.nv-background rect{ fill: rgb(42, 42, 42)}';  // for linechart, default is black, so change it with custom color

        var svgString = ImageUtilsService.getSVGString(thesvg[0], cssStyleText);

        var width = $window.innerWidth - 110;
        if( $rootScope.fullmode )
            width = $window.innerWidth - 60;

        var height = chart_view_options[num - 1].chart.height;

        ImageUtilsService.svgString2Image(exported_file_name[num], svgString, width, height, 'png', save ); // passes Blob and filesize String to the callback

        function save( dataBlob, filesize ){
            var filename = exported_file_name[num];

            filename += generateExportedFileName(num);

            filename += '.png';

            saveAs( dataBlob, filename ); // FileSaver.js function
        }
    }   
});
