'use strict';

/* Controllers */

angular.module('app')
    .factory('LoginFact', ['$http','$cookies', '$location', 
    	function($http, $cookies,$location){
    	var LoginFact = {};
    	LoginFact.doLogin = function(email, loginkey, callback){
    		$http({
				method: 'POST',
				url: "http://api.foodtalk.in/login",
				data: {email:email, password:loginkey}
			}).then(function (response) {
                console.log(response);
				if(response.data.result.APPSESSID){
					$cookies['batman'] = response.data.result;
                    $cookies['APPSESSID'] = response.data.result.APPSESSID;
                    $cookies['user'] = response.data.result.name;
                    $cookies['email'] = response.data.result.email;
                    $cookies['role'] = response.data.result.role;
					callback(true);
				}else{
					callback(false);
				}
	            
	        });
    	}

    	LoginFact.getUserData = function(callback){
		    session = $cookies["batman"];
		    if(session) callback(session);
		    else callback(false);
		}


    	return LoginFact;
    }])
    .controller('LoginCtrl', ['$scope','$location','LoginFact', function($scope,$location,LoginFact) {
    	$scope.user = {};
    	$scope.doLogin = function(){
    		LoginFact.doLogin($scope.user.username, $scope.user.password, function(response){
    			if(response){
    				$location.path('/app/home');
    			}
    		})
    	}

    }])


angular.module('app')
    .factory('UrlFact', ['', function(){
    	var UrlFact = {}
    	var baseurl = "";
    	UrlFact.login= baseurl+"login";
    	UrlFact.privilege= baseurl+"privilege";
    	return UrlFact;
    }])
