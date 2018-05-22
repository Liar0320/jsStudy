(function(angular){
    'use strict'
    angular.module('app.login',[]).controller('loginCtrl',loginCtrl);
    loginCtrl.$inject = ['$state','$http','ajaxService','sessionFactory'];
    function loginCtrl($state,$http,ajaxService,sessionFactory){
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
             ajaxService.post('/login',vm.form,(result)=>{
                    let data = result.data
                    console.log('success',data);
                    if(data.bool){
                         sessionFactory.set('UserLogin',data.token);
                         ajaxService.post('/userInfo','',function(data){
                            console.log(data);
                         })
                    }
                })
        }
    }
})(angular);