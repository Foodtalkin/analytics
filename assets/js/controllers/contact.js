'use strict';

/* Controllers */

angular.module('app')
    .controller('contactCtrl', ['$scope','$location','contactFact','UrlFact',
     function($scope,$location,contactFact, UrlFact) {
	    $scope.showDetails = false;
	    $scope.mainpage = UrlFact.contact;
	    $scope.getList = function(url){
	    	contactFact.getList(url,function(response){
	    		$scope.contactData = response.data.result.data;
	        	$scope.NextUrl = response.data.result.next_page_url;
	        })
	    }
	    $scope.getList($scope.mainpage);
	    $scope.nextPage = function(url){
	    	contactFact.getList(url,function(response){
	    		console.log(response.data.result);
		    	$scope.contactData = $scope.contactData.concat(response.data.result.data);
	    		$scope.NextUrl = response.data.result.next_page_url;
	        })
	    }
        $scope.OpenMessage = function(data){
        	$scope.showDetails = true;
        	$scope.currentMsg = data;
	       	console.log($scope.currentMsg);
        }
        $scope.markDone = function(id, status){
        	var active = "";
        	if(status == '1'){
        		active = "0";
        	}else{
        		active = "1";
        	}
        	contactFact.changeStauts(id, active, function(response){
        		if(response){
        			$scope.showDetails = false;
        			$scope.getList($scope.mainpage);
                    var message ="Hurray! Status is changed"
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
    .factory('contactFact', ['$http', 
    	function($http){
    	var contactFact = {};
    	contactFact.getList = function(url, callback){
    		$http({
				method: 'GET',
				url: url
			}).then(function(response) {
	            callback(response);
	        });
    	}
    	contactFact.changeStauts = function(id, active, callback){
		    console.log(active);
		      $http({
		          method: 'PUT',
		          url: UrlFact.contact+'/'+id,
		          data : {status:active}
		        }).then(function (response) {
		            if(response.data.message === "Success"){
		                callback(true);
		                console.log(response);
		            }else{
		              //Create an error Box and display the 
		              console.log(response);
		              callback(false);

		            }
		          });
		  }

    	return contactFact;
    }])