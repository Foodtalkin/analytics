'use strict';

/* Controllers */

angular.module('app')

.controller('appfeedCtrl', ['$scope','appfeedFact','UrlFact', function($scope, appfeedFact, UrlFact) {
	// varibles declartion
    $scope.redeemFeedUrl = UrlFact.appfeed.redmption;
    $scope.purchaseFeedUrl = UrlFact.appfeed.purchase;
    $scope.eventPurchaseFeedUrl = UrlFact.appfeed.eventPurchase;
    $scope.signupFeedUrl = UrlFact.appfeed.signup;
    $scope.redeemptions =  {};
    $scope.purchases = {};
    $scope.signups = {};
    $scope.eventPurchases = {};

    // Data fatching functions definations
    $scope.GetRedeemFeed = function(url){
    	appfeedFact.getFeedData(url, function(response){
    		$scope.redeemptions = response.data.result.data;
    		$scope.redeemFeedNextUrl = response.data.result.next_page_url;
    	});
    }
    $scope.GetPurchaseFeed = function(url){
    	appfeedFact.getFeedData(url, function(response){
    		$scope.purchases = response.data.result.data;
    		$scope.purchaseFeedNextUrl = response.data.result.next_page_url;
    	});
    }
	$scope.GetEventPurchaseFeed = function(url){
		appfeedFact.getFeedData(url, function(response){
			$scope.eventPurchases = response.data.result.data;
			$scope.eventPurchaseFeedNextUrl = response.data.result.next_page_url;
			console.log($scope.eventPurchases);
		});
	}
    $scope.GetSignupFeed = function(url){
    	appfeedFact.getFeedData(url, function(response){
    		$scope.signups = response.data.result.data;
    		$scope.signupFeedNextUrl = response.data.result.next_page_url;
    	});
    }
    $scope.GetNextPage = function(url, type){
    	appfeedFact.getFeedData(url, function(response){
    		if(type == "redeem"){
    			// $scope.redeemptions = response.data.result.data;
    			$scope.redeemptions = $scope.redeemptions.concat(response.data.result.data);
    			$scope.redeemFeedNextUrl = response.data.result.next_page_url;
    		}else if(type == "purchase"){
    			// $scope.purchases = response.data.result.data;
    			$scope.purchases = $scope.purchases.concat(response.data.result.data);
    			$scope.purchaseFeedNextUrl = response.data.result.next_page_url;
    		}else if(type == "signup"){
    			// $scope.signups = response.data.result.data;
    			$scope.signups = $scope.signups.concat(response.data.result.data);
    			$scope.signupFeedNextUrl = response.data.result.next_page_url;
    		}else if(type == "event-purchase"){
				$scope.eventPurchases = $scope.eventPurchases.concat(response.data.result.data);
				$scope.eventPurchaseFeedNextUrl = response.data.result.next_page_url;
			}
    		
    	});
    }

    // getting data
		// disable as app integration closed
    /*$scope.GetRedeemFeed($scope.redeemFeedUrl);
    $scope.GetPurchaseFeed($scope.purchaseFeedUrl);
    $scope.GetSignupFeed($scope.signupFeedUrl);
    $scope.GetEventPurchaseFeed($scope.eventPurchaseFeedUrl);*/
}])
.factory('appfeedFact', ['$http', function($http){
	var appfeedFact = {};
	appfeedFact.getFeedData = function(url, callback){
		$http({
			method: 'GET',
			url: url
		}).then(function (response) {
			//console.log(response);
            callback(response);
        });
	}
	return appfeedFact;
}])