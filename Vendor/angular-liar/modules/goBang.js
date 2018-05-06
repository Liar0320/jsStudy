(function(angular){
    'use strict'
    angular.module('app.goBang',[])
        .controller('goBangCtrl',goBangCtrl)
        .directive('decGoBang',decGoBang)
    goBangCtrl.$inject = [];
    function goBangCtrl(){
        const vm = this;
        console.log(vm);
        vm.name = 'goBang';
    }

    decGoBang.$inject = [];
    function decGoBang(){
        return{
            restrict:'C',
            link:link,
        }

        function link(scope,ele,attrs){
            console.log(attrs);
            let client = {x:document.body.offsetWidth,y:document.body.offsetHeight};
            let boardSize = {cols:15,rows:15};
            let cellSize = {width:client.x/boardSize.cols,height:client.y/boardSize.rows}
            ele[0].setAttribute('width',client.x);
            ele[0].setAttribute('height',client.y);
            let ctx = ele[0].getContext('2d');
            createBoard(ctx,boardSize,cellSize,client);
        }

        //绘制棋盘
        function createBoard(ctx,boardSize,cellSize,client){
            ctx.strokeStyle = '#000';
            for(let i = 0;i<boardSize.cols;i++){
                ctx.moveTo(cellSize.width*i,0);
                ctx.lineTo(cellSize.width*i,client.y);
                ctx.stroke();
            }
            for(let i = 0;i<boardSize.rows;i++){
                ctx.moveTo(0,cellSize.height*i);
                ctx.lineTo(client.x,cellSize.height*i);
                ctx.stroke();
            }
        }
    }
})(angular);