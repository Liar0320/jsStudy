/*
 * @Author: liar 
 * @Date: 2018-09-21 00:07:50 
 * @Last Modified by: liar
 * @Last Modified time: 2019-01-21 17:12:50
 * https://www.itcodemonkey.com/article/12599.html
 */
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
				let current = nums[index];
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
	};
});

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
	},{});
	let obj2 = nums2.reduce((temp,item)=>{
		temp[item]? ++temp[item]:(temp[item] = 1);
		return temp;
	},{});
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
	const REG = /^0+$/g;
	money += "";
	let cashPronun = "";
	for(let i =0;i<money.length;i++){
		let number = money.charAt(i);
		cashPronun += +number||(money.length-i===4&&(!REG.test(money.substring(i,money.length))))?transferZero(+number):"";
		cashPronun += +number||(money.length-i===1)?transfer(money.length-i):"";
	}
	function transfer(digit){
		switch (digit) {
		case 1: return "元";
		case 2: return "拾";     
		case 3: return "佰";   
		case 4: return "仟";     
		case 5: return "万";  
		case 6: return "拾万";   
		case 7: return "佰万";   
		case 8: return "仟万";    
		case 9: return "亿"; 
		case 10: return "拾亿"; 
		default:  
		}
	}

	function transferZero(number){
		switch (number) {
		case 0: return "零";
		case 1: return "壹";
		case 2: return "贰";     
		case 3: return "叁";   
		case 4: return "肆";     
		case 5: return "伍";   
		case 6: return "陆";   
		case 7: return "柒";   
		case 8: return "捌";   
		case 9: return "玖";   
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
		if(val === ".") return true;
		if( (0<val&&val<10)&&(!(val in obj))){
			obj[val] = "";
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
					console.log(result,i,j);
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
					console.log(result,j,i);
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
						console.log(result,countX,countY);
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
			return [i,temp[dseTarget]];
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
			};
			sort(j,i,origin,matrix,_len);
		}
	}
  
    
	function sort(x,y,origin,rect,len){
		var current_x = len - y;
		var current_y = x;
		if(current_x === origin.x && current_y === origin.y){
			rect[x][y] = origin.data;
			return true;
		}else{
			rect[x][y] = rect[current_x][current_y];
			return sort(current_x,current_y,origin,rect,len);
		}
	}
};


/**  有效的字母异位词
 * 根据上一题的启发 只有小写字母的时候  将 26位字母 全部罗列 经过二次循环判断 如果 都成立条件 则 是字母异位词，  条件为 该字母的次数是否相等
    var allChar = 'abcdefghijklmnopqrstuvwxyz';
    var len = allChar.length - 1;
    var char;
    var reg;
    var resultS;
    var resultT;
    for(var i = 0 ; i < len ;i++){
        char = allChar.charAt(i);
        reg = new RegExp(char,'g');
        if((s.match(reg)||[]).length !== (t.match(reg)||[]).length) return false;
    }
    return true
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
	var r = {};
	var i ;
	s.split("").forEach(v=>{if(r[v.charCodeAt()] === undefined)r[v.charCodeAt()] = 0; r[v.charCodeAt()]++;});
	t.split("").forEach(v=>r[v.charCodeAt()]--);
	for( i in r){
		if(r[i] !== 0) return false;
	}
	return true;    
};



/**
 * 最长公前缀  可优化
 * 因为数组不太好处理 需要循环 所以考虑 变成字符串 用正则去匹配  (','+["flower","flow","flight"].join()).match(/,flo/g)
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
	if(strs.length ===0 ) return "";  
	var el = strs[0];               //1、提取第一位单词 作为基准
	var s = "," + strs.join(",");   //2、创建总的字符串 s
	var l = strs.length;            //3、创建数组长度
	var r = "";                     //4、匹配参数 r
	var i = 0;                      //5、创建一个 i = 0 的计数变量
	while(s.match(new RegExp(","+ r,"g")).length === l){
		i++;
		if(r === el) break;
		r = el.substring(0,i);
	}
	return el.substring(0,i-1);
};


//实现 atoi，将字符串转为整数。
var myAtoi = function(str) {
	var s = parseInt(str)||0;
	return s < -2147483648 ? -2147483648 : s>2147483647 ? 2147483647:s;
};

var myAtoi = function(str) {
	var s = (str.match(/^\s*([-+]?)(\d+)/)||[])[0] *1;
	if(!s)return 0;
	return s < -2147483648 ? -2147483648 : s>2147483647 ? 2147483647:s;
};

var myAtoi = function(str) {
	var s = (str.replace(/^\s+/,"").match(/^[-+]?\d+/)||[])[0] *1 || 0;
	return s < -2147483648 ? -2147483648 : s>2147483647 ? 2147483647:s;
};

var myAtoi = function(str) {
	var s = (str.replace(/^\s+/,"").match(/^[-+]?\d+/)||[])[0] *1;
	if(!s)return 0;
	let min = Math.pow(-2,31) ;
	let max = Math.pow(2,31) -1;
	return s < min ? min : s>max ? max:s;
};


/**
 * Definition for singly-linked list.
 * function ListNode(val){
 *      this.val = val;
 *      this.next = next;
 * }
 */
