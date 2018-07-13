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
            name:'validform',
            files:['../node_modules/angular-validation/dist/angular-validation-rule.js','../node_modules/angular-validation/dist/angular-validation.js']
        }
        ]
    })
    .constant('APP_LOADMOD',{
        'login':['validform']
    });
})(angular);

