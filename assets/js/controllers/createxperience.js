'use strict';

/* Controllers */

angular.module('app', ['mgo-angular-wizard'])

.controller('createxperienceCtrl', ['$scope', 'WizardHandler','createxperienceFact','$rootScope','$location','Upload', 'cloudinary',
 function($scope, WizardHandler, createxperienceFact, $rootScope,$location, $upload, cloudinary) {	

var d = new Date();
$scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
$scope.uploadFiles = function(files){
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
        file.status = file.progress + "%";
      }).success(function (data, status, headers, config) {
        $rootScope.photogall = $rootScope.photogall || [];
        data.context = {custom: {photo: $scope.title}};
        file.result = data;
        console.log(data);
        // return file.result.url;
        $rootScope.photogall.push(data);
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

// wizard code
$scope.finished = function() {
    alert("Wizard finished :)");
}

$scope.logStep = function() {
    console.log("Step continued");
}

$scope.goBack = function() {
    WizardHandler.wizard().goTo(0);
}

$scope.getCurrentStep = function(){
	return WizardHandler.wizard().currentStepNumber();
}
$scope.goToStep = function(step){
	WizardHandler.wizard().goTo(step);
}

// main code
$scope.experience = {};
$scope.NoDataForm = true;
$scope.uploadCard = function(files){
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
	        file.status = file.progress + "%";
	      }).success(function (data, status, headers, config) {
	        $rootScope.photos = $rootScope.photos || [];
	        data.context = {custom: {photo: $scope.title}};
	        file.result = data;
	        $scope.experience.card_image =  file.result.url;
	        console.log($scope.experience.card_image);
	        $rootScope.photos.push(data);
	      }).error(function (data, status, headers, config) {
	        file.result = data;
	      });
	    }
	  });
}
$scope.uploadCover = function(files){
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
	        file.status = file.progress + "%";
	      }).success(function (data, status, headers, config) {
	        $rootScope.photos = $rootScope.photos || [];
	        data.context = {custom: {photo: $scope.title}};
	        file.result = data;
	        $scope.experience.cover_image = file.result.url;
	        $rootScope.photos.push(data);
	      }).error(function (data, status, headers, config) {
	        file.result = data;
	      });
	    }
	  });
}

// open data item forms
$scope.openTextForm =function(){
	$scope.NoDataForm = false;
	$scope.textData = true;
	$scope.imageData = false;
	$scope.videoData = false;
	$scope.urlData = false;
	$scope.list1Data = false;
	$scope.list2Data = false;
}
$scope.openImageForm =function(){
	$scope.NoDataForm = false;
	$scope.textData = false;
	$scope.imageData = true;
	$scope.videoData = false;
	$scope.urlData = false;
	$scope.list1Data = false;
	$scope.list2Data = false;	
}
$scope.openVideoForm =function(){
	$scope.NoDataForm = false;
	$scope.textData = false;
	$scope.imageData = false;
	$scope.videoData = true;
	$scope.urlData = false;
	$scope.list1Data = false;
	$scope.list2Data = false;	
}
$scope.openUrlForm =function(){
	$scope.NoDataForm = false;
	$scope.textData = false;
	$scope.imageData = false;
	$scope.videoData = false;
	$scope.urlData = true;
	$scope.list1Data = false;
	$scope.list2Data = false;	
}
$scope.openList1Form =function(){
	$scope.NoDataForm = false;
	$scope.textData = false;
	$scope.imageData = false;
	$scope.videoData = false;
	$scope.urlData = false;
	$scope.list1Data = true;
	$scope.list2Data = false;	
}
$scope.openList2Form =function(){
	$scope.NoDataForm = false;
	$scope.textData = false;
	$scope.imageData = false;
	$scope.videoData = false;
	$scope.urlData = false;
	$scope.list1Data = false;
	$scope.list2Data = true;	
}

