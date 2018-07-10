angular.module('app',[])
    .controller('tabActiveControl',['$scope',function($scope){
        console.log($scope);
        var vm = this;
        // vm.opo = [];

        vm.data =  [
            {'title':'工作性质',children:[0,1,2,3,4,5,6,7]},
            {'title':'学历要求',children:[0,1,2,3,4,5,6,7]},
            {'title':'行业',children:[0,1,2,3,4,5,6,7]},
        ]
        
    
        vm.callback = function(result){
            console.log(result);
        }
    }])
    //callback 接收的回调函数
    //resolve 显示的数据
    .directive('devTab',function(){
        return{
            restrict:'E',
            scope:{
                // reslove:'=',
                // mutilp:'@',
                callback:'&',
                reslove:'=',
            },
            template:template,
            link:function(scope,ele){

                var result = {};

                ele.bind('click',click);

                function click(e){
                    e = e||window.event;
                    var target = angular.element(e.target);
                    var parentId = target.hasClass('child')?target.attr('parent'):target.parent().attr('parent');
                    var searchId = target.hasClass('child')?target.attr('search'):target.parent().attr('search');
                    if(target.hasClass('child')){
                        target.hasClass('active')? removeClass(target,searchId,parentId):
                        addClass(target,searchId,parentId);
                    }else if(target.hasClass('delete')){
                        removeClass(target.parent(),searchId,parentId);
                    }
                    target = null;
                    scope.callback({'result':result});
                } 
    
                //删除
                function removeClass(ele,searchId,parentId){
                    ele.removeClass('active');
                    var index = result[parentId].indexOf(searchId);
                    if(index>-1) result[parentId].splice(index,1);
                    ele = null;
                }
                //添加
                function addClass(ele,searchId,parentId){
                    ele.addClass('active');
                    if(!result[parentId])result[parentId] = [];
                    result[parentId].push(searchId);
                    ele = null;
                }
                
                scope.$on('destroy',function(){
                    ele.unbind(click);
                    ele.remove();
                })
            }
        }

        function template(){
            return  "<ul >"+
                        "<li ng-repeat='item in reslove' >"+
                        "<span>{{item.title}}</span>"+
                        "<a class='child' ng-repeat='childItem in item.children'  parent='{{$parent.$index}}'  search='{{$index}}'>{{childItem}}<i class='delete'></i></a>"+
                        "</li>"+
                    "</ul>"
        }
    })