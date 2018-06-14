(function(angular){
    var home = angular.module('app.home',[]);
    home.controller('homeCtrl',homeCtrl)
    homeCtrl.$inject = [];
    function homeCtrl() {
        var vm = this;
        console.log(this);
    }



    home.directive('decBroadCast',decBroadCast)
    function decBroadCast() {
        return{
            restrict:'A',
            link:link,
        }
        function link(scope,ele,attrs) {
            let animation = attrs.animation;
            let len = ele[0].querySelectorAll('img').length;
            let width = parseInt($.getStyle(ele[0].querySelectorAll('img')[0],'width'));
            $.setStyle(ele[0],'width',`${len*width}px`);
            $.setStyle(ele[0],'left',`${width}px`);
            let index = 1; 
            $.setStyle(ele[0],'transform',`translate3d(-${index*width}px,0,0)`);
            setInterval(()=>{
                index++;
                if(!$.hasClass(ele[0],animation))$.addClass(ele[0],animation)
                $.setStyle(ele[0],'transform',`translate3d(-${index*width}px,0,0)`);
                if(index===len){
                    setTimeout(()=>{
                    $.removeClass(ele[0],animation);
                    index = 1;
                    $.setStyle(ele[0],'transform',`translate3d(-${index*width}px,0,0)`);
                    },1000)
                }
            },10000)

            ele[0].parentNode.appendChild(getCricleHtml(len));


            function getCricleHtml(len){
                let div = document.createElement('div');
                div.className = 'pa tc pageControl';
                for (let i = 0; i< len - 1 ; i++) {
                   let circle = document.createElement('div');
                   circle.className = 'pageControl-circle mr15';
                   circle.addEventListener('click',()=>{
                        index = i + 1;
                        if(!$.hasClass(ele[0],animation))$.addClass(ele[0],animation)
                        $.setStyle(ele[0],'transform',`translate3d(-${index*width}px,0,0)`);
                   })
                   div.appendChild(circle);
                   circle = null;
                }
                return div;
            }
        }
    }
})(angular)

//decBroadCast
/*
    轮播图，
    一张为基数，
                  1 2 3 1
                1 2 3 1
              1 2 3 1
            1 2 3 1 
    ----->  1 2 3 1 
                1 2 3 1
    排序方式 头尾各方一张
    当0一直向有滑动，直到滑动到0时 将动画效果取消并且重置位移 然后将index改为1 动画效果加上反复
    位移使用translate3d();
    可参考https://github.com/townkoim/js-img-lunbo
*/