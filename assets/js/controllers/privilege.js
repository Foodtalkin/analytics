'use strict';

/* Controllers */

angular.module('app')
    .controller('privilegeCtrl', ['$scope','privilegeFact','$rootScope','$location','Upload', 'cloudinary',
    function($scope, privilegeFact, $rootScope,$location, $upload, cloudinary) {
    	$scope.showForm = true;
    	$scope.showDetails = false;
    	$scope.cover = "";
    	$scope.restro = {};
    	$scope.RestaurantData = {};
	    	
	    $scope.getRestroList = function(){
	    	privilegeFact.getRestroList(function(response){
		    	$scope.restroList = response.data.result;
		    	console.log(response);
		    });
	    }
	    $scope.getRestroList();

	    $scope.cityList = [{
	    	   'id': '1',
	    	   'name': 'Delhi NCR',
	    	   'city_zone': [{
	    	   	    	'id' : '1',
	    	   	    	'name': 'Gurgaon'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '2',
	    	   	    	'name': 'Noida'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '3',
	    	   	    	'name': 'South Delhi'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '4',
	    	   	    	'name': 'North Delhi'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '5',
	    	   	    	'name': 'East Delhi'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '6',
	    	   	    	'name': 'West Delhi'   	
	    	   	   },
	    	   	   {
	    	   	    	'id' : '7',
	    	   	    	'name': 'Central Delhi'   	
	    	   	   }]	
	    	}];

	    $scope.createRestro = function(){
	    	if(!$scope.cover || $scope.cover == ""){
	    		alert('upload the image first then try again');
	    	}else{
	    		privilegeFact.createRestro($scope.restro.name, $scope.restro.one_liner,
	    		 $scope.restro.cost, $scope.cover, function(response){
	    		 	if(response){
	    		 		$scope.cover = "";
	    		 		$scope.restro = {};
	    		 		$rootScope.photos = [];
	    		 		$scope.files = {};
	    		 		$scope.CreateNewRestro.$setPristine();
			            $scope.getRestroList();

			            var message ="Hurray! New Restaurant is created. Next click on restaurant name in list and start adding outlet."
			            $('body').pgNotification({
	                        style: 'bar',
	                        message: message,
	                        position: 'top',
	                        timeout: 5000,
	                        type: 'success'
	                    }).show();
			        }else{
			            //alert("oops somthing went wrong try again");
			            var message ="Oops! somthing went wrong. Please try again"
			            $('body').pgNotification({
	                        style: 'bar',
	                        message: message,
	                        position: top,
	                        timeout: 5000,
	                        type: 'error'
	                    }).show();
			            $scope.createBtnRestro = false;
			        }
	    		 });
	    	}
	    }

	    $scope.openCreateform = function() {
	    	$scope.showForm = true;
    		$scope.showDetails = false;
	    }

	    $scope.OpenRestro = function(id) {
	    	$scope.showForm = false;
    		$scope.showDetails = true;
    		privilegeFact.getrestrodata(id, function(response){
    			console.log(response.data.result);
    			$scope.RestaurantData = response.data.result;
    			if($scope.RestaurantData.cuisine.length == 0){
    				$scope.noCusine = true;
    			}else{
    				$scope.noCusine = false;
    			}
    		})
	    }

	    $scope.getOutletOffers = function(id){
	    	privilegeFact.getOutletOffers(id, function(response){
	    		
	    	})
	    }

	    var d = new Date();
	    $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
	    //$scope.$watch('files', function() {
	    $scope.uploadFiles = function(files){
	      console.log(files);
	      $scope.files = files;
	      if (!$scope.files) return;
	      angular.forEach(files, function(file){
	        if (file && !file.$error) {
	          file.upload = $upload.upload({
	            url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
	            data: {
	              upload_preset: cloudinary.config().upload_preset,
	              tags: 'myphotoalbum',
	              context: 'photo=' + $scope.title,
	              file: file
	            }
	          }).progress(function (e) {
	            file.progress = Math.round((e.loaded * 100.0) / e.total);
	            file.status = "Uploading... " + file.progress + "%";
	          }).success(function (data, status, headers, config) {
	            $rootScope.photos = $rootScope.photos || [];
	            data.context = {custom: {photo: $scope.title}};
	            file.result = data;
	            $scope.cover = file.result.url;
	            //console.log($scope.store.cover);
	            $rootScope.photos.push(data);
	          }).error(function (data, status, headers, config) {
	            file.result = data;
	          });
	        }
	      });
	    };
		//});


	    $scope.dragOverClass = function($event) {
	      var items = $event.dataTransfer.items;
	      var hasFile = false;
	      if (items != null) {
	        for (var i = 0 ; i < items.length; i++) {
	          if (items[i].kind == 'file') {
	            hasFile = true;
	            break;
	          }
	        }
	      } else {
	        hasFile = true;
	      }
	      return hasFile ? "dragover" : "dragover-err";
	    };

    }])
    .factory('privilegeFact', ['$http', function($http){
    	var privilegeFact = {};
    	privilegeFact.getRestroList = function(callback){
    		$http({
				method: 'GET',
				url: 'http://stg-api.foodtalk.in/privilege/restaurant'
			}).then(function (response) {
	            callback(response);
	        });
    	}
    	privilegeFact.createRestro = function(name, one_liner, cost, card_image, callback){
		    $http({
		      method: 'POST',
		      url: 'http://stg-api.foodtalk.in/privilege/restaurant',
		      data : {
		        'name' : name,
		        'one_liner' : one_liner,
		        'cost' : cost,
		        'card_image' : card_image
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
		privilegeFact.getrestrodata = function(id,callback){
			$http({
				method: 'GET',
				url: 'http://stg-api.foodtalk.in/privilege/restaurant/'+id
			}).then(function (response) {
	            callback(response);
	        });
		}
		privilegeFact.getOutletOffers = function(id, callback){
			$http({
				method: 'GET',
				url: 'http://stg-api.foodtalk.in/privilege/outlet-offer/'+id
			}).then(function(response){
				callback(response);
			})
		}
		privilegeFact.getOutletImages = function(id, callback){
			$http({
				method: 'GET',
				url: ' http://stg-api.foodtalk.in/privilege/outlet/'+id+'/image'
			}).then(function(response){
				callback(response);
			})
		}
    	return privilegeFact;
    }])
