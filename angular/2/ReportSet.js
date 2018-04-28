(function () {
    angular.module('app.ReportSet', []).controller('ReportSet', ReportSet);
    ReportSet.$inject = ['$state'];
    function ReportSet($state) {
        var vm = this;
        console.log(this);
        vm.listItem = ['表格', 'echart', '用户列表', 'hhhh'];
        vm.preView = function (result) {
            console.log(result, vm);
            $state.go('/MES/BI/ReportView', { args: result, title: '预览界面' });
        }
    }
})();
(function () {
    angular.module('app.ReportSet').directive('decCreateLink', decCreateLink);
    decCreateLink.$inject = ['ngDialog', '$ocLazyLoad','$compile'];
    function decCreateLink(ngDialog, $ocLazyLoad, $compile) {
        return {
            restrict: 'A',
            scope: {
                preView:'&'
            },
            link: function (scope,ele,attr) {

                var dragDownItem = { down: false, className: '', transferData: null, dragParent: null, offset: { x: 0, y: 0 } };  ///存储侧栏数据的box
                
                var boxs = [];

                document.getElementsByClassName('control-collect')[0].addEventListener('mousedown', function (e) {
                    var node = e.target&&e.target.parentNode ||'';
                    if (node && node.className.indexOf('control-item') === -1) return;
                    dragDownItem.down = true;
                    dragDownItem.offset = { x: e.pageX, y: e.pageY };
                    dragDownItem.transferData = { type: node.getAttribute('type') }
                }) ///侧栏数据的box被按下时存储交换信息

                document.getElementsByClassName('drag')[0].addEventListener('mousemove', function (e) {
                    if (dragDownItem.down) {
                        if (dragDownItem.dragParent === null) {
                            let div = document.createElement('div');
                            div.style.cssText = 'position:absolute;height:50px;width:50px;background-color:#000;top:' + e.pageY + 'px;left:' + e.pageX + 'px';
                            document.getElementsByClassName('drag')[0].appendChild(div);
                            dragDownItem.dragParent = div;
                        }
                        boxMove(dragDownItem.dragParent, { x: e.pageX - dragDownItem.offset.x, y: e.pageY - dragDownItem.offset.y });
                        dragDownItem.offset.x = e.pageX;
                        dragDownItem.offset.y = e.pageY;
                    }
                })  ///侧栏数据的box移动

                document.getElementsByClassName('drag')[0].addEventListener('mouseup', function (e) {
                    if (dragDownItem.dragParent === null) return;
                    dragDownItem.dragParent.parentElement.removeChild(dragDownItem.dragParent);
                    if (e.target.className.indexOf('drag-parent') > -1) {
                        createBgDiv(dragDownItem.transferData);
                    }
                    dragDownItem = { down: false, className: '', transferData: null, dragParent: null, offset: { x: 0, y: 0 } };
                })  ///侧栏数据的box抬起

                //创建box
                function createDragBox(result) {
                    console.log(result);
                    if (result.boolean !== 'success') return;
                    let box = document.createElement('div');
                    box.className = 'drag-box';
                    box.innerHTML = createBox();
                    box.addEventListener('mouseover', function (e) {
                        this.getElementsByClassName('drag-control')[0].style['display'] = 'block';
                        this.getElementsByClassName('drag-control-head')[0].style['display'] = 'block';
                        this.getElementsByClassName('drag-control-component')[0].style['display'] = 'block';

                    })  //为元素box添加hover效果 产生按钮

                    box.addEventListener('mouseleave', function (e) {
                        this.getElementsByClassName('drag-control')[0].style['display'] = 'none';
                        this.getElementsByClassName('drag-control-head')[0].style['display'] = 'none';
                        this.getElementsByClassName('drag-control-component')[0].style['display'] = 'none';
                    })  //为元素box移除hover效果

                    box.appendChild(createControl());

                    let content = document.createElement('div');
                    content.className = 'drag-content';
                    // content.innerText = result.data ? result.data : '';
                    
                    //angular 生成 ng-include---start
                    includeBoxView(content, JSON.stringify(result.data));

                    box.appendChild(content);

                    document.getElementsByClassName('drag-parent')[0].appendChild(box)
                    //angular 生成 ng-include------end


                    box = null;
                }

                //修改box
                function modfiyDragBox(result,currentBox) {
                    if (!currentBox) return;
                    var content = currentBox.getElementsByClassName('drag-content')[0];
                    content.innerHTML = '';
                    includeBoxView(content, JSON.stringify(result.data));
                    currentBox = null;
                }

                //创建按钮
                function createControl() {
                    let controlComponent = document.createElement('div');
                    controlComponent.className = 'drag-control-component';
                    let controlComponentResize = document.createElement('button');
                    controlComponentResize.innerText = '放大'
                    controlComponentResize.addEventListener('click', function (e) {
                        let box = e.target.parentElement.parentElement;
                        if (e.target.innerText.indexOf('放大') > -1) {
                            box.setAttribute('data-transform', box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)');
                            box.setAttribute('data-height', getDomStyle(box, 'height'))
                            box.setAttribute('data-width', getDomStyle(box, 'width'))
                            box.style.cssText = 'height:100%;width:100%;transform:translate3d(0,0,0);z-index:999';
                            e.target.innerText = '还原'
                        } else {
                            e.target.innerText = '放大'
                            box.style.cssText = 'transform:' + box.getAttribute('data-transform') + ';height:' + box.getAttribute('data-height') + ';width:' + box.getAttribute('data-width') + '';
                        }
                        box = null;
                    })

                    let controlComponentSetting = document.createElement('button');
                    controlComponentSetting.innerText = '设置'
                    controlComponentSetting.addEventListener('click', function (e) {
                        var currentBox = e.target.parentNode.parentNode;
                        var receive = JSON.parse(currentBox.getElementsByClassName('drag-content')[0].firstChild.firstChild.getAttribute('view-dist'));
                        createBgDiv(receive, currentBox, 'setting')
                        currentBox = null;
                    })

                    controlComponent.appendChild(controlComponentResize);

                    controlComponent.appendChild(controlComponentSetting);
                    return controlComponent;
                }

                //创建box主体
                function createBox() {
                    return '<div class="drag-control">'
                             + '     <div class="drag-control-border drag-control-left-top"></div>'
                             + '<div class="drag-control-border drag-control-center-top"></div>'
                            + '<div class="drag-control-border drag-control-right-top"></div>'
                             + '<div class="drag-control-border drag-control-left"></div>'
                            + '<div class="drag-control-border drag-control-right"></div>'
                             + '<div class="drag-control-border drag-control-left-bottom"></div>'
                            + '<div class="drag-control-border drag-control-center-bottom"></div>'
                            + '<div class="drag-control-border drag-control-right-bottom"></div>'
                            + '</div>'
                            + '<div class="drag-control-head"></div>'
                }

                //创建模态框
                function createBgDiv(receive, currentBox,flag) {
                    $ocLazyLoad.load(['../Modules/MES/BI/ReportSetDialog.js']).then(function () {
                        ///加载完成
                        var dialog = ngDialog.open({
                            template: '../Modules/MES/BI/ReportSetDialog.html',
                            className: 'drag-ngdialog',
                            overlay: true,
                            showClose: false,
                            closeByEscape: false,
                            closeByDocument: false,
                            controller:'ReportSetDialog as vm',
                           // data: receive,
                            // preCloseCallback: createDragBox
                            resolve: {          //提供注入参数  数据传输
                                dep: function () {
                                    return receive
                                }
                            }
                        });
                        dialog.closePromise.then(function (data) {
                            console.log(data.value + '-------- has been dismissed');
                            flag === 'setting' ? modfiyDragBox(data.value, currentBox) : createDragBox(data.value);
                            currentBox && (currentBox = null);
                        })
                    });
                }

                //创建ng-include
                function includeBoxView(ele,data) {
                    var div = document.createElement('div');
                    div.setAttribute("oc-lazy-load","'/Modules/Mes/BI/ReportBoxView.js'");
                    div.className = 'drag-dialog-content-body';
                    div.innerHTML = '<div report-box-view view-dist=' + data + '></div>';
                    var $dom = $compile(div)(scope);
                    $dom.appendTo(ele);
                  //  ele.appendChild(div);
                    ele = null;
                    $dom = null;
                }

                //body主体控制
                var dragDown = { down: false, className: '', dragParent: null, mouse: { x: 0, y: 0 } };

                document.getElementsByClassName('drag-parent')[0].addEventListener('mousedown', function (e) {
                    if (e.target.className.indexOf('drag-control') > -1) {
                        dragDown.down = true;
                        dragDown.className = e.target.className;
                        dragDown.dragParent = dragDown.className.indexOf('drag-control-head') > -1 ? e.target.parentElement : e.target.parentElement.parentElement;
                        dragDown.mouse = { x: e.pageX, y: e.pageY };
                    }
                });  ///在drag-parent 摆放content界面的点击事件 模板对象为‘drag-control’ 存储对象

                document.getElementsByClassName('drag-parent')[0].addEventListener('mouseleave', function (e) {
                    dragDown = { down: false, className: '', dragParent: null };
                })  ///当前界面移除drag-parent 容器 关于drag-control的事件

                document.getElementsByClassName('drag-parent')[0].addEventListener('mousemove', function (e) {
                    if (dragDown.down) {
                        if (dragDown.className.indexOf('drag-control-head') > -1) {
                            boxMove(dragDown.dragParent, { x: e.pageX - dragDown.mouse.x, y: e.pageY - dragDown.mouse.y });
                        } else {
                            boxResize(dragDown.dragParent, { x: e.pageX - dragDown.mouse.x, y: e.pageY - dragDown.mouse.y }, dragDown.className);
                        }
                        dragDown.mouse.x += e.pageX - dragDown.mouse.x;
                        dragDown.mouse.y += e.pageY - dragDown.mouse.y;
                    }
                });  ///当前界面鼠移动事件针对侧栏数据

                document.getElementsByTagName('body')[0].addEventListener('mouseup', function (e) {
                    dragDown = { down: false, className: '', dragParent: null };
                });  ///当前界面鼠标抬起事件dragDown

                function boxResize(current, offset, className) {
                    let direct = className.indexOf('left-top') > -1 ? { x: -1, y: -1 } :
                                className.indexOf('center-top') > -1 ? { x: 0, y: -1 } :
                                className.indexOf('right-top') > -1 ? { x: 1, y: -1 } :
                                className.indexOf('left-bottom') > -1 ? { x: -1, y: 1 } :
                                className.indexOf('center-bottom') > -1 ? { x: 0, y: 1 } :
                                className.indexOf('right-bottom') > -1 ? { x: 1, y: 1 } :
                                className.indexOf('left') > -1 ? { x: -1, y: 0 } :
                                className.indexOf('right') > -1 ? { x: 1, y: 0 } : null;

                    if (direct.x !== 0) {
                        var width = getDomStyle(current, 'width').replace(/[^\d]+/g, '') * 1;
                        current.style.width = width + direct.x * offset.x + 'px';
                    }
                    if (direct.y !== 0) {
                        var height = getDomStyle(current, 'height').replace(/[^\d]+/g, '') * 1;
                        current.style.height = height + direct.y * offset.y + 'px';
                    }
                    if (direct.x === -1 || direct.y === -1) {
                        if (direct.x === 1 && direct.y === -1) direct.x = 0;
                        if (direct.x === -1 && direct.y === 1) direct.y = 0;
                        let transform = current.style['transform'].replace(/[^\d]+/g, ',').split(',') || [];
                        current.style['transform'] = 'translate3d(' + (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1) + 'px,' + (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1) + 'px,0)'
                    }
                }  //处理元素box的放大缩小

                function boxMove(current, offset) {
                    let transform = current.style['transform'].replace(/[^\d]+/g, ',').split(',') || [];
                    current.style['transform'] = 'translate3d(' + (offset.x * 1 + (transform[2] || 0) * 1) + 'px,' + (offset.y * 1 + (transform[3] || 0) * 1) + 'px,0)'
                    current = null;
                }   ///处理元素移动 相对之前位置的偏移

                function getDomStyle(ele, attr) {
                    return ele.currentStyle ?
                    ele.currentStyle[attr] : getComputedStyle(ele, null)[attr];
                }    ///处理dom节点获取样式属性


                document.getElementsByClassName('drag-submit')[0].addEventListener('click', function () {
                    var dragBoxs = document.getElementsByClassName('drag-box')[0];
                    var boxs = [];
                    var ratioHeight = document.body.clientHeight / document.getElementsByClassName('drag-parent')[0].clientHeight;
                    var ratioWidth = document.body.clientWidth / document.getElementsByClassName('drag-parent')[0].clientWidth;
                    while (dragBoxs) {
                        var params = {};
                        let transform = dragBoxs.style['transform'].replace(/[^\d]+/g, ',').split(',') || [];
                        params['transform'] = 'translate3d(' + (transform[2] || 0) * ratioWidth + 'px,' + (transform[3] || 0) * ratioHeight + 'px,0)';
                        params['height'] = dragBoxs.clientHeight * ratioHeight;
                        params['width'] = dragBoxs.clientWidth * ratioWidth;
                        params['data'] = dragBoxs.getElementsByClassName('drag-content')[0].firstChild.firstChild.getAttribute('view-dist');
                        boxs.push(params);
                        dragBoxs = dragBoxs.nextSibling;
                    }
                    scope.$apply(function () {
                        scope.preView({ result: boxs });
                    })
                    dragBoxs = null;
                })
                
            }
        }
    }
})();



