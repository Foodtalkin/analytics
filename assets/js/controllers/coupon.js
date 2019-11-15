'use strict';

/* Controllers */

angular.module('app')
.controller('couponCtrl', ['$scope','couponFact', 'UrlFact', '$location',
 function($scope, couponFact, UrlFact, $location){
 	$scope.allList = {};
	$scope.Coupon = {};
	$scope.couponDetails = {};
	$scope.eventdatadisabled = true;
 	$scope.NextUrl = '';
	 $scope.$on('$viewContentLoaded', function(){
		 $location.url('/app/contact')
		 window.location = '#/app/contact'
	 });
	 return;
	$scope.getallList = function(){
        couponFact.getList(UrlFact.coupon, function(response){
			$scope.allList = response.data.result.data;
            $scope.NextUrl = response.data.result.next_page_url;
            console.log('next page', response.data.result.next_page_url)
		});
	}
     $scope.nextPage = function(url){
         console.log(url);
         if (url) {
             couponFact.getList(url, function (response) {
                 $scope.allList = $scope.allList.concat(response.data.result.data);
                 $scope.NextUrl = response.data.result.next_page_url;
             })
         }
     }
	$scope.getallList();
	$scope.OpenDetails = function(id){
		$scope.editDetails = false;
		$scope.hideForm = true;
        couponFact.getCouponDetails(id, function(response){
			$scope.couponDetails = response.data.result;
            $scope.couponDetails.is_disabled = $scope.couponDetails.is_disabled == 1
		})
	}

	$scope.onEditScreen = function(){
		if($scope.notificationDetails.screen == 'experiences'){
			$scope.eventdatadisabled = true;
		}else{
			$scope.eventdatadisabled = false;
		}
	}
	$scope.createCoupon = function() {
		$scope.isDisabled = true;
		var data = {
            code: $scope.Coupon.couponCode,
            description: $scope.Coupon.description,
            discount: $scope.Coupon.discount,
            duration: $scope.Coupon.duration,
            qty: $scope.Coupon.qty,
            expire_at: $scope.Coupon.expire_at,
            note: $scope.Coupon.note
		}
		console.log(data);
		couponFact.saveCouponCode(UrlFact.coupon, 'POST', data, function(response){
			$scope.isDisabled = false;
			console.log(response);
			if (response.data.code == 200) {
				$scope.Coupon = {};
				$scope.getallList();

				var message = "Hurray! New Coupon is created"

				$('body').pgNotification({
					style: 'bar',
					message: message,
					position: 'top',
					timeout: 5000,
					type: 'success'
				}).show();
			} else {
				var message = "Oops! somthing went wrong. Please try again"
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

	$scope.openedit = function() {
		$scope.editDetails = true;
	}
	$scope.openCreateform = function(){
		$scope.hideForm = false;
	}
	$scope.editCoupon = function(id){
		var data = {
            code: $scope.couponDetails.code,
            description: $scope.couponDetails.description,
            discount: $scope.couponDetails.discount,
            duration: $scope.couponDetails.duration,
            qty: $scope.couponDetails.qty,
            expire_at: $scope.couponDetails.expire_at,
            note: $scope.couponDetails.note
        }
        couponFact.saveCouponCode(UrlFact.coupon+'/'+id, 'PUT', data, function(response) {
			if (response.data.code == 200) {
				$scope.getallList();
				$scope.editDetails = false;
				var message ="Hurray! New Coupon is edited"
				$('body').pgNotification({
					style: 'bar',
					message: message,
					position: 'top',
					timeout: 5000,
					type: 'success'
				}).show();
			} else {
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

	$scope.deleteCoupon = function(id){
        couponFact.deleteCoupon(id, function(response) {
			if (response.data.code == 202) {
				$scope.getallList();
                $scope.editDetails = false;
                $scope.hideForm = false;
				var message = "Coupon is disabled"

				$('body').pgNotification({
					style: 'bar',
					message: message,
					position: 'top',
					timeout: 5000,
					type: 'success'
				}).show();
			} else {
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
}]).factory('couponFact', ['$http', 'UrlFact', function($http, UrlFact){
	var couponFact = {};
    couponFact.getList = function(url, callback){
		$http({
			method: 'GET',
			url: url
		}).then(function (response) {
            callback(response);
        })
	}
    couponFact.deleteCoupon = function(id, callback) {
		$http({
			method: 'DELETE',
			url: UrlFact.coupon + '/' + id
		}).then(function (response) {
            callback(response);
        });
	}
    couponFact.getCouponDetails = function(id, callback) {
		$http({
			method: 'GET',
			url: UrlFact.coupon + '/' + id
		}).then(function (response) {
			callback(response);
        });
	}
    couponFact.saveCouponCode = function(url, method, postData, callback) {
		$http({
			method: method,
			url: url,
			data: postData
		}).then(function(response){
			callback(response);
		});
	}

	return couponFact;
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
