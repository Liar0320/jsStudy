(function(){
    angular.module('app.header',[]).controller('headerCtrl',headerCtrl);
    headerCtrl.$inject = ['ajaxService'];
    function headerCtrl(ajaxService){
        var vm = this;
        ajaxService.get('menuList','',(res,req)=>{
            console.log(res,req);
            vm.titleSets = res.data.record;
        })
    }
})(angular);