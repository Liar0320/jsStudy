
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
    app.provider('routerHelpProvider',['$stateProvider',function($stateProvider){

        var createRouter =function(params){
            params.forEach(element => {
                $stateProvider.state(element.name,{url:element.url,controller:element.controller,
                                    templateUrl:element.templateUrl,resolve:element.resolve})
            });
        }
        this.$get = function(){
            return createRouter;
        }
    }]);

    app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
       $urlRouterProvider.otherwise('login')
        $stateProvider
            .state('login',{
                url:'/login',
                controller:'loginCtrl as vm',
                templateUrl:'./system/login.html',
                resolve:{
                    loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('../system/login.js');  
                    }]
                }})
            .state('goBang',{
                url:'/goBang',
                controller:'goBangCtrl as vm',
                templateUrl:'../modules/goBang.html',
                resolve:{
                    loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('../modules/goBang.js');  
                    }]
                }
            })
       
    }])


})(angular);