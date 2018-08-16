///  o 存储 引用1 ， item 存储 引用1  ,'改变'值类型 通过引用修改了源数据 ,item 改变引用到 null ,但是o的引用还是没变;
///  null既不是对象也不是一种类型，它仅是一种特殊的值，你可以将其赋予任何引用类型，你也可以将null转化成任何类型
///https://www.cnblogs.com/canning-gao/p/5708796.html
///https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8
//https://blog.csdn.net/cbjcry/article/details/70154946 JS操作DOM元素属性和方法
/*
https://segmentfault.com/a/1190000004322487       你真的会使用XMLHttpRequest吗？
https://www.cnblogs.com/heyuquan/archive/2014/07/17/bubble-quick-sort.html  排序可参考
*/
const $ = {};
///判断 return true or false
(_$ => {
  //number string boolean undefind object function
  function type(thing) {
    const TEMPLATE = {
      "[object Number]": "number - object",
      "[object String]": "string - object",
      "[object Boolean]": "boolean - object",
      "[object Object]": "object"
    };
    let _type = typeof thing;
    if (thing === null) {
      return "null";
    } else if (_type === "object") {
      console.log(Object.prototype.toString.call(thing));
      return TEMPLATE[Object.prototype.toString.call(thing)];
    } else {
      return _type;
    }
  }

  ///基础类型判断
  const types = [
    "Array",
    "Boolean",
    "Date",
    "Number",
    "Object",
    "RegExp",
    "HTMLDocument",
    "String",
    "Window",
    "Function"
  ];
  types.reduce((index, item) => {
    _$["is" + item] = data => {
      if (Object.prototype.toString.call(data) === `[object ${item}]`)
        return true;
      return false;
    };
    return _$;
  }, _$);

  ///是否为空
  function isNull(obj) {
    if (typeof obj === "object") {
      if (_$.isArray(obj)) {
        return obj.length === 0;
      } else {
        return Object.keys(obj).length === 0;
      }
    } else {
      if (obj === undefined || obj === null || obj === "") return true;
      return false;
    }
  }

  $["isNull"] = isNull;
  $["type"] = type;
})($);

///-------- liarCopy || 浅拷贝 -----深度拷贝  暂时不考虑原形链上的
(function(_$) {
  //对象的深度拷贝，不考虑原型链
  function liarCopy(destination, source) {
    copyRecurse(destination, source);
    function copyRecurse(destination, source) {
      if ($.isArray(source)) {
        !_$.isArray(destination) && (destination = []);
        !destination.length || (destination.length = 0);
        for (let i = 0; i < source.length; i++) {
          destination[i] = copyElement(source[i]);
        }
        // source.forEach((item,index) => {
        //     destination[index] = copyElement(item);
        // });
      } else if (_$.isObject(source)) {
        !_$.isObject(destination) && (destination = {});
        if (!_$.isNull(destination)) {
          Object.keys(destination).forEach(item => {
            delete destination["item"];
          });
        }
        for (let item in source) {
          destination[item] = copyElement(source[item]);
        }
      }
      return destination;
    }
    function copyElement(source) {
      if (typeof source !== "object") return source;
      let destination = undefined;
      return copyRecurse(destination, source);
    }
  }

  //对象的扩展
  function liarExtend(destination, source) {
    if (_$.isObject(destination) && _$.isObject(source)) {
      for (let item in source) {
        destination[item] = source[item];
      }
    } else {
      new Error("data is not [object Object]");
    }
  }

  //快速排序  O(nlog2n) O(1)
  function querysort(origin) {
    if (!_$.isArray(origin))
      return new Error("输入的参数不是数组无法进行快速排序");
    function sort(start, end, arr) {
      let key = arr[start];
      let temp_x = start;
      let temp_y = end;
      while (true && start < end) {
        for (; start < end; end--) {
          if (key > arr[end]) {
            arr[start++] = arr[end]; //start++ 先赋值然后将start所在的索引加一，因为这个数据arr[start]肯定小于key 所以在下面的for循环中就没必要在进行判断；
            break;
          }
        }

        for (; start < end; start++) {
          if (key < arr[start]) {
            arr[end--] = arr[start]; //同理
            break;
          }
        }
      }

      arr[start] = key;
      //    if(temp_y-temp_x===1) return arr;
      if (start === end) {
        if (start - temp_x > 1) sort(temp_x, start - 1, arr);
        if (temp_y - end > 1) sort(end + 1, temp_y, arr);
      }
    }
    sort(0, origin.length - 1, origin);
  }

  //冒泡排序  O(n^2) O(1)
  function bubbleSort(origin) {
    for (let j = 0; j < origin.length; j++) {
      for (let i = 0; i < origin.length; i++) {
        if (origin[i + 1] < origin[i]) {
          let temp = origin[i + 1];
          origin[i + 1] = origin[i];
          origin[i] = temp;
        }
      }
    }
    return origin;
  }

  //去除头尾空格  return str
  function trim(str) {
    if (typeof str === "string") return str.replace(/^\s+|\s+$/g, "");
    throw new Error("$.tirm()  参数必须为string");
  }

  //两个数组合并，根据关键字去重，
  //groupA  groupB  以A为原型对b去重 如果值相同 取A；
  function combineData(groupA, groupB, key) {
    let combineGroup = groupA.concat(groupB);
    let tempData = [];
    return combineGroup.filter(function(x) {
      if (tempData.indexOf(x[key]) !== -1) return;
      tempData.push(x[key]);
      return x;
    });
  }

  function GUID(){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
  }

  liarExtend(_$, {
    liarCopy,
    liarExtend,
    trim,
    querysort,
    bubbleSort
  });
})($);