/**
 * 
 * @param {ListNode} node 
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function(node){
	node.val = node.next.val;
	node.next = node.next.next;
};

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * 查找当前节点的  第n-1个next 是不是 null 如果是则为该节点就是需要寻找的
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
	var i ;
	var temp ;
	var node ;
	var c = 0;
	while(true){
		node = head;
		for(i = 0; i< c ;i++){
			node = node.next;
		}
		temp = node;
		for(i = 0; i<n-1;i++){
			temp = temp.next;
		}
		if(temp.next === null){
			if(node.next === null){
				node = head;
				for(i = 0; i< c -1 ;i++){
					node = node.next;
				}
				c === 0? (head = null):(node.next = null);
			}else{
				node.val = node.next.val;
				node.next = node.next.next;
			}
			return head;
		}
		c++;
	}

};

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * 查找当前节点的  第n-1个的next 是不是 null 如果是则为该节点就是需要寻找的
 * 定义两个指针p1 p2 他们保持相差 n步的距离 
 * 当 p1 达到条件时 p2 删除该节点就可以了
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {

	var dummyHead = new ListNode(-1);
	dummyHead.next = head;
	var p1 = dummyHead.next;
	for(var i =0; i<n-1;i++){
		p1 = p1.next;
	}
	p1 = p1.next;
	var p2 = dummyHead;
	while(p1 !== null){
		p1 = p1.next;
		p2 = p2.next;
	}

	p2.next = p2.next.next;

	return dummyHead.next;

};


/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * var a = new ListNode(1) ;var b = new ListNode(2) ;var c = new ListNode(3) ;var d = new ListNode(4); a.next = b;b.next =c ;c.next =d 
 * @param {ListNode} head
 * @return {ListNode}
 */
/**
 * 每次循环到最后一位 删除该节点  将该节点 赋予 q1.next;
 * 如果下一个节点是 null 或者 node.next === null;
 * return node ;
 * 如果不是则
 * 将 node的下一个节点指向node
 * @param {*} head 
 */
var reverseList = function(head) {
	if(!head || head.next === null) return head;
	var rn = new ListNode();
	var q1 = rn;
	var q2 = head.next.next;
	var q3 = head;
    
	while(true){
		while(q2 !== null){
			q2 = q2.next;
			q3 = q3.next;
		}
		if(q1.val === undefined){
			q1.val = q3.next.val;
		}else{
			q1.next = q3.next;
			q1 = q1.next;
		}
		q3.next = null;
		if(head.next === null) break;
		q2 = head.next.next;
		q3 = head;
	}
	q1.next = head;
	return rn;
};

var reverseList = function (head) {
	var prev = null;
	var tempNext = null;
	var node = head;
	while (node) {
		tempNext = node.next;
		node.next = prev;
		prev = node;
		node = tempNext;
	}
	return prev;
};

var reverseList = function (head) {
	if(head === null || head.next === null){
		return head;
	}else{
		var result = reverseList(head.next);
		var nextNode = head.next;
		nextNode.next = head;
		head.next = null;
	}
	return result;
};

//将两个有序链表 合成一个
var mergeTwoLists = function(l1, l2) {
	var q1 = l1;
	var q2 = l2;
	var isRun ;
	var head;
	var node ;
	while (true) {
		if(q1!==null && q2 !==null){
			isRun =  q1.val < q2.val? 1:2;
			if(node === undefined){
				node = isRun === 1? q1:q2;
				head = node;
				isRun === 1? (q1 = q1.next):(q2 = q2.next);
			}else{
				node.next = isRun === 1? q1:q2;
				isRun === 1? (q1 = q1.next):(q2 = q2.next);
				node = node.next;
			}
		}else if(q1 === null && q2 ===null){
			return head || null;
		}else if(q1 === null){
			if(node){
				node.next = q2; 
			}else{
				node = q2;
				head = node;
			}
           
		   return head;
		}else{
			if(node){
				node.next = q1; 
			}else{
				node = q1;
				head = node;
			}
			return head;
		}

	}
};

