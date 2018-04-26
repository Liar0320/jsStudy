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
  