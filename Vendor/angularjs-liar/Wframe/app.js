
(function(angular){
    'use strict'
   var app = angular.module('app',['ui.router','oc.lazyLoad']);
//    app.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
//         app.register = {
//             controller: $controllerProvider.register,
//             directive: $compileProvider.directive,
//             filter: $filterProvider.register,
//             factory: $provide.factory,
//             service: $provide.service
//         };
//     });
    app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('login')
        $stateProvider.state('login',{
            url:'/login',
            controller:'loginCtrl',
            templateUrl:'../system/login.html',
            resolve:{
                loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                // $ocLazyLoad.load
                return $ocLazyLoad.load('../system/login.js');  
                }]
            }
        })
    }])

})(angular);