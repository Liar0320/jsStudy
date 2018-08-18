(function () {

    module = angular.module('app',[]);
    module.controller('treeCtrl',treeCtrl);
    treeCtrl.$inject = ['$sce'];
    function treeCtrl($sce) {
        var vm = this;
        vm.treedata = [
       
		];
		vm.treedata.push({'label':'党工部领导2',id:14,pid:12,end:true}, {'label':'部门领导',id:11,pid:0},
            {'label':'分管局领导',id:12,pid:0},
		    {'label':'党工部领导',id:13,pid:0});
		var currentNode = null;
        vm.treeAdd = function () {
			if(!vm.nodeName||!currentNode) return ; 
			var newId = GUID(4,10);
			var filterData = vm.treedata.filter(function (item) {
				return item.id*1 === vm.selectFilter *1;
			});
			// filterData.forEach(function (item) {
			// 	return item.pid = newId;
			// });
		   if(filterData[0])filterData[0].pid = newId;
            vm.treedata.push({
				label:vm.nodeName,
				id:newId,
				pid:currentNode.id,
				end:filterData.length===0
			});
			currentNode = null;
		};

		

		vm.treeSelect = function (result) {
			console.log(result);
			currentNode = result;
			vm.filterTreeData = vm.treedata.filter(function (item) {
				return item.pid === currentNode.id;
			});
			$scope.$apply();
		};

		
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