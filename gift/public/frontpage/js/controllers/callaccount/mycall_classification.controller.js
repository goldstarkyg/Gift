app.controller('MycallClassificationController', function ($scope, $rootScope, $http, $timeout, $uibModal, $window, $interval, toaster, AuthService) {
    var MESSAGE_TITLE = 'My Task';

    $scope.$watch('vm.daterange', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

         $scope.getDataList();
    });


    $scope.tableState = undefined;

    // pip
    $scope.isLoading = false;
    $scope.datalist = [];
    $scope.filter = {};
    var search_option = '';

    $scope.cur_date = new Date();
    $scope.filter.call_date = moment().format('YYYY-MM-DD');
    $scope.filter.total_selected = false;

    $scope.calltypes = [
        'All',
        'Internal',
        'Received',
        'Local',
        'Mobile',
        'National',
        'International',
    ];

    $scope.call_filter = {};
    for( var i = 0; i < $scope.calltypes.length; i++)
        $scope.call_filter[$scope.calltypes[i]] = true;

    $scope.classify_filter_types = [
        'All',
        'Business',
        'Personal',
        'Unclassified',
       // 'No Classify'
    ];

    $scope.classify_types = [
        'Business',
        'Personal',
        'Unclassified',
       // 'No Classify',
    ];

    $scope.classify_filter = {};

    for( var i = 0; i < $scope.classify_filter_types.length; i++) {
     if(i==3 || i==1)   $scope.classify_filter[$scope.classify_filter_types[i]] = true;
    }

    $scope.approve_states = [
        'All',
       // 'No Approval',
        'Unclassified',
        'Waiting For Approval',
        'Approved',
        'Returned',
       // 'Rejected',
        'Pre-Approved',
        'Closed'
    ];

    $scope.approve_filter = {};
    for( var i = 0; i < $scope.approve_states.length; i++){
      if(i==1 || i==2 || i==4)  $scope.approve_filter[$scope.approve_states[i]] = true;
    }


    $scope.filter.search = "";
    $scope.filter.extensions = [];


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

    $scope.refreshTickets = function(){
        for( var i = 0; i < $scope.classify_filter_types.length; i++) {
            if(i==3 || i==1)   $scope.classify_filter[$scope.classify_filter_types[i]] = true;
            else $scope.classify_filter[$scope.classify_filter_types[i]] = false;
        }
        for( var i = 0; i < $scope.approve_states.length; i++){
            if(i==1 || i==2 || i==4)   $scope.approve_filter[$scope.approve_states[i]] = true;
           // if(i==5)   $scope.approve_filter[$scope.approve_states[i]] = true;
            else $scope.approve_filter[$scope.approve_states[i]] = false;
        }
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();
    }

    $scope.onFilterShort = function(val){
        if(val == 'Personal') {
            for( var i = 0; i < $scope.classify_filter_types.length; i++) {
                if(i==2)   $scope.classify_filter[$scope.classify_filter_types[i]] = true;
                else $scope.classify_filter[$scope.classify_filter_types[i]] = false;
            }

            for( var i = 0; i < $scope.approve_states.length; i++){
                  $scope.approve_filter[$scope.approve_states[i]] = true;
            }
        }
        if(val == 'Approved' || val == 'Waiting For Approval' || val == 'Returned' || val == 'Closed') {
            for( var i = 0; i < $scope.approve_states.length; i++){
                if($scope.approve_states[i]==val)   
                    $scope.approve_filter[$scope.approve_states[i]] = true;
                else   
                    $scope.approve_filter[$scope.approve_states[i]] = false;
            }

            for( var i = 0; i < $scope.classify_filter_types.length; i++) {
                 $scope.classify_filter[$scope.classify_filter_types[i]] = true;
            }
        }
        
        if(val == 'Total') {
            for( var i = 0; i < $scope.classify_filter_types.length; i++) {
                 $scope.classify_filter[$scope.classify_filter_types[i]] = true;
            }
            for( var i = 0; i < $scope.approve_states.length; i++){
                  $scope.approve_filter[$scope.approve_states[i]] = true;
            }
        }
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();
    }

    //  pagination
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 30,
        sort: 'desc',
        field: 'id',
        totalItems: 0,
        numberOfPages : 1,
        countOfPages: 1
    };

    $scope.myDatetimeRange =
    {
        date: {
            from: moment().subtract(6, "months"), // start date ( Date object )
            to: moment() // end date ( Date object )
        },
        time: {
            from: 0, // default start time (in minutes)
            to: 24 * 60, // default end time (in minutes)
            step: 15, // step width
            minRange: 15, // min range
            hours24: false // true = 00:00:00 | false = 00:00 am/pm
        },
        "hasDatePickers": true,
        "hasTimeSliders": true
    }
    $scope.myDatetimeLabels =
    {
        date: {
            from: 'Start date',
            to: 'End date'
        }
    }

    $scope.time_range = '';

    $scope.$watch('myDatetimeRange.date.from', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
        $scope.getDataList();
    });
    $scope.$watch('myDatetimeRange.date.to', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
        $scope.getDataList();
    });
    $scope.$watch('myDatetimeRange.time.from', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
        $scope.getDataList();
    });
    $scope.$watch('myDatetimeRange.time.to', function(newValue, oldValue) {
        if (newValue === oldValue)
            return;
        $scope.getTimeRange();
        $scope.getDataList();
    });

    $scope.getTimeRange = function() {
        var start_time = moment($scope.myDatetimeRange.date.from)
            .set({
                'hour' : 0,
                'minute'  : 0,
                'second' : 0
            })
            .add('minute', $scope.myDatetimeRange.time.from)
            .format('YYYY-MM-DD HH:mm:ss');

        var end_time = moment($scope.myDatetimeRange.date.to)
            .set({
                'hour' : 0,
                'minute'  : 0,
                'second' : 0
            })
            .add('minute', $scope.myDatetimeRange.time.to)
            .format('YYYY-MM-DD HH:mm:ss');

        $scope.start_time = start_time;
        $scope.end_time = end_time;
        $scope.time_range = start_time + ' - ' + end_time;
    }

    $scope.getTimeRange();

    getExtensionList();
    getDestinationList();

    $scope.subcount = {};
    $scope.subcount.unmarked = 0;
    $scope.subcount.rejected = 0;
    $scope.subcount.awaiting = 0;
    $scope.subcount.approved = 0;
    $scope.subcount.personal = 0;
    $scope.subcount.business = 0;

    $scope.getDataList = function(tableState) {
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
        request.search = $scope.filter.search;
        request.start_time = $scope.start_time;
        request.end_time = $scope.end_time;
        request.searchoption = search_option;
        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;

        request.call_type = [];
        for (var key in $scope.call_filter) {
            if( $scope.call_filter[key] == true && key != 'All' ) {
                request.call_type.push(key);
            }
        }
        if( request.call_type.length < 6) 
            $scope.calltypecolor = '#f2a30a';
        else 
            $scope.calltypecolor = '#fff';

        request.extensions = [];
        for(var i = 0; i < $scope.filter.extensions.length; i++) {
            if ($scope.filter.extensions[i].selected == true)
                request.extensions.push($scope.filter.extensions[i].id);
        }
        if($scope.filter.extensions.length != request.extensions.length )
            $scope.extensioncolor = '#f2a30a';
        else
            $scope.extensioncolor = '#fff';


        request.classify = [];
        for (var key in $scope.classify_filter) {
            if( $scope.classify_filter[key] == true && key != 'All' ) {
                request.classify.push(key);
            }
        }
        if( request.classify.length < 3) 
            $scope.classifycolor = '#f2a30a';
        else 
            $scope.classifycolor = '#fff';

        request.approval = [];
        for (var key in $scope.approve_filter) {
            if( $scope.approve_filter[key] == true && key != 'All' ) {
                if($scope.approve_filter['All'] == true && $scope.approve_filter[key] == true && key == 'No Approval')
                                continue;
                request.approval.push(key);
            }
        }
        if( request.approval.length < 6) 
            $scope.approvalcolor = '#f2a30a';
        else 
            $scope.approvalcolor = '#fff';


        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;
        request.agent_id = profile.id;
        request.data_flag = 1;

        $scope.datalist = [];

        // only get data
        $http({
            method: 'POST',
            url: '/frontend/callaccount/myadmincall',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.datalist = response.data.datalist;
                
                for(var i = 0; i < $scope.datalist.length; i++) {
                    $scope.datalist[i].classify_temp = $scope.datalist[i].classify + '';
                    $scope.datalist[i].approval_temp = $scope.datalist[i].approval + '';
                    $scope.datalist[i].selected = false;
                    if($scope.datalist[i].classify != 'Unclassified') $scope.datalist[i].classifyhide = true;
                    else $scope.datalist[i].classifyhide = false;
                }

                $scope.filter.total_selected = false;
                $scope.filter.classify_temp = 'Unclassified';
                $scope.selected_count = 0;

                console.log(response);
                console.log(response.data.time);
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
                $scope.isLoading = false;
            });

        // only get count    

        var count_request = angular.copy(request);
        count_request.data_flag = 0;

        $http({
            method: 'POST',
            url: '/frontend/callaccount/myadmincall',
            data: count_request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {               
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

                console.log('count time: ' + response.data.time);                
            }).catch(function(response) {
                console.error('Gists error', response.status, response.data);
            })
            .finally(function() {
            });    
    };

    $scope.onChangeClassifyView = function (ticket) {
        ticket.classifyhide = false;
    }
    $scope.onChangeExtension = function(exten) {
        if( exten.extension == 'All' )
        {
            if($scope.filter.extensions[0].selected == false ) {
                for(var i = 1; i < $scope.filter.extensions.length; i++) {
                    $scope.filter.extensions[i].selected = false;
                }
            }else {
                for(var i = 1; i < $scope.filter.extensions.length; i++) {
                    $scope.filter.extensions[i].selected = true;
                }
            }
        }
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();
    }

    $scope.onChangeSelected = function() {
        var selected_count = 0;
        for(var i = 0; i < $scope.datalist.length; i++) {
            if( $scope.datalist[i].selected )
                selected_count++;
        }

        $scope.selected_count = selected_count;
    }

    $scope.onChangeTotalSelected = function() {
        for(var i = 0; i < $scope.datalist.length; i++) {
            $scope.datalist[i].selected = $scope.filter.total_selected;
        }

        $scope.onChangeSelected();
    }

    $scope.onChangeClassify = function(row) {
        if( row.classify_temp == 'Business' )
        {
            var size = '';
            var modalInstance = $uibModal.open({
                templateUrl: 'classifyReasonModal.html',
                controller: 'ClassifyReasonController',
                size: size,
                resolve: {
                    call: function () {
                        return row;
                    }
                }
            });

            modalInstance.result.then(function (comment) {
                if( comment == undefined || comment.length < 1 )
                {
                    toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                    return;
                }

                row.comment = comment;
                $scope.sendApproval();
            }, function () {

            });
        }else  if( row.classify_temp == 'Personal' ){
            $scope.sendApproval();
        }
    }

     

    $scope.sendApproval = function() {
        var request = {};

        request.calls = [];

        var profile = AuthService.GetCredentials();

        for(var i = 0; i < $scope.datalist.length; i++ )
        {
            var call = $scope.datalist[i];
            if( call.classify == call.classify_temp && call.approval == call.approval_temp )
                continue;

            var data = {};
            data.id = call.id;
            data.submitter = profile.id;
            data.classify = call.classify_temp;
            if( data.classify == 'Business' ) {
                data.comment = call.comment;
                data.approval = 'Waiting For Approval';
            }
            else {
                data.comment = '';
                data.approval = 'Closed';
            }
            request.calls.push(data);
        }

        $http({
            method: 'POST',
            url: '/frontend/callaccount/submitapproval',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                $scope.getDataList();
                $scope.$emit('refreshCall', '');
            }).catch(function(response) {

            })
            .finally(function() {

            });
    }

    $scope.sendFinance = function() {

    }

    $scope.onClickApproval = function(row) {
        if( row.approval == 'Returned')
        {
            var size = 'lg';
            var modalInstance = $uibModal.open({
                templateUrl: 'returnReplyModal.html',
                controller: 'ReturnReplyController',
                size: size,
                resolve: {
                    call: function () {
                        return row;
                    }
                }
            });

            modalInstance.result.then(function (comment) {
                if( comment.comment_content == undefined || comment.comment_content.length < 1 )
                {
                    toaster.pop('error', MESSAGE_TITLE, 'Please set reason' );
                    return;
                }

                row.comment = comment.comment_content;
                row.classify = comment.classify_temp;
                if(row.classify == 'Business') row.approval = 'Waiting For Approval';
                if(row.classify == 'Personal') row.approval = 'Closed';
                submitComment(row, comment);
            }, function () {

            });
        }
    }

    $scope.onMoreInfo = function (row) {
        var size = '';
        var modalInstance = $uibModal.open({
            templateUrl: 'MoreInfoModal.html',
            controller: 'ReturnReplyController',
            size: size,
            resolve: {
                call: function () {
                    return row;
                }
            }
        });
    }

    function submitComment(call, comment) {
        var request = {};

        var profile = AuthService.GetCredentials();
        request.call_id = call.id;
        request.submitter = profile.id;
        request.comment = comment.comment_content;
        var currentdate = new Date();
        var datetime = currentdate.getFullYear()+"-"+
            (currentdate.getMonth()+1) +"_"+
            currentdate.getDate() + "_"+
            currentdate.getHours() +"_"+
            currentdate.getMinutes() +"_"+
            currentdate.getSeconds()+"_";
        var url =  datetime + Math.floor((Math.random() * 100) + 1);
        var imagetype = comment.imagetype;
        var imagename = comment.imagename;
        if(imagetype != undefined) {
            var extension = imagetype.substr(imagetype.indexOf("/") + 1, imagetype.length);
            request.image_url = url + "." + extension;
            if(comment.src == '') request.image_url = '';
        }
        request.image_src = comment.src;
        request.approval = call.approval;
        request.classify = call.classify;
        
        $http({
            method: 'POST',
            url: '/frontend/callaccount/submitcomment',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.getDataList();
            console.log(response);
        }).catch(function(response) {

            })
            .finally(function() {

            });
    }

    $scope.getDate = function(row) {
        return moment(row.created_at).format('YYYY-MM-DD');
    }

    $scope.getTime = function(row) {
        return moment(row.created_at).format('h:mm:ss a');
    }

    $scope.getDurationInMinute = function(duration) {
        return moment.utc(duration * 1000).format("mm:ss");
    }

    function getExtensionList()
    {
        // get extension list
        var request = {};

        var profile = AuthService.GetCredentials();
        request.agent_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/callaccount/myextlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.filter.extensions = response.data;
            for(var i = 0; i < $scope.filter.extensions.length; i++)
                $scope.filter.extensions[i].selected = true;

            var all = {};
            all.id = 0;
            all.extension = 'All';
            all.selected = true;
            $scope.filter.extensions.unshift(all);

            console.log(response);
        }).catch(function(response) {

            })
            .finally(function() {

            });
    }

    function getDestinationList()
    {
        // get extension list
        var request = {};

        var profile = AuthService.GetCredentials();
        request.property_id = profile.property_id;

        $http({
            method: 'POST',
            url: '/frontend/callaccount/destlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.dest_list = response.data;
            for(var i = 0; i < $scope.dest_list.length; i++)
                $scope.dest_list[i].selected = true;

            var all = {};
            all.id = 0;
            all.country = 'All';
            all.selected = true;
            $scope.dest_list.unshift(all);

            console.log(response);
        }).catch(function(response) {

            })
            .finally(function() {

            });
    }

    $scope.searchtext = '';
    $scope.onSearch = function() {
        search_option = $scope.searchtext;
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();
    }

});

