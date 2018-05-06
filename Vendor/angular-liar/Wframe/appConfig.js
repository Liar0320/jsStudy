(function(angular){
    function appConfig(){
        let  routerConfig = [
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
        ];
        return {
            routerConfig
        }
    }

    angular.module('app').provider('routerHelp',['$stateProvider',function($stateProvider){
        var createRouter =function(params){
            if(params === 'app'){
                if(appConfig !==undefined) params = appConfig().routerConfig;
            }
            params.forEach(element => {
                $stateProvider.state(element.name,{url:element.url,controller:element.controller,
                                    templateUrl:element.templateUrl,resolve:element.resolve})
            });
        }
        this.$get = function(){
            return createRouter;
        }
    }]);

    angular.module('app').config(['routerHelpProvider',(routerHelpProvider)=>{
        routerHelpProvider.$get()('app');
    }])

})(angular);