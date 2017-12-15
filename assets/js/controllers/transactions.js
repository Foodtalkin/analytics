'use strict';

/* Controllers */

angular.module('app')
	.controller('transactionsCtrl', ['$scope', 'transactionsFact', function($scope, transactionsFact){
		$scope.getTransections = function(){
			transactionsFact.getTransections(function(response){
				$scope.txnHistory = response.data.result;
				$scope.createDownloadList();
			})
		}
		$scope.getTransections();

		$scope.options = {
         "sDom": "t",
            
            "destroy": true,
            "paging": false,
            "scrollCollapse": true
        };

        $scope.getTransectionsByDate = function(){
        	var start = moment($scope.startdate).format("YYYY-MM-DD");
        	var end = moment($scope.enddate).format("YYYY-MM-DD");
        	transactionsFact.getTransectionsByDate(start, end, function(response){
        		$scope.txnHistory = response.data.result;
        		$scope.createDownloadList();
        	})
        }


	    $scope.createDownloadList = function(){
	        $scope.usercsv = [];
	        $scope.usercsv.push({a:'Title',b:'Amount',c:'Txn Id' , d:'User Id', e:'Order Id', f:'Created At'})
	        angular.forEach($scope.txnHistory, function(item){
	            $scope.usercsv.push({a:item.title,b:item.txn_amount,c:item.txn_id,d:item.user_id,e:item.order_id, f:item.created_at});
	        });
	    }
	}])
	.factory('transactionsFact', ['$http', 'UrlFact', function($http, UrlFact){
		var transactionsFact = {};
		transactionsFact.getTransections = function(callback){
			$http({
				method: 'GET',
				url: UrlFact.transactions
			}).then(function(response) {
	            callback(response);
	        });
		}
		transactionsFact.getTransectionsByDate = function(start,end, callback){
			$http({
				method: 'GET',
				url: UrlFact.transactions+ '?from=' + start + '&to=' + end
			}).then(function(response) {
	            callback(response);
	        });
		}
		return transactionsFact;
	}])