app.directive('dropzoneclassify', function() {
        return {
            restrict: 'A',
            scope: {
                file: '=',
                fileName: '='
            },
            link: function(scope, element, attrs) {
                var checkSize,
                    isTypeValid,
                    processDragOverOrEnter,
                    validMimeTypes;

                processDragOverOrEnter = function (event) {
                    if (event != null) {
                        event.preventDefault();
                    }
                    event.dataTransfer.effectAllowed = 'copy';
                    return false;
                };

                validMimeTypes = attrs.fileDropzone;

                checkSize = function(size) {
                    var _ref;
                    if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };

                isTypeValid = function(type) {
                    if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };

                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);

                return element.bind('drop', function(event) {
                    var file, name, reader, size, type;
                    if (event != null) {
                        event.preventDefault();
                    }
                    reader = new FileReader();
                    reader.onload = function(evt) {
                        if (checkSize(size) && isTypeValid(type)) {
                            return scope.$apply(function() {
                                scope.file = evt.target.result;
                                if (angular.isString(scope.fileName)) {
                                    return scope.fileName = name;
                                }
                            });
                        }
                    };
                    file = event.dataTransfer.files[0];
                    name = file.name;
                    type = file.type;
                    size = file.size;
                    reader.readAsDataURL(file);
                    return false;
                });
            }
        };
    })


    .directive("filereadclassify", [function () {
        return {
            scope: {
                filereadclassify: "=",
                imagenameclassify: "=",
                imagetypeclassify: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.filereadclassify = loadEvent.target.result;
                        });
                    }
                    scope.imagenameclassify = changeEvent.target.files[0].name;
                    scope.imagetypeclassify = changeEvent.target.files[0].type;
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);



app.controller('ClassifyReasonController', function ($scope, $uibModalInstance, toaster, call) {
    $scope.call = call;
    $scope.save = function () {
        $uibModalInstance.close($scope.call.comment);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ReturnReplyController', function ($scope, $uibModalInstance, $http, call) {
    $scope.call = call;
    $scope.call.src = '';
    $scope.call.imagename = '';
    $scope.call.imagetype = '';
    $scope.call.comment_content = '';

    $scope.send = function () {
        $uibModalInstance.close($scope.call);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDate = function(row) {
        return moment(row.created_at).format('YYYY-MM-DD');
    }

    $scope.getTime = function(row) {
        return moment(row.created_at).format('h:mm:ss a');
    }

    $scope.getDurationInMinute = function(duration) {
        return moment.utc(duration * 1000).format("mm:ss");
    }

    var request = {};
    request.call_id = call.id;

    $scope.comment_list = [];
    $http({
        method: 'POST',
        url: '/frontend/callaccount/commentlist',
        data: request,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
        .then(function(response) {
            $scope.comment_list = response.data;
        }).catch(function(response) {

        })
        .finally(function() {

        });
});

app.controller('CallTypeController', function ($scope) {
    $scope.onChangeCallType = function(type) {
        if( type == 'All' )
        {
            for( var i = 0; i < $scope.calltypes.length; i++)
                $scope.call_filter[$scope.calltypes[i]] = $scope.call_filter['All'];
        }
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();

    }
});

app.controller('ClassifyController', function ($scope) {
    $scope.onChangeClassify = function(type) {
        if( type == 'All' )
        {
            for( var i = 0; i < $scope.classify_types.length; i++)
                $scope.classify_filter[$scope.classify_types[i]] = $scope.classify_filter['All'];
        }

        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();

    }
});

app.controller('ApprovalController', function ($scope) {
    $scope.onChangeApproval = function(type) {
        if( type == 'All' )
        {
            for( var i = 0; i < $scope.approve_states.length; i++)
                $scope.approve_filter[$scope.approve_states[i]] = $scope.approve_filter['All'];
        }
        $scope.paginationOptions.pageNumber = 0;
        $scope.tableState.pagination.start = 0;
        $scope.getDataList();

    }
});



