'use strict';

/* Controllers */

angular.module('app')

.controller('experienceCtrl', ['$scope','experienceFact', function($scope,experienceFact) {
	var mainurl = 'http://stg-api.foodtalk.in/privilege/experiences';
	
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
    		console.log(response);
    	})
    }

}])
.factory('experienceFact', ['$http', function($http){
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
			url: " http://stg-api.foodtalk.in/privilege/experiences/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	return experienceFact;
}]);




