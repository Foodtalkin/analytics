'use strict';

/* Controllers */

angular.module('app')
.controller('notificationCtrl', ['$scope','notificationFact', function($scope, notificationFact){
	$scope.Notification = {};
	$scope.notificationDetails = {};
	$scope.getallList = function(){
		notificationFact.getList(function(response){
			$scope.allList = response.data.result;
			console.log($scope.allList);
		});
	}
	$scope.getallList();
	$scope.OpenDetails = function(id){
		$scope.editDetails = false;
		$scope.hideForm = true;
		notificationFact.getNotificationDetails(id, function(response){
			console.log(response.data.result);
			$scope.notificationDetails = response.data.result;

			if($scope.notificationDetails.is_disabled == '1'){
				$scope.notificationDetails.is_disabled = true;
			}else{
				$scope.notificationDetails.is_disabled = false;
			}
		
		})
	}

	$scope.createNotification = function(){
// "userId": "1384",
		var data = {
					  "push_time": $scope.Notification.date + " " + $scope.Notification.time,
					  "push": {
					    "where": {
					      
					      
					    },
					    "data": {
					      "alert": $scope.Notification.msgtxt,
					      "badge": "Increment"
					    }
					  }
					}
					//console.log($scope.Notification.group);
		if($scope.Notification.group == 'all'){
			data.push.where.deviceType = {
					        "$in": [
					          "android", "ios"
					        ]
					      };
		}else if($scope.Notification.group == 'android'){
			//console.log('android');
			data.push.where.deviceType = {
					        "$in": [
					          "android"
					        ]
					      };
		}else if($scope.Notification.group == 'ios'){
			//console.log('ios');
			data.push.where.deviceType = {
					        "$in": [
					          "ios"
					        ]
					      };
		}
		console.log(data);
		notificationFact.sendNotification('http://api.foodtalk.in/privilege/push', 'POST', data, function(response){
			console.log(response);
			if(response.data.code == "200"){
				$scope.Notification = {};
                    $scope.getallList();
                    var message ="Hurray! New Notification is created"
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
                            position: top,
                            timeout: 5000,
                            type: 'error'
                        }).show();
                }
		})
	}
	
	$scope.openedit = function(){
		$scope.editDetails = true;
		$scope.notificationDetails.push_time = $scope.notificationDetails.push_time.split(' ');
		if($scope.notificationDetails.push.data.alert){
			$scope.notificationDetails.msg = $scope.notificationDetails.push.data.alert;
		}else{
			$scope.notificationDetails.msg = "";
		}
	}	
	$scope.openCreateform = function(){
		$scope.hideForm = false;
	}
	$scope.editNotification = function(id){
		//console.log($scope.notificationDetails.msg);
		// "userId": "1384",
		var data = {
					  "push_time": $scope.notificationDetails.push_time[0] + " " + $scope.notificationDetails.push_time[1],
					  "push": {
					    "where": {
					      "deviceType": {
					        
					      }
					    },
					    "data": {
					      "alert": $scope.notificationDetails.msg,
					      "badge": "Increment"
					    }
					  }
					}
		if($scope.myusergroup == 'all'){
			data.push.where.deviceType = {
				"$in": [
				          "android", "ios"
				        ]
			};
		}else if($scope.myusergroup == 'android'){
			data.push.where.deviceType = {
					        "$in": [
					          "android"
					        ]
					      };
		}else if($scope.myusergroup == 'ios'){
			data.push.where.deviceType = {
					        "$in": [
					          "ios"
					        ]
					      };
		}
		//console.log(data);
		notificationFact.sendNotification('http://api.foodtalk.in/privilege/push/'+id, 'PUT', data, function(response){
			//console.log(response);
			if(response.data.code == "200"){
                    $scope.getallList();
                    $scope.editDetails = false;
                    var message ="Hurray! New Notification is edited"
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
                            position: top,
                            timeout: 5000,
                            type: 'error'
                        }).show();
                }
		})
	}

	$scope.deleteNotification = function(id){
		notificationFact.deleteNotification(id, function(response){
			console.log(response);
			if(response.data.code == "202"){
				$scope.getallList();
                $scope.editDetails = false;
                $scope.hideForm = false;
                var message ="Notification is disabled"
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
                            position: top,
                            timeout: 5000,
                            type: 'error'
                        }).show();
                }
		})
	}
}]).factory('notificationFact', ['$http', function($http){
	var notificationFact = {};
	notificationFact.getList = function(callback){
		$http({
			method: 'GET',
			url: 'http://api.foodtalk.in/privilege/push'
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	notificationFact.deleteNotification = function(id, callback){
		$http({
			method: 'DELETE',
			url: 'http://api.foodtalk.in/privilege/push/'+id
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	notificationFact.getNotificationDetails = function(id, callback){
		$http({
			method: 'GET',
			url: 'http://api.foodtalk.in/privilege/push/'+id
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	notificationFact.sendNotification = function(url, method, postdata, callback){
		$http({
			method: method,
			url: url,
			data: postdata
		}).then(function(response){
			callback(response);
		})
	}
	return notificationFact;
}]).directive('timepicker', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            $(elem).timepicker({showSeconds: true,showMeridian: false}).on('show.timepicker', function(e) {
                var widget = $('.bootstrap-timepicker-widget');
                widget.find('.glyphicon-chevron-up').removeClass().addClass('pg-arrow_maximize');
                widget.find('.glyphicon-chevron-down').removeClass().addClass('pg-arrow_minimize');
            });
        }
    }
   })