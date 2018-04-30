(function(angular){
    'use strict'
    angular.module('app.login',[]).controller('loginCtrl',loginCtrl);
    loginCtrl.$inject = [];
    function loginCtrl(){
        var vm = this;
        console.log(vm);
    }
})(angular);