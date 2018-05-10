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

        const abstractBoard = handleBoard();

        //画板
        var ctxPiece;

        //棋子
        const pieceBlob={
            black:new Blob(),
            white:new Blob(),
            current: 0 , //0代表黑色,1代表白色
        } 

        //抽象的棋盘操手
        function handleBoard(){
            const cellSize ={width:0,height:0}; //存储每一个单元格的大小
            const boardLayout = []; //抽象的棋盘 二维数组
            //设置抽象棋盘
            function setBoardLayut(size,layout = boardLayout){
                if(size.cols === undefined||size.rows ===undefined) 
                            new Error(`棋盘格局不对,行数${size.rows},列数${size.cols}`)
                for(let i = 0;i<size.cols;i++){
                    layout[i] = [];
                    for(let j=0;j<size.rows;j++){
                        layout[i][j] = false;
                    }
                }
                console.log(layout,boardLayout)
            };
            //修改抽象棋盘
            function modifyLayout(current,turn,layout = boardLayout){
                layout[current[1]][current[0]] = turn;
                // console.log(layout,boardLayout)
            }
            return{
                cellSize,
                boardLayout,
                setBoardLayut,
                modifyLayout,
            }
        }

        function link(scope,element,attrs){
            console.log(attrs);
            let ele = element[0];
            ctxPiece = ele.getContext('2d');
            let client = {height:600,width:600};
            let boardSize = {cols:15,rows:15};
            abstractBoard.cellSize.width = client.width/boardSize.cols;
            abstractBoard.cellSize.height = client.height/boardSize.rows;
            abstractBoard.setBoardLayut(boardSize);

            initBoard(ele,client);
            createBoard(ele,boardSize,abstractBoard.cellSize,client);
            getPiece(pieceBlob);
        }

        //初始化棋盘配置
        function initBoard(ele,client){
            ele.setAttribute('width',client.width);
            ele.setAttribute('height',client.height);
            ele.addEventListener('mousedown',mousedown);
            ele.addEventListener('mouseup',mouseup);
        }

        //创建棋盘背景
        function createBoard(ele,boardSize,cellSize,client){
            let img = new Image();
            img.src = "./assets/img/boardBg.jpg";
            img.onload = ()=>{
                let bgCanvas = document.createElement('canvas');
                bgCanvas.className = 'goBang-bg';
                bgCanvas.height = client.height;
                bgCanvas.width = client.width;
                let bgCtx = bgCanvas.getContext('2d');
                bgCtx.drawImage(img,0,0);
                ele.parentElement.appendChild(bgCanvas);
                paintBoard(bgCtx,boardSize,cellSize,client);
                bgCanvas = null;
                ele = null;
                img = null;
            }
        }

        //绘制棋盘
        function paintBoard(ctx,boardSize,cellSize,client){
            ctx.strokeStyle = '#000';
            for(let i = 0;i<boardSize.cols+1;i++){
                ctx.moveTo(cellSize.width*i,0);
                ctx.lineTo(cellSize.width*i,client.height);
                ctx.stroke();
            }
            for(let i = 0;i<boardSize.rows+1;i++){
                ctx.moveTo(0,cellSize.height*i);
                ctx.lineTo(client.width,cellSize.height*i);
                ctx.stroke();
            }
        }

        //增加棋盘监听事件mousedown
        function mousedown(evnet){
            console.log('down',evnet);
        }

        //增加棋盘监听事件mouseup
        function mouseup(evnet){
         //   console.log('up',evnet,calcRect(event.offsetX,event.offsetY,abstractBoard.cellSize));
            let current = calcRect(event.offsetX,event.offsetY,abstractBoard.cellSize);
            if(!validRect(abstractBoard.boardLayout,current)) return;
            abstractBoard.modifyLayout(current,pieceBlob.current);
            drawPiece(ctxPiece,current,abstractBoard.cellSize,pieceBlob);
        }

        //计算当前点击的棋盘位置
        function calcRect(x,y,cellSize){
            return [Math.floor(x/cellSize.width),Math.floor(y/cellSize.height)];
        }

        //判断五子棋是否结束的算法
        function validRect(boardLayout,current){
            if(boardLayout[current[1]][current[0]] !== false) return false;

            return true;
        }

        //获取初始化五子棋
        function getPiece(piece){
            let imgBlack = new Image();
            imgBlack.src = './assets/img/black.png';
            imgBlack.onload = function(){
                piece.black = imgBlack;
            }; 
            let imgWhite = new Image();
            imgWhite.src = './assets/img/white.png';
            imgWhite.onload = function(){
                piece.white = imgWhite;
            }; 
        }

        //设置当前棋子
        function drawPiece(ctx,current,cellSize,piece){
            let turn = (++piece.current)%2 === 0? 'black':'white';
            ctx.drawImage(piece[turn],current[0]*cellSize.width,current[1]*cellSize.height);         
        }

        return{
            restrict:'C',
            link:link,
        }
    }
})(angular);