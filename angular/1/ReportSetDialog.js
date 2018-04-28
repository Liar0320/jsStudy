(function () {
    angular.module('app.ReportSetDialog', []).controller('ReportSetDialog', ReportSetDialog);
    ReportSetDialog.$inject = ['$scope','dep'];
    function ReportSetDialog($scope, dep) {
        var vm = this;
        var params = dep;  
        angular.extend(vm, {
            viewParams: {
                type: params.type, ///往模态框注入的值;
                data: ['id', 'text'],   ///传给boxView的数据
                name: [],   ///需要的数据说明
            },
            viewUrl:'',     ///boxView的数据源
        })

        vm.viewUrl = '/Menu/GetMenuGridList';

        vm.closeDialog = function () {

            $scope.closeThisDialog({ boolean: 'success', data: params });

            //$scope.confirm('success');
        }
    }
})();

(function () {
    angular.module('app').directive('reportBoxView', reportBoxView);
    reportBoxView.$inject = [];
   // oc-lazy-load="'/Modules/Mes/BI/ReportBoxView.js'"
    function reportBoxView() {
        return {
            restrict: 'A',
            templateUrl: '/Modules/Mes/BI/ReportBoxView.html',
            scope: {
                viewParams: '=',
                viewUrl: '=',
            },
            controller: 'reportBoxView as vm'
        }
    }
})();