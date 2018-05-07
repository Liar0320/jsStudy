
(function(angular){
    'use strict'
   var app = angular.module('app',['ui.router','oc.lazyLoad']);
   app.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
    });
    app.provider('routerHelp',['$stateProvider',function($stateProvider){
        var createRouter =function(params){
            params.forEach(element => {
                $stateProvider.state(element.name,{url:element.url,controller:element.controller,
                                    templateUrl:element.templateUrl,resolve:element.resolve})
            });
        }
        this.createRouter = createRouter;
        this.$get = function(){
            return createRouter;
        }
    }]);
    app.config(['$stateProvider','$urlRouterProvider','routerHelpProvider','routerConfig',function($stateProvider,$urlRouterProvider,routerHelp,routerConfig){
       $urlRouterProvider.otherwise('login')
       $stateProvider
            .state('login',{
                url:'/login',
                controller:'loginCtrl as vm',
                templateUrl:'../system/login.html',
                resolve:{
                    loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('../system/login.js');  
                    }]
                }});
        routerHelp.createRouter(routerConfig);
    }]);
    app.service('ajaxService',['$http',function($http){
        this.post = (url,params,resolve,reject,cache)=>{
            $http({
                method:'post',
                url,
                data:params,
                cache,
            }).then((response, status, headers, config)=>{
                $.isFunction(resolve)?
                        resolve(response, status, headers, config):
                        console.warn('ajaxService callback is not function');
            }).catch((response, status, headers, config)=>{
                $.isFunction(reject)?
                        reject(response, status, headers, config):
                        console.warn('ajaxService callback is not function');
            });
        }
        this.get = (url,params,resolve,reject,cache)=>{
            $http({
                method:'get',
                url,
                params,
                cache,
            }).success((response, status, headers, config)=>{
                $.isFunction(resolve)?
                        resolve(response, status, headers, config):
                        console.warn('ajaxService callback is not function');
            }).error((response, status, headers, config)=>{
                $.isFunction(reject)?
                        reject(response, status, headers, config):
                        console.warn('ajaxService callback is not function');
            });
        }
    }])
    app.factory('httpInterceptor',['$q',($q)=>{
        return{
            request:(config)=>{
                console.log('发送成功',config);
                return config;
            },
            requestError:(err)=>{
                console.log('发送失败',err);
                return $q.reject(err);
            },
            response:(res)=>{
                console.log('请求成功',res);
                return res;
            },
            responseError:(err)=>{
                console.log('请求失败',err);
                return $q.reject(err);
            }
        }
    }]);
    app.config(['$httpProvider',($httpProvider)=>{
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded;charset=utf-8";
         $httpProvider.defaults.headers.put["Content-Type"] =
        "application/x-www-form-urlencoded;charset=utf-8";
    }])
    app.run(['$rootScope',($rootScope)=>{
        
    }])
})(angular);