https://juejin.im/post/59c60691518825396f4f71a1

http://ghmagical.com/article/page/id/nXCnaSLsuyWd


https://stackoverflow.com/questions/3395359/difference-between-src-and-href     SRC和HREF之间的区别

https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers
javaScript 大纲
    因为是一门解释性语言,执行速度没有其他编译性语言快，但是不存在跨平台;

所有的浏览器都起源于Mosaic,现在流行的浏览器内核，
    Chrome:Webkit,
    Safari:Webkit,
    IE:Trident,
    Firefox:gecko,

js的六种基本类型  Number String Boolean Null Undefined Object
显示类型转化
Number类型 NaN解释 not a number | Number('1') = 1; Number(true) = 1; Number(false) = 0; Number(null) = 0;  Number(undefined) = NaN;   Number('abc') = NaN ;
String类型 String(1)='1';
Boolead类型 Boolean(0) = false; Boolean(undefined) = false; Boolean('') = false;

隐式类型转换
Number类型 
parseInt:: parseInt('123') = 123; parseInt('123px') = 123;  parseInt(string, radix);parseInt('101', 2) = 5;//radix进制 将string按照radix转化为十进制
parsefloat:: parseInt('123.111pasdas') = 123.111;

String类型
(3).toString(2) == 11;

Boolead类型  == 两边类型进行隐式转换    === 不进行转化
2>1 = true ; 3>2>1 = false;--->3>2=ture ----> true>1 false; 3>2==1 = true;   3>2===1 = false;   