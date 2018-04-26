const app = angular.module('app',['vs-repeat','xslxJs']);
app.controller('repeat',repeat);
repeat.$inject = ['$scope','SheetJSExportService'];
function repeat($scope,SheetJSExportService){
    let vm = this;
    vm.tableRows = []
    let length = vm.tableRows.length;
    vm.addrows = 100;
    vm.add = function(){
        length = vm.tableRows.length;
        for(let i=length;i<length+vm.addrows;i++){
            vm.tableRows.push( {text:'hello world '+i,author:'liar',key:i});
        }
    }
    vm.add();
    

    //xlsx
    vm.export = function(){
        var grid={data:vm.excel||vm.tableRows,options:''}
        SheetJSExportService.exportXLSX(grid);
    }
    vm.getExcel = (excel) => {
        console.log(excel);
        vm.excel = excel.data;
    }
}