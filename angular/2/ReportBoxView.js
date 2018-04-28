(function () {
    angular.module('app.reportBoxView', []).controller('reportBoxView', reportBoxView);
    reportBoxView.$inject = ['$scope', 'ajaxService'];
    function reportBoxView($scope, ajaxService) {
        var vm = this;
        var params = $scope.viewDist? JSON.parse($scope.viewDist) :$scope.viewParams;
        
        angular.extend(vm, {
            rows:[],
            headers: params.data,
            names: params.name,
            type: params.type,
            viewUrl: params.viewUrl,
        })
        console.log(vm, $scope);



        if (vm.viewUrl) {
            ajaxService.post(vm.viewUrl, {}, function (res) {
                console.log(res);
                vm.rows = res.Record;
            })
        }


    }

    

})();

