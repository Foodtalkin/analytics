'use strict';

/* Controllers */

angular.module('app')
    .controller('HomeCtrl', ['$scope','sortData','homeFact', function($scope, sortData, homeFact) {
        $scope.users = {};
        $scope.restaurant = {};
        $scope.topUsers = {};
        $scope.users.all = 0;
        $scope.users.paid = 0;
        $scope.users.unpaid = 0;
        $scope.getareaChats = function(){
            sortData.doSorting(function(response){
                $scope.allData = response;
                $scope.userOnboard = $scope.allData.user7days;
                $scope.offerRedemp = $scope.allData.Offers7days;
                console.log($scope.allData);
            });
        }
        	
        $scope.getRestaurantStats = function(){
            homeFact.getRestaurant("30","10", function(response){
                console.log(response);
                $scope.restaurant = response.data.result;
            });
        }
        
        $scope.getUsersStats = function(){
            homeFact.getTopUsers("30","10", function(response){
                console.log(response);
                $scope.topUsers = response.data.result;
            });
        }  

        $scope.getUsersStats();
        $scope.getUserChart = function(){
            homeFact.getUsers("30", function(response){
                $scope.UserCounts = response.data.result.overall;
                $scope.userpie = [getpercent(response.data.result.overall[1].count, response.data.result.overall[0].count), getpercent(response.data.result.overall[2].count, response.data.result.overall[0].count)];
                //console.log($scope.userpie);
            });
        }
            
        $scope.getRedemptionchart = function(){
            homeFact.getredemption("30", function(response){
                $scope.offerall = response.data.result.overall;
                $scope.appetizer = parseInt($scope.offerall[0].count);
                $scope.Mains = parseInt($scope.offerall[1].count);
                $scope.cocktails = parseInt($scope.offerall[2].count);
                $scope.off15 = parseInt($scope.offerall[3].count);
                $scope.off20 = parseInt($scope.offerall[4].count);
                $scope.buffet = parseInt($scope.offerall[5].count);
                $scope.offertotalredmp = $scope.appetizer + $scope.Mains + $scope.cocktails + $scope.off15 + $scope.off20 + $scope.buffet;
                $scope.offerpie = [getpercent($scope.appetizer, $scope.offertotalredmp),
                getpercent($scope.Mains, $scope.offertotalredmp),
                getpercent($scope.cocktails, $scope.offertotalredmp),
                getpercent($scope.off15, $scope.offertotalredmp),
                getpercent($scope.off20, $scope.offertotalredmp),
                getpercent($scope.buffet, $scope.offertotalredmp)];
            });
        }
            
        function getpercent(a, t) {
            var temp = a * 100 / t;
            return temp;
        }
        // call Charts
        $scope.getRedemptionchart();
        $scope.getUserChart();
        $scope.getRestaurantStats();
        $scope.getareaChats();
        // end call chart


        // chart options
    	$scope.user_line_options = {
            chart: {
                type: 'lineChart',
                height: 400,
                x: function(d) {
                    return d[0]
                },
                y: function(d) {
                    return d[1]
                },
                color: [
                    '#259b24',
                    '#e51c23',
                    '#212121'//antarctica

                ],
                useInteractiveGuideline: true,
                transitionDuration: 500,
                xAxis: {
                    tickFormat: function(d) {
                        return d3.time.format('%d/%m/%Y')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: d3.format("")
                }
            }
        }

        $scope.offer_line_options = {
            chart: {
                type: 'lineChart',
                height: 400,
                x: function(d) {
                    return d[0]
                },
                y: function(d) {
                    return d[1]
                },
                color: [
                    '#673ab7',
                    '#e91e63',
                    '#ff9800',
                    '#9c27b0',
                    '#3f51b5', 
                    '#ffc107'

                ],
                useInteractiveGuideline: true,
                transitionDuration: 500,
                xAxis: {
                    tickFormat: function(d) {
                        return d3.time.format('%d/%m/%Y')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: d3.format("")
                }
            }
        }

        $scope.$watch('userpie', function() {
            $scope.user_pie_options = {
                type: 'pie',
                width: '200',
                height: '200',
                tooltipFormat: '{{offset:offset}} ({{percent.1}}%)',
                transitionDuration: 500,
                tooltipValueLookups: {
                    'offset': {
                        0: 'Paid',
                        1: 'Un Paid'
                    }
                },sliceColors: ['#259b24 ',
                        '#e51c23']
            };
        });
            
        $scope.$watch('offerpie', function(){
            $scope.offer_pie_options = {
                type: 'pie', 
                width: '200',
                height: '200',
                tooltipFormat: '{{offset:offset}} ({{percent.1}}%)',
                transitionDuration: 500,
                tooltipValueLookups: {
                    'offset': {
                        0: '1+1 Appetizer ' ,
                        1: '1+1 Main Course ',
                        2: '1+1 Cocktail ',
                        3: '15% off on Food & Drinks ',
                        4: '20% off on Food only ',
                        5: '1+1 on Buffet '
                    }
                },sliceColors: ['#673ab7',
                        '#e91e63',
                        '#ff9800',
                        '#9c27b0',
                        '#3f51b5', 
                        '#ffc107']

            };
        })
            

    }])
    .factory('homeFact', ['$http', function($http){
    	var homeFact = {};
    	homeFact.getUsers = function(days, callback){
    		$http({
				method: 'GET',
				url: 'http://api.foodtalk.in/privilege/analytics/user/'+days
			}).then(function (response) {
	            callback(response);
	        });
    	}

    	homeFact.getredemption = function(days, callback){
    		$http({
				method: 'GET',
				url: 'http://api.foodtalk.in/privilege/analytics/redemption/'+days
			}).then(function (response) {
	            callback(response);
	        });
    	}

    	homeFact.getRestaurant = function(days,top, callback){
    		$http({
				method: 'GET',
				url: 'http://api.foodtalk.in/privilege/analytics/restaurants/'+days+'/'+top
			}).then(function (response) {
	            callback(response);
	        });
    	}

        homeFact.getTopUsers = function(days,top, callback){
            $http({
                method: 'GET',
                url: 'http://api.foodtalk.in/privilege/analytics/topuser/'+days+'/'+top
            }).then(function (response) {
                callback(response);
            });
        }
    	return homeFact;
    }]).factory('sortData', ['homeFact', function(homeFact){
    	var sortData = {};
    	sortData.doSorting =function(callback){
    		var userApi = {};
    		var offerApi = {};
    		var userApi30 = {};
    		var offerApi30 = {};
    		var restroApi = {};
    		var allData = {
    			"user7days" : [],
    			"user30days" : [],
    			"Offers7days" : [],
    			"Offers30days" : []
    		};

            function dateformat(date, count){
                var array = date.split('-');
                var temp = [Date.UTC(parseInt(array[0]), parseInt(array[1])-1, parseInt(array[2])), parseInt(count)];
                return temp;
            }

    		homeFact.getUsers("7", function(response){
    			userApi = response.data.result;
    			// paid user Last 7 days
    			var mypaidobj = {
    				"key" : "Paid",
                    // lineColor:"red",
    				"values" : []
    			}
    			angular.forEach(userApi.datewise.paid, function(value, key) {
                  var temp = dateformat(value.date, value.count);
				  mypaidobj.values.push(temp);
				});
				allData.user7days.push(mypaidobj);

				// unpaid user last 7 days
				var myunpaidobj = {
    				"key" : "unPaid",
                    // lineColor:"red",
    				"values" : []
    			}
    			angular.forEach(userApi.datewise.unpaid, function(value, key) {
				  var temp = dateformat(value.date, value.count);
				  myunpaidobj.values.push(temp);
				});
				allData.user7days.push(myunpaidobj);

    		});
    		
    		homeFact.getUsers("30", function(response){
    			userApi30 = response.data.result;
    			// paid user 30 days
    			var mypaidobj = {
    				"key" : "Paid",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(userApi30.datewise.paid, function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  mypaidobj.values.push(temp);
				});
				allData.user30days.push(mypaidobj);
				// unpaid user 30 days
				var myunpaidobj = {
    				"key" : "unPaid",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(userApi30.datewise.unpaid, function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myunpaidobj.values.push(temp);
				});
				allData.user30days.push(myunpaidobj);
    		})

    		homeFact.getredemption("7", function(response){
    			offerApi = response.data.result;
    			var datewise = offerApi.datewise;
                // total 
                // var myOverallobj = {
                //     "key" : "Total",
                //     // lineColor:"red",
                //     "values" : []
                // }
                // angular.forEach(datewise, function(value, key) {
                //     console.log(value);
                //    var temp = dateformat(value.date, value.count);
                //   myOverallobj.values.push(temp);
                // });
                // allData.Offers7days.push(myOverallobj);

    			// offer 1+1 appetizer
    			var myOverallobj = {
    				"key" : "1+1 Appetizer",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['1'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);

				// offer main course
				var myOverallobj = {
    				"key" : "1+1 Main",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['2'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);

				// offer Cocktail
				var myOverallobj = {
    				"key" : "1+1 Cocktail",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['3'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);

				// 15% off on Food & Drinks
				var myOverallobj = {
    				"key" : "15% off on Food & Drinks",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['4'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);

				// 20% off on Food only
				var myOverallobj = {
    				"key" : "20% off on Food only",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['5'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);

				// 1+1 on Buffet
				var myOverallobj = {
    				"key" : "1+1 on Buffet",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['6'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers7days.push(myOverallobj);
    		});
    		homeFact.getredemption("30", function(response){
    			offerApi30 = response.data.result;
    			var datewise = offerApi30.datewise;

    			// offer 1+1 appetizer
    			var myOverallobj = {
    				"key" : "1+1 Appetizer",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['1'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);
				// offer main course
				var myOverallobj = {
    				"key" : "1+1 Main",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['2'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);

				// offer Cocktail
				var myOverallobj = {
    				"key" : "1+1 Cocktail",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['3'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);

				// 15% off on Food & Drinks
				var myOverallobj = {
    				"key" : "15% off on Food & Drinks",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['4'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);

				// 20% off on Food only
				var myOverallobj = {
    				"key" : "20% off on Food only",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['5'], function(value, key) {
				   var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);

				// 1+1 on Buffet
				var myOverallobj = {
    				"key" : "1+1 on Buffet",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(datewise['6'], function(value, key) {
				    var temp = dateformat(value.date, value.count);
				  myOverallobj.values.push(temp);
				});
				allData.Offers30days.push(myOverallobj);
    		})
    		callback(allData);
    	}
    	return sortData;
    }])