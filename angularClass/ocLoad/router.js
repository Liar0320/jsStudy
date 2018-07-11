(function(angular){
    'use strict';
    var ROUTERCONFIG = [
        {
            name:'a.b',
            url:'/b',
            controller:'b as vm',
            templateUrl:'./modules/b.html',
            resolve: './modules/b.js'
        },
        {
            name:'a.b.c',
            url:'/c',
            controller:'c as vm',
            templateUrl:'./modules/c.html',
            resolve: './modules/c.js'
        },{
            name:'d',
            url:'/d',
            // parent:'a.b',
            controller:'d as vm',
            templateUrl:'./modules/d.html',
            resolve: './modules/d.js'
        },
    ]

    angular.module('app').constant('ROUTERCONFIG',ROUTERCONFIG);

    var VENDOR = {
        'jquery':["./node_modules/jquery/dist/jquery.js"],
        'bootstrap':["./node_modules/bootstrap/dist/js/bootstrap.js","./node_modules/bootstrap/dist/css/bootstrap.css"],
    }
    var APPDOM = {
        'b':["jquery",],
        'c':["bootstrap"],
        'd':["jquery","bootstrap"],
    }
    angular.module('app').constant('VENDOR',VENDOR);
    angular.module('app').constant('APPDOM',APPDOM);
})(angular);