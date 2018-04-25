const app = angular.module('app',['vs-repeat']);
app.controller('repeat',repeat);
repeat.$inject = ['$scope'];
function repeat($scope){
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
}