'use strict';

/* Controllers */

angular.module('app').controller('usersCtrl', ['$scope','userFact', function($scope, userFact){
	$scope.showDetails = false;
	$scope.mainpage = "http://api.foodtalk.in/privilege/user";
    $scope.getList = function(url){
    	userFact.getList(url,function(response){
    		$scope.usersList = response.data.result.data;
    		//console.log(response.data.result);
        	$scope.NextUrl = response.data.result.next_page_url;
        })
    }
    $scope.getList($scope.mainpage);
    $scope.nextPage = function(url){
    	userFact.getList(url,function(response){
    		console.log(response.data.result);
	    	$scope.usersList = $scope.usersList.concat(response.data.result.data);
    		$scope.NextUrl = response.data.result.next_page_url;
        })
    }
     $scope.OpenMessage = function(id){
    	$scope.showDetails = true;
    	
    	userFact.getredemption(id, function(response){
    		$scope.currentUser = response.data.result;
    		console.log(response.data.result);
    	})
    	// if($scope.currentUser.subscription.length == 0){
    	// 	$scope.unpaid = true;
    	// }else{
    	// 	$scope.unpaid = false;
    	// }
     }
}])
.factory('userFact', ['$http', function($http){
	var userFact = {}
	userFact.getList = function(url, callback){
    		$http({
				method: 'GET',
				url: url
			}).then(function(response) {
	            callback(response);
	        });
    	}
    	userFact.getredemption = function(id, callback){
    		$http({
				method: 'GET',
				url: "http://api.foodtalk.in/privilege/user/"+id
			}).then(function(response) {
	            callback(response);
	        });
    	}
	return userFact;
}])