(function(angular){
    'use strict'
    let routerConfig = [
        {
            name:'goBang',
            url:'/goBang',
            controller:'goBangCtrl as vm',
            templateUrl:'../modules/goBang.html',
            resolve:{
                loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('../modules/goBang.js');  
                }]
            }
        },//跳转五子棋页面
        {
            name:'home',
            url:'/home',
            controller:'homeCtrl as vm',
            templateUrl:'../modules/home.html',
            resolve:{
                loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load('../modules/home.js');  
                }]
            }
        },//跳转五子棋页面
    ]


    angular.module('app').constant('routerConfig',routerConfig);
})(angular);