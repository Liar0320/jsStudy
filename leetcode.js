//1 2 3 4 5 6 7        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~神奇    代码其实是逻辑思维的展示，逻辑的好坏在一定程度上决定了代码的好坏。
(function(){
    const rotate = function(nums,k){
        let Nlength = nums.length;
        (Nlength<k)&&(k=k%Nlength);
 
        if(Nlength%2 !==0){
            let i = 0;  
            let start = nums[0];
            let temp = nums[0];  
            while(true){
              let index = (i+k+1)>Nlength?(i+k-Nlength):(i+k);
              let current = nums[index]
              nums[index] = temp;
              temp = current;  
              if(index===0) break;
              i=index;	
            }
        }else{
            let i = 0;    //当前索引
            let start = nums[0]; //存储开始位移的元素
            let xunhuan = 0;     //位移执行的次数  应该最后执行完成位 n次
            let start_i = 0;     //一个标志位控制第几次循环位移 开始的标志位
            let temp = nums[start_i]; //存储开始位移的元素
            while(true){
              let index = (i+k+1)>Nlength?(i+k-Nlength):(i+k);  //获取位移之后的index值
              let current = nums[index];  //获取下次位移的元素
              nums[index] = temp; //替换存储的元素
              temp = current;    //存储元素
              i=index;	         //当前索引
              xunhuan++;         //当前位移次数
              if(i===start_i){  //当索引 === 起始索引 即一个循环结束
                  if(xunhuan===Nlength) break;   //如果位移次数等于应该需要位移的次数 则执行完成；
                  start_i++;                     //否则 开始下一个循环 起始循环索引++；
                  i = start_i;                   //当前索引 等于起始索引
                  temp =  nums[start_i];         //存储元素
              }
            }
        }  
    }
})

//数组存在重复 则返回true 
var containsDuplicate = function(nums) {
    while(nums.length>1){
        if(nums.indexOf(nums.shift())>-1) return true;
    }
    return false;
};


//两个数组的交集并且长度顺序一样
//总体思路，获取A数组的起始数据，从B数组中匹配相同长度相同，比较两组是否相同如果不同，继续在B中查找是否还有A的起始数据，
//如果没有则将A数组长度逐步递减，递减方式首先首部 之后 尾部 这两次都保留A数组的长度， 如果不成立 A数组去头去尾 直到A数组的长度为0
function containArray(arrayOld,arrayNew){
    let index = 0;
    while(arrayOld.length - index >= arrayNew.length){
        let temp = true;
        index = arrayOld.indexOf(arrayNew[0],index);
        if(index===-1)return false;
        for(let i = 1;i<arrayNew.length;i++){
            if(arrayNew[i]===arrayOld[++index]) continue;
            temp = false;
            break;
        }
        if(temp) return true;
   }
   return false;
}

function intersect(nums1,nums2){
    if(nums1.length<nums2.length){
        let temp = nums1;
        nums1 = nums2;
        nums2 = temp;
    }
    let index = 0;
    let maxLength = nums2.length;
    while(nums2.length>0){
        if(containArray(nums1,nums2)) return nums2;
        if(containArray(nums1,nums2.slice(0,maxLength-1))) return nums2.slice(0,maxLength-1);
        if(containArray(nums1,nums2.slice(1,maxLength))) return nums2.slice(1,maxLength);
        nums2.shift();
        nums2.pop();
    }
    return [];
}

//两个数组的交集 扩展  出现即取 交集；
//计算 nums1 nums2 各种不同值出现的次数，
//nums2中如果存在这个值，取次数小的 push;
var intersect = function(nums1, nums2) {
    let obj1 = nums1.reduce((temp,item)=>{
          temp[item]? ++temp[item]:(temp[item] = 1);
          return temp;
      },{})
      let obj2 = nums2.reduce((temp,item)=>{
          temp[item]? ++temp[item]:(temp[item] = 1);
          return temp;
      },{})
      let temp = [];
      for(let key in obj1){
          if(obj2[key]){
              let index = Math.min(obj2[key],obj1[key]);
              for(let i =0 ;i<index;i++){
                  temp.push(key*1);
              }
          }
      }
      return temp;
};

//斐波那契数列
// 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233，377，610，987，1597，2584，4181，6765，10946，17711，28657，46368
//fibonSequence(n) = fibonSequence(n-1) + fibonSequence(n-2);
function fibonSequence(n){
    if(n===0||n===1) return 1;
    return fibonSequence(n-1) + fibonSequence(n-2);
} 

