
(function(angular){
    'use strict';
    var app = angular.module('app',['ui.router','oc.lazyLoad']);
    // app.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
    //     app.register = {
    //         controller: $controllerProvider.register,
    //         directive: $compileProvider.directive,
    //         filter: $filterProvider.register,
    //         factory: $provide.factory,
    //         service: $provide.service
    //     };
    // });
    app.provider('routerHelp',['$stateProvider',function($stateProvider){
        var createRouter =function(params){
            if(!params) return;
            params.forEach(element => {
                $stateProvider.state(
                    element.name,
                    {
                        url:element.url,
                        controller:element.controller,
                        templateUrl:element.templateUrl,
                        resolve:{
                            loadCtrl:['$ocLazyLoad','APP_LOADMOD',function($ocLazyLoad,APP_LOADMOD){
                                var mod = [];
                                var arr = element.resolve.split('/');
                                var name = arr[arr.length - 1].split('.js')[0];
                                APP_LOADMOD[name]&&APP_LOADMOD[name].forEach(function(item){
                                    mod.push(item);
                                });
                                mod.push(element.resolve);
                                return $ocLazyLoad.load(mod);  
                            }]
                        }
                    });
            });
        }
        this.createRouter = createRouter;
        this.$get = function(){
            return createRouter;
        }
    }]);
    app.config(['$stateProvider','$urlRouterProvider','routerHelpProvider','routerConfig',function($stateProvider,$urlRouterProvider,routerHelp,routerConfig){
       $urlRouterProvider.otherwise('home');
       $stateProvider
            .state('app',{
                url:'/home',
                views:{
                    '':{
                        controller:'homeCtrl as vm',
                        templateUrl:'../modules/home.html',
                    },
                    'header':{
                        controller:'headerCtrl as vm',
                        templateUrl:'../system/header.html',
                    }
                },
                resolve:{
                    '':['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('../modules/home.js');  
                    }],
                    'header':['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('../system/header.js');  
                    }]
                }
            });
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
                      var dropdown_menu = this.getElementsByClassName('liar-dropdown-menu')[0];
                      if(dropdown_menu&&dropdown_menu.$children().length>0&&!$.hasClass(dropdown_menu,'show')){
                        $.addClass(dropdown_menu,'show');
                        $.addClass(this.getElementsByTagName('a')[0],'fff')
                      }
                })
                ele.bind('mouseleave',function(e){
                        var dropdown_menu = this.getElementsByClassName('liar-dropdown-menu')[0];
                        if( dropdown_menu&&$.hasClass(dropdown_menu,'show')){
                            $.removeClass(dropdown_menu,'show');
                            $.removeClass(this.getElementsByTagName('a')[0],'fff')
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
                var aClassName = attr.asetclass||'active';
                var targetEl = attr.targetel || 'navdown-menu';
   
              //  if(!dropdown_menu) var dropdown_menu = ele[0].getElementsByClassName(targetEl)[0];
                var dropdown_menuSidle = ele[0].getElementsByClassName('navdown-menu')[0];
             
                ele.bind('mousedown',function(e){
                    e = e||window.event;
                    e.preventDefault();
                    var el = e.target;
                    if(el.nodeName === 'I' && el.getAttribute('left')!==undefined) {
                        $.hasClass(dropdown_menuSidle,'trans0') ? $.removeClass(dropdown_menuSidle,'trans0'):$.addClass(dropdown_menuSidle,'trans0');
                        return;
                    }
                    if(el.nodeName === 'A'&&el.getAttribute('parent') !==undefined){
                        var menuContaint = angular.element(el).parent().find('ul');
                        var height = menuContaint&&$.getStyle(menuContaint[0],'height');
                        var li = menuContaint.find('li');
                        // if(remove(height !=='0px')) return;
                        if(height ==='0px'&&li.length>0&&!$.hasClass(ele[0],className)){ 
                            $.addClass(angular.element(el).parent()[0],className);
                            height = parseInt($.height(li[0],true))*li.length + 1; //1  hr分割线
                            $.setStyle(menuContaint[0],'height',height+'px');
                            menuContaint.bind('mousedown',setActive);
                        }else{
                            removeParent(angular.element(el).parent()[0],menuContaint[0]);
                            menuContaint.unbind('mousedown',setActive)
                        }
                        li = null;
                        menuContaint = null;
                    }
                })

                function removeParent(child,menu){
                    if(child&&menu){
                        $.removeClass(child,className); 
                        $.setStyle(menu,'height','0px');   
                        return; 
                    }
                    var children = ele.parent().children();
                    for (let index = 0; index < children.length; index++) {
                        if(className&&$.hasClass(children[index],className)){
                            $.removeClass(children[index],className); 
                            $.setStyle(children[index].getElementsByClassName(targetEl)[0],'height','0px');
                            break;
                        }   
                    }
                }

                //遍历所有的目录节点 如果选中择置空
                function remove(ele){
                    var children = ele.parent().children();
                    for (let index = 0; index < children.length; index++) {
                        let bol = false;
                        var lis = children[index].getElementsByTagName('li');
                        [...lis].forEach(item=>{
                            if($.hasClass(item,aClassName)){
                                $.removeClass(item,aClassName);  bol = true;
                            }   
                        }) 
                        if(bol) return;
                    }
                }

                function setActive(e){
                    e = e ||window.evnet;
                    e.stopPropagation();
                    var target = e.target||window.evnet.target
                    if(target.nodeName !== 'A') return false;
                    remove(angular.element(target.parentNode.parentNode.parentNode));
                    $.addClass(target.parentNode,aClassName);
                }

            }
        }
    }
})(angular);