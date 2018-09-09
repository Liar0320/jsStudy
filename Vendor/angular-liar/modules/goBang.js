(function (angular, window) {
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
    return {
      restrict: "C",
      //scope:true,
      link: link
    };

    function link(scope, element, attrs) {
      console.log(attrs);
      var bang = Bang(element[0],600,600);
      bang.run();
      scope.clearPiece = bang.clearPiece;
    }


  /*
 * 构造五子棋的方法
 * @param {element | int} id canvas节点 或者 是 canvas的id
 * @param {int} height 棋盘的高度
 * @param {int} width  棋盘的宽度
 * @param {int | undefined} cols 棋盘的列数
 * @param {int | undefined} rows 棋盘的行数
 */
function Bang (id, height, width, cols, rows) {
  'use strict'
  // canvas 画板
  var ele, ctxPiece

  var conf = {
    height: height,
    width: width

    // 棋子
  }; var pieceBlob = {
    black: undefined,
    white: undefined,
    current: 0 // 0代表黑色,1代表白色
  }

  // 抽象的棋盘操手
  var abstractBoard = {
    // 棋盘大小
    cellCount: {
      cols: 15,
      rows: 15
    },
    // 存储每一个单元格的大小
    cellSize: { width: 0, height: 0 },
    // 抽象的棋盘  二维数组
    boardLayout: [],
    // 存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
    sortBoardStep: [],
    // 设置cell的多少
    setCellCount: function setCellCount (cols, rows) {
      if (cols) this.cellCount.cols = cols
      if (rows) this.cellCount.rows = rows
      this.setBoardLayut(this.cellCount)
    },
    // 设置每个单元格的宽高
    setCellSize: function setCellSize (client) {
      this.cellSize.width = client.width / this.cellCount.cols
      this.cellSize.height = client.height / this.cellCount.rows
    },
    // 设置抽象棋盘
    setBoardLayut: function setBoardLayut (size, layout) {
      if (!size) size = this.cellCount
      if (!layout) layout = this.boardLayout
      if (size.cols === undefined || size.rows === undefined) new Error('\u68CB\u76D8\u683C\u5C40\u4E0D\u5BF9,\u884C\u6570' + size.rows + ',\u5217\u6570' + size.cols) /*eslint-disable-line*/
      for (var i = 0; i < size.cols; i++) {
        layout[i] = []
        for (var j = 0; j < size.rows; j++) {
          layout[i][j] = false
        }
      }
    },
    // 修改抽象棋盘
    modifyLayout: function modifyLayout (current, turn, layout) {
      if (!layout) layout = this.boardLayout
      layout[current[1]][current[0]] = turn
      if (turn) this.setBoardStep(current, turn, JSON.parse(JSON.stringify(layout)))
    },
    // 存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
    setBoardStep: function setBoardStep (current, turn, layout) {
      if (!layout) layout = this.boardLayout
      this.sortBoardStep.push({
        current: current,
        turn: turn,
        layout: layout
      })
    }

    // 启动
  }; function run () {
    ele = typeof id !== 'object' ? document.getElementById(id):id;
    ctxPiece = ele.getContext('2d')
    initAbstractBoard(conf, cols, rows)
    initBoard(ele, conf)
    createBoard(ele, abstractBoard.cellCount, abstractBoard.cellSize, conf)
    getPiece(pieceBlob)
  }

  // 初始化棋盘配置
  function initBoard (ele, client) {
    ele.width = client.width
    ele.height = client.height
    ele.addEventListener('mousedown', mousedown)
    ele.addEventListener('mouseup', mouseup)
  }

  // 初始化抽象棋盘
  function initAbstractBoard (conf, cols, rows) {
    abstractBoard.setCellCount(cols, rows)
    abstractBoard.setCellSize(conf)
  }

  // 创建棋盘背景
  function createBoard (ele, boardSize, cellSize, client) {
    var img = new Image() /* eslint-disable-line */
    img.src = './assets/img/boardBg.jpg'
    img.onload = function () {
      var bgCanvas = document.createElement('canvas')
      bgCanvas.className = 'goBang-bg'
      bgCanvas.height = client.height
      bgCanvas.width = client.width
      var bgCtx = bgCanvas.getContext('2d')
      bgCtx.drawImage(img, 0, 0)
      ele.parentElement.appendChild(bgCanvas)
      paintBoard(bgCtx, boardSize, cellSize, client)
      bgCanvas = null
      ele = null
      img = null
    }
  }

  // 绘制棋盘
  function paintBoard (ctx, boardSize, cellSize, client) {
    ctx.strokeStyle = '#000'
    for (var i = 0; i < boardSize.cols + 1; i++) {
      ctx.moveTo(cellSize.width * i, 0)
      ctx.lineTo(cellSize.width * i, client.height)
      ctx.stroke()
    }
    for (var _i = 0; _i < boardSize.rows + 1; _i++) {
      ctx.moveTo(0, cellSize.height * _i)
      ctx.lineTo(client.width, cellSize.height * _i)
      ctx.stroke()
    }
  }

  // 增加棋盘监听事件mousedown
  function mousedown (event) {
    console.log('down', event)
  }

  // 增加棋盘监听事件mouseup
  function mouseup (event) {
    var current = calcRect(event.offsetX, event.offsetY, abstractBoard.cellSize)
    if (abstractBoard.boardLayout[current[1]][current[0]] !== false) return false
    var turn = ++pieceBlob.current % 2 === 0 ? 'black' : 'white'
    drawPiece(ctxPiece, current, abstractBoard.cellSize, pieceBlob, turn)
    setTimeout(function () {
      if (validRect(abstractBoard.boardLayout, current, turn)) {
        alert('\u6E38\u620F\u7ED3\u675F.' + turn + '\u65B9\u80DC\u5229') /* eslint-disable-line*/
        gameControl()
      }
    })
    console.log(abstractBoard)
  }

  // 计算当前点击的棋盘位置
  function calcRect (x, y, cellSize) {
    return [Math.floor(x / cellSize.width), Math.floor(y / cellSize.height)]
  }

  // 判断五子棋是否结束的算法
  // current当前位置，turn当前方，boardLayout当前棋盘布局
  function validRect (boardLayout, current, turn) {
    var matchOpreat = [1, 1]
    var method = 0
    // 用for比while应该更好
    while (++method !== 5) {
      var count = { forWard: 0, backWard: 0 }
      var _rows = current[1]
      var _cols = current[0]

      switch (method) { // 五子棋的四种获胜情况
        case 1:
          matchOpreat = [1, 0]; break // 1,1 1,2 1,3 1,4 1,5
        case 2:
          matchOpreat = [1, 1]; break // 1,1 2,2 3,3 4,4 5,5
        case 3:
          matchOpreat = [0, 1]; break // 1,1 2,1 3,1 4,1 5,1
        case 4:
          matchOpreat = [-1, 1]; break // 1,5 2,4 3,3 4,2 5,1
      }
      // 判断上一行是否存在(rows - matchOpreat[1]>=0)
      while (_rows - matchOpreat[1] >= 0 && boardLayout[_rows = _rows - matchOpreat[1]][_cols = _cols - matchOpreat[0]] === turn) {
        count.forWard++
      };
      _rows = current[1]
      _cols = current[0]
      // 判断下一行是否存在(rows + matchOpreat[1]<=14)
      while (_rows + matchOpreat[1] <= 14 && boardLayout[_rows = _rows + matchOpreat[1]][_cols = _cols + matchOpreat[0]] === turn) {
        count.backWard++
      }
      console.log(count, count.backWard + count.forWard)
      if (count.backWard + count.forWard >= 4) return true
    }
    return false
  }

  // 获取初始化五子棋
  function getPiece (piece) {
    var imgBlack = new Image() /* eslint-disable-line*/
    imgBlack.src = './assets/img/black.png'
    imgBlack.onload = function () {
      piece.black = imgBlack
    }
    var imgWhite = new Image() /* eslint-disable-line*/
    imgWhite.src = './assets/img/white.png'
    imgWhite.onload = function () {
      piece.white = imgWhite
    }
  }

  // 设置当前棋子
  function drawPiece (ctx, current, cellSize, piece, turn) {
    abstractBoard.modifyLayout(current, turn)
    ctx.drawImage(piece[turn], current[0] * cellSize.width, current[1] * cellSize.height)
  }

  // 返回上一步
  function clearPiece () {
    if (pieceBlob.current === 0) return alert('没有上一步') /* eslint-disable-line*/
    var step = abstractBoard.sortBoardStep[--pieceBlob.current]
    abstractBoard.sortBoardStep.pop()
    abstractBoard.modifyLayout(step.current, false)
    ctxPiece.clearRect(step.current[0] * abstractBoard.cellSize.width, step.current[1] * abstractBoard.cellSize.height, abstractBoard.cellSize.width, abstractBoard.cellSize.height)
  }

  // 保存棋盘
  function saveBoard () {
    if (pieceBlob.current === 0) return alert('没有上一步') /* eslint-disable-line*/
    var step = abstractBoard.sortBoardStep[--pieceBlob.current]
    abstractBoard.sortBoardStep.pop()
    abstractBoard.modifyLayout(step.current, false)
    ctxPiece.clearRect(step.current[0] * abstractBoard.cellSize.width, step.current[1] * abstractBoard.cellSize.height, abstractBoard.cellSize.width, abstractBoard.cellSize.height)
  }
  // 游戏的开始和重启
  function gameControl () {
    var next = confirm('是否重新开始') /* eslint-disable-line*/
    if (!next) return
    ctxPiece.clearRect(0, 0, conf.width, conf.height)
    initAbstractBoard(conf)
  }
  return {
    run: run,
    clearPiece: clearPiece,
    saveBoard: saveBoard,
    gameControl: gameControl
  }
}

  }
})(angular, window);



