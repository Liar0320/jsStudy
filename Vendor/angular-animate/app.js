/*
 * @Author: lich 
 * @Date: 2018-08-24 15:07:09 
 * @Last Modified by: lich
 * @Last Modified time: 2018-08-24 15:23:20
 */
/*eslint-disable*/
(function(angular) {
    var app = angular.module("app", ["ngAnimate"]);
    app.controller('animateCtrl',animateCtrl);
    animateCtrl.$inject = [];
    function animateCtrl() {
        var vm = this;
        vm.list = [0,1,2,3,4,5,6,7,8];
        vm.animateChildren = false;
        vm.enterElement = false;
    }

    // app.directive('greetingBox', ['$animate', function($animate) {
    //     return function(scope, element, attrs) {
    //         attrs.$observe('active', function(value) {
    //         value ? $animate.addClass(element, 'on') : $animate.removeClass(element, 'on');
    //         });
    //     });
    // }]);

})(angular);

