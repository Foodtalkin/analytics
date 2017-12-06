'use strict';

/* Controllers */

angular.module('app').controller('usersCtrl', ['$scope','userFact','UrlFact',
 function($scope, userFact, UrlFact){
	$scope.showDetails = false;
	$scope.mainpage = UrlFact.user;
    $scope.getList = function(url){
    	userFact.getList(url,function(response){
    		$scope.usersList = response.data.result.data;
    		console.log(response.data.result);
        	$scope.NextUrl = response.data.result.next_page_url;
        })
    }

    $scope.searchUser = function(){
        if($scope.searchTerm.length >= 3){
            var base = UrlFact.user+"?search="+encodeURI($scope.searchTerm);
            $scope.getList(base);
        }else if($scope.searchTerm.length == 0){
            $scope.getList($scope.mainpage);
        }
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
     }

     $scope.saveNotes = function(id){
        $scope.isDisabled = true;
        userFact.saveNotes(id, $scope.currentUser.notes, function(response){
            $scope.isDisabled = false;
            if(response){
                    $scope.showDetails = false;
                    $scope.getList($scope.mainpage);
                    var message ="Hurray!"
                        $('body').pgNotification({
                            style: 'bar',
                            message: message,
                            position: 'top',
                            timeout: 5000,
                            type: 'success'
                        }).show();
                }else{
                    var message ="Oops! somthing went wrong. Please try again"
                        $('body').pgNotification({
                            style: 'bar',
                            message: message,
                            position: 'top',
                            timeout: 5000,
                            type: 'error'
                        }).show();
                }
        })
     }
}])
.factory('userFact', ['$http','UrlFact', function($http, UrlFact){
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
				url: UrlFact.user+"/"+id
			}).then(function(response) {
	            callback(response);
	        });
    	}
        userFact.saveNotes = function(id, notes, callback){
            $http({
              method: 'PuT',
              url: UrlFact.user+'/'+id,
              data : {
                "notes":notes
              }
            }).then(function (response) {
                console.log(response);
                if(response.data.code === "200"){
                    callback(true);
                    //console.log(response);
                }else{
                  //Create an error Box and display the 
                  alert('something went wrong please try again after refreshing the page');
                  //console.log(response);
                  callback(false);
                }
            });
        }
	return userFact;
}])