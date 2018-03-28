///$q  promise https://www.cnblogs.com/ZengYunChun/p/6438330.html
///固定一个元素到文档底部的高度
(function(_window){
    angular.module('app').directice('decHeight',decHeight);
    decHeight.$inject = [];
    function decHeight(){
        return{
            restrict:'A',
            link:(scope,ele,attrs)=>{
                fullHeight();
                function fullHeight(){
                    // console.log(timeFnc++)
                    var clientHeight= document.body.clientHeight;
                    var top = ele[0].offsetTop;     //获取元素距上边界距离
                    var height = clientHeight-top-15;   //留白15像素
                    var cszd = attrs.height||'height';//参数字段如果有值则取，没有默认'height'
                    ele[0].style[cszd] = height+'px';
                }

                _window.addEventListener('resize',timeInter) //如果页面大小发生变化重新赋值
                var timeoutTb; //存储定时器
              //  var timeCount = 0;//定时器产生的次数
              //  var timeFnc = 0; //函数执行的次数
                function timeInter(){
                    if(timeoutTb) clearTimeout(timeoutTb);
                    timeoutTb = setTimeout(fullHeight, 200);
                  //  console.log(timeCount++);
                }

                scope.$on('$destroy',()=>{
                    ele = null;
                    _window.removeEventListener('resize',timeInter);
                })
            }
        }
    } 
})(window)