(function(angular){
  var app=  angular.module('app',['ui.router','oc.lazyLoad']);

    app.provider('routerHelp',['$stateProvider',function($stateProvider){
        var createRouter =function(params){
            params.forEach(element => {
                $stateProvider.state(
                    element.name,
                    {
                        url:element.url,
                        controller:element.controller,
                        templateUrl:element.templateUrl,
                        // resolve:{
                        //     loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                        //         return $ocLazyLoad.load(element.resolve);  
                        //     }]
                        // },
                        resolve:{
                            loadCtrl:['$ocLazyLoad','APPDOM','VENDOR',function($ocLazyLoad,APPDOM,VENDOR){
                                var result =[];
                                var arr = element.resolve.split('/');
                                var name = arr[arr.length -1].split('.js')[0];
                                APPDOM[name].forEach(function(item){
                                    result = result.concat(VENDOR[item]);
                                })
                                result.push(element.resolve);
                                return $ocLazyLoad.load(result);  
                            }]
                        }
                    })
            });
        }
        this.createRouter = createRouter;
        this.$get = function(){
            return createRouter;
        }
    }]);
    app.config(['$stateProvider','$urlRouterProvider','routerHelpProvider','ROUTERCONFIG',function($stateProvider,$urlRouterProvider,routerHelp,ROUTERCONFIG){
       $urlRouterProvider.otherwise('/a')
       $stateProvider
            .state('a',{
                url:'/a',
                controller:'a as vm',
                templateUrl:'./modules/a.html',
                resolve:{
                    loadCtrl:['$ocLazyLoad',function($ocLazyLoad){
                        return $ocLazyLoad.load('./modules/a.js');  
                    }]
                }
            });
        routerHelp.createRouter(ROUTERCONFIG);
    }]);
})(angular);