//生成一个反转的链表 和一个正向链表
function reseverNode (head){
	if(head === null || head.next === null ){
		var result = head? new ListNode(head.val) : null;
		return [result,result,result];
	}else{
		var result = reseverNode(head.next);
		var node = new ListNode(head.val);
		result[0].next = node;
		return [node,result[1],head];
	}
}

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
	var q1 = head;
	var q2;

	var preNode = null;
	var tempNode = null ;
	while(head !== null){
		if(tempNode){
			tempNode = new ListNode(head.val);
			tempNode.next = preNode;
			preNode = tempNode;
		}else{
			tempNode = new ListNode(head.val);
			preNode = tempNode;
		}
		head = head.next;
	}
	q2 = tempNode;
  
    
	if(q1 === q2) return true;
	while((q1 !== null || q2 !== null)&&(q1.val === q2.val)){
		q1 = q1.next;
		q2 = q2.next;
	}
	if(q1 === null && q2 ===null){
		return true;
	}else{
		return false;
	}
  

};

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
	var level = 1;
	var bol = true;
	while(root){
		var result = bstToArrayLevel(root,level);
		if(result.every(item=> item === null)) break;
		if(!compareResever(result)){
			bol = false;
			break;
		}
		level++;
	}
	return bol;
};

//将二叉树 转化为数组形式
function bstToArrayLevel(treeNode,level){
	var result = [];
	if(level === 0){
		return [treeNode === null ? null : treeNode.val];
	}
	if(treeNode){
		result = result.concat(bstToArrayLevel(treeNode.left,level-1));
    	result = result.concat(bstToArrayLevel(treeNode.right,level-1));
	}

	return result;
}

//判断一个数组是否为回文
function compareResever(rows){
	var len = rows.length;
	var start = -1;
	do{
		if(rows[++start] !== rows[--len]) break;
	}while(start < len);
	return  (--start === len);
}



/**
 * 88. 合并两个有序数组
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 * 因为两个数组都是有序的
所以
	A数组为参照对象
	将B数组的元素 依次插入 A数组
	直到B数组的长度为零
	
	找到一个比temp大的元素 插入其前面
 */
var merge = function(nums1, m, nums2, n) {
    var temp = 0,i = 0;
    nums1.length = m;
    nums2.length = n;
    while(nums2.length !== 0){
       temp = nums2.shift();
       while(nums1[i] < temp){
           i++
       }
        nums1.splice(i,0,temp);
    }
};



//最简单的思考
//	俩个条件 第一为连续数组 第二为最大
//所以 
//	当所有数为正数 都全部相加时最大
//类似 求最大回文
//	定义一个compare方法。 比较当前最大值 和 计算最大值; 获取最大计算值 作为下一次计算使用
//	直到len = 1;
	
	
	/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    var len = nums.length ;
    const l = len;
    var max = nums[0];
    var i ;
    var tempA = [];
    
    while(len !== 0){
        i = 0;
        while(i + len <= l){
            tempA.push(nums.slice(i,i+len).reduce(addSum));
            i++;
        }
        max = Math.max(...tempA,max);
        tempA = [];
        len--;
    }
    
    return max;
};

function addSum(result,item){
     result = (result || 0) + item;
     return result;
}

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    var len = nums.length ;
    const l = len;
    var max = nums[0];
    var i ;
    var offset = 0;
    var tempA ;
    
    while(len !== 0){
        i = 0;
        //tempA.push(nums.slice(i,i+len).reduce(addSum));
        //tempA = nums.slice(i,i+len).reduce(addSuma);
        tempA = addSum(nums.slice(i,i+len));
       // tempA.push(addSum(nums.slice(i,i+len)));
        max = Math.max(tempA,max);
        i++;
        while(i + len <= l){
            offset = nums[i + len - 1] - nums[i-1]; 
            tempA = tempA + offset;
            max = Math.max(tempA,max);
            //tempA.push(tempA[i-1] + offset);
            //tempA.length = 100
            i++;
        }
       // max = Math.max(...tempA,max);
        //tempA = []
        len--;
    }
    
    return max;
};

