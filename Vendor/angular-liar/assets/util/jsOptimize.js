const $ = {};
///判断 return true or false
((_$)=>{
    ///基础类型判断
    const types=["Array","Boolean","Date","Number"
    ,"Object","RegExp","HTMLDocument","String","Window",'Function'];
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
        return destination;
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

    //两个数组合并，根据关键字去重，
    //groupA  groupB  以A为原型对b去重 如果值相同 取A；
    function combineData(groupA,groupB,key){
        let
        combineGroup = groupA.concat(groupB);
        let tempData = []
        return combineGroup.filter(function(x){
            if(tempData.indexOf(x[key]) !==-1) return ;
            tempData.push(x[key]);
            return x;
        })
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

    function setStyle(ele,attr,value){
        ele.style[attr] = value;
    }

    function addClass(ele,className){
        if(className.match(/ +/g) === null){
            ele.classList.add(className);
        }else{
            ele.className += ele.className === ''? className:' '+className;
        }
    }
    
    function removeClass(ele,className){
        if(className.match(/ +/g) === null){
            ele.classList.remove(className);
        }else{
            let names = className.split(/ +/g);
            for(let item of names){
                ele.className.indexOf(item) ===-1||ele.classList.remove(item);
            }
        }
    }

    function hasClass(ele,className){
       return  ele.className.indexOf(className) > -1;
    }

    function getAttributeNames(ele,attr){
        return ele.attributes;
    }

    $.liarExtend($,{
        getStyle,
        setStyle,
        addClass,
        removeClass,
        getAttributeNames,
        hasClass
    })

})($)