// const abstractBoard = new handleBoard();


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


// //抽象的棋盘操手
// function handleBoard() {
//   //cell的多少
//   const cellCount= {
//     cols:15,
//     rows:15
//   }; 
//   //存储每一个单元格的大小
//   const cellSize = { width: 0, height: 0 }; 
//   //抽象的棋盘 二维数组
//   const boardLayout = []; 
//   //存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
//   const sortBoardStep=[];
//   //设置cell的多少
//   function setCellCount(cols=cellCount.cols,rows=cellCount.rows){
//     cellCount.cols = cols;
//     cellCount.rows = rows;
//     setBoardLayut(cellCount);
//   }
//   //设置每个单元格的宽高
//   function setCellSize(client){
//           cellSize.width = client.width / cellCount.cols;
//           cellSize.height = client.height / cellCount.rows;
//   }
//   //设置抽象棋盘
//   function setBoardLayut(size = cellCount, layout = boardLayout) {
//     if (size.cols === undefined || size.rows === undefined)
//       new Error(`棋盘格局不对,行数${size.rows},列数${size.cols}`);
//     for (let i = 0; i < size.cols; i++) {
//       layout[i] = [];
//       for (let j = 0; j < size.rows; j++) {
//         layout[i][j] = false;
//       }
//     }
//     console.log(layout, boardLayout);
//   }
//   //修改抽象棋盘
//   function modifyLayout(current, turn, layout = boardLayout) {
//     layout[current[1]][current[0]] = turn;
//     if(turn)setBoardStep(current, turn, $.liarCopy([],layout));
//     // console.log(layout,boardLayout)
//   }
//   //存储棋盘的步数对应的落子位置 包含参数 第一步 黑子 位置 ， step turn  pois
//   function setBoardStep(current, turn, layout = boardLayout){
//     sortBoardStep.push({
//         current,
//         turn,
//         layout
//     });
//   }

//   return {
//     cellCount,
//     cellSize,
//     boardLayout,
//     sortBoardStep,
//     setCellCount,
//     setCellSize,
//     setBoardLayut,
//     modifyLayout,
//     setBoardStep
//   };
// }