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