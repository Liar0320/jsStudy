///  o 存储 引用1 ， item 存储 引用1  ,'改变'值类型 通过引用修改了源数据 ,item 改变引用到 null ,但是o的引用还是没变;
///  null既不是对象也不是一种类型，它仅是一种特殊的值，你可以将其赋予任何引用类型，你也可以将null转化成任何类型
///https://www.cnblogs.com/canning-gao/p/5708796.html
///https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8
/*
https://segmentfault.com/a/1190000004322487       你真的会使用XMLHttpRequest吗？
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
    function liarCopy(destination,source){
        copyRecurse(destination,source)
        function copyRecurse(destination,source){
            if($.isArray(source)){
                !_$.isArray(destination)&&(destination = []);
                !destination.length||(destination.length = 0);
                source.forEach((item,index) => {
                    destination[index] = copyElement(item);
                });
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
 

    function liarExtend(destination,source){
        if(_$.isObject(destination)&&_$.isObject(source)){
            for(let item in source){
                destination[item] = source[item];
            }
        }else{
            new Error('data is not [object Object]');
        }
    }

    //去除头尾空格  return str
    function trim(str){
        if(typeof str === 'string') return str.replace(/^\s+|\s+$/g,'');
        throw new Error('$.tirm()  参数必须为string')
    }

    liarExtend(_$,{
        liarCopy,
        liarExtend,
        trim
    })
})($);
console.log($);

(function(){
    function sendAjax(){
        var formData = new FormData();
        formData.append('username','liar');
        formData.append('id',123456);

        var xhr = new XMLHttpRequest();
        xhr.timeout = 3000;
        xhr.responseText = "text";
        xhr.open('post','http://www.baidu.com',true)
        xhr.onload = function(e){
            if(this.status ==200||this.status == 304){
                console.log(this.responseText);
            }
        }
        xhr.send(formData)
    } 
    sendAjax()
})()