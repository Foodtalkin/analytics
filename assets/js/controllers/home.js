'use strict';

/* Controllers */

angular.module('app')
    .controller('HomeCtrl', ['$scope','sortData','homeFact', '$location', function($scope, sortData, homeFact, $location) {
        $scope.users = {};
        $scope.restaurant = {};
        $scope.topUsers = {};
        $scope.valuableUsers = {};
        $scope.analyticsSales = {};
        $scope.liveEventsData = {};
        $scope.allSalesData = {};
        $scope.onboardedUsersData = {};
        $scope.couponOnBoardPieChartData = {}
        $scope.userSubscriptionState = {}
        $scope.restaurantRatings = {}
        $scope.users.all = 0;
        $scope.users.paid = 0;
        $scope.users.unpaid = 0;
        $scope.users.trial = 0;
        window.location = '#/app/contact'
        return

        $scope.getareaChats = function(){
            sortData.doSorting(function(response){
                $scope.allData = response;
                $scope.userOnboard = $scope.allData.user7days;
                $scope.offerRedemp = $scope.allData.Offers7days;
            });
        }

        $scope.getRestaurantStats = function(){
            homeFact.getRestaurant("30","10", function(response){
                //console.log(response);
                $scope.restaurant = response.data.result;
            });
        }

        $scope.getUsersStats = function(){
            //disable as app integration closed
            /*homeFact.getTopUsers("30","10", function(response){
                //console.log(response);
                $scope.topUsers = response.data.result;
            });*/
        }

        $scope.getValuableUsers = function(){
            //disable as app integration closed
            /*homeFact.getValuableUsersData(function(response){
                $scope.valuableUsers = response.data.data;
            });*/
        }

        $scope.getAnalyticsSales = function(){
          //disable as app integration closed
            /*homeFact.getSalesAnalytics(function(response){
                $scope.allSalesData = response.data;
                $scope.analyticsSales = $scope.allSalesData.daily;
            });*/
        }

        $scope.getAnalyticsCouponOnBoard = function(){
            homeFact.getAnalyticsCouponOnBoard(function(response){
                $scope.couponOnBoardPieChartData = response.data;
                $scope.couponOnBoard = response.data.users.map(function (item) {
                    return getpercent(item.total, response.data.total);
                })
            });
        }

        $scope.getAnalyticsCouponOnBoardConfig = function(data){
            return {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Browser market shares January, 2015 to May, 2015'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',

                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: data
                }]
            }
        }

        $scope.getLiveEvents = function(){
            homeFact.getLiveEventsData(function(response){
                $scope.liveEventsData = {};
                $scope.liveEventsData = response.data.data;
            });
        }

        $scope.getUsersStats();
        $scope.getUserChart = function(){
            homeFact.getUsers("30", function(response){
                //console.log(response);
                $scope.UserCounts = response.data.result.overall;
                $scope.userpie = [getpercent(response.data.result.overall[1].count, response.data.result.overall[0].count), getpercent(response.data.result.overall[3].count, response.data.result.overall[0].count), getpercent(response.data.result.overall[2].count, response.data.result.overall[0].count)];
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

        $scope.getOnboardedUsersData = function(){
            homeFact.getOnboardedUsersData(function(response){
                $scope.onboardedUsersData = response.data;
            });
        }

        $scope.getRestaurantRating = function(){
            homeFact.getRestaurantRatingData(function(response){
                $scope.restaurantRatings = {};
                $scope.restaurantRatings = response.data.result;
            });
        }

        $scope.getUserSubscriptionState = function () {
            //disable as app integration closed
            /*homeFact.getUserSubscriptionState(function (response) {
                $scope.userSubscriptionState = response.data.result;
                let total = $scope.userSubscriptionState.paidUserCount + $scope.userSubscriptionState.expiredSubscriptionCount + $scope.userSubscriptionState.trailUserCount + $scope.userSubscriptionState.userNotSubscribeCount + $scope.userSubscriptionState.trailExpiredUserCount;

                $scope.userStatePie = [
                    getpercent($scope.userSubscriptionState.paidUserCount, total),
                    getpercent($scope.userSubscriptionState.expiredSubscriptionCount, total),
                    getpercent($scope.userSubscriptionState.trailUserCount, total),
                    getpercent($scope.userSubscriptionState.userNotSubscribeCount, total),
                    getpercent($scope.userSubscriptionState.trailExpiredUserCount, total)
                ];
            })*/
        }

        // call Charts
        $scope.getRedemptionchart();
        $scope.getUserChart();
        $scope.getRestaurantStats();
        $scope.getareaChats();
        $scope.getAnalyticsSales();
        $scope.getLiveEvents();
        $scope.getValuableUsers();
        $scope.getOnboardedUsersData();
        $scope.getAnalyticsCouponOnBoard();
        $scope.getRestaurantRating();
        $scope.getUserSubscriptionState();
        // end call chart




        $scope.userBarOption ={
          chart: {
            type: "multiBarChart",
            height: 420,
            margin: {

              left: 15
            },
            clipEdge: true,
            duration: 500,
            tooltips: true,
            tooltipContent: function (key, x, y, e, graph) {
                  return '<p>' + key + '</p><p>' + y + ' on '+ x + '</p>';
                },
            stacked: false,
            color: [

                        '#e51c23',
                        '#ff9800',
                        '#259b24',//antarctica
                        '#601adc'
                ],
            xAxis: {
              tickFormat: function(d) {
                        return d3.time.format('%d/%m')(new Date(d))
                    }
            },
            reduceXTicks: false,
            showControls: false,
            yAxis: {
              tickFormat: d3.format('d')
            }
          }
        }

        $scope.nvd3_area_options = {
            chart: {
                type: 'stackedAreaChart',
                height: 400,
                margin: {
                    left: 15
                },
                x: function(d) {
                    return d[0]
                },
                y: function(d) {
                    return d[1]
                },
                color: [
                   '#601adc',
                    '#e91e63',
                    '#ff9800',
                    '#742282',
                    '#3fb55f',
                    '#07e2ff'

                ],
                useInteractiveGuideline: true,
                rightAlignYAxis: false,
                transitionDuration: 500,
                showControls: false,
                clipEdge: true,
                xAxis: {
                    tickFormat: function(d) {
                        return d3.time.format('%d/%m/%Y')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: d3.format('d')
                },
                legend: {
                    margin: {
                        top: 5
                    }
                }
            }
        }

        $scope.analyticsSalesOption ={
            chart: {
                type: "multiBarChart",
                height: 500,
                margin: {
                },
                clipEdge: true,
                duration: 500,
                tooltips: true,
                tooltipContent: function (key, x, y, e, graph) {
                    return '<p>' + key + '</p><p>' + y + ' on '+ x + '</p>';
                },
                stacked: false,
                color: [
                    '#ff9800',
                    '#259b24',
                    '#e51c23'
                ],
                xAxis: {
                    tickFormat: function(d) {
                        var arr = d.split(',');
                        if (arr.length == 1) {
                            return d3.time.format('%d/%m')(new Date(arr[0]))
                        }
                        return d3.time.format('%d/%m')(new Date(arr[0])) + ' - ' + d3.time.format('%d/%m')(new Date(arr[1]))
                    }
                },
                reduceXTicks: false,
                showControls: false,
                yAxis: {
                    tickFormat: d3.format('d')
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
                        1: 'UnPaid',
                        2: 'trial'
                    }
                },sliceColors: ['#259b24 ',
                        '#e51c23',
                        '#ff9800']
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
                },sliceColors: ['#601adc',
                    '#e91e63',
                    '#ff9800',
                    '#742282',
                    '#3fb55f',
                    '#07e2ff']

            };
        })

        $scope.$watch('couponOnBoard', function(){
            $scope.coupon_pie_options = {
                type: 'pie',
                width: '200',
                height: '200',
                tooltipFormat: '{{offset:offset}} ({{percent.1}}%)',
                transitionDuration: 500,
                tooltipValueLookups: {
                    'offset': $scope.couponOnBoardPieChartData.users.map(function (item) {
                        return item.code
                    })
                }
            };
        })

        $scope.$watch('userStatePie', function() {
            $scope.user_state_pie_options = {
                type: 'pie',
                width: '200',
                height: '200',
                tooltipFormat: '{{offset:offset}} ({{percent.1}}%)',
                transitionDuration: 500,
                tooltipValueLookups: {
                    'offset': {
                        0: 'Paid User',
                        1: 'Expired Subscription',
                        2: 'Active trials',
                        3: 'Only Signed up',
                        4: 'Trail Expired'
                    }
                }
            };
        });
    }])
    .factory('homeFact', ['$http', 'UrlFact', function($http, UrlFact){
    	var homeFact = {};
    	homeFact.getUsers = function(days, callback){
        //disable as app integration closed
    		/*$http({
				method: 'GET',
				url: UrlFact.home.user +days
			}).then(function (response) {
	            callback(response);
	        });*/
    	}

    	homeFact.getredemption = function(days, callback){
    		$http({
				method: 'GET',
				url: UrlFact.home.redemption+days
			}).then(function (response) {
	            callback(response);
	        });
    	}

    	homeFact.getRestaurant = function(days,top, callback){
    		$http({
				method: 'GET',
				url: UrlFact.home.restaurants+days+'/'+top
			}).then(function (response) {
	            callback(response);
	        });
    	}

        homeFact.getTopUsers = function(days,top, callback){
            $http({
                method: 'GET',
                url: UrlFact.home.topuser+days+'/'+top
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getValuableUsersData = function(callback){
            $http({
                method: 'GET',
                url: UrlFact.privilege.valuableUsers
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getSalesAnalytics = function(callback){
            $http({
                method: 'GET',
                url: UrlFact.privilege.salesRevenue
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getAnalyticsCouponOnBoard = function (callback) {
            $http({
                method: 'GET',
                url: UrlFact.privilege.couponOnBoardPieChart
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getOnboardedUsersData = function(callback){
            $http({
                method: 'GET',
                url: UrlFact.privilege.onboardedUsersCount
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getLiveEventsData = function(callback){
            $http({
                method: 'GET',
                url: UrlFact.privilege.liveEvents
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getRestaurantRatingData = function (callback) {
            $http({
                method: 'GET',
                url: UrlFact.privilege.restaurantRating
            }).then(function (response) {
                callback(response);
            });
        }

        homeFact.getUserSubscriptionState = function (callback) {
            $http({
                method: 'GET',
                url: UrlFact.privilege.userSubscriptionState
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

            function barformat(date, count){
                //var array = date.split('-');
                var temp = {};
                //var x = [Date.UTC(parseInt(array[0]), parseInt(array[1])-1, parseInt(array[2]))];
                var y = parseInt(count);
                temp.x = date;
                temp.y = y;
                return temp;
            }

    		homeFact.getUsers("7", function(response){
    			userApi = response.data.result;
    			// paid user Last 7 days
                //console.log(userApi);

				// unpaid user last 7 days
				var myunpaidobj = {
    				"key" : "New Users",
                    // lineColor:"red",
    				"values" : []
    			}
    			angular.forEach(userApi.datewise.total, function(value, key) {
				  var temp = barformat(value.date, value.count);
				  myunpaidobj.values.push(temp);
				});
				allData.user7days.push(myunpaidobj);
                // unpaid user last 7 days
                var mytrialobj = {
                    "key" : "Trial",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi.datewise.trial, function(value, key) {
                  var temp = barformat(value.date, value.count);
                  mytrialobj.values.push(temp);
                });
                allData.user7days.push(mytrialobj);

                var mypaidobj = {
                    "key" : "Paid",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi.datewise.paid, function(value, key) {
                  var temp = barformat(value.date, value.count);
                  mypaidobj.values.push(temp);
                });
                allData.user7days.push(mypaidobj);

                var mypaidobj = {
                    "key" : "Coupon Used",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi.datewise.couponUsed, function(value, key) {
                  var temp = barformat(value.date, value.count);
                  mypaidobj.values.push(temp);
                });
                allData.user7days.push(mypaidobj);
    		});

    		homeFact.getUsers("30", function(response){
    			userApi30 = response.data.result;
    			// paid user 30 days

				// unpaid user 30 days
				var myunpaidobj = {
    				"key" : "New Users",
    				// lineColor:"red",
                    "values" : []
    			}
    			angular.forEach(userApi30.datewise.total, function(value, key) {
				   var temp = barformat(value.date, value.count);
				  myunpaidobj.values.push(temp);
				});
				allData.user30days.push(myunpaidobj);

                var mytrialobj = {
                    "key" : "Trial",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi30.datewise.trial, function(value, key) {
                  var temp = barformat(value.date, value.count);
                  mytrialobj.values.push(temp);
                });
                allData.user30days.push(mytrialobj);

                var mypaidobj = {
                    "key" : "Paid",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi30.datewise.paid, function(value, key) {
                   var temp = barformat(value.date, value.count);
                  mypaidobj.values.push(temp);
                });
                allData.user30days.push(mypaidobj);

                var mypaidobj = {
                    "key" : "Coupon Used",
                    // lineColor:"red",
                    "values" : []
                }
                angular.forEach(userApi30.datewise.couponUsed, function(value, key) {
                   var temp = barformat(value.date, value.count);
                  mypaidobj.values.push(temp);
                });
                allData.user30days.push(mypaidobj);
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
