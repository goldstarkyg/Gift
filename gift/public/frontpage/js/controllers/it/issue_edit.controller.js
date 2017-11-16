app.controller('IssueEditController', function ($scope, $rootScope, $http, $interval, $stateParams, $httpParamSerializer, AuthService, GuestService, toaster, Upload, $uibModal) {
    var MESSAGE_TITLE = 'Issue Edit';

    var profile = AuthService.GetCredentials();
    var client_id = profile.client_id;
    $scope.datetime = {};
    $scope.uploadme = {};
    $scope.location = {};
    $scope.files = [];
   // window.alert(profile.id);
   
    
    if($scope.issue.location !=null) {
        $scope.location = $scope.issue.location;
    }
  

    $scope.life_units = [
        'days',
        'months',
        'years',
    ];

    $scope.statuses = $http.get('/frontend/it/statuslist')
        .then(function(response){
            $scope.statuses = response.data;
        });
        $scope.severity_list = $http.get('/frontend/it/severitylist')
        .then(function(response){
            $scope.severity_list = response.data;
        });

    $scope.getDepartmentList = function(val) {
        if( val == undefined )
            val = "";
        var profile = AuthService.GetCredentials();
        var property_id = profile.property_id;
        return GuestService.getDepartSearchList(val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
     //$scope.issue.sendflag=0;
    
    $scope.inProgress=function(){
	    $scope.issue.status ="In-Progress";
	   $scope.UpdateIssue();
	    $scope.UpdateStatus();
	    
    }
         $scope.onReject=function(){
	    $scope.issue.status ="Rejected";
// 	   $scope.UpdateIssue();
	   
         var modalInstance = $uibModal.open({
            templateUrl: 'tpl/it/rejectedmodal.html',
            controller: 'RejectedComment',
            resolve: {
               issue: function () {

                    return $scope.issue;
                }


                }
            
        });
        // $scope.UpdateStatus();
        }
	    
    
    $scope.onResolve=function(){
	    $scope.issue.status ="Resolved";
	    $scope.UpdateIssue();
	    $scope.UpdateStatus();
	    
    }
    $scope.$on('UpdateStatus', function(event, args){
        //toaster.pop('error', 'Balls');

        $scope.UpdateStatus();
        //toaster.pop('error', 'Refreshed');
    });
   
    $scope.UpdateStatus = function(){
       
        $http({
            method: 'POST',
            url: '/frontend/it/updatestatus',
            data: {
                    id: $scope.issue.id,
                    status: $scope.issue.status,
                   
                }
,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
                toaster.pop('success', MESSAGE_TITLE, 'Status has been updated successfully');
                $scope.pageChanged();
                //$scope.UpdateIssue();
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created notification');
            })
            .finally(function() {
            });
    }
 
/*
    $scope.onDepartmentSelect = function (equipment, $item, $model, $label) {
        $scope.equipment.dept_id = $item.id;
    };
*/

/*
    $scope.getGroupList = function(val) {
        if( val == undefined )
            val = "";
        return promiss = $http.get('/frontend/equipment/grouplist?group_name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
*/
/*
    $scope.onGroupSelect = function (issue, $item, $model, $label) {
        // $scope.equipment.equipment_group_id = $item.id;
        var issues = {};
        issues.equip_group_id = $item.id;
        issues.name = $item.name;
        var exist_val = false;
        for(var i=0 ; i < $scope.equipment.equipment_group.length ; i++) {
            var name = $scope.equipment.equipment_group[i].name;
            if(name == $item.name) {
                exist_val = true;
                break;
            }
        }
        if(exist_val == false)
            $scope.equipment.equipment_group.push(equipments);
    };
*/

/*
    $scope.getPartGroupList = function(val) {
        if( val == undefined )
            val = "";
        return promiss = $http.get('/frontend/equipment/partgrouplist?part_group_name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
*/
/*
    $scope.onPartGroupSelect = function (equipment, $item, $model, $label) {
        $scope.equipment.part_group_id = $item.id;
        var parts = {};
        parts.part_group_id = $item.id;
        parts.name = $item.name;
        parts.type = $item.type;
        var exist_val = false;
        for(var i=0 ; i < $scope.equipment.part_group.length ; i++) {
            var name =   $scope.equipment.part_group[i].name + $scope.equipment.part_group[i].type;
            if(name == ($item.name+$item.type)) {
                exist_val = true;
                break;
            }
        }

        if(exist_val == false)
            $scope.equipment.part_group.push(parts);
    };
*/

/*
    $scope.getExternalCompany = function(val) {
        if( val == undefined )
            val = "";
        return promiss = $http.get('/frontend/equipment/maintenancelist?name='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
*/
/*
    $scope.onExternalCompanySelect = function (equipment, $item, $model, $label) {
        $scope.equipment.external_maintenance_id = $item.id;
    };

    $scope.delEquipGroup = function (id) {
        for(var i=0; i < $scope.equipment.equipment_group.length;i++) {
            var group_id = $scope.equipment.equipment_group[i].equip_group_id;
            if(id == group_id) $scope.equipment.equipment_group.splice(i,1);
        }
    }

    $scope.delPartGroup = function (id) {
        for(var i=0; i < $scope.equipment.part_group.length;i++) {
            var group_id = $scope.equipment.part_group[i].part_group_id;
            if(id == group_id) $scope.equipment.part_group.splice(i,1);
        }
    }
*/

    $scope.getLocationList = function(val) {
        if( val == undefined )
            val = "";

        return $http.get('/list/locationtotallist?location=' + val + '&client_id=' + client_id)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });
    };
    $scope.onLocationSelect = function ($item, $model, $label) {
        $scope.location = $item;
        $scope.issue.location_group_member_id = $item.id;
    };

   $scope.getCategoryList = function(val) {
        if( val == undefined )
            val = "";

        return $http.get('/frontend/it/catlist?category='+val)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });

    };
     $scope.onCategorySelect = function ($item, $model, $label) {
        $scope.issue.category = $item.category;
    };
    
    $scope.getSubCategoryList = function(val) {
        if( val == undefined )
            val = "";
            
            var category=$scope.issue.category;
            //window.alert(category);

        return $http.get('/frontend/it/subcatlist?sub_cat='+val+ '&category=' + category)
            .then(function(response){
                return response.data.map(function(item){
                    return item;
                });
            });

    };
    $scope.onSubCategorySelect = function ($item, $model, $label) {
        $scope.issue.subcategory = $item.sub_cat;
    };
