(function(angular){
    'use strict'
    angular.module('app.login',[]).controller('loginCtrl',loginCtrl);
    loginCtrl.$inject = ['$state','$http','ajaxService'];
    function loginCtrl($state,$http,ajaxService){
        var vm = this;
        vm.name='login';
        angular.extend(vm,{
            form:{
                id:'',
                password:''
            },
            login
        });
        function login(){
             ajaxService.post('/login',vm.form,(data)=>{
                         console.log('success',data);
                })
        }
    }
})(angular);