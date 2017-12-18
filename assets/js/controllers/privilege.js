'use strict';

/* Controllers */

angular.module('app')
    .controller('privilegeCtrl', ['$scope','privilegeFact','$rootScope','$location','Upload', 'cloudinary','$http',
    function($scope, privilegeFact, $rootScope,$location, $upload, cloudinary,$http) {
    	$scope.showForm = true;
    	$scope.showDetails = false;
    	$scope.cover = "";
    	$scope.restro = {};
    	$scope.RestaurantData = {};
    	$scope.Currunt = {};
    	$scope.Currunt.outlet = {};
    	$scope.Currunt.offer = {};
    	$scope.default = {};
    	$scope.default.defaultOffersList = [];
    	$scope.openViaDetails = false;
    	$scope.editing = false;
	    	
	    $scope.getRestroList = function(){
	    	privilegeFact.getRestroList(function(response){
		    	$scope.restroList = response.data.result;
		    	console.log(response);
		    });
	    }
	    $scope.getRestroList();

	    privilegeFact.getCusineList(function(response){
	    	$scope.cuisineList = response.data.result;
	    })

	    privilegeFact.getofferList(function(response){
	    	$scope.default.defaultOffersList = response.data.result;
	    })
	    
// create calls
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
	    		 		$scope.Currunt.RestroId = response.data.result.id;
	    		 		$scope.openCuisineForm();
			        }else{
			            //alert("oops somthing went wrong try again");
			            var message ="Oops! somthing went wrong. Please try again"
			            $('body').pgNotification({
	                        style: 'bar',
	                        message: message,
	                        position: 'top',
	                        timeout: 5000,
	                        type: 'error'
	                    }).show();
			            $scope.createBtnRestro = false;
			        }
	    		 });
	    	}
	    }

	    $scope.addCuisine = function(){
	    	console.log($scope.Currunt);
	    	var temp = [];
	    	angular.forEach($scope.Currunt.cuisineList, function(value, key){
	    		temp.push(value.id);
	    	})
	    	privilegeFact.addCuisine($scope.Currunt.RestroId, temp, function(response){
	    		if(response){
	    			console.log($scope.openViaDetails);
	    			if($scope.openViaDetails == true){
	    				$scope.OpenRestro($scope.Currunt.RestroId);
	    				$scope.openViaDetails = false;
	    			}else{
	    				$scope.openprimaryCuisine();
	    				$scope.openViaDetails = false;
	    			}
	    			
	    		}else{
			            //alert("oops somthing went wrong try again");
			            var message ="Oops! somthing went wrong. Please try again"
			            $('body').pgNotification({
	                        style: 'bar',
	                        message: message,
	                        position: 'top',
	                        timeout: 5000,
	                        type: 'error'
	                    }).show();
			            $scope.createBtnRestro = false;
			        }
	    	})
	    }
	    $scope.makePrimaryCuisine = function(){
	    	privilegeFact.makePrimaryCuisine($scope.Currunt.RestroId,$scope.Currunt.primary, function(response){
	    		console.log(response);
	    		if($scope.openViaDetails == true){
    				$scope.OpenRestro($scope.Currunt.RestroId);
    				$scope.openViaDetails = false;
    			}else{
    				$scope.opencreateOutletform();
    				$scope.openViaDetails = false;
    			}
	    		
	    	})
	    }
	    $scope.primaryButtonClick = function(id){
	    	$scope.Currunt.primary = id;
	    	$scope.makePrimaryCuisine();
	    	$scope.OpenRestro($scope.Currunt.RestroId);
	    }

	    // city areas for outlet
	    $scope.zonelist = [];
		  $scope.delzone = [
		      {"name": "Gurgaon", "id": "1"},
		      {"name": "Noida", "id": "2"},
		      {"name": "South Delhi", "id": "3"},
		      {"name": "North Delhi", "id": "4"},
		      {"name": "East Delhi", "id": "5"},
		      {"name": "West Delhi", "id": "6"},
		      {"name": "Central Delhi", "id": "7"}
		    ];

		  $scope.mumbzone = [
		      {"name": "Western Suburbs", "id": "8"},
		      {"name": "Eastern Suburbs", "id": "9"},
		      {"name": "Harbour Suburbs", "id": "10"},
		      {"name": "South Mumbai", "id": "11"}
		    ];

		  $scope.selectCityChange = function(){
		  	
		    if($scope.Currunt.outlet.city_id == 1){
		      $scope.zonelist = $scope.delzone;
		      $http.get('assets/js/controllers/delhiarea.js').success(function(data) {
		       $scope.arealist = data;
		      });
		    }else if($scope.Currunt.outlet.city_id == 2){
		      $scope.zonelist = $scope.mumbzone;
		      console.log($scope.zonelist);
		      $http.get('assets/js/controllers/mumbaiarea.js').success(function(data) {
		       $scope.arealist = data;
		      });
		    }else{
		    	console.log($scope.Currunt.outlet.city_id);
		    }
		  }

		$scope.createOutlet = function(){
			if(!$scope.Currunt.outlet.city_id || !$scope.Currunt.outlet.city_zone_id || !$scope.Currunt.outlet.area ){
				// privilegeFact.createOutlet
				console.log($scope.Currunt.outlet);
				alert('all Fields are required');
				return;
			}else{
				//$scope.Currunt.outlet.city_zone_id = $scope.Currunt.outlet.city_zone_id.id;
				$scope.Currunt.outlet.resturant_id = $scope.Currunt.RestroId;
				privilegeFact.createOutlet($scope.Currunt.outlet, function(response){
					if(response){
						$scope.Currunt.outletId = response.data.result.id;
						if($scope.openViaDetails == true){
		    				$scope.OpenRestro($scope.Currunt.RestroId);
		    				$scope.openViaDetails = false;
		    			}else{
		    				$scope.openOutletImageform();
		    				$scope.openViaDetails = false;
		    			}
						
					}else{
						// error
					}
				})
			}
		}
		$scope.outletImageData= [];
		$scope.saveImagesToOutlet = function(){
	      $scope.saveImgBtnOutlet = true;
	      if($rootScope.photos.length != 0){
	        $scope.outletimages = $rootScope.photos;
	        console.log($scope.outletimages);
	        angular.forEach($scope.outletimages, function(data) {
	          var myobj = {
	            "url": data.url,
	            "type": "photo"
	          };
	          $scope.outletImageData.push(myobj);
	        });
	      }else{
	        alert('no images');
	        $scope.saveImgBtnOutlet = false;
	      }
	      privilegeFact.saveImagesToOutlet($scope.Currunt.outletId, $scope.outletImageData, function(response){
	        if(response){
	            $scope.cover = "";
	            $rootScope.photos = "";
	            if($scope.openViaDetails == true){
    				$scope.OpenRestro($scope.Currunt.RestroId);
    				$scope.openViaDetails = false;
    				$scope.cover = "";
    				$scope.files = "";
    			}else{
    				$scope.openOutletOfferform();
    				$scope.openViaDetails = false;
    				$rootScope.photos = "";
    				$scope.files = "";
    			}
    			$scope.saveImgBtnOutlet = false;
	          }else{
	            alert("oops somthing went wrong try again");
	            $scope.saveImgBtnOutlet = false;
	          }
	      })
	    }

	    $scope.createOffer = function(){
	    	if(!$scope.Currunt.offer.offer_id){
	    		alert('choose a offer Type');
	    		return;
	    	}else{
	    		$scope.Currunt.offer.start_date = moment($scope.Currunt.offer.start_date).format("YYYY-MM-DD");
	    		$scope.Currunt.offer.end_date = moment($scope.Currunt.offer.end_date).format("YYYY-MM-DD")
	    		$scope.Currunt.offer.outlet_id = $scope.Currunt.outletId;
	    		$scope.Currunt.offer.cover_image = $scope.cover;
	    		//$scope.Currunt.offer.offer_id = $scope.Currunt.offer.offer_id.id;
	    		// call offer function
	    		privilegeFact.createOffer($scope.Currunt.offer, function(response){
	    			if(response){
	    				console.log($scope.Currunt);
	    				if($scope.openViaDetails == true){
		    				$scope.OpenRestro($scope.Currunt.RestroId);
		    				$scope.openViaDetails = false;
		    			}else{
		    				$scope.openMoreOption();
		    				$scope.openViaDetails = false;
		    			}
	    			}
	    		})

	    	}
	    }

	    $scope.openCreateform = function() {
	    	$scope.showForm = true;
	    	$scope.form1 = true;
    		$scope.showDetails = false;
    		//$scope.openViaDetails = false;
	    }
	    $scope.openCuisineForm = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = true;
	    	$scope.form3 = false;
	    	$scope.form4 = false;
	    	$scope.form5 = false;
	    	$scope.form6 = false;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
	    }
	    $scope.openprimaryCuisine = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = true;
	    	$scope.form4 = false;
	    	$scope.form5 = false;
	    	$scope.form6 = false;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
	    }
	    $scope.opencreateOutletform = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = false;
	    	$scope.form4 = true;
	    	$scope.form5 = false;
	    	$scope.form6 = false;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
	    }
	    $scope.openOutletImageform = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = false;
	    	$scope.form4 = false;
	    	$scope.form5 = true;
	    	$scope.form6 = false;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
	    }
	    $scope.openOutletOfferform = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = false;
	    	$scope.form4 = false;
	    	$scope.form5 = false;
	    	$scope.form6 = true;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
	    }
	    $scope.openMoreOption = function(){
	    	$scope.showForm = true;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = false;
	    	$scope.form4 = false;
	    	$scope.form5 = false;
	    	$scope.form6 = false;
	    	$scope.form7 = true;
    		$scope.showDetails = false;
	    }
	    $scope.createOfferbutton = function(id){
	    	$scope.openOutletOfferform();
	    	$scope.Currunt.outletId = id;
	    }

	    $scope.hideForms = function(){
	    	$scope.showForm = false;
	    	$scope.form1 = false;
	    	$scope.form2 = false;
	    	$scope.form3 = false;
	    	$scope.form4 = false;
	    	$scope.form5 = false;
	    	$scope.form6 = false;
	    	$scope.form7 = false;
    		$scope.showDetails = false;
    		$scope.openViaDetails = false;
    		$scope.editing = false;
    		$scope.Currunt = {};
	    	$scope.Currunt.outlet = {};
	    	$scope.Currunt.offer = {};
	    }

	    $scope.addImagebutton = function(id){
	    	$scope.Currunt.outletId = id;
	    	$scope.openOutletImageform();
	    }
	    $scope.OpenRestro = function(id) {
	    	$scope.Currunt.RestroId = id;
	    	$scope.showForm = false;
    		$scope.showDetails = true;
    		privilegeFact.getrestrodata(id, function(response){
    			$scope.RestaurantData = response.data.result;
    			
    			 $scope.getOutletOffers();
    			 console.log($scope.RestaurantData);
    			if($scope.RestaurantData.cuisine.length == 0){
    				$scope.noCusine = true;
    			}else{
    				$scope.noCusine = false;
    			}
    		})
	    }

	    $scope.getOutletOffers = function(){
	    	angular.forEach($scope.RestaurantData.outlet, function(key, value){
	    		
	    		privilegeFact.getOutletOffers(key.id, function(response){
	    			//console.log(response.data.result);
		    		if(key.id == response.data.result.id){
		    			$scope.RestaurantData.outlet[value].offer = [];
		    			$scope.RestaurantData.outlet[value].offer.push(response.data.result.offer);
		    		}
		    		privilegeFact.getOutletImages(key.id, function(response){
		    			if(key.id == response.data.result[0].entity_id){
		    				$scope.RestaurantData.outlet[value].images = response.data.result;
		    			}
		    		})
		    	})
	    	})
	    	
	    }


	    $scope.deletecusine = function(id){
	    	var retVal = confirm("Do you want to delete this item ?");
       			if( retVal == true ){
			    	privilegeFact.deletecusine($scope.Currunt.RestroId, id, function(respopnse){
			    		if(response){
			    			$scope.OpenRestro($scope.Currunt.RestroId);
			    		}
			    	})
			    }else{
			    	return;
			    }
	    }

	    $scope.deleteImage = function(id, outletid){
	    	var retVal = confirm("Do you want to delete this item ?");
		        if( retVal == true ){
			    	privilegeFact.deleteImage(id, outletid, function(response){
			    		if(response){
			    			$scope.OpenRestro($scope.Currunt.RestroId);
			    		}
			    	})
			    }else{
			    	return;
			    }
	    }

	    $scope.deleteOutlet = function(id, active){

	    	if(active == '1'){
	    		active = '0';
	    	}else{
	    		active = '1';
	    	}
	    	privilegeFact.deleteOutlet(id, active, function(response){
	    		if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    		}
	    	})
	    }

	    $scope.deleteRestro = function(id, active){
	    	if(active == '1'){
	    		active = '0';
	    	}else if(active == '0'){
	    		active = '1';
	    	}
	    	privilegeFact.deleteRestro(id, active, function(response){
	    		if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    		}
	    	})
	    }

	    $scope.deleteoffer = function(id, active){
	    	if(active == '1'){
	    		active = '0';
	    	}else{
	    		active = '1';
	    	}
	    	privilegeFact.deleteoffer(id, active, function(response){
	    		if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    		}
	    	})
	    }

	    $scope.openRestroEdit = function(){
	    	// get restodata
	    	$scope.restro.name = $scope.RestaurantData.name;
	    	$scope.restro.one_liner = $scope.RestaurantData.one_liner;
	    	$scope.restro.cost = $scope.RestaurantData.cost;
	    	$scope.restro.card_image = $scope.RestaurantData.card_image;
	    	$scope.editing = true;
	    	$scope.openViaDetails = true;
	    	$scope.openCreateform();
	    	$scope.cover= "";
	    }

	    $scope.updateRestro = function(){
	    	if($scope.cover != ""){
	    		$scope.restro.card_image = $scope.cover;
	    	}
	    	privilegeFact.updateRestro($scope.Currunt.RestroId, $scope.restro, function(response){
	    		if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    			$scope.getRestroList();
	    			$scope.editing = false;
	    			$scope.openViaDetails = false;
	    		}
	    	})
	    }

	    $scope.openOutletEdit = function(data){
	    	$scope.Currunt.outlet = data;
	    	$scope.editing = true;
	    	$scope.openViaDetails = true;
	    	$scope.opencreateOutletform();
	    	$scope.selectCityChange();
	    	//console.log($scope.Currunt.outlet);
	    }

	    $scope.updateOutlet = function(){
	    	var data = {
	        'name' : $scope.Currunt.outlet.name,
	        'phone' : $scope.Currunt.outlet.phone,
	        'address' : $scope.Currunt.outlet.address,
	        'city_id' : $scope.Currunt.outlet.city_id,
	        'city_zone_id' : $scope.Currunt.outlet.city_zone_id,
	        'area' : $scope.Currunt.outlet.area,
	        'postcode' : $scope.Currunt.outlet.postcode,
	        'suggested_dishes' : $scope.Currunt.outlet.suggested_dishes,
	        'resturant_id' : $scope.Currunt.outlet.resturant_id,
	        'work_hours' : $scope.Currunt.outlet.work_hours,
	        'latitude': $scope.Currunt.outlet.latitude,
	        'longitude':$scope.Currunt.outlet.longitude,
	        'email': $scope.Currunt.outlet.email
	      };
	      privilegeFact.updateOutlet($scope.Currunt.outlet.id, data, function(response){
	      	if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    			$scope.editing = false;
	    			$scope.openViaDetails = false;
	    			$scope.Currunt.outlet = {};
	    		}
	      })
	    }

	    $scope.openOfferEdit = function(id){
	    	$scope.cover = "";
	    	privilegeFact.getOfferData(id, function(response){
	    		$scope.Currunt.offer = response.data.result;    		
	    	})
	    	$scope.editing = true;
	    	$scope.openViaDetails = true;
	    	$scope.openOutletOfferform();
	    }

	    $scope.updateOffer = function(){
	    	if($scope.cover != ""){
	    		scope.Currunt.offer.cover_image = $scope.cover;
	    	}
	    	var data = {
	        'cover_image' : $scope.Currunt.offer.cover_image,
	        'short_description' : $scope.Currunt.offer.short_description,
	        'start_date' : moment($scope.Currunt.offer.start_date).format("YYYY-MM-DD"),
	        'end_date' : moment($scope.Currunt.offer.end_date).format("YYYY-MM-DD"),
	        'description' : $scope.Currunt.offer.description
		    }
		    privilegeFact.updateOffer($scope.Currunt.offer.id, data, function(response){
		    	if(response){
	    			$scope.OpenRestro($scope.Currunt.RestroId);
	    			$scope.editing = false;
	    			$scope.openViaDetails = false;
	    		}
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

		var d = new Date();
    $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
    //$scope.$watch('files', function() {
	    $scope.uploadFiles2 = function(files){
	      //console.log(files);
	      $scope.files = files;
	      if (!$scope.files){
	        return;
	      }
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
	            $rootScope.photos.push(data);
	            console.log($rootScope.photos);
	          }).error(function (data, status, headers, config) {
	            file.result = data;
	          });
	        }

	      });
	    };
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
    .factory('privilegeFact', ['$http','UrlFact', function($http, UrlFact){
    	var privilegeFact = {};
    	privilegeFact.getRestroList = function(callback){
    		$http({
				method: 'GET',
				url: UrlFact.privilege.restaurant
			}).then(function (response) {
	            callback(response);
	        });
    	}
    	privilegeFact.createRestro = function(name, one_liner, cost, card_image, callback){
		    $http({
		      method: 'POST',
		      url: UrlFact.privilege.restaurant,
		      data : {
		        'name' : name,
		        'one_liner' : one_liner,
		        'cost' : cost,
		        'card_image' : card_image
		      }
		    }).then(function (response) {
		        console.log(response);
		        if(response.data.code === "200"){
		            callback(response);
		            //console.log(response);
		        }else{
		          //Create an error Box and display the 
		          alert('something went wrong please try again after refreshing the page');
		          //console.log(response);
		          callback(false);
		        }
		  	});
		}
		privilegeFact.updateRestro = function(id,data,callback){
			$http({
		        method: 'PUT',
		        url: UrlFact.privilege.restaurant+'/'+id,
		        data : data
		      }).then(function (response) {
		          console.log(response);
		          if(response.data.code === "200"){
		              callback(true);
		              console.log(response);
		          }else{
		            //Create an error Box and display the 
		            alert('something went wrong please try again after refreshing the page');
		            console.log(response);
		            callback(false);
		          }
		    });
		}
		privilegeFact.updateRestroStatus = function(id, active, callback){
		      $http({
		        method: 'PUT',
		        url: UrlFact.privilege.restaurant+'/'+id,
		        data : {
		          'is_disabled' : active
		        }
		      }).then(function (response) {
		          //console.log(response);
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
		privilegeFact.getCusineList = function(callback){
			$http({
		      method: 'GET',
		      url: UrlFact.privilege.cuisine
		    }).then(function (response) {
		            callback(response);
		    });
		}
		privilegeFact.addCuisine = function(id,cuisines, callback){
		    $http({
		      method: 'POST',
		      url: UrlFact.privilege.restaurant+'/'+id+'/cuisine',
		      data: {
		        'cuisines' : cuisines
		      }
		    }).then(function (response) {
		            //console.log(response);
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
		privilegeFact.makePrimaryCuisine = function(id, cusine, callback){
		    $http({
		        method: 'PUT',
		        url: UrlFact.privilege.restaurant+'/'+id,
		        data : {
		          'primary_cuisine' : cusine
		        }
		    }).then(function (response) {
		          //console.log(response);
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
		privilegeFact.deleteCuisine = function(RestroId, cuisineId, callback){
		    $http({
		      method: 'DELETE',
		      url: UrlFact.privilege.restaurant+'/'+RestroId+'/cuisine/'+cuisineId
		    }).then(function (response) {
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
		privilegeFact.createOutlet = function(data, callback){
			$http({
		      method: 'POST',
		      url: UrlFact.privilege.outlet,
		      data : data
		    }).then(function (response) {
		        console.log(response);
		        if(response.data.code === "200"){
		            callback(response);
		            //console.log(response);
		        }else{
		          //Create an error Box and display the 
		          alert('something went wrong please try again after refreshing the page');
		          //console.log(response);
		          callback(false);
		        }
		  	});
		}
		privilegeFact.updateOutlet = function(id,data,callback){
			$http({
		        method: 'PUT',
		        url: UrlFact.privilege.outlet+'/'+id,
		        data : data
		      }).then(function (response) {
		          console.log(response);
		          if(response.data.code === "200"){
		              callback(true);
		              console.log(response);
		          }else{
		            //Create an error Box and display the 
		            alert('something went wrong please try again after refreshing the page');
		            console.log(response);
		            callback(false);
		          }
		    });
		}
		privilegeFact.getrestrodata = function(id,callback){
			$http({
				method: 'GET',
				url: UrlFact.privilege.restaurant+'/'+id
			}).then(function (response) {
	            callback(response);
	        });
		}
		privilegeFact.getOutletOffers = function(id, callback){
			$http({
				method: 'GET',
				url: UrlFact.privilege.outlet+'/'+id
			}).then(function(response){
				callback(response);
			})
		}
		privilegeFact.getOfferData = function(id, callback){
			$http({
			method: 'GET',
			url: UrlFact.privilege.outletOffer+'/'+id
			}).then(function (response) {
	            callback(response);
	        });
		}
		privilegeFact.getOutletImages = function(id, callback){
			$http({
				method: 'GET',
				url: UrlFact.privilege.outlet+'/'+id+'/image'
			}).then(function(response){
				callback(response);
			})
		}
		privilegeFact.saveImagesToOutlet = function(id, data, callback){
		    $http({
		        method: 'POST',
		        url: UrlFact.privilege.outlet+'/'+id+'/image',
		        data : { "images" : data}
		      }).then(function (response) {
		          console.log(response);
		          if(response.data.code === "200"){
		              callback(true);
		              console.log(response);
		          }else{
		            //Create an error Box and display the 
		            alert('something went wrong please try again after refreshing the page');
		            console.log(response);
		            callback(false);
		          }
		    });
		}
		privilegeFact.createOffer = function(data,callback){
			$http({
		        method: 'POST',
		        url: UrlFact.privilege.outletOffer,
		        data : data
		      }).then(function (response) {
		          console.log(response);
		          if(response.data.code === "200"){
		              callback(true);
		              console.log(response);
		          }else{
		            //Create an error Box and display the 
		            alert('something went wrong please try again after refreshing the page');
		            console.log(response);
		            callback(false);
		          }
		    });
		}
		privilegeFact.updateOffer = function(id,data,callback){
			$http({
		        method: 'PUT',
		        url: UrlFact.privilege.outletOffer+'/'+id,
		        data : data
		      }).then(function (response) {
		          console.log(response);
		          if(response.data.code === "200"){
		              callback(true);
		              console.log(response);
		          }else{
		            //Create an error Box and display the 
		            alert('something went wrong please try again after refreshing the page');
		            console.log(response);
		            callback(false);
		          }
		    });
		}
		privilegeFact.getofferList = function(callback){
			$http({
				method: 'GET',
				url: UrlFact.privilege.offer
			}).then(function (response) {
	            callback(response);
	        });
		}

		privilegeFact.deletecusine = function(Restroid, cuisineId, callback){
		    $http({
		      method: 'DELETE',
		      url: UrlFact.privilege.restaurant+'/'+Restroid+'/cuisine/'+cuisineId
		    }).then(function (response) {
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

		privilegeFact.deleteImage = function(id,outletid, callback){
		    $http({
		      method: 'DELETE',
		      url: UrlFact.privilege.outlet+'/'+ outletid +'/image/'+id
		    }).then(function (response) {
		        if(response.data.code === "202"){
		            callback(true);
		            console.log(response);
		        }else{
		          //Create an error Box and display the 
		          alert('something went wrong please try again after refreshing the page');
		          console.log(response);
		          callback(false);
		        }
		    });
		  }

		  privilegeFact.deleteoffer = function(id, active, callback){
		    $http({
		      method: 'PUT',
		      url: UrlFact.privilege.outletOffer+'/'+id,
		      data : {
		          'is_disabled' : active
		        }
		    }).then(function (response) {
		        if(response.data.code === "200"){
	              callback(true);
	          }else{
	            //Create an error Box and display the 
	            alert('something went wrong please try again after refreshing the page');
	            //console.log(response);
	            callback(false);
	          }
		    });
		  }

		  privilegeFact.deleteOutlet = function(id, active, callback){
		      $http({
		        method: 'PUT',
		        url: UrlFact.privilege.outlet+'/'+id,
		        data : {
		          'is_disabled' : active
		        }
		      }).then(function (response) {
		          //console.log(response);
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

		  privilegeFact.deleteRestro = function(id, active, callback){
			$http({
				method: 'PUT',
				url: UrlFact.privilege.restaurant+'/'+id,
				data : {
				  'is_disabled' : active
				}
				}).then(function (response) {
				  //console.log(response);
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
    	return privilegeFact;
    }])
