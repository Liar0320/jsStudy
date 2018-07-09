(function(angular){
    'use strict';
    angular.module('app').config(['$ocLazyLoadProvider','APP_REQUIRES',function($ocLazyLoadProvider,APP_REQUIRES){
        $ocLazyLoadProvider.config({
            modules:APP_REQUIRES.modules,
            debug:false,
            events:true
        });
    }])
    .constant('routerConfig', [
        {
            name:'login',
            url:'/login',
            controller:'loginCtrl as vm',
            templateUrl:'../system/login.html',
            resolve:'../system/login.js'
        },
        {
            name:'app.goBang',
            url:'/goBang',
            controller:'goBangCtrl as vm',
            templateUrl:'../modules/goBang.html',
            resolve:'../modules/goBang.js'
        },//跳转五子棋页面
    ]
)
    .constant('APP_REQUIRES',{
        modules:[{
            name:'encrypt',
            files:['../node_modules/md5/md5.js']
        }
        ]
    })
    .constant('APP_LOADMOD',{
        'login':['encrypt']
    });
})(angular);