//要求输入一串低于十位的数字,输出这串数字的中文大写。
//eg: input 10000   output:壹万;
//eg: input 1001010 output:壹佰万壹仟零壹拾;
//千位 没有则加零
//分析从最大位开始向下读取,碰到零则继续下一位(千位读零);
function localismCash(money){
    const REG = /^0+$/g
    money += '';
    let cashPronun = '';
    for(let i =0;i<money.length;i++){
        let number = money.charAt(i);
        cashPronun += +number||(money.length-i===4&&(!REG.test(money.substring(i,money.length))))?transferZero(+number):'';
        cashPronun += +number||(money.length-i===1)?transfer(money.length-i):'';
    }
    function transfer(digit){
        switch (digit) {
            case 1: return '元';
            case 2: return '拾';     
            case 3: return '佰';   
            case 4: return '仟';     
            case 5: return '万';  
            case 6: return '拾万';   
            case 7: return '佰万';   
            case 8: return '仟万';    
            case 9: return '亿'; 
            case 10: return '拾亿'; 
            default:  
        }
    }

    function transferZero(number){
        switch (number) {
            case 0: return '零';
            case 1: return '壹';
            case 2: return '贰';     
            case 3: return '叁';   
            case 4: return '肆';     
            case 5: return '伍';   
            case 6: return '陆';   
            case 7: return '柒';   
            case 8: return '捌';   
            case 9: return '玖';   
            default:  new Error("错误数值");
        }
    }

    return cashPronun;
}

/**   有效的数独
    首先board肯定是一个 2 * 2 的数组

	验证每一行是否成立 成立的条件每个元素都不相等且在1-9
	vaildRows() 
	
	验证每一列是否成立 成立的条件每个元素都不相等且在1-9
	vaildCols()
	
	验证每个区块内是否成立  成立的条件每个元素都不相等且在1-9
	vaildRect()
	小块思想 循环 9次 拆分成数组 可以进行判断				
	大块思想 循环 9次 拆分成数组 可以进行判断
	for(var j = 0 ;j< 9; j++){
		var countX = j % 3 + 3*_i;
		var countY = Math.floor(j/3) + 3*i;
		if(!validBool(result,board[countX][countY])){
			console.log(result,countX,countY)
			return false;
		}
	}
	
    成立的条件每个元素都不相等且在1-9
	function validBool(obj,val){
		return 0<val&&val<10&&(!(val in obj))
	}
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
    function validBool(obj,val){
        if(val === '.') return true;
        if( (0<val&&val<10)&&(!(val in obj))){
            obj[val] = ''
            return true;
        }else{
            return false;
        }
	}
    function vaildRows(board){
        var result;
        for(var i = 0;i<board.length;i++){
            result = {};
            for(var j = 0; j<board[i].length;j++){
                if(!validBool(result,board[i][j])){
                    console.log(result,i,j)
                    return false;
                }
            }
        }
        return true;
    }
    function vaildCols(board){
        var result;
        for(var i = 0;i<board.length;i++){
            result = {};
            for(var j = 0; j<board[i].length;j++){
                if(!validBool(result,board[j][i])){
                     console.log(result,j,i)
                   return false;
                 }
            }
        }
      return true;
    }
    function vaildRect(board){
        var result ;
        for(var _i = 0 ; _i<3;_i++){
            for(var i =0 ; i < 3; i++){
                result = {};
                for(var j = 0 ;j< 9; j++){
                    var countX = j % 3 + 3*_i;
                    var countY = Math.floor(j/3) + 3*i;
                    if(!validBool(result,board[countX][countY])){
                        console.log(result,countX,countY)
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    
    return vaildRows(board)&&vaildCols(board)&&vaildRect(board);
};


/** 两数之和
 * 给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。

   你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    var temp = {};
    var len = nums.length;
    var dseTarget ;
    for(var i = 0; i<len;i++){
        dseTarget = target - nums[i];
        if(dseTarget in temp){
            return [i,temp[dseTarget]]
        }else{
            temp[nums[i]] = i;
        }

    }
};


/**移动零
 *给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。 
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    for(var i =  nums.length - 1; i > -1; i-- ){
        if(nums[i] === 0 ){
            nums.splice(i,1);
            nums.push(0);
        } 
         
    }
};


/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    var _len = matrix.length - 1;
    //var count = _len - 2;
    for(var j = 0 ;j <_len ; j++){
      for(var i = 0 + j ;i< _len - j;i ++){
            var origin = {
                x:j,
                y:i,
                data:matrix[j][i]
            }
            sort(j,i,origin,matrix,_len)
        }
    }
  
    
    function sort(x,y,origin,rect,len){
        var current_x = len - y;
        var current_y = x;
        if(current_x === origin.x && current_y === origin.y){
            rect[x][y] = origin.data;
            return true;
        }else{
            rect[x][y] = rect[current_x][current_y]
            return sort(current_x,current_y,origin,rect,len)
        }
    }
};



	  









