(function(angular){
    'use strict'
    angular.module('app.login',[]).controller('loginCtrl',loginCtrl);
    loginCtrl.$inject = ['$state'];
    function loginCtrl($state){

        var vm = this;
        $state.go('goBang');  
        vm.name='login'
    }
})(angular);