// dynamic elements add to detailed list
$scope.list2= [];
$scope.detailsList= {};
$scope.addItemToDTlist = function(){
	if($scope.detailsList){
		$scope.list2.push($scope.detailsList);
		console.log($scope.list2);
		$scope.detailsList = {};
	}
}

// create event
$scope.createExperience = function(){
	if($scope.experience.card_image && $scope.experience.card_image){
		createxperienceFact.createExperience($scope.experience, function(response){
			console.log(response);
			$scope.eventId = response.data.result.id;
		})
	}
}

// add data
$scope.eventId = 3;
$scope.addData = function(data){
	createxperienceFact.addData($scope.eventId, data, function(response){
		createxperienceFact.getExprienceDetails($scope.eventId, function(response){
			$scope.eventDetails = response.data.result;
		})
	})
}
$scope.dText = {};
$scope.saveText = function(){
	if($scope.dText.title && $scope.dText.content){
		var data = {
			"type":"TEXT",
			"title": $scope.dText.title,
			"content": $scope.dText.content
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}
$scope.dImage = {};
$scope.saveImages = function(){
	if($scope.dImage.title && $rootScope.photogall.length != 0){
		var temp = [];
		angular.forEach($scope.photogall, function(data) {
          temp.push(data.url);
        });
		var data = {
			"type":"IMAGE",
			"title": $scope.dImage.title,
			"content": temp
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}
$scope.dVideo = {};
$scope.saveVideo = function(){
	if($scope.dVideo.title && $scope.dVideo.content){
		var data = {
			"type":"VIDEO",
			"title": $scope.dVideo.title,
			"content": $scope.dVideo.content
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}
$scope.durl = {};
$scope.saveUrl = function(){
	if($scope.durl.title && $scope.durl.content){
		var data = {
			"type":"URL",
			"title": $scope.durl.title,
			"content": $scope.durl.content
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}
$scope.dList1 = {};
$scope.saveList1 = function(){
	if($scope.dList1.title && $scope.dList1.content){
		var data = {
			"type":"LIST1",
			"title": $scope.dList1.title,
			"content": $scope.dList1.content.split(",")
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}
$scope.dlist2 = {};
$scope.saveList2 = function(){
	if($scope.dlist2.title){
		var data = {
			"type":"LIST2",
			"title": $scope.dlist2.title,
			"content": $scope.list2
		}
		console.log(data);
		$scope.addData(data);
	}else{
		alert("all fields are required");
	}
}

// sort data
createxperienceFact.getExprienceDetails($scope.eventId, function(response){
		$scope.eventDetails = response.data.result;
	})
$scope.checkOrder = function(){
	var result = document.getElementsByClassName("sortedContainer");
	var wrappedResult = angular.element(result);
	//console.log(wrappedResult[0].childNodes);
	$scope.ordertemp = [];
	angular.forEach(wrappedResult[0].childNodes, function(value, key){
		if(value.id){
			$scope.ordertemp.push(value.id);
		}
	});
	console.log($scope.ordertemp);
	createxperienceFact.sortdata($scope.eventId, $scope.ordertemp, function(response){
		console.log(response);
	})
}
}])
.factory('createxperienceFact', ['$http', function($http){
	var createxperienceFact = {};
	createxperienceFact.getExprienceDetails = function(id,callback){
		$http({
			method: 'GET',
			url: "http://stg-api.foodtalk.in/privilege/experiences/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.createExperience = function(data, callback){
		$http({
			method: 'POST',
			url: "http://stg-api.foodtalk.in/privilege/experiences",
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.addData = function(id, data, callback){
		$http({
			method: 'POST',
			url: "http://stg-api.foodtalk.in/privilege/experiences/data/"+id,
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.sortdata = function(id, data, callback){
		$http({
			method: 'PUT',
			url: "http://stg-api.foodtalk.in/privilege/experiences/sort_data/"+id,
			data: data
		}).then(function(response){
			callback(response)
		})
	}
	return createxperienceFact;
}])
