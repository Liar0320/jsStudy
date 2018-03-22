///  o 存储 引用1 ， item 存储 引用1  ,'改变'值类型 通过引用修改了源数据 ,item 改变引用到 null ,但是o的引用还是没变;
///  null既不是对象也不是一种类型，它仅是一种特殊的值，你可以将其赋予任何引用类型，你也可以将null转化成任何类型
(function(){
    var o = {a:1,b:2};
    function del(item){
        console.log(o);
        item.a ='改变';
        console.log(o);
    }
   del(o);
   function del2(item){
        console.log(o);
        item =null;
        console.log(o);
    }
    del2(o)
})();


///
///-------- liarCopy || 深度copy  暂时不考虑原形链上的
///$  isArray isNull liarCopy
var $ = {};
(function(){
    function liarCopy(destination,souce){
       if(typeof destination === 'object'&&typeof souce === 'object'){
            if(isArray(souce)){
                if(!isArray(destination))throw new Error('destination参数必须是数组');
                !destination.length||(destination.length = 0);
                souce.forEach(item => {
                    destination.push(item);
               });
            }else{
                if(isArray(destination))throw new Error('destination参数必须是对象');
                if(!isNull(destination)){
                    Object.keys(destination).forEach(item =>{
                        delete destination['item'];
                    })
                }
                for(let item in souce){
                    destination[item] = souce[item];
                }
            }
       }else{
          throw new Error('输入的必须是对象');
       }
    }
    ///是否是数组
    function isArray(obj){
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return object.prototype.toString.call(obj) === '[object Array]'
        }
    }
    ///是否为空
    function isNull(obj){
        if(typeof obj ==='object'){
            if(isArray(obj)){
                return obj.length === 0;
            }else{
                return  Object.keys(obj).length ===0;
            }
        }else{
            if(obj === undefined||obj ===null||obj ==='')return true;
            return false;
        }
    }
    //去除头尾空格
    function trim(str){
        if(typeof str === 'string') return str.replace(/^\s+|\s+$/g,'');
        throw new Error('$.tirm()  参数必须为string')
    }

    $.isArray = isArray;
    $.isNull = isNull;
    $.trim = trim;
    $.liarCopy = liarCopy;
})();
console.log($.isArray([]),$.isArray(0));