//document和节点的方法
(function($) {
  function getStyle(ele, attr) {
    return ele.currentStyle
      ? ele.currentStyle[attr]
      : getComputedStyle(ele, "null")[attr];
  }

  function setStyle(ele, attr, value) {
    ele.style[attr] = value;
  }

  function addClass(ele, addName) {
    if (addName.match(/ +/g) === null) {
      ele.classList.add(addName);
    } else {
      ele.className += ele.className === "" ? addName : " " + addName;
    }
  }

  function removeClass(ele, addName) {
    if (addName.match(/ +/g) === null) {
      ele.classList.remove(addName);
    } else {
      let names = addName.split(/ +/g);
      for (let item of names) {
        ele.className.indexOf(item) === -1 || ele.classList.remove(item);
      }
    }
  }

  function hasClass(ele, className) {
    var all = " " + ele.className + " ";
    return all.indexOf(" " + className + " ") > -1;
  }
  //window.getComputedStyle(ele).height     (内容高度);  height
  //clientHeight                                          (内容高度 + 内边距*2); height + padding
  //offsetHeight                                          (内容高度 + 内边距*2 +边框*2)  height + padding + border
  //ele node节点  如果 bol为true则获取 加上margin值得 宽度;
  function width(ele, bol) {
    let width = bol
      ? ele.offsetWidth +
        getStyle(ele, "margin-right").match(/\d+/) * 1 +
        getStyle(ele, "margin-left").match(/\d+/) * 1
      : ele.offsetWidth;
    return width;
  }

  function height(ele, bol) {
    let height = bol
      ? ele.offsetHeight +
        getStyle(ele, "margin-top").match(/\d+/) * 1 +
        getStyle(ele, "margin-bottom").match(/\d+/) * 1
      : ele.offsetHeight;
    return height;
  }

  function getAttributeNames(ele, attr) {
    return ele.attributes;
  }

  //对于node的操作
  function insertAfter(targetNode, originNode) {
    originNode = originNode.siblindNodes;
  }

  $.liarExtend($, {
    getStyle,
    setStyle,
    addClass,
    removeClass,
    getAttributeNames,
    hasClass,
    height,
    width
  });
})($);

(function(_$) {
  //获取所有的子节点
  Element.prototype.$children = function() {
    var children = this.children;
    if (!children) {
      children = [];
      var childNodes = this.childNodes;
      var len = childNodes.length;
      for (let i = 0; i < len; i++) {
        let element = childNodes[i];
        if (element.nodeType === 1) children.push(element);
      }
    }
    return children;
  };

  //一个元素的上一个节点
  Element.prototype.$previousElementSibling = function() {
    var node = this.previousElementSibling;
    if (!node)
      for (
        node = this.previousSibling;
        node && node.nodeType !== 1;
        node = node.previousSibling
      );
    return node;
  };

  //一个元素的下一个节点
  Element.prototype.$nextElementSibling = function() {
    var node = this.nextElementSibling;
    if (!node)
      for (
        node = this.nextElementSibling;
        node && node.nodeType !== 1;
        node = node.nextElementSibling
      );
    return node;
  };

  //在一个元素节点的后面加入一个节点
  Element.prototype.$insterAfter = function(target, origin) {
    var nextNode = origin.$nextElementSibling();
    if (nextNode === undefined) {
      return this.appendChild(target);
    } else {
      return this.insertBefore(target, nextNode);
    }
  };

  //寻找当前元素的第n个兄弟元素 可以为负数
  //逻辑：当n位正数时 向下查找 n-- 当n为负数时向上查找 n++
  Element.prototype.$retSibling = function(n) {
    var origin = this;
    while (n && origin) {
      if (n > 0) {
        origin = origin.$nextElementSibling();
        n--;
      } else {
        origin = origin.$previousElementSibling();
        n++;
      }
    }
    return origin;
  };
})($);

