(function(angular){
    'use strict'
    angular.module('app.login',[]).controller('loginCtrl',loginCtrl);
    loginCtrl.$inject = ['$state','$http','ajaxService'];
    function loginCtrl($state,$http,ajaxService){
        var vm = this;
       // $state.go('goBang');  
        vm.name='login';
        angular.extend(vm,{
            url:'login',
            data:'{"id":0,"password":123456}'
        })
        vm.send = ()=>{
            console.log(vm);
            ajaxService.post(vm.url,JSON.parse(vm.data),(response, status, headers, config)=>{
               console.log('success',response, status, headers, config);
            },(response, status, headers, config)=>{console.log('failed',response, status, headers, config);},true)
        }
    }
})(angular);