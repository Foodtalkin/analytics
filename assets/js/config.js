/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$httpProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
            $httpProvider.defaults.headers.common = {};
            $httpProvider.defaults.headers.post = {};
            $httpProvider.defaults.headers.put = {};
            $httpProvider.defaults.headers.patch = {};
            $httpProvider.defaults.headers.get = {};
            delete $httpProvider.defaults.headers.common["X-Requested-With"];


            $httpProvider.interceptors.push('sessionInjector');


            $urlRouterProvider
                .otherwise('/access/login');

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: "/app",
                    templateUrl: "tpl/app.html"
                })
                .state('app.dashboard', {
                    url: "/home",
                    templateUrl: "tpl/home.html",
                    controller: 'HomeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nvd3',
                                    'rickshaw',
                                    'sparkline'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/home.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.appfeed', {
                    url: "/appfeed",
                    templateUrl: "tpl/appfeed.html",
                    controller: 'appfeedCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/appfeed.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.notification', {
                    url: "/notification",
                    templateUrl: "tpl/notification.html",
                    controller: 'notificationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'moment',
                                    'datepicker',
                                    'timepicker'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/notification.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.privilege', {
                    url: "/privilege",
                    templateUrl: "tpl/privilege.html",
                    controller: 'privilegeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/privilege.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.experience', {
                    url: "/experience",
                    templateUrl: "tpl/experience.html",
                    controller: 'experienceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/experience.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.createxperience', {
                    url: "/experience/create",
                    templateUrl: "tpl/createxperience.html",
                    controller: 'createxperienceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'wizard',
                                    'inputMask'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/createxperience.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.users', {
                    url: "/users",
                    templateUrl: "tpl/users.html",
                    controller: 'usersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/users.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('app.contact', {
                    url: "/contact",
                    templateUrl: "tpl/contact.html",
                    controller: 'contactCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/contact.js'
                                    ]);
                                });
                        }]
                    }
                })
                .state('access', {
                    url: '/access',
                    template: '<div class="full-height" ui-view></div>'
                })
                .state('access.login', {
                    url: '/login',
                    templateUrl: 'tpl/login.html',
                    controller: 'LoginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    /* 
                                        Load any ocLazyLoad module here
                                        ex: 'wysihtml5'
                                        Open config.lazyload.js for available modules
                                    */
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        'assets/js/controllers/login.js'
                                    ]);
                                });
                        }]
                    }
                })

        }
    ]);


    // cloudinary
    angular.module('app').config(['cloudinaryProvider', function (cloudinaryProvider) {
        cloudinaryProvider
            .set("cloud_name", "digital-food-talk-pvt-ltd")
            .set("upload_preset", "litsmjmb");
    }]);

    angular.module('app').config(['TitleProvider', function(TitleProvider) {
        TitleProvider.enabled(false); // it is enabled by default
     }]);
    
    angular.module('app').config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
        KeepaliveProvider.interval(10);
    }]).run(function(Idle){
        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();
        console.log('app started.');
    });


    // intercepter
    angular.module('app').factory('sessionInjector', ['$cookies', function($cookies) {  
    var sessionInjector = {
        request: function(config) {
            var session = $cookies["APPSESSID"];
            //console.log(session);
            if(config.url == 'https://api.cloudinary.com/v1_1/digital-food-talk-pvt-ltd/upload'){
                // console.log('');
            }else{
                if (session) {
                    config.headers['APPSESSID'] = session;
                    // console.log(config);
                }
            }
            return config;
        }
    };
    return sessionInjector;
}]);


    // experience directive
    angular.module('app').directive('experienceData', function() {
        return {
            templateUrl: function(elem, attr) {
                if(attr.dType == 'TEXT'){
                    return 'tpl/directiveTemplates/text.html';
                }else if(attr.dType == 'VIDEO'){
                    return 'tpl/directiveTemplates/video.html';
                }else if(attr.dType == 'URL'){
                    return 'tpl/directiveTemplates/url.html';
                }else if(attr.dType == 'IMAGE'){
                    return 'tpl/directiveTemplates/image.html';
                }else if(attr.dType == 'LIST1'){
                    return 'tpl/directiveTemplates/list1.html';
                }else if(attr.dType == 'LIST2'){
                    return 'tpl/directiveTemplates/list2.html';
                }
            }
        };
    });