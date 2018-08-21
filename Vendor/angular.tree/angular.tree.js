(function () {

    module = angular.module('app',[]);
    module.controller('treeCtrl',treeCtrl);
    treeCtrl.$inject = ['$scope'];
    function treeCtrl($scope) {
        var vm = this;
   
		vm.treedata = [
       
		];
		// vm.treedata.push({'label':'党工部领导2',id:14,pid:12,end:true}, {'label':'部门领导',id:11,pid:0},
        //     {'label':'分管局领导',id:12,pid:0},
		//     {'label':'党工部领导',id:13,pid:0});
		var currentNode = null;
        vm.treeAdd = function () {
			if(vm.treedata.length === 0) currentNode ={id:0};
			if(!vm.nodeName||!currentNode) return layer.msg('请选择节点 并输入新的节点名称'); 
			if(currentNode.label === '结束') ; 
			var newId = GUID(4,10); 
			var isEnd = false;
			if(vm.selectFilter === 88888) isEnd= true;
			var filterData = vm.treedata.filter(function (item) {
				return item.id*1 === vm.selectFilter *1;
			});
			if(vm.treedata.length!==0&&!isEnd&&filterData.length===0){
				return layer.msg('请选择下级节点'); 
			}
			// filterData.forEach(function (item) {
			// 	return item.pid = newId;
			// });
			if(isEnd) currentNode.end = false;
		   if(filterData[0])filterData[0].pid = newId;
            vm.treedata.push({
				label:vm.nodeName,
				data:'数据'+newId,
				id:newId,
				pid:currentNode.id,
				end:vm.treedata.length===0||isEnd
			});
			currentNode = null;
		};

		vm.treeDelete = function () {
			if(!vm.nodeName||!currentNode) return layer.msg('请选择节点'); 
			if(currentNode.enable === false) return;
			var filterData = vm.treedata.filter(function (item) {
				return item.pid*1 === currentNode.id *1;
			});
			var filterData = {
				parent:null,
				child:[]
			};
			for (var i = 0; i < vm.treedata.length; i++) {
				var elem = vm.treedata[i];
				if(elem.id*1 === currentNode.id*1){
					 vm.treedata.splice(i,1);
					 break;
				}
			}

			vm.treedata.reduce(function (filterData,item) {
				if(item.pid*1 === currentNode.id *1){
					filterData.child.push(item);
				}else if(item.id *1 === currentNode.pid*1){
					filterData.parent = item;
				}
				return filterData;
			},filterData);

			if(filterData.child.length === 0){
				if(!filterData.parent) return 	currentNode = null;
				filterData.parent.end = true;
			}

			filterData.child.forEach(function (item) {
				item.pid = filterData.parent.id;
				//item.end = filterData.end ;
			});

			currentNode = null;

		};

		

		vm.treeSelect = function (result) {
			console.log(result);
			currentNode = result;
	
			vm.filterTreeData = vm.treedata.filter(function (item) {
				return item.pid === currentNode.id;
			});
			vm.filterTreeData.push({'label':'结束',id:88888});
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

    module.directive("decLineTree", [
		function() {
			return {
				scope: {
					treeData: "=",
					onSelect: "&"
				},
				link: function(scope, elem) {
					var g = new dagreD3.graphlib.Graph()
						.setGraph({ rankdir: "LR", edgesep: 40, ranksep: 40 })
						.setDefaultEdgeLabel(function() {
							return {};
						});
					// Here we"re setting nodeclass, which is used by our custom drawNodes function
					// below.
					g.setNode(0, { label: "开始", class: "type-TOP" });
					g.setNode(88888, { label: "结束", class: "type-S" });

					g.nodes().forEach(function(v) {
						var node = g.node(v);
						// Round the corners of the nodes
						node.rx = node.ry = 5;
					});

					// Set up edges, no special attributes.
					g.setEdge(0, 88888);

					// Create the renderer
					var render = new dagreD3.render();

					d3.select("svg").append("g");

					// Run the renderer. This is what draws the final graph.
					render(d3.select("svg g"), g);

					var watch = scope.$watch("treeData", sortGnode, true);

					function sortGnode(newData) {
						var g = new dagreD3.graphlib.Graph()
							.setGraph({
								rankdir: "LR",
								edgesep: 40,
								ranksep: 40
							})
							.setDefaultEdgeLabel(function() {
								return {};
							});
						g.setNode(0, { label: "开始", class: "type-TOP id-0" });
						g.setNode(88888, {
							label: "结束",
							class: "type-S id-88888"
						});
						var i;
						for (i = 0; i < newData.length; i++) {
							g.setNode(newData[i].id * 1, {
								label: newData[i].label,
								class: "type-S id-" + newData[i].id + ""
							});
						}
						g.nodes().forEach(function(v) {
							var node = g.node(v);
							// Round the corners of the nodes
							node.rx = node.ry = 5;
						});
						for (i = 0; i < newData.length; i++) {
							if (newData[i].end) {
								g.setEdge(newData[i].id * 1, 88888);
							}
							g.setEdge(newData[i].pid * 1, newData[i].id * 1);
						}

						if (g.nodes().length === 2) {
							g.setEdge(0, 88888);
						}

						// Run the renderer. This is what draws the final graph.
						render(d3.select("svg"), g);

						//设置svg版面的高度
						var boxClient = angular.element("svg>g")[0].getBBox();
						elem.attr("height", boxClient.height + 10);

						//为node绑定单击事件 为 node 添加 .active类 兄弟元素 去除 触发函数 返回 treeData的数据
						angular
							.element("svg .node")
							.bind("click", function(event) {
								var textContent = "";
								textContent = event.target.textContent;
								if (!event.target.textContent) {
									textContent = angular
										.element(event.target)
										.next()
										.text();
								}
								var node = angular.element(event.target);
								while (!node.hasClass("node")) {
									node = node.parent();
								}
								var currentNode = node[0].className.baseVal
									.split(" ")
									.filter(function(item) {
										return item.indexOf("id-") > -1;
									});
								node.addClass("active");
								node.siblings().removeClass("active");
								var id = currentNode[0].split("id-")[1] * 1;
								var result;
								if (id === 0 || id === 88888) {
									result = [
										{
											id: id,
											enable: false,
											end: id === 0 ? true : false
										}
									];
								} else {
									result = newData.filter(function(item) {
										return item.id * 1 === id;
									});
								}

								scope.onSelect({ result: result[0] });
								console.log("g", textContent);
							});

						//为node绑定双击事件  如果双击 则进行layer弹窗 重命名
						angular
							.element("svg .node")
							.unbind("dblclick")
							.bind("dblclick", function(event) {
								console.log("dblclick");
								var node = angular.element(event.target);
								while (!node.hasClass("node")) {
									node = node.parent();
								}
								var result = filterScopeData(node[0])[0];
								if (
									result.id * 1 === 88888 ||
									result.id * 1 === 0
								)
									return;
								console.log(result);

								layer.prompt(
									{
										title: "重命名"
									},
									function(value, isLY) {
										for (
											var index = 0;
											index < scope.treeData.length;
											index++
										) {
											if (
												scope.treeData[index].id * 1 ===
												result.id * 1
											) {
												scope.treeData[
													index
												].label = value;
												break;
											}
										}
										scope.$apply();
										// sortGnode(scope.treeData);
										layer.close(isLY);
									}
								);
							});

						//关于拖动的一些配置
						var moveOrigin = {
							x: 0,
							y: 0,
							mouseX: 0,
							mouseY: 0,
							enable: false
						};

						$("svg .node").draggable({
							//当拖动开始时 判断 不是开始和结束时 启用 移动  记录当前的鼠标位置和node的transform
							start: function(event, ui) {
								console.log(event, ui);
								if (
									event.target.textContent === "开始" ||
									event.target.textContent === "结束"
								) {
									moveOrigin.enable = false;
								} else {
									moveOrigin.enable = true;
								}
								moveOrigin.mouseX = event.pageX;
								moveOrigin.mouseY = event.pageY;
								var offset = getOffset(event.target);
								moveOrigin.x = offset.x;
								moveOrigin.y = offset.y;
							},

							//计算鼠标前后两次位置的距离 node节点进行相同的位置加减，区域上方 10 区域左方10 为临界点
							drag: function(event) {
								if (!moveOrigin.enable) return;
								var disX = event.pageX - moveOrigin.mouseX;
								var disY = event.pageY - moveOrigin.mouseY;
								var transform =
									event.target
										.getAttribute("transform")
										.match(/\d[\d\.]+/g) || [];
								var x = transform[0] * 1 || 0;
								var y = transform[1] * 1 || 0;
								var newX = disX + x > 10 ? disX + x : 10;
								var newY = disY + y > 10 ? disY + y : 10;
								event.target.setAttribute(
									"transform",
									"translate(" + newX + "," + newY + ")"
								);
								console.log(
									disX,
									disY,
									transform,
									event.target
										.getAttribute("transform")
										.match(/\d[\d\.]+/g)
								);
								moveOrigin.mouseX = event.pageX;
								moveOrigin.mouseY = event.pageY;
							},

							//拖动是否启用。 获取节点位置 如果不进行交换 则 拖动取消 返回原始的位置
							stop: function(event) {
								if (!moveOrigin.enable) return;
								var offset = getOffset(event.target);
								var isSWap = swapNode(
									offset.x,
									offset.y,
									event.target
								);
								if (!isSWap)
									event.target.setAttribute(
										"transform",
										"translate(" +
											moveOrigin.x +
											"," +
											moveOrigin.y +
											")"
									);
							},
							containment: "parent"
						});
					}

					//根据node 获取transform的 数值
					function getOffset(node) {
						var transform =
							node
								.getAttribute("transform")
								.match(/\d[\d\.]+/g) || [];
						var x = transform[0] * 1 || 0;
						var y = transform[1] * 1 || 0;
						node = null;
						return {
							x: x,
							y: y
						};
					}

					//根据当前鼠标的位置 去遍历除了该节点的所有节点  如果在节点的局域呢 则交换node上的数据 节点位置不变
					function swapNode(x, y, node) {
						console.log($(node).siblings());

						var siblings = $(node).siblings();
						var item;
						for (var i = 0; i < siblings.length; i++) {
							item = siblings[i];
							if (
								item.textContent === "开始" ||
								item.textContent === "结束"
							)
								continue;
							var offset = getOffset(item);
							var clinet = item.getBBox();
							var vaildX =
								offset.x < x && x < offset.x + clinet.width;
							var vaildY =
								offset.y < y && y < offset.y + clinet.height;
							if (vaildX && vaildY) {
								// node.setAttribute('transform','translate('+ offset.x +','+ offset.y +')');
								// item.setAttribute('transform','translate('+ moveX +','+ moveY +')');
								var data = [];
								data.push(
									filterScopeData(node)[0],
									filterScopeData(item)[0]
								);
								var arr = scope.treeData.filter(function(item) {
									return (
										data[0].id === item.id ||
										data[1].id === item.id
									);
								});
								var temp = angular.copy(arr[0]);
								arr[0].label = arr[1].label;
								arr[0].data = arr[1].data;
								arr[1].label = temp.label;
								arr[1].data = temp.data;
								scope.treeData.forEach(function(item) {
									for (var i = 0; i < arr.length; i++) {
										if (arr[i].id === item.id) {
											item.data = arr[i].data;
											item.label = arr[i].label;
										}
									}
								});
								sortGnode(scope.treeData);
								//scope.$apply();
								return true;
							}
						}
						siblings = null;
						item = null;
						return false;
					}

					//根据当前node节点 获取 scope.treeData中对应的数据  关联字段 id
					function filterScopeData(node) {
						var result;
						var currentNode = node.className.baseVal
							.split(" ")
							.filter(function(item) {
								return item.indexOf("id-") > -1;
							});
						var id = currentNode[0].split("id-")[1] * 1;

						if (id === 0 || id === 88888) {
							result = [
								{
									id: id,
									enable: false,
									end: id === 0 ? true : false
								}
							];
						} else {
							result = scope.treeData.filter(function(item) {
								return item.id * 1 === id;
							});
						}
						return result;
					}

					scope.$on("destroy", function() {
						watch();
					});
				}
			};
		}
	]);
  
}).call(this);