function addSum(arr){
    var result = 0;
	var i = 0;
    var len = arr.length;
     for(i ;i < len ;i++ ){
         result += arr[i];
     }
    return result;
}
//function addSuma(result,item){
//     result = (result || 0) + item;
//     return result;
//}


/**
 * @param {number[]} nums
 * @return {number}
 * 
1、连续数组
2、最大和

接收变量 max;
累加变量 temp;
当
	temp = temp + current;
	if(temp < 0) {
		temp = 0;
	}else if(current < 0){
		continue ;
	}else {
		max = Math.max(max,temp);
	}
 */
var maxSubArray = function(nums) {
    var max = nums.shift(),temp = max > 0? max :0;
    while(nums.length !== 0){
        temp = temp + nums.shift();
        max = Math.max(max,temp);
        if(temp < 0) temp = 0;
    }
    return max;
};

// dayMax  当天最贵值;
// 如果从最后一天开始计算
// 往前计算利润 如果当dayMax - 当前天 利润最大 则 赋予 max；
/**买卖股票的最佳时机
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    var dayMax = 0,max = 0, i =  prices.length - 1;
    for(i;i >= 0;i--){
        dayMax = Math.max(dayMax,prices[i]);
        max = Math.max(max,dayMax - prices[i]);
    }
    return max;
};

//统计所有小于非负整数 n 的质数的数量。
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
    let i = 2,j, l = n,primes = [],isPrimes;
    for(i; i < l ;i++){
        isPrimes = true;
        for(j = 0;j<primes.length ; j++){
            if(i%primes[j] === 0){
                isPrimes = false;
                break;
            }
        }
        if(isPrimes)primes.push(i);
    }
    return primes.length;
};


/**
 * 统计所有小于非负整数 n 的质数的数量。
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
    console.time()
    let i = 2,j,primes = {},count = 0;
    for(i; i < n ;i++){
        if(isPrimes2(i)){
            count++;
        }
    }
    function isPrimes2(num){
        var result=true, i = 2, len = Math.round(Math.sqrt(num));
        for(i;i<=len;i++){
            if(num%i === 0){
                result = false;
                break;
            } 
        }
        return result;
    }
    console.timeEnd()
    return count;
};

/**
 * 统计所有小于非负整数 n 的质数的数量。
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
    let i = 2,j, l = n,primes = [],p;
    for(i; i < l ;i++){
        i>3500? (p = isPrimes1) : (p = isPrimes2);
        if(p(i)) primes.push(i);
    }
    function isPrimes1(num){
        var result=true, i = 0, len = primes.length;
        for(i;i<=len;i++){
            if(num%primes[i] === 0){
                result = false;
                break;
            } 
        }
        return result;
    }
    function isPrimes2(num){
        var result=true, i = 2, len = Math.ceil(num/2);
        for(i;i<=len;i++){
            if(num%i === 0){
                result = false;
                break;
            } 
        }
        return result;
    }
    return primes.length;
};


/**
 * like
 * 正向计算，计算所有可以相乘的数 直到n，缓存到array，
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
    let arr = new Array(n),i= 2,j;
    for(i ;i < n;i++){
        if(typeof arr[i] === 'undefined'){
            for(j = i*i; j<n ; j+=i){
                arr[j] = true;
            }
        }
    }
    let count = 0;
    for(i = 2;i<n;i++){
        if(!arr[i]) count++;
    }
    return count;
};


/**
 * 罗马数字转整数
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const rules = {
        I:1,
        V:5,
        X:10,
        L:50,
        C:100,
        D:500,
        M:1000
    }
    const special = ['I','X','C'];
    let o = s.split(''),n = o.length; i = 0,current = 0 ,next = 0 , result = 0;
    for(i; i < n ;i++){
        current = rules[o[i]]
        if(special.includes(o[i])){
            next = rules[o[i+1]];
            if(next > current) {
                current = next - current ;
                i++;
            }
        }
  
        result += current;
    }
    return result ;
};


/**
 * 罗马数字转整数
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const rules = {
        I:1,
        V:5,
        X:10,
        L:50,
        C:100,
        D:500,
        M:1000
    }
    const special = ['I','X','C'];
    let o = s.split(''),n = o.length; i = 0,current = 0 , result = 0;
    for(i; i < n ;i++){
        current = rules[o[i]]
        if(current < (rules[o[i+1]] || 0)){
           result -= current;
        }else{
           result += current;
        }
    }
    return result ;
};