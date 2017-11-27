'use strict';

/* Controllers */

angular.module('app', ['mgo-angular-wizard'])

.controller('createxperienceCtrl', ['$scope', '$state', 'WizardHandler','createxperienceFact','$rootScope','$location','Upload', 'cloudinary',
 function($scope, $state, WizardHandler, createxperienceFact, $rootScope,$location, $upload, cloudinary) {	

$scope.form1 = {};
$scope.form2 = {};
$scope.form3 = {};
$scope.form4 = {};
$scope.form5 = {};
$scope.form6 = {};

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
	var message ="Hurray! New Notification is created"
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
$scope.experience = {};
$scope.experience.action_text = "Book Now";
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

// create event
$scope.createExperience = function(){
	console.log($scope.experience);
	if($scope.experience.cover_image){
		createxperienceFact.createExperience($scope.experience, function(response){
			console.log(response);
			if(response.data.code == "200"){
				$scope.eventId = response.data.result.id;
			}else{
				alert("something went wrong please try again");
			}
		})
	}else{
		alert("no Images");
	}
}

// add data
$scope.addData = function(data){
	createxperienceFact.addData($scope.eventId, data, function(response){
		if(response.data.code == "200"){
			createxperienceFact.getExprienceDetails($scope.eventId, function(response){
				console.log(response);
				if(response.data.code == "200"){
					$scope.eventDetails = response.data.result;
				}else{
					alert("something went wrong please try again");
				}
				
			});
		}else{
			alert("something went wrong please try again");
		}
			
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
		// console.log(data);
		$scope.addData(data);

		// empty the form after use
		 $scope.dText = {};
		 $scope.hidealldataForm();
		// $scope.form1.$setPristine();
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
		// console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dImage = {};
		$scope.hidealldataForm();
		// $scope.form2.$setPristine();
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
		// console.log(data);
		$scope.addData(data);
		// empty the form after use
		$scope.dVideo = {};
		$scope.hidealldataForm();
		// $scope.form3.$setPristine();
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
		// console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.durl = {};
		$scope.hidealldataForm();
		// $scope.form4.$setPristine();
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
		// console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dList1 = {};
		$scope.hidealldataForm();
		// $scope.form5.$setPristine();
	}else{
		alert("all fields are required");
	}
}
$scope.dlist2 = {};
$scope.saveList2 = function(){
	if($scope.dlist2.title && $scope.list2.length != 0){
		var data = {
			"type":"LIST2",
			"title": $scope.dlist2.title,
			"content": $scope.list2
		}
		// console.log(data);
		$scope.addData(data);

		// empty the form after use
		$scope.dlist2 = {};
		$scope.hidealldataForm();
		// $scope.form6.$setPristine();
	}else{
		alert("all fields are required");
	}
}

// sort data
// createxperienceFact.getExprienceDetails($scope.eventId, function(response){
// 		$scope.eventDetails = response.data.result;
// 	})
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
		if(response.data.code == "202"){
			createxperienceFact.getExprienceDetails($scope.eventId, function(response){
				console.log(response);
				if(response.data.code == "200"){
					$scope.eventDetails = response.data.result;
				}else{
					alert("something went wrong please try again");
				}
				
			});
		}else{
			alert("somthing went wrong");
		}
		
	})
}



// publish experience

$scope.PublishExperience = function(){
	createxperienceFact.PublishExperience($scope.eventId, function(response){
		console.log(response);
		if(response.data.code == "202"){
			$state.go('app.experience');
		}else{
			alert("somthing went wrong");
		}

	})
}

}])
.factory('createxperienceFact', ['$http', 'UrlFact', function($http, UrlFact){
	var createxperienceFact = {};
	createxperienceFact.getExprienceDetails = function(id,callback){
		$http({
			method: 'GET',
			url: UrlFact.experience.main+"/"+id
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.PublishExperience = function(id,callback){
		$http({
			method: 'PUT',
			url: UrlFact.experience.main+"/"+id+"/acitvate"
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.createExperience = function(data, callback){
		$http({
			method: 'POST',
			url: UrlFact.experience.main,
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.addData = function(id, data, callback){
		$http({
			method: 'POST',
			url: UrlFact.experience.data+"/"+id,
			data: data
		}).then(function(response) {
            callback(response);
        });
	}
	createxperienceFact.sortdata = function(id, data, callback){
		$http({
			method: 'PUT',
			url: UrlFact.experience.sortdata+id,
			data: data
		}).then(function(response){
			callback(response)
		})
	}
	return createxperienceFact;
}])
