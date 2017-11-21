'use strict';

/* Controllers */

angular.module('app', ['mgo-angular-wizard'])

.controller('editExperienceCtrl', ['$scope', '$state', '$stateParams', 'WizardHandler','editexperienceFact','$rootScope','$location','Upload', 'cloudinary',
 function($scope, $state, $stateParams, WizardHandler, editexperienceFact, $rootScope,$location, $upload, cloudinary) {	

$scope.eventId = $stateParams.id;
$scope.cover_image = "";
$scope.card_image = "";
editexperienceFact.getExprienceDetails($scope.eventId, function(response){
	$scope.experience = response.data.result;
});

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
    $state.go('app.experience');
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
// for data forms showing message
$scope.NoDataForm = true;
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
	        $scope.cover_image = file.result.url;
	        $rootScope.photos.push(data);
	      }).error(function (data, status, headers, config) {
	        file.result = data;
	      });
	    }
	  });
}

// edit Event
$scope.editExperience = function(){
	
	if($scope.cover_image != ""){
		$scope.experience.cover_image = $scope.cover_image;
	}
	var temp = {
		"title":$scope.experience.title,
		"cover_image":$scope.experience.cover_image,
		"address":$scope.experience.address,
		"city_id":$scope.experience.city_id,
		"start_time":$scope.experience.start_time,
		"end_time":$scope.experience.end_time,
		"cost":$scope.experience.cost,
		"nonveg_preference":$scope.experience.nonveg_preference,
		"taxes":$scope.experience.taxes,
		"convenience_fee":$scope.experience.convenience_fee,
		"total_seats":$scope.experience.total_seats,
		"action_text":$scope.experience.action_text,
		"tag":$scope.experience.tag,
		"latitude": $scope.experience.latitude,
		"longitude": $scope.experience.longitude
	}
	console.log(temp);
	
	editexperienceFact.editExperience($scope.eventId,temp, function(response){
		console.log(response);
	})
}

// delete data 
$scope.deleteData = function(id){	
	var retVal = confirm("Do you want to delete this item ?");
	if( retVal == true ){
		editexperienceFact.deleteData(id, function(response){
			console.log(response);
			editexperienceFact.getExprienceDetails($scope.eventId, function(response){
				$scope.experience = response.data.result;
			});
		})
	}
	else{
	  	return false;
	}
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

// add data
$scope.addData = function(data){
	editexperienceFact.addData($scope.eventId, data, function(response){
		editexperienceFact.getExprienceDetails($scope.eventId, function(response){
			$scope.experience = response.data.result;
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
		//console.log(data);
		$scope.addData(data);
		// empty the form after use
		// $scope.dText = {};
		// $scope.TextDataForm.$setPristine();
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
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		// $scope.dImage = {};
		// $scope.imageDataForm.$setPristine();
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
		//console.log(data);
		$scope.addData(data);
		// empty the form after use
		// $scope.dVideo = {};
		// $scope.VideoDataForm.$setPristine();
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
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		// $scope.durl = {};
		// $scope.urlDataForm.$setPristine();
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
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		// $scope.dList1 = {};
		// $scope.list1DataForm.$setPristine();
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
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		// $scope.dlist2 = {};
		// $scope.list2DataForm.$setPristine();
	}else{
		alert("all fields are required");
	}
}

// sort data
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
		editexperienceFact.sortdata($scope.eventId, $scope.ordertemp, function(response){
			console.log(response);
		})
	}
}])
.factory('editexperienceFact', ['$http','UrlFact', function($http, UrlFact){
	var editexperienceFact = {};
	editexperienceFact.getExprienceDetails = function(id,callback){
		$http({
			method: 'GET',
			url: UrlFact.experience.main+"/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	editexperienceFact.editExperience = function(id, data, callback){
		$http({
			method: 'PUT',
			url: UrlFact.experience.main+"/"+id,
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	editexperienceFact.deleteData = function(id, callback){
		$http({
			method: 'DELETE',
			url: UrlFact.experience.data+"/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	editexperienceFact.addData = function(id, data, callback){
		$http({
			method: 'POST',
			url: UrlFact.experience.data+"/"+id,
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	editexperienceFact.sortdata = function(id, data, callback){
		$http({
			method: 'PUT',
			url: UrlFact.experience.sortdata+id,
			data: data
		}).then(function(response){
			callback(response)
		})
	}
	return editexperienceFact;
}])
