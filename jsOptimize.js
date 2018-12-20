///  o 存储 引用1 ， item 存储 引用1  ,'改变'值类型 通过引用修改了源数据 ,item 改变引用到 null ,但是o的引用还是没变;
///  null既不是对象也不是一种类型，它仅是一种特殊的值，你可以将其赋予任何引用类型，你也可以将null转化成任何类型
///https://www.cnblogs.com/canning-gao/p/5708796.html
///https://git-scm.com/book/zh/v1/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8
//https://blog.csdn.net/cbjcry/article/details/70154946 JS操作DOM元素属性和方法
/*
https://segmentfault.com/a/1190000004322487       你真的会使用XMLHttpRequest吗？
https://www.cnblogs.com/heyuquan/archive/2014/07/17/bubble-quick-sort.html  排序可参考
https://www.cnblogs.com/chuaWeb/p/5210689.html
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

  function GUID(len,radix){
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

  /**
   * 将base64转换为文件
   * @param {*} dataurl 
   * @param {*} filename 
   * var base64Testc = 'data:image/png;base64,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'
   * var nf = dataURLtoFile(base64Testc,'001.png');
   */
function dataURLtoFile(dataurl, filename) {//将base64转换为文件
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}




/**                           ??????????????????????????没想明白 为什么要这么写当时
			 *创建 0 - limitR 随机数
			 * @param {*} limitR 最大随机数
			 */
      function randomDigit (limitR) {
          limitR = limitR || 10;
          var random = Math.random;
          var len =  String(limitR).length;
          var digit = 1;
          for (var i = 0; i < len; i++) {
            digit = 10*digit;
          }
          var result;
          var count = 0;
          while (result === undefined && count < 100) {
              var counts = parseInt(random() * digit);
              if (counts < limitR) result = counts;
              count++;
          }
          random = null;
          return count === 100 ? 0 : result;
      }
    function square(_parmas,_square) {
        var normal = _parmas;
        for (var i = 1; i < _square; i++) {
          normal = normal*_parmas;
        }
        return normal;
    }


     /**
     * 比较新值数组v1和旧值数组o1  根据p_k键值  判断其中的row是否发生 新值 修改 或者删除
     * @param {*} v1    新
     * @param {*} o1    旧
     * @param {*} p_k   键值
     * @param {*} excludes  忽略的键值
     * 根据对象判断其关系为
        新增
        修改
        删除
      var v1,o1,v1_c,o1_c,o1_d;
      判断 v1,o1 两个是否为数组 如果不是则return;

      var result = [
        [],	//新增
        [],	//修改
        []	//删除
      ]


      //获取v1中的所有键值;转换为 键值对象  key:row  v1_c
      //匹配o1中的所有数据，提取键值相同的;并且remove他;  生成一个新的数组 o1_d;和键值对象 o1_c key:row
        result[2] = o1_d;
      //比较 o1_c中的所有row 和 v1_c的row中的 关系 ; 
        如果 o1_c中 row的所有键值对 === v1_c的row;则数据正常;
        不等于  数据修改 result[1].push(row);
        每次比较 delete v1_c中的键值对;
        循环剩下的键值对,该数据就是新增的条数;
        result[0] = row;
     */
    function JsonOrg(v1, o1, p_k, excludes) {
      var v1_c = {}; var o1_c = {}; var i, key, o_item, v_item, flag, key_2;
      if (p_k === undefined) p_k = 'id';
      var result = [
          [], // 新增
          [], 	// 修改
          [] // 删除
      ];
      // 获取v1中的所有键值;转换为 键值对象  key:row  v1_c
      for (i = 0; i < v1.length; i++) {
          v1_c[v1[i][p_k]] = v1[i];
      }
      // 匹配o1中的所有数据，提取键值相同的;并且remove他;  生成一个新的数组 o1_d;和键值对象 o1_c key:row
      for (i = 0; i < o1.length; i++) {
          if (v1_c[o1[i][p_k]]) {
              o1_c[o1[i][p_k]] = o1[i];
              o1.splice(i, 1);
              i--;
          }
      }
      // 删除的rows
      result[2] = o1;
      // 比较 o1_c中的所有row 和 v1_c的row中的 关系 ;   获取 修改的row
      for (key in o1_c) {
          if (o1_c.hasOwnProperty(key)) {
              o_item = o1_c[key];
              v_item = v1_c[key];
              flag = true;
              for (key_2 in o_item) {
                  if (excludes && excludes.indexOf(key_2) > -1) continue;
                  if (o_item.hasOwnProperty(key_2)) {
                      if (o_item[key_2] !== v_item[key_2]) {
                          flag = false;
                          break;
                      }
                  }
              }
              if (!flag) {
                  result[1].push(v_item);
              }
              delete v1_c[key];
          }
      }
      // 新值的row
      for (key in v1_c) {
          result[0].push(v1_c[key]);
      }
      return result;
  };
  

  liarExtend(_$, {
    liarCopy,
    liarExtend,
    trim,
    querysort,
    bubbleSort,
    combineData,
    GUID,
    randomDigit
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

//对时间处理
(function () {
    // 传进数字 传出字符串  二位数
    function isAddTwo (count) {
      if (count < 10) count = '0' + count;
      return count + '';
    }

    /**
     * 拼接日历中的最小对象  天
     * @param {*} year
     * @param {*} month
     * @param {*} day
     * @param {*} week
     * @param {*} typeOfmonth 是第几个月
     */
    function packDateObj (year, month, day, week, typeOfmonth, typeMath) {
        var M, Y;
        if (typeMath === 'next') {
            M = isAddTwo(month === 12 ? 1 : month + 1);
            Y = month === 12 ? year + 1 : year;
        } else if (typeMath === 'prev') {
            M = isAddTwo(month === 1 ? 12 : month - 1);
            Y = month === 1 ? year - 1 : year;
        } else {
            M = isAddTwo(month);
            Y = year;
        }
        return { text: day, month: typeOfmonth, week: week, date: Y + '-' + M + '-' + isAddTwo(day) };
    }

    /**
    * 获取当月的日期格式
    * @param {*} Cyear 当前年份
    * @param {*} Cmonth 当前月份
    * @param {*} currentDate 当前日期 可选
    */
    function getFullMonthDays (Cyear, Cmonth, CDate) {
        Cmonth = Number(Cmonth);
        Cyear = Number(Cyear);
        CDate = Number(CDate);
        var month = new Date(Cyear, Cmonth - 1);
        var firstWeek = month.getDay();
        var days = month.getDays();
        var result = [];
        var i;
        var week;
        week = firstWeek - 1;
        // 当月
        for (i = 0; i < days; i++) {
            week += 1;
            if (week === 8) week = 1;
            result.push(packDateObj(Cyear, Cmonth, i + 1, week, 'current'));
            // result.push({ text: i + 1, month: 'current', week: week, date: Cyear + '-' + isAddTwo(Cmonth) + '-' + isAddTwo(i + 1), isSelected: CDate === (i + 1) });
        }
        i = 0;
        // 下月
        while (week !== 6) {
            week === 7 ? (week = 1) : (week += 1);
            result.push(packDateObj(Cyear, Cmonth, i += 1, week, 'nextMonth', 'next'));
            // result.push({ text: i += 1, month: 'nextMonth', week: week, date: Cyear + '-' + isAddTwo(Cmonth === 12 ? 1 : Cmonth + 1) + '-' + isAddTwo(i) });
        }
        // 上月
        if (firstWeek !== 7) {
            week = firstWeek;
            var preMonthDays = new Date(Cyear, Cmonth - 2).getDays();
            for (i = 0; i < firstWeek; i++) {
                week -= 1;
                if (week === 0)week = 7;
                result.unshift(packDateObj(Cyear, Cmonth, preMonthDays - i, week, 'preMonth', 'prev'));
                // result.unshift({ text: preMonthDays - i, month: 'preMonth', week: week, date: Cyear + '-' + isAddTwo(Cmonth === 1 ? 12 : Cmonth - 1) + '-' + isAddTwo(preMonthDays - i) });
            }
        }
        // 补齐
        week--;
        i = result[ result.length - 1 ].text;
        while (result.length < 42) {
            week === 7 ? (week = 1) : (week += 1);
            result.push(packDateObj(Cyear, Cmonth, i += 1, week, 'nextMonth', 'next'));
            // result.push({ text: i += 1, month: 'nextMonth', week: week, date: Cyear + '-' + isAddTwo(Cmonth === 12 ? 1 : Cmonth + 1) + '-' + isAddTwo(i) });
        }
        return result;
    }

    /**
    * 得到日期数组
    * @param {*} startDate 起始时间
    * @param {*} endDate 截止时间
    * 依赖  getdaysByDate  getDateBydays  isAddTwo
    */
    function resultSortDate (startDate, endDate) {
        var month = 0;
        var days = 0;
        if (startDate.getMonth === undefined) {
            var t1 = startDate.match(/\d+/g);
            var year1 = t1[0] * 1;
            var month1 = t1[1] * 1 - 1;
            var days1 = t1[2] * 1;
        }
        if (endDate.getMonth === undefined) {
            var t2 = endDate.match(/\d+/g);
            var year2 = t2[0] * 1;
            var month2 = t2[1] * 1 - 1;
            var days2 = t2[2] * 1;
        }
        if (year1 === year2) {
            var days1 = getdaysByDate(startDate);
            var days2 = getdaysByDate(endDate);
            var result = [];
            for (var i = days1; i <= days2; i++) {
                var getM = getDateBydays(i, startDate);
                var date = year1 + '-' + isAddTwo(getM[0]) + '-' + isAddTwo(getM[1]);
                result.push(date);
            }
        } else {
            days1 = getdaysByDate(startDate);
            days2 = 365;
            result = [];
            for (i = days1; i <= days2; i++) {
                getM = getDateBydays(i, startDate);
                date = year1 + '-' + isAddTwo(getM[0]) + '-' + isAddTwo(getM[1]);
                result.push(date);
            }
            days1 = 1;
            days2 = getdaysByDate(endDate);
            for (i = days1; i <= days2; i++) {
                getM = getDateBydays(i, endDate);
                date = year2 + '-' + isAddTwo(getM[0]) + '-' + isAddTwo(getM[1]);
                result.push(date);
            }
        }
        return result;
    }

    /**
    * 根据日期获取在当年中的天数
    * @param {*} date 日期
    */
    function getdaysByDate (date) {
        var nowDate = date ? new Date(date) : new Date();
        var february = (nowDate.getFullYear() % 100 !== 0 && nowDate.getFullYear() % 4 === 0) || nowDate.getFullYear() % 400 === 0 ? 29 : 28;
        var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var month = 0;
        var days = 0;
        var result = 0;
        if (date.getMonth === undefined) {
            var t = date.match(/\d+/g);
            month = t[1] * 1 - 1;
            days = t[2] * 1;
        }
        for (var i = month - 1; i >= 0; i--) {
            result += daysOfMonth[i];
        }
        result += days;

        return result;
    }
    /**
    * 根据天数转化为当年日期中的日期时间
    * @param {*} days 天数
    * @param {*} startDate 可选    当年的某天 为了获取 2月的天数
    */
    function getDateBydays (days, startDate) {
      var nowDate = startDate ? new Date(startDate) : new Date();
      var february = (nowDate.getFullYear() % 100 !== 0 && nowDate.getFullYear() % 4 === 0) || nowDate.getFullYear() % 400 === 0 ? 29 : 28;
      var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var month = 0;
      while (days > daysOfMonth[month]) {
          days -= daysOfMonth[month];
          month++;
          if (month >= 12) break;
      }
      return [month + 1, days];
    }
})();
