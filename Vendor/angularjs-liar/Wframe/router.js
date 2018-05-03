(function(angular){
    'use strict'
    angular.module('app').service('routerConfig',routerConfig);
    routerConfig.$inject = [];
    function routerConfig(){
       
        return routerHelpProvider('李程欢')     
    }
})(angular);