/*
    $scope.onSupplierSelect = function (equipment, $item, $model, $label) {
        $scope.equipment.supplier_id = $item.id;
    };

    $scope.$watch('datetime.date', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.equipment.purchase_date = moment(newValue).format('YYYY-MM-DD');
    });

    $scope.$watch('datetime.date_warranty_start', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.equipment.warranty_start = moment(newValue).format('YYYY-MM-DD');
    });

    $scope.$watch('datetime.date_warranty_end', function(newValue, oldValue) {
        if( newValue == oldValue )
            return;

        console.log(newValue);
        $scope.equipment.warranty_end = moment(newValue).format('YYYY-MM-DD');
    });
*/ $scope.uploadFiles = function (files) {
        $scope.files = $scope.files.concat(files);
        var profile = AuthService.GetCredentials();       
        if ($scope.files && $scope.files.length > 0 ) {
            Upload.upload({
                url: '/frontend/it/uploadsubfiles',
                data: {
                    id: $scope.issue.id,
                    user_id: profile.id,
                    files: $scope.files
                }
            }).then(function (response) {
                $scope.files = [];
                if( response.data.upload )
                    $scope.issue.sub_download_array = response.data.upload.split("|");
                else
                    $scope.issue.sub_download_array = [];
            }, function (response) {
                $scope.files = [];
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                $scope.progress = 
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };

    $scope.removeFile = function($index) {        
        var request = {};
        request.id = $scope.issue.id;
        request.index = $index;

        $http({
            method: 'POST',
            url: '/frontend/it/removefiles',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            console.log(response);                            
            if( response.data.upload )
                $scope.issue.sub_download_array = response.data.upload.split("|");
            else
                $scope.issue.sub_download_array = [];
        }).catch(function(response) {
        })
        .finally(function() {

        });
     
    }

    $scope.UpdateIssue = function(){
	    $scope.issue.updated_by= profile.id;
        var data = angular.copy($scope.issue);
        var currentdate = new Date();
        var datetime = currentdate.getFullYear()+"-"+
            (currentdate.getMonth()+1) +"_"+
            currentdate.getDate() + "_"+
            currentdate.getHours() +"_"+
            currentdate.getMinutes() +"_"+
            currentdate.getSeconds()+"_";
        var url =  datetime + Math.floor((Math.random() * 100) + 1);
/*
        var imagetype = $scope.uploadme.imagetype;
        var imagename = $scope.uploadme.imagename;
        if(imagetype != undefined) {
            var extension = imagetype.substr(imagetype.indexOf("/") + 1, imagetype.length);
            data.image_url = url + "." + extension;
        }
        data.image_src = $scope.uploadme.src;
        
*/
        $http({
            method: 'POST',
            url: '/frontend/it/updateissue',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
	            
                
                $scope.pageChanged();
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created notification');
            })
            .finally(function() {
            });
    }
});

app.controller('RejectedComment', function($scope, $rootScope, $http, AuthService, GuestService, $interval, toaster, $timeout, $uibModalInstance, issue) {
/*
           $scope.ok = function () {
        $uibModalInstance.close($scope.sub);
        };
*/var MESSAGE_TITLE = 'Issue Edit';
     $scope.reject='';
     var profile = AuthService.GetCredentials();

     

        $scope.cancel = function () {
        $uibModalInstance.dismiss();
        };
        
        $scope.onSend=function(){
	    issue.sendflag = 1;
	    $scope.UpdateIssue();
	    $rootScope.$broadcast('UpdateStatus');
	    
	   }
	   
	    $scope.UpdateIssue = function(){
        
		issue.reject=$scope.reject;
        var currentdate = new Date();
        var datetime = currentdate.getFullYear()+"-"+
            (currentdate.getMonth()+1) +"_"+
            currentdate.getDate() + "_"+
            currentdate.getHours() +"_"+
            currentdate.getMinutes() +"_"+
            currentdate.getSeconds()+"_";
        var url =  datetime + Math.floor((Math.random() * 100) + 1);
        issue.reject=$scope.reject;
        issue.updated_by= profile.id;
        var data = angular.copy(issue);
/*
        var imagetype = $scope.uploadme.imagetype;
        var imagename = $scope.uploadme.imagename;
        if(imagetype != undefined) {
            var extension = imagetype.substr(imagetype.indexOf("/") + 1, imagetype.length);
            data.image_url = url + "." + extension;
        }
        data.image_src = $scope.uploadme.src;
        
*/
        $http({
            method: 'POST',
            url: '/frontend/it/updateissue',
            data: data,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function(response) {
	            //toaster.pop('success', MESSAGE_TITLE, 'Status has been updated successfully');
                $rootScope.$broadcast('onpageChanged');
                $uibModalInstance.dismiss();
                //$scope.pageChanged();
            }).catch(function(response) {
                toaster.pop('error', MESSAGE_TITLE, 'Failed to created notification');
            })
            .finally(function() {
            });
    }
	   
        
        

               
           

    });


