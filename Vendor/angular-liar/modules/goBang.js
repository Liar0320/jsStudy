(function(angular,window) {
  "use strict";
  angular
    .module("app.goBang", [])
    .controller("goBangCtrl", goBangCtrl)
    .directive("decGoBang", decGoBang);
  goBangCtrl.$inject = ['$scope'];
  function goBangCtrl($scope) {
    const vm = this;
    vm.name = "goBang";
    $scope.name = 'goBang';
  }

  decGoBang.$inject = [];
  function decGoBang() {
    //配置
    let conf = {
        // height:window.screen.availHeight>1200?600:window.screen.availHeight,
        // width:window.screen.availWidth>1200?600:window.screen.availWidth,
        height:document.documentElement.clientWidth>1200?600:document.documentElement.clientHeight,
        width:document.documentElement.clientWidth>1200?600:document.documentElement.clientWidth,
    }
    const abstractBoard = new handleBoard();
    //画板
    var ctxPiece;
    //棋子
    const pieceBlob = {
      black: new Blob(),
      white: new Blob(),
      current: 0 //0代表黑色,1代表白色
    };

    //抽象的棋盘操手
    function handleBoard() {
      //cell的多少
      const cellCount= {
        cols:15,
        rows:15
      }; 
      //存储每一个单元格的大小
      const cellSize = { width: 0, height: 0 }; 
      //抽象的棋盘 二维数组
      const boardLayout = []; 
      //存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
      const sortBoardStep=[];
      //设置cell的多少
      function setCellCount(cols=cellCount.cols,rows=cellCount.rows){
        cellCount.cols = cols;
        cellCount.rows = rows;
        setBoardLayut(cellCount);
      }
      //设置每个单元格的宽高
      function setCellSize(client){
              cellSize.width = client.width / cellCount.cols;
              cellSize.height = client.height / cellCount.rows;
      }
      //设置抽象棋盘
      function setBoardLayut(size = cellCount, layout = boardLayout) {
        if (size.cols === undefined || size.rows === undefined)
          new Error(`棋盘格局不对,行数${size.rows},列数${size.cols}`);
        for (let i = 0; i < size.cols; i++) {
          layout[i] = [];
          for (let j = 0; j < size.rows; j++) {
            layout[i][j] = false;
          }
        }
        console.log(layout, boardLayout);
      }
      //修改抽象棋盘
      function modifyLayout(current, turn, layout = boardLayout) {
        layout[current[1]][current[0]] = turn;
        if(turn)setBoardStep(current, turn, $.liarCopy([],layout));
        // console.log(layout,boardLayout)
      }
      //存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
      function setBoardStep(current, turn, layout = boardLayout){
        sortBoardStep.push({
            current,
            turn,
            layout
        });
      }

      return {
        cellCount,
        cellSize,
        boardLayout,
        sortBoardStep,
        setCellCount,
        setCellSize,
        setBoardLayut,
        modifyLayout,
        setBoardStep
      };
    }

    function link(scope, element, attrs) {
      console.log(attrs);
      let ele = element[0];
      ctxPiece = ele.getContext("2d");

      initAbstractBoard(conf);
      initBoard(ele,conf);
      createBoard(ele, abstractBoard.cellCount, abstractBoard.cellSize, conf);
      getPiece(pieceBlob);
      scope.clearPiece = clearPiece;
    }

    //初始化棋盘配置
    function initBoard(ele,client) {
      ele.width = client.width;
      ele.height = client.height;
      ele.addEventListener("mousedown", mousedown);
      ele.addEventListener("mouseup", mouseup);
    }

    //初始化抽象棋盘
    function initAbstractBoard(conf){
       abstractBoard.setCellCount();
       abstractBoard.setCellSize(conf);
    }

    //创建棋盘背景
    function createBoard(ele, boardSize, cellSize, client) {
      let img = new Image();
      img.src = "./assets/img/boardBg.jpg";
      img.onload = () => {
        let bgCanvas = document.createElement("canvas");
        bgCanvas.className = "goBang-bg";
        bgCanvas.height = client.height;
        bgCanvas.width = client.width;
        let bgCtx = bgCanvas.getContext("2d");
        bgCtx.drawImage(img, 0, 0);
        ele.parentElement.appendChild(bgCanvas);
        paintBoard(bgCtx, boardSize, cellSize, client);
        bgCanvas = null;
        ele = null;
        img = null;
      };
    }

    //绘制棋盘
    function paintBoard(ctx, boardSize, cellSize, client) {
      ctx.strokeStyle = "#000";
      for (let i = 0; i < boardSize.cols + 1; i++) {
        ctx.moveTo(cellSize.width * i, 0);
        ctx.lineTo(cellSize.width * i, client.height);
        ctx.stroke();
      }
      for (let i = 0; i < boardSize.rows + 1; i++) {
        ctx.moveTo(0, cellSize.height * i);
        ctx.lineTo(client.width, cellSize.height * i);
        ctx.stroke();
      }
    }

    //增加棋盘监听事件mousedown
    function mousedown(evnet) {
      console.log("down", evnet);
    }

    //增加棋盘监听事件mouseup
    function mouseup(evnet) {
      let current = calcRect(
        event.offsetX,
        event.offsetY,
        abstractBoard.cellSize
      );
      if (abstractBoard.boardLayout[current[1]][current[0]] !== false) return false;  
      let turn = ++pieceBlob.current % 2 === 0 ? "black" : "white"; 
      drawPiece(ctxPiece, current, abstractBoard.cellSize, pieceBlob,turn);
      if (validRect(abstractBoard.boardLayout, current,turn)){
          alert(`游戏结束.${turn}方胜利`);
          gameControl();
      }
      console.log(abstractBoard);
    }

    //计算当前点击的棋盘位置
    function calcRect(x, y, cellSize) {
      return [Math.floor(x / cellSize.width), Math.floor(y / cellSize.height)];
    }

    //判断五子棋是否结束的算法
    // current当前位置，turn当前方，boardLayout当前棋盘布局
    function validRect(boardLayout, current,turn) {
        let matchOpreat = [1,1];
        let method = 0;
          //用for比while应该更好
        while(++method!==5){
            let count = {forWard:0,backWard:0};
            let rows = current[1];
            let cols = current[0];

            switch(method){ //五子棋的四种获胜情况
                case 1:matchOpreat = [1,0]; break;      // 1,1 1,2 1,3 1,4 1,5
                case 2:matchOpreat = [1,1]; break;      // 1,1 2,2 3,3 4,4 5,5
                case 3:matchOpreat = [0,1]; break;      // 1,1 2,1 3,1 4,1 5,1
                case 4:matchOpreat = [-1,1]; break;     // 1,5 2,4 3,3 4,2 5,1    
           }
            //判断上一行是否存在(rows - matchOpreat[1]>=0)
            while((rows - matchOpreat[1]>=0)&&boardLayout[rows=rows-matchOpreat[1]][cols=cols-matchOpreat[0]] === turn){
                    count.forWard++;
            };
                rows = current[1];
                cols = current[0];
            //判断下一行是否存在(rows + matchOpreat[1]<=14)
            while((rows + matchOpreat[1]<=14)&&boardLayout[rows=rows+matchOpreat[1]][cols=cols+matchOpreat[0]] === turn){
                    count.backWard++;
            }
            console.log(count,count.backWard+count.forWard);
            if(count.backWard+count.forWard >=4) return true;
        }
        return false;
    }

    //获取初始化五子棋
    function getPiece(piece) {
      let imgBlack = new Image();
      imgBlack.src = "./assets/img/black.png";
      imgBlack.onload = function() {
        piece.black = imgBlack;
      };
      let imgWhite = new Image();
      imgWhite.src = "./assets/img/white.png";
      imgWhite.onload = function() {
        piece.white = imgWhite;
      };
    }

    //设置当前棋子
    function drawPiece(ctx, current, cellSize, piece,turn) {
      abstractBoard.modifyLayout(current, turn);
      ctx.drawImage(
        piece[turn],
        current[0] * cellSize.width,
        current[1] * cellSize.height
      );
    }

    //返回上一步
    function clearPiece() {
      if(pieceBlob.current === 0) return alert('没有上一步');
      let step = abstractBoard.sortBoardStep[--pieceBlob.current];
      abstractBoard.sortBoardStep.pop();
      abstractBoard.modifyLayout(step.current,false);
      ctxPiece.clearRect(
            step.current[0] * abstractBoard.cellSize.width,
            step.current[1] * abstractBoard.cellSize.height,
            abstractBoard.cellSize.width,
            abstractBoard.cellSize.height
          );
    }

     //返回上一步
    function saveBoard() {
      if(pieceBlob.current === 0) return alert('没有上一步');
      let step = abstractBoard.sortBoardStep[--pieceBlob.current];
      abstractBoard.sortBoardStep.pop();
      abstractBoard.modifyLayout(step.current,false);
      ctxPiece.clearRect(
            step.current[0] * abstractBoard.cellSize.width,
            step.current[1] * abstractBoard.cellSize.height,
            abstractBoard.cellSize.width,
            abstractBoard.cellSize.height
          );
    }
    
    //游戏的开始和重启
    function gameControl(){
        ctxPiece.clearRect(0,0,conf.width,conf.height);
        initAbstractBoard(conf);
    }

    return {
      restrict: "C",
      //scope:true,
      link: link
    };
  }
})(angular,window);

