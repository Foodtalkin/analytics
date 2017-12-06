'use strict';

/* Controllers */

angular.module('app', ['mgo-angular-wizard'])

.controller('editExperienceCtrl', ['$scope', '$state', '$stateParams', 'WizardHandler','editexperienceFact','$rootScope','$location','Upload', 'cloudinary',
 function($scope, $state, $stateParams, WizardHandler, editexperienceFact, $rootScope,$location, $upload, cloudinary) {	
$scope.experience ={};
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
	var message ="Hurray! Your experience edited successfully."
                        $('body').pgNotification({
                            style: 'bar',
                            message: message,
                            position: 'top',
                            timeout: 5000,
                            type: 'success'
                        }).show();
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
	if(files.length == 0){
		$scope.myerrorcover = "Wrong image Size";
	}else{
		$scope.myerrorcover = "";
	}
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

$scope.$watchGroup(["experience['start_time']", "experience['end_time']"], function (newValue, oldValue) {
    if(!(angular.isUndefined($scope.experience.end_time)) && !(angular.isUndefined($scope.experience.start_time)) && $scope.experience.end_time != "" && $scope.experience.start_time != ""){
    	if(moment($scope.experience.end_time).isAfter($scope.experience.start_time)){
    		// end date is after
    		$scope.checkendDate = false;
    	}else{
    		// start date is after
    		$scope.checkendDate = true;
    	}
    }
  });
// create date formats
$scope.customDate = true;
$scope.genrateDateFormats = function(){
	if(!$scope.experience.start_time || !$scope.experience.end_time || $scope.experience.start_time == "" || $scope.experience.end_time == ""){
		return;
	}else{
		// Dec 31 at 11PM to 2AM
		if($scope.experience.timeFormats == '1'){
			
			var date1 = moment($scope.experience.start_time).format("MMM Do [at] h[:]mmA");
			date1 = date1 + " to " + moment($scope.experience.end_time).format("h[:]mmA");
			$scope.experience.display_time = date1;
		}
			

		// Dec 31, 11PM Onwards
		if($scope.experience.timeFormats == '2'){
			var date2 = moment($scope.experience.start_time).format("MMM Do[,] h[:]mmA [Onwards]");
			$scope.experience.display_time = date2;
		}
			
		// Fri, Dec 31, 11PM Onwards
		if($scope.experience.timeFormats == '3'){
			var date3 = moment($scope.experience.start_time).format("ddd[,] MMM Do[,] h[:]mmA [Onwards]");
			$scope.experience.display_time = date3;
		}
		

		// 2 Lines: Dec 31 at 11PM to 2AM || 3 hours on Friday night
		if($scope.experience.timeFormats == '4'){
			var date4 = moment($scope.experience.start_time).format("MMM Do [at] h[:]mmA");
			date4 = date4 + " to " + moment($scope.experience.end_time).format("h[:]mmA");
			date4 = date4 + "\n" + moment($scope.experience.end_time).from(moment($scope.experience.start_time), true);
			date4 = date4 + " on "+ moment($scope.experience.start_time).format("dddd");
			$scope.experience.display_time = date4;
		}
			

		// 2 Lines: Dec 31, 11PM Onwards || 3 hours on Friday night
		if($scope.experience.timeFormats == '5'){
			var date5 = moment($scope.experience.start_time).format("MMM Do[,] h[:]mmA [Onwards]");
			date5 = date5 + "\n" + moment($scope.experience.end_time).from(moment($scope.experience.start_time), true);
			date5 = date5 + " on "+ moment($scope.experience.start_time).format("dddd");
			$scope.experience.display_time = date5;
		}
		if($scope.experience.timeFormats == '6'){
			$scope.customDate = false;
		}

		console.log($scope.experience.display_time);
	}
}
// edit Event
$scope.editExperience = function(){
	$scope.editBtnDisabled = true;
	if($scope.cover_image != ""){
		$scope.experience.cover_image = $scope.cover_image;
	}
	if($scope.experience.timeFormats == '6'){
			$scope.experience.display_time = $scope.experience.customeDisplayTime;
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
		"longitude": $scope.experience.longitude,
		"display_time" :$scope.experience.display_time
	}
	//console.log(temp);
	
	editexperienceFact.editExperience($scope.eventId,temp, function(response){
		console.log(response);
		$scope.editBtnDisabled = false;
		if(response.data.code != '200'){
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
$scope.hidealldataForm =function(){
	$scope.NoDataForm = true;
	$scope.textData = false;
	$scope.imageData = false;
	$scope.videoData = false;
	$scope.urlData = false;
	$scope.list1Data = false;
	$scope.list2Data = false;	
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
			$scope.addTextDisable = false;
			$scope.addImageDisable = false;
			$scope.addVideoDisabled = false;
			$scope.addUrlDisabled = false;
			$scope.addList1Disabled = false;
			$scope.addList2Disabled = false;
			$scope.experience = response.data.result;
		})
	})
}
$scope.dText = {};
$scope.saveText = function(){
	$scope.addTextDisable = true;
	if($scope.dText.title && $scope.dText.content){
		var data = {
			"type":"TEXT",
			"title": $scope.dText.title,
			"content": $scope.dText.content
		}
		//console.log(data);
		$scope.addData(data);
		// empty the form after use
		$scope.dText = {};
		$scope.hidealldataForm();
		// $scope.TextDataForm.$setPristine();
	}else{
		$scope.addTextDisable = false;
		alert("all fields are required");
	}
}
$scope.dImage = {};
$scope.saveImages = function(){
	$scope.addImageDisable = true;
	if($scope.dImage.title && $rootScope.photogall.length != 0){
		var temp = [];
		angular.forEach($scope.photogall, function(data) {
          temp.push(data.url);
        });
        // var contentToSend = {
        // 	"content": $scope.dImage.detail,
        // 	"images": temp
        // }
		var data = {
			"type":"IMAGE",
			"title": $scope.dImage.title,
			"content": temp
		}
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dImage = {};
		$scope.hidealldataForm();
		// $scope.imageDataForm.$setPristine();
	}else{
		$scope.addImageDisable = false;
		alert("all fields are required");
	}
}
$scope.dVideo = {};
$scope.saveVideo = function(){
	$scope.addVideoDisabled = true;
	if($scope.dVideo.title && $scope.dVideo.content){
		var data = {
			"type":"VIDEO",
			"title": $scope.dVideo.title,
			"content": $scope.dVideo.content
		}
		//console.log(data);
		$scope.addData(data);
		// empty the form after use
		$scope.dVideo = {};
		$scope.hidealldataForm();
		// $scope.VideoDataForm.$setPristine();
	}else{
		$scope.addVideoDisabled = false;
		alert("all fields are required");
	}
}
$scope.durl = {};
$scope.saveUrl = function(){
	$scope.addUrlDisabled = true;
	if($scope.durl.title && $scope.durl.content){
		var data = {
			"type":"URL",
			"title": $scope.durl.title,
			"content": $scope.durl.content
		}
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.durl = {};
		$scope.hidealldataForm();
		// $scope.urlDataForm.$setPristine();
	}else{
		$scope.addUrlDisabled = false;
		alert("all fields are required");
	}
}
$scope.dList1 = {};
$scope.dList1.content = [];
$scope.dList1.list1item = "";
$scope.addItemtolist1 = function(){
	//console.log($scope.dList1.list1item);
	$scope.dList1.content.push($scope.dList1.list1item);
	//console.log($scope.dList1.content);
	$scope.dList1.list1item = "";
}
$scope.saveList1 = function(){
	$scope.addList1Disabled = true;
	if($scope.dList1.title && $scope.dList1.content.length != 0){
		var data = {
			"type":"LIST1",
			"title": $scope.dList1.title,
			"content": $scope.dList1.content
		}
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dList1 = {};
		$scope.hidealldataForm();
		// $scope.list1DataForm.$setPristine();
	}else{
		$scope.addList1Disabled = false;
		alert("all fields are required");
	}
}
$scope.dlist2 = {};
$scope.saveList2 = function(){
	$scope.addList2Disabled = true;
	if($scope.dlist2.title){
		var data = {
			"type":"LIST2",
			"title": $scope.dlist2.title,
			"content": $scope.list2
		}
		//console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dlist2 = {};
		$scope.hidealldataForm();
		// $scope.list2DataForm.$setPristine();
	}else{
		$scope.addList2Disabled = false;
		alert("all fields are required");
	}
}

// sort data
	$scope.checkOrder = function(){
		$scope.arragebtnDisabled = true;
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
			$scope.arragebtnDisabled = false;
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
