(function () {
    angular.module('app.reportBoxView', []).controller('reportBoxView', reportBoxView);
    reportBoxView.$inject = ['$scope', 'ajaxService'];
    function reportBoxView($scope, ajaxService) {
        var vm = this;
        //var params = $scope.viewParams;
        angular.extend(vm, {
            rows:[],
            headers: $scope.viewParams.data,
            names: $scope.viewParams.name,
            type: $scope.viewParams.type,
        })
        console.log(vm, $scope);



        if ($scope.viewUrl) {
            ajaxService.post($scope.viewUrl, {}, function (res) {
                console.log(res);
                vm.rows = res.Record;
            })
        }


    }

    

})();