// current当前位置，turn当前方，boardLayout当前棋盘布局
// function countResult(current,turn,boardLayout){
//     let matchOpreat = [1,1];
//     let method = 0;
//     //用for比while应该更好
//     while(++method!==5){
//         let count = {forWard:0,backWard:0};
//         let rows = current[1];
//         let cols = current[0];

//         switch(method){ //五子棋的四种获胜情况
//             case 1:matchOpreat = [1,0]; break;      // 1,1 1,2 1,3 1,4 1,5
//             case 2:matchOpreat = [1,1]; break;      // 1,1 2,2 3,3 4,4 5,5
//             case 3:matchOpreat = [0,1]; break;      // 1,1 2,1 3,1 4,1 5,1
//             case 4:matchOpreat = [-1,1]; break;     // 1,5 2,4 3,3 4,2 5,1    
//        }
//         //判断上一行是否存在(rows - matchOpreat[1]>=0)
//         while((rows - matchOpreat[1]>=0)&&boardLayout[rows=rows-matchOpreat[1]][cols=cols-matchOpreat[0]] === turn){
//                 count.forWard++;
//         };
//             rows = current[1];
//             cols = current[0];
//             //判断下一行是否存在(rows + matchOpreat[1]<=14)
//         while((rows + matchOpreat[1]<=14)&&boardLayout[rows=rows+matchOpreat[1]][cols=cols+matchOpreat[0]] === turn){
//                 count.backWard++;
//         }
//         console.log(count,count.backWard+count.forWard);
//         if(count.backWard+count.forWard >=4) {
//             alert('游戏结束');
//             return true;
//         }
//     }
//     return false;
// }
