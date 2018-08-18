(function () {

    module = angular.module('d3tree',[]);
    module.controller('treeCtrl',treeCtrl);
    treeCtrl.$inject = [];
    function treeCtrl() {
        var vm = this;
        vm.treedata = {'a':1};
        vm.treedata = [
       
        ];
        vm.treeAdd = function () {
            vm.treedata.push({'label':'党工部领导2',id:14,pid:12,end:true}, {'label':'部门领导',id:11,pid:0},
            {'label':'分管局领导',id:12,pid:0},
            {'label':'党工部领导',id:13,pid:0});
        };
        vm.treeSelect = function (result) {
            console.log(result);
        }
    }

    module.directive('decLineTree',decTree);
    decTree.$inject = [];
    function decTree(){
       return {
           restrict:'AEC',
           scope:{
               treeData:'=',
               onSelect:'&'
           },
           link:function (scope,elem,attr) {
               console.log(scope,scope.treedata,scope,elem,attr);

               var g = new dagreD3.graphlib.Graph()
               .setGraph({rankdir: 'LR', edgesep: 40, ranksep: 40})
               .setDefaultEdgeLabel(function() { return {}; });

               var watch = scope.$watch('treeData',sortGnode,true);
               function sortGnode(newData,oldData) {
                    var g = new dagreD3.graphlib.Graph()
                    .setGraph({rankdir: 'LR', edgesep: 40, ranksep: 40})
                    .setDefaultEdgeLabel(function() { return {}; });
                    g.setNode(0,  { label: "开始",       class: "type-TOP id-0"});
                    g.setNode(88888,  { label: "结束",         class: "type-S id-88888" });
                  var i ;
                  for ( i = 0; i < newData.length; i++) {
                      g.setNode(newData[i].id*1,{label:newData[i].label,   class:'type-S id-'+newData[i].id+''});
                  }
                  g.nodes().forEach(function(v) {
                        var node = g.node(v);
                        // Round the corners of the nodes
                        node.rx = node.ry = 5;
                    });
                  for ( i = 0; i < newData.length; i++) {
                      if(newData[i].end){
                        g.setEdge(newData[i].id*1,88888);
                      }
                        g.setEdge(newData[i].pid*1,newData[i].id*1);                     
                  }

                  if(g.nodes().length===2){
                    g.setEdge(0, 88888);
                  }
                  

        

                  // Run the renderer. This is what draws the final graph.
                  render(d3.select("svg"), g);


                 var boxClient = angular.element('svg>g')[0].getBBox();
                 elem.attr('height',boxClient.height+10);

         

                 angular.element('svg .node').bind('click',function (event) {
                      var textContent = '';
                      textContent = event.target.textContent;
                      if(!event.target.textContent){
                        textContent = angular.element(event.target).next().text();
                      }else{

                      }
                      var node = angular.element(event.target) ;
                      while (!node.hasClass('node')) {
                        node = node.parent();
                      }
                      var currentNode = node[0].className.baseVal.split(' ').filter(function (item) {
                          return item.indexOf('id-')>-1;
                      });
                      node.addClass('active');
                      node.siblings().removeClass('active');
                      var id = currentNode[0].split('id-')[1]*1;
                      var result;
                      if(id === 0 || id=== 88888){
                          result = [{id:id,enable:false,end:id===0?true:false}];
                      }else{
                        result = newData.filter(function (item) {
                            return item.id*1 === id ;
                        });
                      }
                        
                      
                      scope.onSelect({result:result[0]});
                      console.log('g',textContent);
                 });

                 var moveOrigin = {
                        x:0,
                        y:0,
                        mouseX:0,
                        mouseY:0,
                        enable:false
                    };

                 $('svg .node').draggable({
                    start: function (event, ui) {
                        console.log(event,ui);
                        if(event.target.textContent ==='开始' || event.target.textContent ==='结束'){
                            moveOrigin.enable = false;
                        }else{
                            moveOrigin.enable = true;
                        }
                        moveOrigin.mouseX = event.pageX;
                        moveOrigin.mouseY = event.pageY;
                        var offset = getOffset(event.target);
                        moveOrigin.x = offset.x;
                        moveOrigin.y = offset.y;
                      
                    },
          
            
                    drag: function (event, ui) {
                        if(!moveOrigin.enable) return;
                        var disX = event.pageX - moveOrigin.mouseX;
                        var disY = event.pageY - moveOrigin.mouseY;
                        var transform = event.target.getAttribute('transform').match(/\d[\d\.]+/g)||[];
                        var x = transform[0] *1 ||0;
                        var y = transform[1] *1 || 0;
                        var newX = disX + x > 10? disX + x : 10;
                        var newY = disY + y > 10? disY + y : 10;
                        event.target.setAttribute('transform','translate('+ newX +','+ newY +')');
                        console.log(disX,disY,transform,event.target.getAttribute('transform').match(/\d[\d\.]+/g));
                        moveOrigin.mouseX = event.pageX;
                        moveOrigin.mouseY = event.pageY;
                    },
            
                    stop: function (event, ui) {
                        if(!moveOrigin.enable) return;
                       var offset =  getOffset(event.target);
                       var isSWap =  swapNode(offset.x,offset.y,event.target,moveOrigin.x,moveOrigin.y);
                       if(!isSWap)  event.target.setAttribute('transform','translate('+ moveOrigin.x +','+ moveOrigin.y +')');
                    },
                    containment: "parent"
                });

                function getOffset(node) {
                    var transform = node.getAttribute('transform').match(/\d[\d\.]+/g)||[];
                    var x = transform[0] *1 ||0;
                    var y = transform[1] *1 || 0;
                    node = null;
                    return {
                        x:x,
                        y:y
                    }
                }

                function swapNode(x,y,node,moveX,moveY) {
                   console.log($(node).siblings());
                 
                   var siblings =$(node).siblings();
                   var item ;
                   for (var i = 0; i < siblings.length;  i++) {
                        item = siblings[i];
                        if(item.textContent === '开始' ||item.textContent==='结束') continue;
                        var offset = getOffset(item);
                        var clinet = item.getBBox();
                        var vaildX = (offset.x < x)&&(x<offset.x + clinet.width);
                        var vaildY =  (offset.y < y)&&(y<offset.y + clinet.height);
                        if(vaildX&&vaildY){
                           // node.setAttribute('transform','translate('+ offset.x +','+ offset.y +')');
                           // item.setAttribute('transform','translate('+ moveX +','+ moveY +')');
                           var data = [];
                           data.push(filterScopeData(node)[0],filterScopeData(item)[0]);
                           var arr = scope.treeData.filter(function (item) {
                                return data[0].id === item.id || data[1].id ===item.id;
                            });
                            var temp = angular.copy(arr[0]);
                            arr[0].label = arr[1].label;
                            arr[0].data = arr[1].data;
                            arr[1].label = temp.label;
                            arr[1].data = temp.data;
                            scope.treeData.forEach(function (item) {
                                for (var i = 0; i < arr.length; i++) {
                                    if(arr[i].id === item.id){
                                        item.data = arr[i].data;
                                        item.label = arr[i].label;
                                    }
                                }
                            });
                            scope.$apply();
                            return false;
                        }   
                   }
                   siblings = null;
                   item = null;
                   return false;
                }

                function filterScopeData(node) {
                    var currentNode = node.className.baseVal.split(' ').filter(function (item) {
                        return item.indexOf('id-')>-1;
                    });
                    var id = currentNode[0].split('id-')[1]*1;
                   
                    if(id === 0 || id=== 88888){
                        result = [{id:id,enable:false,end:id===0?true:false}];
                    }else{
                      result = scope.treeData.filter(function (item) {
                          return item.id*1 === id ;
                      });
                    }
                    return result;
                }
              
                //  angular.element('svg .node').bind('mousedown',function (event) {
                //     var node = angular.element(event.target) ;
                //     while (!node.hasClass('node')) {
                //       node = node.parent();
                //     }
                //     var transform = node[0].getAttribute('transform').match(/\d[\d\.]+/g)*1;
                //     moveOrigin.x = transform[0];
                //     moveOrigin.y = transform[1];
                //     moveOrigin.mouseX = event.pageX;
                //     moveOrigin.mouseY = event.pageY;
                //     moveOrigin.target = node;
                //     angular.element('svg').bind('mousemove',mousemove);
                //     angular.element('svg').bind('mouseup',mouseup);
                //     console.log(event,node);
                //  });

                //  function mousemove(evnet) {
                //      if(!moveOrigin.node) return;
                //      var disX = event.page

                //  }

                //  function mouseup() {
                //     angular.element('svg').unbind('mousemove',mousemove);
                //     angular.element('svg').unbind('mouseup',mouseup);
                //  }


               }
               

                
  
            
                // Here we"re setting nodeclass, which is used by our custom drawNodes function
                // below.
                g.setNode(0,  { label: "开始",       class: "type-TOP"});
                g.setNode(88888,  { label: "结束",         class: "type-S" });
  
                
                g.nodes().forEach(function(v) {
                    var node = g.node(v);
                    // Round the corners of the nodes
                    node.rx = node.ry = 5;
                });
                
                // Set up edges, no special attributes.
                g.setEdge(0, 88888);

                // Create the renderer
                var render = new dagreD3.render();
            
                var svg = d3.select("svg"),
                svgGroup = svg.append("g");
              
                // Run the renderer. This is what draws the final graph.
                render(d3.select("svg g"), g);

                scope.$on('destroy',function () {
                    watch();
                });
           }
       }
    }
  
}).call(this);