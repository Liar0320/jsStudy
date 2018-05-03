(function(angular){
    'use strict'
    angular.module('app.goBang',[]).controller('goBangCtrl',goBangCtrl)
    goBangCtrl.$inject = [];
    function goBangCtrl(){
        const vm = this;
        console.log(vm);
        vm.name = 'goBang';
    }
})(angular);