//兼容 ie 8 和ie8以下
(function($) {
  function objectKes(object){
    if(Object.keys){
      return Object.keys(object);
    }
    var result = [];
    for(var key in obj){
      if(obj.prototype.hasOwnProperty(key)){
        result.push(key);
      }
    }
    return result;
  }

  function indexOf(arr,value){
    if(Array.prototype.indexOf){
      return arr.indexOf(value);
    }
    var len = arr.length >>> 0, from = Number(arguments[2]) || 0 ,
    from = (from < 0) ?  Math.ceil(from) : Math.floor(from);
    for (;from < len ; from++) {
      if(from in arr && value === arr[from]) return from;
    }
    return -1;
  }


  //IE8和IE8以下的浏览器
  //document.body.scrollLeft document.documentElement.scrollLeft 会混乱但是只会存在一个
  function getScrollOffset() {
    if (window.pageXOffset !== undefined) {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    } else {
      return {
        x: document.body.scrollLeft + document.documentElement.scrollLeft,
        y: document.body.scrollTop + document.documentElement.scrollTop
      };
    }
  }


  //增加监听事件
  //addEventListener IE9以下不兼容
  //attachEvent  IE独有 但是this指向为window
  function addEvent(elem, type, handle) {
    if (elem.addEventListener) {
      elem.addEventListener(type, handle,false);
    } else if (elem.attachEvent) {
      this['at'+handle.name]  = function() {
        handle.call(elem);
      }
      elem.attachEvent("on" + type, this['at'+handle.name]);
    } else {
      elem["on" + type] = handle;
    }
  }

  //取消监听事件
  function removeEvent(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type,handle,false);
    } else if (elem.detachEvent) {
      elem.detachEvent("on" + type, this['at'+handle.name]);
      this = null;
    } else {
      elem["on" + type] = false;
    }
  }
  //事件冒泡 子元素向父元素传递事件，
  //事件捕获 父元素向下捕获 直到点击事件元素，
  //IE不支持捕获

  //先捕获后冒泡 ，当事件执行时 先绑定先执行

    //阻止冒泡事件
  //在ie下cancelbubble  不支持stoppropagation
  function stopBubble(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }

  //取消页面右键事件
  function undoContextmenu() {
    document.oncontextmenu = function(e) {
      cancelHandler(e);
    };
    function cancelHandler(evnet) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    }
  }
  
  //按需加载
  function loadScript(url,callback){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if(script.readyState){
        script.onreadystatechange = function(){
            if(script.readyState === 'complete'||script.readyState==='loaded'){
                callback();
            }
        }
    }else{
        script.onload = function(){
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
  }


  //IE只有window.event
  var evnet = e || window.event;
  //火狐只有target,IE只有srcElement,chrome都有
  var target = e.target || e.srcElement;

  //window.keydown  所有键除了fn   编码唯一但和ascll有区别
  //window.keypress 字符类按键     标准ascll 
  //String.fromCharCode()  ascll转字符

  $.liarExtend($, {
    getScrollOffset,
    stopBubble,
    undoContextmenu
  });
})($);

(function($){
    //拖拽区域 elem 默认为document
    //拖拽对象 target
    function drag(target,elem){
        elem || ( elem = document);
        var disX;
        var disY;
        function downHandle(e){
            var e = e || window.event;
            disX = e.pageX - parseInt(target.style.left||0);
            disY = e.pageY - parseInt(target.style.top||0);
            $.addEvent(elem,'mousemove',moveHandle);
            $.addEvent(elem,'mouseup',upHandle);
            $.stopBubble(e);
        }
        function moveHandle(e){
            var e = e || window.event;
            target.style.left = e.pageX - disX + 'px';
            target.style.top = e.pageY - disY + 'px';
            $.stopBubble(e);
        }
        function upHandle(e){
            var e = e || window.event;
            var eTarget = e.target || e.srcElement;
            if(eTarget !== target) return;
            $.removeEvent(elem,'mousemove',moveHandle);
            $.removeEvent(elem,'mouseup',upHandle);
            $.stopBubble(e);
        }  
        $.addEvent(target,'mousedown',downHandle);

        return function(){
            $.removeEvent(target,'mousedown',downHandle);
        }
    }
})($);
