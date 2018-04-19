///  o 存储 引用1 ， item 存储 引用1  ,'改变'值类型 通过引用修改了源数据 ,item 改变引用到 null ,但是o的引用还是没变;
///  null既不是对象也不是一种类型，它仅是一种特殊的值，你可以将其赋予任何引用类型，你也可以将null转化成任何类型
///https://www.cnblogs.com/canning-gao/p/5708796.html
///https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8
//https://blog.csdn.net/cbjcry/article/details/70154946 JS操作DOM元素属性和方法
/*
https://segmentfault.com/a/1190000004322487       你真的会使用XMLHttpRequest吗？
https://www.cnblogs.com/heyuquan/archive/2014/07/17/bubble-quick-sort.html  排序可参考
*/
(function(){
    var o = {a:1,b:2};
    function del(item){
        console.log(o);
        item.a ='改变';
        console.log(o);
    }
   del(o);
   function del2 (item){
        console.log(o);
        item =null;
        console.log(o);
    }
    del2(o)
})();


const $ = {};
///判断 return true or false
((_$)=>{
    ///基础类型判断
    const types=["Array","Boolean","Date","Number"
    ,"Object","RegExp","HTMLDocument","String","Window"];
    types.reduce((index,item)=>{
        _$['is'+item] = (data)=>{
            if(Object.prototype.toString.call(data) === `[object ${item}]`) return true;
            return false;
        };
        return _$;
    },_$)

    ///是否为空
    function isNull(obj){
        if(typeof obj ==='object'){
            if(_$.isArray(obj)){
                return obj.length === 0;
            }else{
                return  Object.keys(obj).length ===0;
            }
        }else{
            if(obj === undefined||obj ===null||obj ==='')return true;
            return false;
        }
    }
    
    $['isNull'] = isNull;
})($);


///-------- liarCopy || 浅拷贝 -----深度拷贝  暂时不考虑原形链上的
(function(_$){ 
     //对象的深度拷贝，不考虑原型链
    function liarCopy(destination,source){
        copyRecurse(destination,source)
        function copyRecurse(destination,source){
            if($.isArray(source)){
                !_$.isArray(destination)&&(destination = []);
                !destination.length||(destination.length = 0);
                for(let i = 0;i<source.length;i++){
                    destination[i] = copyElement(source[i]);
                }
                // source.forEach((item,index) => {
                //     destination[index] = copyElement(item);
                // });
            }else 
            if(_$.isObject(source)){
                    !_$.isObject(destination)&&(destination = {});
                    if(!_$.isNull(destination)){
                        Object.keys(destination).forEach(item =>{
                            delete destination['item'];
                        })
                    }
                    for(let item in source){
                        destination[item] = copyElement(source[item]);
                    }
            }
            return destination;
        }
        function copyElement(source){
            if(typeof source !=='object') return source;
            let destination = undefined;
            return copyRecurse(destination,source);
        }
    }
 
    //对象的扩展
    function liarExtend(destination,source){
        if(_$.isObject(destination)&&_$.isObject(source)){
            for(let item in source){
                destination[item] = source[item];
            }
        }else{
            new Error('data is not [object Object]');
        }
    }

    //快速排序  O(nlog2n) O(1)
    function querysort(origin){
        if(!_$.isArray(origin))return new Error('输入的参数不是数组无法进行快速排序')
        function sort(start,end,arr){
            let key = arr[start];
            let temp_x = start;
            let temp_y = end;
            while(true&&(start<end)){

                for(;start<end;end--){
                    if(key>arr[end]){
                        arr[start++] = arr[end];//start++ 先赋值然后将start所在的索引加一，因为这个数据arr[start]肯定小于key 所以在下面的for循环中就没必要在进行判断；
                        break;
                    }
                }

                for(;start<end;start++){
                    if(key<arr[start]){
                        arr[end--] = arr[start];//同理
                        break;
                    }
                }

            }

            arr[start] = key;
        //    if(temp_y-temp_x===1) return arr;
            if(start === end){
                if(start-temp_x>1)sort(temp_x,start-1,arr);
                if(temp_y-end>1)sort(end+1,temp_y,arr);
            }
        }
        sort(0,origin.length-1,origin)
    }

    //冒泡排序  O(n^2) O(1)
    function bubbleSort(origin) {
        for(let j = 0 ; j<origin.length;j++){
            for(let i = 0;i<origin.length;i++){
                if(origin[i+1]<origin[i]){
                    let temp = origin[i+1];
                    origin[i+1] = origin[i];
                    origin[i] = temp;
                }
            }
        }
        return origin;
    }

    //去除头尾空格  return str
    function trim(str){
        if(typeof str === 'string') return str.replace(/^\s+|\s+$/g,'');
        throw new Error('$.tirm()  参数必须为string')
    }

    liarExtend(_$,{
        liarCopy,
        liarExtend,
        trim,
        querysort,
        bubbleSort
    })
})($);

//document和节点的方法
(function($){
    function getStyle(ele,attr){
        return ele.currentStyle?
        ele.currentStyle[attr]:getComputedStyle(ele,'null')[attr];
    }

    function addClass(ele,addName){
        if(addName.match(/ +/g) === null){
            ele.classList.add(addName);
        }else{
            ele.className += ele.className === ''? addName:' '+addName;
        }
    }
    
    function removeClass(ele,addName){
        if(addName.match(/ +/g) === null){
            ele.classList.remove(addName);
        }else{
            let names = addName.split(/ +/g);
            for(let item of names){
                ele.className.indexOf(item) ===-1||ele.classList.remove(item);
            }
        }
    }

    function getAttributeNames(ele,attr){
        return ele.attributes;
    }


})($);
console.log($);