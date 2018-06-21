
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
    app.factory('sessionFactory',['$window',$window=>{
        return{
            set:(key,value)=>{
                $window.sessionStorage[key] = value;
            },
            get:(key,defaultValue)=>{
                return $window.sessionStorage[key]||defaultValue;
            },
            setObject:(key,value)=>{
                $window.sessionStorage[key] = JSON.stringify(value);
            },
            getObject:(key)=>{
                return JSON.parse($window.sessionStorage(key)||'{}')
            }
        }
    }])
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
                        console.error(response);
            });
        }
        function processData(data) {
            if (data == null && data == {}) return {};
            var processData = {};
            if (angular.isObject(data)) {
              angular.forEach(data, function(value, key) {
                var obj = {};
                if (!angular.isString(value)) {
                  obj[key] = JSON.stringify(value);
                } else {
                  obj[key] = value;
                }
                angular.extend(processData, obj);
              });
            }
            return processData;
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
    }]);
    app.factory('httpInterceptor',['$q','sessionFactory',($q,sessionFactory)=>{
        return{
            request:(config)=>{
                if(sessionFactory.get('UserLogin')) config.headers['x-access-token'] = sessionFactory.get('UserLogin');
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
        var param = function(obj) {
            var query = "",
                name,
                value,
                fullSubName,
                subName,
                subValue,
                innerObj,
                i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + "[" + i + "]";
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                }
                } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + "[" + subName + "]";
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                }
                } else if (value !== undefined && value !== null) {
                query +=
                    encodeURIComponent(name) +
                    "=" +
                    encodeURIComponent(value) +
                    "&";
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        $httpProvider.defaults.transformRequest = [
            function(data) {
                return angular.isObject(data) && String(data) !== "[object File]"
                ? param(data)
                : data;
            }
        ];
    }]);
    app.config(['$provide',$provide=>{
        $provide.decorator("$state", ['$delegate',$delegate=>{
            // let state = {};
            // angular.copy($delegate, state);
            // $delegate.transitionTo = to=>{
            //     console.log(to);
            //     state.transitionTo.apply(null, arguments);
            // }
            return  $delegate;
        }])
    }]);
    // app.decorator('$state',($delegate)=>{
    //     console.log($delegate);
    // })


    app.run(['$rootScope','$transitions','sessionFactory',($rootScope,$transitions,sessionFactory)=>{
        $rootScope.app={
            name:'liar',
        };
                //https://www.cnblogs.com/mamimi/p/7809475.html
        // $transitions.onBefore({},(transition)=>{
        //     let stateName = transition.to().name;
        //     if(stateName!=='login'&&sessionFactory.get('UserLogin')) return transition.router.stateService.target('login');
        //     console.log(transition);
        //     return transition;
        //  })
        $transitions.onStart({}, function(transition) {
            let stateName = transition.to().name;
            if(stateName!=='login'&&!sessionFactory.get('UserLogin')) return transition.router.stateService.target('login');
            return transition;
        })

        console.log($rootScope);
    }]);
})(angular);


(function(angular){
    angular.module('app').directive('decDropDown',decDropDown);
    function decDropDown(){
        return{
            restrict:'A',
            link:function(scope,ele,attr){
                ele.bind('mouseover',function(e){
                      var dropdown_menu = this.getElementsByClassName('dropdown-menu')[0];
                      if(dropdown_menu&&!$.hasClass(dropdown_menu,'show')){
                        $.addClass(dropdown_menu,'show');
                        $.addClass(this.getElementsByClassName('headBc-ul-li-a')[0],'fff')
                      }
                })
                ele.bind('mouseleave',function(e){
                        var dropdown_menu = this.getElementsByClassName('dropdown-menu')[0];
                        if( dropdown_menu&&$.hasClass(dropdown_menu,'show')){
                            $.removeClass(dropdown_menu,'show');
                            $.removeClass(this.getElementsByClassName('headBc-ul-li-a')[0],'fff')
                        }
                        
                 })
            }
        }
    }

    angular.module('app').directive('decNavClick',decNavClick);
    function decNavClick(){
        return{
            restrict:'A',
            link:function(scope,ele,attr){
                var className = attr.setclass;
                var targetEl = attr.targetel || 'navdown-menu';
                var calc = attr.calc;

                var dropdown_menu = ele[0].getElementsByClassName(targetEl)[0];
                angular.element(ele.find('a')[0]).bind('mousedown',function(e){
                    e.preventDefault();
                    if(calc !==undefined){
                        var height = dropdown_menu&&$.getStyle(dropdown_menu,'height');
                        if(height ==='0px'){
                            var li = dropdown_menu.getElementsByTagName('li');
                            height = parseInt($.height(li[0],true))*li.length;
                            $.setStyle(dropdown_menu,'height',height+'px');
                          }else{
                            $.setStyle(dropdown_menu,'height','0px');
                          }
                          if(ele[0]&&className&&!$.hasClass(ele[0],className)){
                            $.addClass(ele[0],className);
                          }else{
                            $.removeClass(ele[0],className);
                          }
                    }else{
                        if(dropdown_menu&&className&&!$.hasClass(dropdown_menu,className)){
                            $.addClass(dropdown_menu,className);
                          }else{
                            $.removeClass(dropdown_menu,className);
                          }
                    }
                })
            }
        }
    }
})(angular);