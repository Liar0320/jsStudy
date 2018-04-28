(function () {
    angular.module('app.reportView', []).controller('reportView', reportView);
    reportView.$inject = ['$scope','$stateParams'];
    function reportView($scope, $stateParams) {
        var vm = this;
        angular.extend(vm, {
            params: $stateParams.args,
        })
    }
})();