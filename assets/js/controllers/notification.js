'use strict';

/* Controllers */

angular.module('app')
.controller('notificationCtrl', ['$scope','notificationFact', 'UrlFact', function($scope, notificationFact, UrlFact){
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
		$scope.isDisabled = true;
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

		if($scope.Notification.city == "1"){
			data.push.where.city_id = "1";
		}else if($scope.Notification.city == "2"){
			data.push.where.city_id = "2";
		}else{
			delete data.push.where.city_id;
		}
		if($scope.Notification.group == 'all'){
			delete data.push.where.deviceType;
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
		notificationFact.sendNotification(UrlFact.notification, 'POST', data, function(response){
			$scope.isDisabled = false;
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
		
		if($scope.notificationDetails.push.where.deviceType){
			if($scope.notificationDetails.push.where.deviceType.$in[0][0] == "android"){
				$scope.notificationDetails.myusergroup = 'android';
			}else if($scope.notificationDetails.push.where.deviceType.$in[0][0] == "ios"){
				$scope.notificationDetails.myusergroup = 'ios';
			}
		}else{
			$scope.notificationDetails.myusergroup = 'all';
		}
		console.log($scope.notificationDetails.myusergroup);
	}	
	$scope.openCreateform = function(){
		$scope.hideForm = false;
	}
	$scope.editNotification = function(id){
		//console.log($scope.notificationDetails.msg);
		// "userId": "1384",
		console.log($scope.notificationDetails.myusergroup);
		var data = {
					  "push_time": $scope.notificationDetails.push_time[0] + " " + $scope.notificationDetails.push_time[1],
					  "push": {
					    "where": {
					      
					    },
					    "data": {
					      "alert": $scope.notificationDetails.msg,
					      "badge": "Increment"
					    }
					  }
					}
		if($scope.notificationDetails.myusergroup == 'all'){
			delete data.push.where.deviceType;
		}else if($scope.notificationDetails.myusergroup == 'android'){
			data.push.where.deviceType = {
					        "$in": [
					          "android"
					        ]
					      };
		}else if($scope.notificationDetails.myusergroup == 'ios'){
			data.push.where.deviceType = {
					        "$in": [
					          "ios"
					        ]
					      };
		}

		if($scope.userCity == "1"){
			data.push.where.city_id = "1";
		}else if($scope.userCity == "2"){
			data.push.where.city_id = "2";
		}else{
			delete data.push.where.city_id;
		}
		console.log(data);
		notificationFact.sendNotification(UrlFact.notification+'/'+id, 'PUT', data, function(response){
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
}]).factory('notificationFact', ['$http', 'UrlFact', function($http, UrlFact){
	var notificationFact = {};
	notificationFact.getList = function(callback){
		$http({
			method: 'GET',
			url: UrlFact.notification
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	notificationFact.deleteNotification = function(id, callback){
		$http({
			method: 'DELETE',
			url: UrlFact.notification+'/'+id
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	notificationFact.getNotificationDetails = function(id, callback){
		$http({
			method: 'GET',
			url: UrlFact.notification+'/'+id
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