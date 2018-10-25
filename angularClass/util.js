(function () {
	/** =========================================================
    * 行合并 根据 参数 column index  decRowsMerge
     ========================================================= */
	angular.module("myComponent").directive("decRowsMerge", function () {
		/*           -------demo
            <tr ng-repeat="i in vm.temp track by $index">
                <td>{{$index}}</td>
                <td dec-rows-merge='vm.temp'  column='a' index='{{$index}}'>
                    {{i.a}}
                </td>
                <td dec-rows-merge='vm.temp' column='b' index='{{$index}}'>
                    {{i.b}}
                </td>
                <td>
                    {{i.c}}
                </td>
            </tr>
         */
		return {
			link: function (scope, elem, attrs) {
				var column = attrs.column;
				var index = attrs.index;
				var rows = attrs.decRowsMerge;
				// if (vaildExist()) return;
				// var rowsSpanCounts = 1;
				if (!column || !index || !rows) {
					return console.warn("合并行 绑定的参数不正确");
				}
				/**
                 * 获取需要合并的行数
                 * @param {*} columnN 合并行所开始的行数
                 * @param {*} cszd 需要合并的参数字段
                 * @param {*} rows 数据来源
                 */
				function TrowsSpan (columnN, cszd, rows) {
					var count = 1;
					while (
						count < 100 &&
                        columnN < rows.length - 1 &&
                        rows[columnN][cszd] === rows[columnN + 1][cszd]
					) {
						count++;
						columnN += 1;
					}
					// for (var i = columnN; i < columnN + 1; i++) {
					//     if (columnN === rows.length - 1) {
					//         break;
					//     }
					//     if (rows[i][indB] === rows[i + 1][indB]) {
					//         count++;
					//         columnN++;
					//     }
					// }
					return count;
				}

				/**
                 * 设置合并行数 并且判断是否移除改列
                 * @param {*} rowsSpanCounts 合并的行数
                 */
				function setRowsAttr (rowsSpanCounts) {
					elem.attr("rowSpan", rowsSpanCounts);
					if (rowsSpanCounts !== 1) elem.attr("isFirstRow", column);
				}
				/**
                 * 验证是否已经被合并
                 * @param {*} index 合并行所开始的行数
                 * @param {*} column 需要合并的参数字段
                 * @param {*} value 数据来源
                 */
				function vaildExist (index, column, value) {
					if (
						index !== 0 &&
                        value[index][column] === value[index - 1][column]
					) {
						elem.remove();
						return false;
					}
					return true;
				}

				var watch = scope.$watch(rows, function (newValue, oladValue) {
					if (!newValue) return;
					if (
						newValue.length > 0 &&
                        vaildExist(index * 1, column, newValue)
					) {
						setRowsAttr(TrowsSpan(index * 1, column, newValue));
					}
					watch();
				});
			}
		};
	});

	/** =========================================================
    * 反馈控件解析
     ========================================================= */
	angular.module("myComponent").directive("decFeedback", function () {
		return {
			template:
                "\n <div class=\"systemText-btns\">\n\t<button class=\"btn-inspect\" ng-click=\"vm.goFeedback()\" >\u4F53\u7CFB\u7EA0\u9519</button>\n</div>\n ",
			replace: "true",
			scope: {},
			controllerAs: "vm",
			controller: [
				"$uibModal",
				function ($uibModal) {
					var vm = this;
					vm.goFeedback = function () {
						$uibModal
							.open({
								backdrop: "static",
								animation: true,
								// appendTo: appendTo,
								size: "md",
								component: "feedback",
								resolve: {
									args: function () {
										return {
											type: "view",
											files: "rSldgbqjspForm"
										};
									}
								}
							})
							.result.then(function () {}, function () {});
					};
				}
			]
		};
	});

	/** =========================================================
    * 设置一屏高度 使其离下边界15px
     ========================================================= */
	angular.module("myComponent").directive("decHeight", decHeight);
	decHeight.$inject = [];
	function decHeight () {
		return {
			restrict: "A",
			link: function (scope, ele, attrs) {
				angular.element("html").css("height", "100%");
				angular.element("body").css("height", "100%");
				fullHeight();
				function fullHeight () {
					// console.log(timeFnc++)
					var clientHeight = document.body.clientHeight;
					var top = ele.offset().top; // 获取元素距上边界距离
					var height = clientHeight - top - 15; // 留白15像素
					var cszd = attrs.height || "height";// 参数字段如果有值则取，没有默认'height'
					ele[0].style[cszd] = height + "px";
				}

				window.addEventListener("resize", timeInter); // 如果页面大小发生变化重新赋值
				var timeoutTb; // 存储定时器
				//  var timeCount = 0;//定时器产生的次数
				//  var timeFnc = 0; //函数执行的次数
				function timeInter () {
					if (timeoutTb) clearTimeout(timeoutTb);
					timeoutTb = setTimeout(fullHeight, 200);
					//  console.log(timeCount++);
				}

				scope.$on("$destroy", function () {
					ele = null;
					window.removeEventListener("resize", timeInter);
				});
			}
		};
	}

	/** =========================================================
    * 弹窗控件封装       依赖$uibModal
     ========================================================= */
	angular.module("myComponent").factory("popup", ["$q", "$uibModal", function ($q, $uibModal) {
		// var appendTo = angular.element(event.currentTarget).parent();
		return function (config) {
			// var config = {
			//     animation: true, //是否启用动画
			//     appendTo: null, // 把模态窗口放在指定的dom元素中。例如$document.find('aside').eq(0)
			//     backdrop: [true, false, 'static'][2], // 打开模态窗口时的背景设置。可设置的值有：true（显示灰色背景，在模态窗口之外单击会关闭模态窗口），false（不显示灰色背景），"static"（显示灰色背景，在模态窗口关闭之前背景元素不可用）
			//     backdropClass: '', //为背景添加的类名
			//     bindToController: false, // 设置为true并且使用controllerAs参数时，$scope的属性会传递给模态窗口所使用的controller
			//     controller: '', // 可以设置为一个表示controller的字符串，或者一个函数，或者一个数组（使用数组标记的方式为控制器注入依赖）。控制器中可使用$uibModalInstance来表示模态窗口的实例。
			//     controllerAs: '', // controller-as语法的替代写法
			//     keyboard: true, // 是否允许用ESC键关闭模态窗口
			//     openedClass: 'modal-open', // 打开模态窗口时为body元素增加的类名
			//     resolve: '', // 传递到模态窗口中的对象
			//     scope: '', // 模态窗口的父作用域对象 $rootScope
			//     size: '', // 一个字符串，和前缀“model-”组合成类名添加到模态窗口上
			//     template: '', // 表示模态窗口内容的文本
			//     templateUrl: '', // 模态窗口内容的模板url
			//     windowClass: '', // 添加到模态窗口模板的类名（不是模态窗口内容模板）
			//     windowTemplateUrl: '', // uib/template/modal/window.html
			//     windowTopClass: ''// 添加到顶层模态窗口的类名
			// };
			// component, data, size
			var common = {
				backdrop: "static",
				animation: true,
				size: "lg",
				controllerAs: "vm"
			};

			// {
			//     backdrop: 'static',
			//     animation: true,
			//     // appendTo: appendTo,
			//     size: size || 'lg',
			//     component: 'calendar',
			//     resolve: angular.copy(data)
			// }
			if ("resolve" in config) {
				var res = angular.copy(config.resolve);
				config.resolve = {};
				if (typeof res === "object") {
					angular.forEach(res, function (value, key) {
						config.resolve[key] = function () {
							return value;
						};
					});
				} else if (res !== undefined && res !== null) {
					config.resolve["params"] = function () {
						return res;
					};
				} else {
					delete config.resolve;
				}
			}

			if ("appendTo" in config) {
				if (angular.isElement(config["appendTo"])) {
					config["appendTo"] = angular.element(config["appendTo"]);
				} else {
					config["appendTo"] = angular.element(config["appendTo"]);
				}
			}

			angular.extend(common, config);

			var defer = $q.defer();
			$uibModal.open(common)
				.result.then(
					function (data) {
						if (defer.promise.$$state.pending)defer.resolve(data);
					},
					function (err) {
						if (defer.promise.$$state.pending)defer.reject(err);
					}
				);
			return defer.promise;
		};
	}]);

	/** =========================================================
    * 自动聚焦
     ========================================================= */
	angular.module("myComponent").directive("autoFocus", function () {
		return {
			link: function (scope, elem) {
				elem.focus();
				scope.$on("destroy", function () {
					elem = null;
					console.log(elem);
				});
			}
		};
	});

	/** =========================================================
    * 触发一个窗口调整大小事件的任何元素
    ========================================================= */
	angular.module("myComponent").directive("triggerResize", triggerResize);
	triggerResize.$inject = ["$window", "$timeout"];
	function triggerResize ($window, $timeout) {
		var directive = {
			link: link,
			restrict: "A"
		};
		return directive;

		function link (scope, element, attributes) {
			element.on("click", function () {
				$timeout(function () {
					// all IE friendly dispatchEvent
					var evt = document.createEvent("UIEvents");
					evt.initUIEvent("resize", true, false, $window, 0);
					$window.dispatchEvent(evt);
					// modern dispatchEvent way
					// $window.dispatchEvent(new Event('resize'));
				}, attributes.triggerResize || 300);
			});
		}
	}

	/** =========================================================
    * 加载动画
     ========================================================= */
	angular.module("myComponent")
		.directive("decLoadanim", decLoadanim);
	decLoadanim.$inject = ["$window"];
	function decLoadanim ($window) {
		return {
			restrict: "E",
			template: template,
			scope: {
				controlHide: "="
			},
			replace: true
			// controller: function () {
			//     $ocLazyLoad.load(['../vendor/spinkit/css/spinkit.css']).then(function () {
			//         /// 加载完成
			//     });
			// }
		};
		function template () {
			var str = "<div style=\"position: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9;top:0;left:0\" ng-show=\"controlHide\" >";
			str += "<div class=\"sk-circle\" style=\"width: 60px;height: 60px;position: relative;top: 40%;\">";
			str += "    <div class=\"sk-circle1 sk-child\"></div>";
			str += "    <div class=\"sk-circle2 sk-child\"></div>";
			str += "    <div class=\"sk-circle3 sk-child\"></div>";
			str += "    <div class=\"sk-circle4 sk-child\"></div>";
			str += "    <div class=\"sk-circle5 sk-child\"></div>";
			str += "    <div class=\"sk-circle6 sk-child\"></div>";
			str += "    <div class=\"sk-circle7 sk-child\"></div>";
			str += "    <div class=\"sk-circle8 sk-child\"></div>";
			str += "    <div class=\"sk-circle9 sk-child\"></div>";
			str += "    <div class=\"sk-circle10 sk-child\"></div>";
			str += "    <div class=\"sk-circle11 sk-child\"></div>";
			str += "    <div class=\"sk-circle12 sk-child\"></div>";
			str += "</div></div>";
			return str;
		}
	}

	/** =========================================================
    *  选择文件指令
     ========================================================= */
	angular.module("myComponent")
		.directive("fileChose", fileChose);
	fileChose.$inject = ["$parse"];
	function fileChose ($parse) {
		return {
			restrict: "A",
			link: function ($scope, $elm, attrs) {
				var fn = $parse(attrs.fileChange);
				$elm.on("change", function (changeEvent) {
					fn($scope, { $event: changeEvent.target.files[0] });
					// var reader = new window.FileReader();
					// reader.onload = function (e) {
					//     console.log('onload');
					//     $scope.$apply(function () {
					//         fn($scope, { $event: e.target });
					//     });
					// };
					// if (changeEvent.target.files.length > 0) reader.readAsBinaryString(changeEvent.target.files[0]);
				});
			}
		};
	}
	/** =========================================================
    *  ahForm表单控制  提交时 提供一个函数 全体校验
     ========================================================= */
	angular.module("myComponent").directive("ahForm", ["$parse", function ($parse) {
		return {
			require: ["form", "^^?form"],
			link: function (scope, elm, attrs, ctrl) {
				elm.attr("novalidate", "novalidate");
				var forEach = angular.forEach;
				var formCtrl = ctrl[0];
				// 报错提示信息
				var getMsg = {
					"required": "该字段不能为空",
					"pattern": "验证失败"
				};
				// 获取表单中的所有model
				forEach(formCtrl.$$controls, function (v1, k1) {
					// 获取model验证规则
					forEach(v1.$validators, function (v2, k2) {
						// 生成报错节点的id 绑定在 model节点上
						v1.errorId = $.GUID(6);
						v1.$$element.parent().css("position", "relative");
						var validName = formCtrl.$name + "." + v1.$name + ".$error." + k2;
						// 监听报错规则是否有变化
						scope.$watch(validName, function (newValue, oldValue) {
							if (!v1.$dirty) return;
							if (newValue) {
								var node = addValidMsg(v1.$$element.position(), v1.$$element.outerHeight(), v1.$$element.outerWidth(), v1.$$attr.errormsg || getMsg[k2], v1.errorId);
								v1.$$element.parent().append(node);
							} else {
								angular.element("#" + v1.errorId).remove();
							}
						});
					});
				});

				elm.bind("submit", errorMsgShow);
				function errorMsgShow (e) {
					scope.$apply(function () {
						// 如果验证没有通过
						if (!formCtrl.$valid) {
							var index = 0;
							// 获取类型
							forEach(formCtrl.$error, function (v, k) {
								// 获取错误对象
								forEach(v, function (v2, k2) {
									index++;
									// 如果页面中没有 报错节点 则添加
									if (angular.element("#" + v2.errorId).length === 0) {
										var node = addValidMsg(v2.$$element.position(), v2.$$element.outerHeight(), v2.$$element.outerWidth(), v2.$$attr.errormsg || getMsg[k], v2.errorId);
										v2.$$element.parent().append(node);
									}
									if (index === 1) v2.$$element.focus();
								});
							});
						}
					});
				}

				// 显示的报错节点
				function addValidMsg (offset, pH, pW, msg, id) {
					return "<div style=\"position:absolute;width:" + pW + "px;top:" + (offset.top + pH) + "px;left:" + offset.left + ";text-align:center;color:red\" id=\"" + id + "\">" + (msg || "验证失败") + "</div>";
					// return `<div style="position:absolute;width:${pW}px;top:${offset.top + pH}px;left:${offset.left};text-align:center;color:red" id="${id}">${msg || '验证失败'}</div>`;
				}

				scope.$on("destroy", function () {
					elm.unbind("submit", errorMsgShow);
					formCtrl = null;
					forEach = null;
				});

				// 添加提交时产生验证
				// angular.extend(formCtrl, {
				//     validPass: function () {
				//         // 如果验证没有通过
				//         if (!this.$valid) {
				//             // 获取类型
				//             forEach(this.$error, function (v, k) {
				//                 // 获取错误对象
				//                 forEach(v, function (v2, k2) {
				//                     // 如果页面中没有 报错节点 则添加
				//                     if (angular.element('#' + v2.errorId).length === 0) {
				//                         var node = addValidMsg(v2.$$element.position(), v2.$$element.outerHeight(), v2.$$element.outerWidth(), v2.$$attr.errormsg || getMsg[k], v2.errorId);
				//                         v2.$$element.parent().append(node);
				//                     }
				//                 });
				//             });
				//         }
				//     }
				// });
			}
		};
	}]);

	/** =========================================================
    *  ahForm 提交按钮 在提交时 只有 表单通过验证 才会执行函数
     ========================================================= */
	angular.module("myComponent").directive("ahSubmit", ["$parse", function ($parse) {
		return {
			restrict: "A",
			compile: function ($element, attr) {
				// We expose the powerful $event object on the scope that provides access to the Window,
				// etc. that isn't protected by the fast paths in $parse.  We explicitly request better
				// checks at the cost of speed since event handler expressions are not executed as
				// frequently as regular change detection.
				var fn = $parse(attr["ahSubmit"], /* interceptorFn */ null, /* expensiveChecks */ true);
				return function ngEventHandler (scope, element) {
					element.on("submit", function (event) {
						if (scope[this.name]) {
							if (scope[this.name].$invalid) return;
						}
						var callback = function () {
							fn(scope, { $event: event });
						};
						scope.$apply(callback);
					});
				};
			}
		};
	}]);
})();
