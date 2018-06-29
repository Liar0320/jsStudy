(function(angular) {
  var home = angular.module("app.home", []);
  home.controller("homeCtrl", homeCtrl);
  homeCtrl.$inject = ["ajaxService"];
  function homeCtrl(ajaxService) {
    var vm = this;
    // vm.titleSets = ['首页','全部课程','Unity','虚幻','关于我们'];
    //   console.log(this);
    //   ajaxService.get('/menuList','',function(res){
    //       console.log(res);
    //       vm.titleSets = res.data.record;
    //   })
  }

  home.directive("decBroadCast", decBroadCast);
  function decBroadCast() {
    return {
      restrict: "A",
      link: link
    };
    function link(scope, ele, attrs) {
      let animation = attrs.animation;
      let len = ele[0].getElementsByTagName("img").length;
      let width = parseInt(
        $.getStyle(ele[0].getElementsByTagName("img")[0], "width")
      );
      $.setStyle(ele[0], "width", `${len * width}px`);
      $.setStyle(ele[0], "left", `${width}px`);
      let index = 1;
      $.setStyle(ele[0], "transform", `translate3d(-${index * width}px,0,0)`);
      setInterval(() => {
        index++;
        if (!$.hasClass(ele[0], animation)) $.addClass(ele[0], animation);
        $.setStyle(ele[0], "transform", `translate3d(-${index * width}px,0,0)`);
        if (index === len) {
          setTimeout(() => {
            $.removeClass(ele[0], animation);
            index = 1;
            $.setStyle(
              ele[0],
              "transform",
              `translate3d(-${index * width}px,0,0)`
            );
          }, 1000);
        }
        setCircleActive(index);
      }, 10000);

      //创建节点
      function getCircleHtml(len) {
        let div = document.createElement("div");
        div.className = "pa tc pageControl";
        for (let i = 0; i < len - 1; i++) {
          let circle = document.createElement("div");
          circle.className = "pageControl-circle mr15";
          circle.addEventListener("click", () => {
            index = i + 1;
            if (!$.hasClass(ele[0], animation)) $.addClass(ele[0], animation);
            $.setStyle(
              ele[0],
              "transform",
              `translate3d(-${index * width}px,0,0)`
            );
            setCircleActive(index);
          });
          div.appendChild(circle);
          circle = null;
        }
        $.setStyle(div.$children()[0], "border-color", "#dedede");
        return div;
      }

      //创建所有点集合
      var circle = getCircleHtml(len);
      ele[0].parentNode.appendChild(circle);
      //设置当前选中的点
      function setCircleActive(index) {
        index === len ? (index = 0) : (index -= 1);
        for (var i = 0; i < len - 1; i++) {
          index === i
            ? $.setStyle(circle.$children()[i], "border-color", "#dedede")
            : $.setStyle(circle.$children()[i], "border-color", "inherit");
        }
      }
    }
  }

  //  home
})(angular);

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
*/
