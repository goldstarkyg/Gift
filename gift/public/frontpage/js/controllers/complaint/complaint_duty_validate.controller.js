app.controller('ComplaintDutyValidationController', function ($scope, $rootScope, $http, $httpParamSerializer, $window, $interval, $uibModal, AuthService, GuestService, toaster ,liveserver) {
    var MESSAGE_TITLE = 'Duty Manager';
		
	$scope.full_height = $window.innerHeight - 125;
		
    $scope.complaint = {};
    $scope.guest_id_editable = false;
    $scope.genders = ['Male', 'Female'];
    $scope.exist_subcomplaint_list = [];
    $scope.guest_history = {};
    $scope.subflag=0;
    $scope.dept="";

    $scope.forward_flag = false;

    $scope.init = function(complaint) {
        var profile = AuthService.GetCredentials();

        $scope.can_be_edit = AuthService.isValidModule('app.complaint.complaint_edit');
        $scope.disable_all = !$scope.can_be_edit;
        $scope.category_editable = AuthService.isValidModule('app.complaint.maincategory_add');

        $scope.complaint = complaint;
        $scope.complaint.location = complaint.lgm_type + ' - ' + complaint.lgm_name;
        $scope.guest_id_editable = !(complaint.guest_id > 0);
        $scope.comment_list = [];
        $scope.complaint.approval_route_flag = complaint.approval_route_id > 0;
        $scope.comp = {};
        
        $scope.complaint.guest_is_open = true;
        $scope.complaint.compensation_comment_is_open = false;
        $scope.complaint.running_subcomplaint_is_open = false;
        $scope.complaint.complaint_comment_is_open = false;
        $scope.forward_flag = $scope.complaint.lg_property_id == profile.property_id;

        if( complaint.path )
            $scope.complaint.download_array = complaint.path.split("|");
        else
            $scope.complaint.download_array = [];

        if( complaint.gender == null )
            $scope.complaint.gender = $scope.genders[0];

        var profile = AuthService.GetCredentials();
        complaint.modified_by = profile.id;

        $http.get('/frontend/complaint/compensationtype?client_id='+profile.client_id)
            .then(function(response) {
                $scope.compensations =  response.data;              
            });
            
      

        complaint.latest = 1;
        complaint.active = true;
        $scope.$emit('onUpdateComplaint', complaint);    

        $scope.comp_list = [];
        $http.get('/frontend/complaint/getcomplaintinfo?id=' + complaint.id + '&property_id=' + profile.property_id)
            .then(function(response) {
                $scope.exist_subcomplaint_list =  response.data.sublist;
                $scope.exist_subcomplaint_list.forEach(function(item, index) {
                    item.ticket_no = $scope.getTicketNumber(item);
                    item.created_at_time = moment(item.created_at).format('D MMM YYYY hh:mm a');
                    item.comment_list.forEach(function(row, index1){
                        row.time = $scope.getTime(row);    
                    });
                    item.log_list.forEach(function(row, index1){
                        row.created_at_time = moment(row.created_at).format('DD MMM YYYY HH:mm:ss');    
                    });                   
                });

                $scope.comp_list =  response.data.comp_list;
                $scope.category_list = response.data.category_list;

                var alloption = {id: 0, name : 'Unclassified'};
                $scope.category_list.unshift(alloption);

                for(var i = 0; i < $scope.exist_subcomplaint_list.length; i++ )
                {
                    var row = $scope.exist_subcomplaint_list[i];
                    if( row.path )
                        row.download_array = row.path.split("|");
                    else
                        row.download_array = [];
                }                
            });    

        // refresh keywords    
        var comment_highlight = $scope.complaint.comment_highlight + '';
        var response_highlight = $scope.complaint.response_highlight + '';
        $scope.complaint.comment_highlight = undefined;
        $scope.complaint.response_highlight = undefined;

        $http.get('/list/severitylist')
            .then(function(response) {
            $scope.complaint.comment_highlight = comment_highlight;
            $scope.complaint.response_highlight = response_highlight;

            $scope.severity_list = response.data; 
        });    

        getCommentList(); 
        getComplaintInfo();
        getGuestHistory();
        getComplaintLogs();
        $scope.loadDepts();
    }
    
    $scope.depts_list = [];
    $scope.depts=[];
     $scope.selDept=[];
     $scope.selected_depts = [];
    $scope.loadDepts = function(){
	    
	    var request = $scope.complaint;
	     $http({
            method: 'POST',
            url: '/frontend/complaint/deptlist',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.selected_depts = response.data.deptlist;
             if($scope.complaint.send_flag==1)
        {
	       //window.alert("yes"+$scope.selected_depts.length);
	        for(i=0;i<$scope.selected_depts.length;i++)
	        {
		        //window.alert($scope.selected_depts[i].department);
	        $scope.selDept[i] = { text: $scope.selected_depts[i].department }; 
	        }
        //$scope.selDept = {text: $scope.selected_depts.map(function(tag) { return tag.department; })}; 
        }
           
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to send departments.');
        })
        .finally(function() {

        });
       
    } 
    
    $scope.loadFiltersValue = function(value) {
      //$scope.loadDepts();
     
   
    $http.get('/list/department')
        .then(function(response){
            $scope.depts_list = response.data;
        });
        
        $scope.depts = $scope.depts_list.map(function(item) { return item.department; }); 
        //window.alert($scope.depts[0]+"yes");
        
        return $scope.depts;
       }
    
 
	$scope.tagsString= [];
     $scope.onDepartmentSend = function () {
	      //window.alert($scope.complaint.sendflag);
	     $scope.tagsString = $scope.selDept.map(function(tag) { return tag.text; });
	     $scope.complaint.depts_list = $scope.depts_list.map(function(item) { if($scope.tagsString.indexOf(item.department)!= -1)
		     {return item.id; }});
		     $scope.complaint.depts_list = $scope.complaint.depts_list.filter(function( element ) {
   return element !== undefined;
});
	     if($scope.complaint.depts_list)
	     {
		     $scope.complaint.send_flag=1;
	     }
	    //$scope.complaint.dept_list = $scope.selDept.map(function(tag) { return tag.dept_id; });

        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/senddept',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
           
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to send departments.');
        })
        .finally(function() {

        });

      
    };

    $scope.onDownloadPDF = function(){
        var filter = {};
        filter.report_by = 'complaint';
        filter.report_type = 'Detailed';
        filter.report_target = 'complaint';
        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.id = $scope.complaint.id;
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);
    }

    $scope.onGenerateCompensationPDF = function(){
        var filter = {};
        filter.report_by = 'complaint';
        filter.report_type = 'Detailed';
        filter.report_target = 'compensation';
        var profile = AuthService.GetCredentials();
        filter.property_id = profile.property_id;
        filter.id = $scope.complaint.id;
        filter.user_id = profile.id;
        $window.location.href = liveserver.api + 'pdfreport?' + $httpParamSerializer(filter);
    }

    $scope.onAck = function($event) {
        $event.preventDefault();
    	$scope.complaint.status = 'Acknowledge';

        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/ack',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onReject = function($event) {
        $event.preventDefault();

        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input reason';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                rejectComplaint(comment);
            }, function () {

            });
    }

    function rejectComplaint(comment) {
        var request = {};
        request.id = $scope.complaint.id;
        request.comment = comment;

        $http({
            method: 'POST',
            url: '/frontend/complaint/reject',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.complaint.status = 'Rejected';
            toaster.pop('info', MESSAGE_TITLE, 'Complaint is rejected');
            $scope.$emit('onChangedComplaint', response.data);
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onResolve = function() {
        $scope.complaint.status = 'Acknowledge';

        var request = $scope.complaint;

        if( request.solution == undefined || request.solution.length < 1 )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please provide primary resolution.');
            return;
        }

        $http({
            method: 'POST',
            url: '/frontend/complaint/resolve',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            toaster.pop('success', MESSAGE_TITLE, 'Complaint resolved successfully.');
            $scope.complaint.status = 'Resolved';
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onClose = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input resolution';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                closeComplaint(comment);
            }, function () {

            });
    }

    function closeComplaint(comment) {
        var request = {};

        request.id = $scope.complaint.id;
        request.comment = comment;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/close',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            $scope.complaint.closed_flag = 1;
            toaster.pop('success', MESSAGE_TITLE, 'Complaint closed successfully.');
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onReopen = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input comment';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                reopenComplaint(comment);
            }, function () {

            });
    }

    function reopenComplaint(comment) {
        var request = {};

        request.id = $scope.complaint.id;
        request.comment = comment;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/reopen',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            $scope.complaint.closed_flag = 0;
            toaster.pop('success', MESSAGE_TITLE, 'Complaint is opened successfully.');
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }
   

    $scope.onRepending = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input comment';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                rependingComplaint(comment);
            }, function () {

            });
    }

    function rependingComplaint(comment) {
        var request = {};

        request.id = $scope.complaint.id;
        request.comment = comment;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/repending',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            $scope.complaint.status = 'Acknowledge';
            toaster.pop('success', MESSAGE_TITLE, 'Complaint is reverted successfully.');
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onUnresolve = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_input.html',
            controller: 'ModalInputCtrl',
            scope: $scope,
            resolve: {
                title: function () {
                    return 'Please input reason';
                }
            }
        });

        modalInstance.result
            .then(function (comment) {
                unresolveComplaint(comment);
            }, function () {

            });
    }

    function unresolveComplaint(comment) {
        var request = {};

        request.id = $scope.complaint.id;
        request.comment = comment;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/unresolve',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            $scope.complaint.closed_flag = 1;
            $scope.complaint.status = 'Unresolved';
            toaster.pop('success', MESSAGE_TITLE, 'Complaint closed successfully.');
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.forwardComplaint = function() {
        if($scope.exist_subcomplaint_list.length > 0 )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Subcomplaint already created');
            return;
        }

        if( $scope.compenstion_id > 0 )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Compensation already created');
            return;
        }

        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/forward',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            toaster.pop('info', MESSAGE_TITLE, 'Complaint has been forwarded.');            
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to forward Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.onChangedSeverity = function() {
        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/changeseverity',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onChangedComplaint', response.data);
            toaster.pop('success', MESSAGE_TITLE, 'Severity has been updated.');
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to change Severity.');
        })
        .finally(function() {

        });
    }

    $scope.onChangedCategory = function() {
        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/changemaincategory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.$emit('onUpdateComplaint', $scope.complaint);            
            toaster.pop('success', MESSAGE_TITLE, 'Category has been updated.');
            getComplaintLogs();
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to change Category.');
        })
        .finally(function() {

        });
    }


    $scope.getGuestList = function(val) {
        if( val == undefined )
            val = "";
        
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;

        return $http.get('/frontend/complaint/guestlist?value=' + val + '&property_id=' + property_id)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };

    $scope.onGuestSelect = function ($item, $model, $label) {
    	$scope.complaint.guest_id = $item.guest_id;
        $scope.complaint.guest_name = $item.guest_name;
    };

    $scope.getCountryList = function(val) {
        if( val == undefined )
            val = "";
       
        return $http.get('/list/countrylist?value=' + val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };

    $scope.onCountrySelect = function ($item, $model, $label) {
        $scope.complaint.nationality = $item.id;
        $scope.complaint.nationality_name = $item.name;
    };

    $scope.saveGuestProfile = function() {
    	if( !($scope.complaint.guest_id > 0) )
    	{
    		toaster.pop('info', MESSAGE_TITLE, 'Please select Guest');
    		return;
    	}

        var request = $scope.complaint;

        $http({
            method: 'POST',
            url: '/frontend/complaint/saveguestprofile',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            toaster.pop('success', MESSAGE_TITLE, 'Guest Profile has been saved');
            $scope.$emit('onChangedComplaint', response.data);
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    $scope.saveGuestFlag = function() {
        var request = $scope.complaint;

        if( !request.guest_comment )
        {
            toaster.pop('info', 'Please input comment');
            return;
        }

        if( !request.pref )
        {
            toaster.pop('info', 'Please input preference');
            return;
        }

        $http({
            method: 'POST',
            url: '/frontend/complaint/flagguest',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            toaster.pop('success', MESSAGE_TITLE, 'Guest is flaged');
            $scope.$emit('onChangedComplaint', response.data);
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Complaint.');
        })
        .finally(function() {

        });
    }

    function getGuestHistory() {
        var request = {};
        request.complaint_id = $scope.complaint.id;
        request.guest_id = $scope.complaint.guest_id;
        if( request.guest_id < 1 )
        {
            $scope.guest_history = [];
            return;
        }

        $http({
            method: 'POST',
            url: '/frontend/complaint/guesthistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.guest_history = response.data.datalist;
            $scope.guest_history.forEach(function(item, index) {
                item.ticket_no = $scope.getComplaintNumber(item);  
                item.created_at_time = moment(item.created_at).format('D MMM YYYY hh:mm a')              ;
            });
        }).catch(function(response) {
            
        })
        .finally(function() {

        });
    }

    function getComplaintLogs() {
        var request = {};
        request.complaint_id = $scope.complaint.id;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/logs',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            $scope.log_list = response.data.datalist;
            $scope.log_list.forEach(function(item, index) {
                    item.created_at_time = moment(item.created_at).format('D MMM YYYY hh:mm a');            
                });

        }).catch(function(response) {
            
        })
        .finally(function() {

        });
    }

    $scope.viewGuestHistory = function() {
        $scope.complaint.history_view = true;
    }

    $scope.hideGuestHistory = function() {
        $scope.complaint.history_view = false;
    }

    $scope.showComplaint = function(row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'complaint_detail.html',
            controller: 'ComplaintDetailCtrl1',
            scope: $scope,
            resolve: {
                complaint: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    }

    function getCommentList(sub) {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.property_id = profile.property_id;
        request.id = $scope.complaint.id;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/getcomments',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            $scope.comment_list = response.data;
            $scope.exist_subcomplaint_list.forEach(function(item, index) {
                    item.time = $scope.getTime(item);            
                });

            for(var i = 0; i < $scope.comment_list.length; i++)
            {
                $scope.comment_list[i].comment = $scope.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
            }
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    $scope.commitComment = function(comment) {
        console.log(comment);

        var profile = AuthService.GetCredentials();
        
        var request = {};
        request.sub_id = $scope.complaint.id;
        request.parent_id = 0;
        request.user_id = $scope.profile.id;        
        request.comment = comment;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/addcomment',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                

            $scope.comment_list = response.data;
            $scope.complaint.sub_comment = ''; 
            for(var i = 0; i < $scope.comment_list.length; i++)
            {
                $scope.comment_list[i].comment = $scope.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
            }
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    $scope.postReply = function(sub, sub_reply) {
        console.log(sub_reply);

        var profile = AuthService.GetCredentials();
        
        var request = {};
        request.sub_id = sub.id;
        request.parent_id = 0;
        request.user_id = profile.id;        
        request.comment = sub_reply;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/addsubcomment',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                

            sub.comment_list = response.data;
            sub.sub_reply = ''; 
            for(var i = 0; i < sub.comment_list.length; i++)
            {
                sub.comment_list[i].comment = sub.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
            }
        }).catch(function(response) {
            // CASE 3: NO Asignee Found on shift : Default Asignee
        })
        .finally(function() {

        });
    }

    $scope.onCompensationSelect = function($item, $model, $label) {
        var compensation_id = $item.id;
        $scope.comp = $item;
        $scope.comp.approve_flag = $item.approval_route_id > 0;   
    }

    $scope.addCompensationType = function(cost) {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.client_id = profile.client_id;
        request.property_id = profile.property_id;
        request.compensation = $scope.comp.compensation;
        request.cost = cost;  

        $http({
            method: 'POST',
            url: '/frontend/complaint/addcompensationtype',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            var data = response.data;
            if( data.code == 200 )
            {
                $scope.compensations =  response.data.list;    

                var item = {};
                item.id = response.data.compensation_id;
                item.approval_route_id = 0;
                item.cost = 0;
                item.compensation = $scope.comp.compensation;

                $scope.onCompensationSelect(item, null, null);          
                
                toaster.pop('success', MESSAGE_TITLE, 'New compensation type has been added');
            }
            
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post compensation.');
        })
        .finally(function() {

        }); 

    }

    $scope.postCompensation = function() {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.id = $scope.complaint.id;
        request.compensation_id = $scope.comp.id;
        request.comment = $scope.comp.comment;
        request.user_id = profile.id;
        request.cost = $scope.comp.cost;

        if( !(request.compensation_id > 0) )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please select compensation');
            return;            
        }

        if( !request.comment )
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please input comment');
            return;            
        }

        $http({
            method: 'POST',
            url: '/frontend/complaint/postcompensation',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            var data = response.data;

            if( data.code != 200 )
                toaster.pop('error', MESSAGE_TITLE, data.message);    
            else
            {
                $scope.comp_list = response.data.comp_list;                
                $scope.$emit('onChangedComplaint', response.data);
                $scope.cancelCompensation();
            }

        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to post Compensation.');
        })
        .finally(function() {

        });        
    }

    $scope.cancelCompensation = function() {
        $scope.comp = {};        
    }

    $scope.showCompensationDetail = function(row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'compensation_detail.html',
            controller: 'CompensationDetailCtrl',
            scope: $scope,
            resolve: {
                comp: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    }

    $scope.getTicketNumber = function(ticket){
        if(!ticket)
            return 'C00000';
        return sprintf('C%05d%s', ticket.parent_id, ticket.sub_label);        
    }

    $scope.getComplaintNumber = function(ticket){
        if(!ticket)
            return 'C00000';
        return sprintf('C%05d', ticket.id);        
    }

    $scope.getTime = function(row) {
        return moment(row.created_at).fromNow();
    }

    function getComplaintInfo(callback) {
        var profile = AuthService.GetCredentials();
        var property_id = $scope.complaint.lg_property_id;
        
        GuestService.getComplaintItemList(property_id)
            .then(function(response) {
                $scope.complaint_list =  response.data.list;
                $scope.complaint_types =  response.data.types;
                $scope.complaint.type_id = $scope.complaint_types[0].id;
                $scope.complaint_department = response.data.com_dept;
                $scope.complaint_usergroup = response.data.com_usergroup;
                $scope.dept_list = response.data.dept;
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to get Complaint Information.');
            })
            .finally(function() {
                if( callback != undefined )
                    callback();
            });    
    }

    $scope.updateComplaintList = function(list){
        $scope.complaint_list = list;
    }

    $scope.addSubComplaint = function(sub, callback) {
	   $scope.subflag=1;
        var request = {};

        request.complaint_id = sub.complaint_id;
        request.dept_id = sub.dept_id;            
        var assginee_id = sub.assignee_id;

        if( !(request.complaint_id > 0)) // complaint
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please select complaint name');
            return;
        }

        if( !(request.dept_id > 0) ) // department is not selected      
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please select Department');
            return;
        }

        if( !(assginee_id > 0) ) // assignee is not selected      
        {
            toaster.pop('info', MESSAGE_TITLE, 'Please select Assignee');
            return;
        }
       
        // save dept id with complaint id
        $http({
            method: 'POST',
            url: '/frontend/complaint/savecomplaintdept',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);     
            $scope.complaint_department = response.data.com_dept;                 
            if( callback != undefined )
                callback();                    
        }).catch(function(response) {
            // CASE 3: NO Asignee Found on shift : Default Asignee
        })
        .finally(function() {
            
        });         
    }


    $scope.assignSubComplaint = function(sub) {
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        var subcomplaint_list = [];

        subcomplaint_list.push(sub);

        var request = {};

        request.property_id = property_id;
        request.user_id = profile.id;
        request.id = $scope.complaint.id;
        request.subcomplaints = subcomplaint_list;
        
        $scope.addSubComplaint(sub, function() {
            $http({
                method: 'POST',
                url: '/frontend/complaint/assignsubcomplaint',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function(response) {
                console.log(response);     
                $scope.$emit('onChangedComplaint', response.data);

                $scope.exist_subcomplaint_list =  response.data;

                toaster.pop('success', MESSAGE_TITLE, 'Created Successfully');
            }).catch(function(response) {
                // CASE 3: NO Asignee Found on shift : Default Asignee
                toaster.pop('error', MESSAGE_TITLE, 'Failed');
            })
            .finally(function() {
            });
        });
        
    }

    // sub complaint
    $scope.viewSubcomplaint = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'subcomplaint_dialog.html',
            controller: 'SubcomplaintDialogCtrl',
            scope: $scope,
            resolve: {
                complaint: function () {

                    return $scope.complaint;
                },
                complaint_list: function () {
                    return $scope.complaint_list;
                },
                severity_list: function () {
                    return $scope.severity_list;
                },
                dept_list: function () {
                    return $scope.dept_list;
                },
                complaint_department : function() {
                    return $scope.complaint_department;
                },
                complaint_usergroup : function() {
                    return $scope.complaint_usergroup;
                },
                severity: function() {
                    return $scope.complaint.severity;
                }
            }
        });

        modalInstance.result.then(function (sub) {
            if(sub) {
                $scope.assignSubComplaint(sub);
            }
        }, function () {

        });
    }

    $scope.$on('selected_complaint', function(event, args){
        $scope.init(args);        
    });

    function getHighlightText($text) {
        var html = $text;
        
        html = html.replace('<span class="angular-highlight">', '');
        html = html.replace('</span>', '');
        html = html.trim();        
        html = html.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");        
        html = html.replace('&amp;', '&');

        try {
            var regex = new RegExp(html, 'gmi');

            return html;
        } catch(e) {

        }    

        return '';
    }

    $scope.comment_highlight = function($text) {        
        var html = getHighlightText($text);
        
        updateHighlight($scope.complaint.comment_highlight, html, 0);
    }

    $scope.clearCommentHighlight = function() {        
        $scope.complaint.comment_highlight = '';                  
    }

    $scope.response_highlight = function($text) {        
        var html = getHighlightText($text);
        
        updateHighlight($scope.complaint.response_highlight, html, 1);
    }

    $scope.clearResponseHighlight = function() {        
        $scope.complaint.response_highlight = '';                  
    }

    function updateHighlight(highlight, html, mode) {
        if( !html || html.length < 1 )
            return;

        if( !highlight || highlight.length < 1 )
            highlight = html;
        else
            highlight += '&&' + html;

        if( mode == 0 )
            $scope.complaint.comment_highlight = highlight;
        if( mode == 1 )
            $scope.complaint.response_highlight = highlight;

        var request = $scope.complaint;
        request.mode = mode;

        $http({
                method: 'POST',
                url: '/frontend/complaint/highlight',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function(response) {
                console.log(response);                     
                $scope.$emit('onUpdateComplaint', $scope.complaint);

                getComplaintLogs();
            }).catch(function(response) {
                // CASE 3: NO Asignee Found on shift : Default Asignee
                toaster.pop('error', MESSAGE_TITLE, 'Failed');

            })
            .finally(function() {
            });
    }

    $scope.createCategory = function () {        
        var modalInstance = $uibModal.open({
            templateUrl: 'complaint_category.html',
            controller: 'ComplaintCategoryCtrl',
            scope: $scope,
            resolve: {
                complaint: function () {
                    return $scope.complaint;
                },
                category_list: function () {
                    return $scope.category_list;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    }

    $scope.setComplaintCategoryList = function(list) {
        $scope.category_list = list;
    }

});

app.controller('SubcomplaintDialogCtrl', function($scope, $http, AuthService, $uibModalInstance, complaint, complaint_list, severity_list, dept_list, complaint_department, complaint_usergroup, severity) {
    $scope.complaint = complaint;
    $scope.complaint_list = complaint_list;
    $scope.severity_list = severity_list;
    $scope.dept_list = dept_list;
    $scope.complaint_department = complaint_department;
    $scope.complaint_usergroup = complaint_usergroup;

    $scope.sub = {};

    $scope.sub.severity = severity;
    $scope.ok = function () {
        $uibModalInstance.close($scope.sub);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    function selectDepartment(sub) {
        // find department id
        var dept_id = -1;
        for(var i = 0; i < $scope.complaint_department.length; i++)
        {
            if( $scope.complaint_department[i].complaint_id == sub.complaint_id )
            {
                dept_id = $scope.complaint_department[i].dept_id;
                break;
            }
        }

        if( dept_id < 1 )
        {
            sub.dept_selectable = true;
            // if( $scope.dept_list.length > 0 )
            // {
            //     dept_id = $scope.dept_list[0].id;            
            // }
        }
        else
            sub.dept_selectable = false;

        sub.dept_id = dept_id;
    }

    function selectAssignee(sub) {
        var assignee_id = -1;
        var assignee_name = '';

        // select Default Asignee
        if( sub.dept_id > 0 )
        {
            for(var i = 0; i < $scope.dept_list.length; i++)
            {
                if( sub.dept_id == $scope.dept_list[i].id )
                {
                    assignee_id = $scope.dept_list[i].user_id;
                    assignee_name = $scope.dept_list[i].wholename;
                    break;
                }
            }
        }

        if( assignee_id > 0 )
        {
            sub.assignee_id = assignee_id;
            sub.assignee_name = assignee_name;
        }
        else
        {
            sub.assignee_id = 0;
            if( sub.dept_selectable == true  )
                sub.assignee_name = '';
            else
                sub.assignee_name = 'No default Assignee';
        }

        // find user group id
        var usergroup_id = -1;
        for(var i = 0; i < $scope.complaint_usergroup.length; i++)
        {
            if( $scope.complaint_usergroup[i].complaint_id == sub.complaint_id )
            {
                usergroup_id = $scope.complaint_usergroup[i].usergroup_id;
                break;
            }
        }

        if( usergroup_id > 0 )        
        {        
            var profile = AuthService.GetCredentials();
            var property_id = profile.property_id;

            var request = {};

            request.property_id = property_id;
            request.complaint_id = sub.complaint_id;
            request.usergroup_id = usergroup_id;
            request.dept_id = sub.dept_id;
            request.loc_id = $scope.complaint.loc_id;

            // find assignee
            $http({
                method: 'POST',
                url: '/frontend/complaint/selectassignee',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function(response) {
                console.log(response);                
                if( response.data.length > 0 )  // CASE 4: Exist Complaint : System choose asignee
                {                   
                    sub.assignee_id = response.data[0].user_id;
                    sub.assignee_name = response.data[0].wholename;
                }                
            
            }).catch(function(response) {
                // CASE 3: NO Asignee Found on shift : Default Asignee
            })
            .finally(function() {

            });
        }

    }

    $scope.onSelectDepartment = function(sub) {
        selectAssignee(sub);        
    }

    $scope.onComplaintSelect = function (sub, $item, $model, $label) {
        sub.complaint_id = $item.id;
        sub.severity = $item.type_id;   
        sub.comment = '';     

        selectDepartment(sub);

        selectAssignee(sub);
    };

    $scope.onEnter = function(sub) {
        console.log(sub.complaint_name);

        if( !sub.complaint_name || sub.complaint_name == '' )
            return;

        // check exist complaint name
        var exist_flag = false;
        for(var i = 0; i < $scope.complaint_list.length; i++)
        {
            if(sub.complaint_name == $scope.complaint_list[i].complaint )
            {
                exist_flag = true;
                break;
            }
        }

        if( exist_flag == false )
        {
            var request = {};
            request.complaint = sub.complaint_name;
            request.type_id = 1;

            // post new complaint
            $http({
                method: 'POST',
                url: '/frontend/complaint/createcomplaintitem',
                data: request,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function(response) {
                console.log(response);      
                $scope.complaint_list =  response.data.list;
                $scope.updateComplaintList(response.data.list);    // update parent scope's complaint list.

                sub.complaint_id = response.data.id;
                sub.severity = 1;

                selectDepartment(sub);
                selectAssignee(sub);

            }).catch(function(response) {
                // CASE 3: NO Asignee Found on shift : Default Asignee
            })
            .finally(function() {

            });
        }
    }


});

app.controller('ComplaintDetailCtrl1', function($scope, $uibModalInstance, $http, AuthService, complaint) {
    $scope.complaint = complaint;
    $scope.comment_list = [];

    function getCommentList() {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.property_id = profile.property_id;
        request.id = $scope.complaint.id;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/getcomments',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            $scope.comment_list = response.data;
            for(var i = 0; i < $scope.comment_list.length; i++)
            {
                $scope.comment_list[i].comment = $scope.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
            }
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    getCommentList();

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.getTicketNumber = function (ticket) {
        if(!ticket)
            return 'C00000';

        return sprintf('C%05d', ticket.id);
    };

    $scope.getTime = function(row) {
        return moment(row.created_at).fromNow();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    
});

app.controller('CompensationDetailCtrl', function($scope, $uibModalInstance, $http, toaster, AuthService, comp) {
    $scope.comp = comp;
    $scope.comment_list = [];

    function getCommentList() {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.property_id = profile.property_id;
        request.id = $scope.comp.id;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/getcompensationcomments',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                
            $scope.comment_list = response.data;
            for(var i = 0; i < $scope.comment_list.length; i++)
            {
                $scope.comment_list[i].comment = $scope.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
            }
        }).catch(function(response) {
        })
        .finally(function() {

        });
    }

    getCommentList();

    $scope.addCommentToReturn = function(comment) {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.property_id = profile.property_id;
        request.id = $scope.comp.id;
        request.comment = comment;
        request.user_id = profile.id;

        $http({
            method: 'POST',
            url: '/frontend/complaint/addcommentoreturn',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);
            var data = response.data;

            if( data.code != 200 )
                toaster.pop('error', 'Duty Manager', data.message);    
            else
            {
                $scope.comment_list = response.data.comment_list;
                for(var i = 0; i < $scope.comment_list.length; i++)
                {
                    $scope.comment_list[i].comment = $scope.comment_list[i].comment.replace(/\r?\n/g,'<br/>');
                }
            }
        }).catch(function(response) {
            toaster.pop('error', 'Duty Manager', 'Failed to post Compensation.');
        })
        .finally(function() {

        });        
    }

   
    $scope.getTicketNumber = function (ticket) {
        if(!ticket)
            return 'C00000';

        return sprintf('C%05d', ticket.id);
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    
});


app.controller('ComplaintCategoryCtrl', function($scope, $uibModalInstance, $http, AuthService, complaint, category_list) {
    $scope.complaint = complaint;
    $scope.cateory_list = category_list;

    $scope.createCategory = function () {
        var profile = AuthService.GetCredentials();

        var request = {};

        request.name = $scope.complaint.category_new_name;        
        request.user_id = profile.id;
        request.property_id = profile.property_id;

        if( !request.name )
            return;
        
        $http({
            method: 'POST',
            url: '/frontend/complaint/createmaincategory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);        
            $scope.complaint.category_new_name = '';        
            $scope.category_list = response.data;       

            var alloption = {id: 0, name : 'Unclassified'};
            $scope.category_list.unshift(alloption);

            $scope.setComplaintCategoryList($scope.category_list);    
        }).catch(function(response) {
        })
        .finally(function() {

        });
    };

    
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});
