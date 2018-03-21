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
