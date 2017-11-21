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
    	if(val == '1'){
    		var state = "/deacitvate";
    	}else{
    		var state = "/acitvate";
    	}
    	experienceFact.changeExprienceState(id, state, function(response){
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
        $scope.usercsv.push({a:'Guest Name',b:'Total Tickets',c:'Non Vegetarian' ,d:'Txn ID'})
        angular.forEach($scope.guestList, function(item){
          $scope.usercsv.push({a:item.name,b:item.total_tickets,c:item.non_veg,d:item.txn_id});
        });
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
	return experienceFact;
}]);




