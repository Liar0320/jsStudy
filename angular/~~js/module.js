(function(){
    'use strict'
    angular.module('app',[])
        .controller("liarControl_1",liarControl_1);
        function liarControl_1(){
            var vm = this;
            vm.name = 'liar';
            console.log('app',vm.name);
        }
    angular.module('module1',[])
        .controller("liarControl_1",liarControl_1)
        function liarControl_1(){
            var vm = this;
            vm.name = 'liar_module1';
            console.log('module1',vm.name);
        }
})();