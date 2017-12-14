'use strict';

/* Controllers */

angular.module('app')

.controller('experienceCtrl', ['$scope','experienceFact','$state','UrlFact', function($scope,experienceFact,$state,UrlFact) {
	var mainurl = UrlFact.experience.main;
	$scope.experience = {}
	$scope.getList = function(url){
		experienceFact.getExprienceList(url,function(response){
			$scope.EventList = response.data.result.data;
			$scope.nextPage = response.data.result.next_page_url;
			console.log($scope.EventList);
		})
	}
	 $scope.nextListPage = function(url){
    	experienceFact.getExprienceList(url,function(response){
	    	$scope.EventList = $scope.EventList.concat(response.data.result.data);
    		$scope.nextPage = response.data.result.next_page_url;
    		console.log($scope.EventList);
        })
    }
	$scope.getList(mainurl);
    
    $scope.OpenEvent = function(id){
    	experienceFact.getExprienceDetails(id, function(response){
    		$scope.showEvent = true;
    		$scope.experience = response.data.result;
            $scope.getUserlist($scope.experience.id);
    		console.log(response);
    	})
    }

    $scope.editOpen = function(){
    	$state.go('app.editExperience', {id: $scope.experience.id});
    }

    $scope.showHideExperience = function(id, val){
        $scope.isDisabled = true;
    	if(val == '1'){
    		var state = "/deacitvate";
    	}else{
    		var state = "/acitvate";
    	}
    	experienceFact.changeExprienceState(id, state, function(response){
            $scope.isDisabled = false;
    		if(response.data.result){
    			$scope.OpenEvent(id);
    		}
    	})
    }

    $scope.deleteExperience = function(id){
        var retVal = confirm("Do you want to delete this item ?");
           if( retVal == true ){
             experienceFact.deleteExprience(id, function(response){
                if(response.data.result){
                    $scope.getList(mainurl);
                }
            });
           }
           else{
              return false;
           }
    	
    }

    $scope.getUserlist = function(id){
         experienceFact.getUserlist(id, function(response){
            $scope.guestList = response.data.result;
            console.log($scope.guestList);
            $scope.createDownloadList();
         })
    }
    $scope.usercsv = [];
    $scope.createDownloadList = function(){
        $scope.usercsv = [];
        $scope.usercsv.push({a:'Guest Name',b:'Total Tickets',c:'Non Vegetarian' , d:'Vegetarian', e:'Txn ID', f:'Email', g:'Phone', h:'Amount'})
        angular.forEach($scope.guestList, function(item){
            if(item.refunded == '0'){
                var temp = item.total_tickets - item.non_veg;
                $scope.usercsv.push({a:item.name,b:item.total_tickets,c:item.non_veg,d:temp,e:item.txn_id, f:item.email, g:item.phone, h:item.txn_amount});
            }
        });
    }

    $scope.initiateRefund = function(txn_id){
         var retVal = confirm("Do you want to Initiate this Refund ?");
           if( retVal == true ){
            experienceFact.initiateRefund(txn_id, function(response){
                console.log(response);
                if(response.data.result.STATUS == "TXN_SUCCESS"){
                    var message = response.data.result.RESPMSG
                        $('body').pgNotification({
                            style: 'bar',
                            message: message,
                            position: 'top',
                            timeout: 5000,
                            type: 'success'
                        }).show();
                }else{
                    var message = response.data.result.RESPMSG
                        $('body').pgNotification({
                            style: 'bar',
                            message: message,
                            position: 'top',
                            timeout: 5000,
                            type: 'danger'
                        }).show();
                }
            });
           }
           else{
              return false;
           }
            
    }

    $scope.refundStatus = function(txn_id){
        
        experienceFact.refundStatus(txn_id, function(response){
            console.log(response);
            $('#modalSlideUpSmall').modal('show');
            $scope.refundDetails = response.data.result.REFUND_LIST[0];
        })
    }

}])
.factory('experienceFact', ['$http','UrlFact', function($http,UrlFact){
	var experienceFact = {};
	experienceFact.getExprienceList = function(url,callback){
		$http({
			method: 'GET',
			url: url
		}).then(function(response) {
            callback(response);
        });
	}
	experienceFact.getExprienceDetails = function(id,callback){
		$http({
			method: 'GET',
			url: UrlFact.experience.main+"/"+id
		}).then(function(response) {
            callback(response);
        });
	}

    experienceFact.getUserlist = function(id,callback){
        $http({
            method: 'GET',
            url: UrlFact.experience.main+"/"+id+"/users?status=success"
        }).then(function(response) {
            callback(response);
        });
    }
	experienceFact.deleteExprience = function(id,callback){
		$http({
			method: 'DELETE',
			url: UrlFact.experience.main+"/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	experienceFact.changeExprienceState = function(id,state,callback){
		$http({
			method: 'PUT',
			url: UrlFact.experience.main+"/"+id+state
		}).then(function(response) {
            callback(response);
        });
	}

    experienceFact.initiateRefund = function(txn_id, callback){
        $http({
            method: 'GET',
            url: UrlFact.experience.refund+txn_id
        }).then(function(response) {
            callback(response);
        });
    }

    experienceFact.refundStatus = function(txn_id, callback){
        $http({
            method: 'GET',
            url: UrlFact.experience.refund+txn_id+"/status"
        }).then(function(response) {
            callback(response);
        });
    }
	return experienceFact;
}]);




