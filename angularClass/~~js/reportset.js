(function () {
    angular.module('app.ReportSet', []).controller('ReportSet', ReportSet);
    ReportSet.$inject = ['$timeout','$rootScope','$scope', '$state', '$stateParams', '$compile', '$q', 'ajaxService', 'Notify'];
    function ReportSet($timeout,$rootScope,$scope, $state, $stateParams, $compile, $q, ajaxService, Notify) {
        var vm = this;
        var params = $stateParams.args || {};
        angular.extend(vm, {
            menuData: '',
            isSave:0
        })
        var oldvalue;
        $scope.type20Num = 0;

        //console.log("vm.controlClass")
        //console.log(vm.controlClass)

        //var className = $stateParams.args.reportClassName || "自定义报表";
        //var method = $stateParams.args.method || null;
        //var reportId = $stateParams.args.reportId || null;

        vm.reportName = params.reportName || '';
        vm.listItem = [];

        //vm.preView = function (result) {
        //              $state.go('/MES/BI/ReportView', { args: '2ba66d64-e9da-7a03-012d-27f419f02c5e', title: '预览界面' });
        //}

        //vm.boxSave = function (result) {
        //    var saveMethod = 1;
        //    dealResult(saveMethod,result, null, vm.reportName, params);
        //}
        vm.boxSave = function (result) {
            var backEndResult = {
                report: [],
                reportZdxx: [],
                reportTxxx: [],
            };
            var saveMethod = 2;
            dealResult(saveMethod, result, backEndResult, vm.reportName, params);
        }

        vm.preView = function (result) {
            //dealResult(result);
            var backEndResult = {
                report: [],
                reportZdxx: [],
                reportTxxx: [],
                background: $scope.bgId || $scope.backgroundId,
                typedate:$scope.type20Num||'',
                width: $scope.bgWidth || $scope.editeWidth,
                height: $scope.bgHeight || $scope.editeHeight
            };
            var saveMethod = 0;
            dealResult(saveMethod, result, backEndResult, vm.reportName, params);
            $state.go('/MES/BI/ReportView', { args: backEndResult, title: '预览界面' });
        };
        //加载链接菜单的select内容
        GetSubMenuName();
        function GetSubMenuName() {
            ajaxService.post('/BiReportSet/GetSubMenuName', { menuId: params.classId }, function (data) {
                vm.menuData = data.Record;
            });
        };

        //处理数据传输
        //saveMethod  保存的方式 1为单区块保存    2为多区块一起保存（推荐）
        //result  配置信息
        //backEndResult  最后数据的结果， 可传入接口 保存或者直接传入reportBoxView生产区块
        //reportName  报表名称
        //params  方法 如果为 edit 则reportId和qkid不应该在自动生成;

        function dealResult(saveMethod, result, backEndResult, reportName, params) {
            if (vm.reportName == '') {
                Notify.alert('<em class="fa fa-warning">  报表名称不能为空！', { status: 'danger' });
                return;
            };
            if (params.method === 'add') {
                for (var i = 0; i < params.reportNames.length; i++) {
                    if (vm.reportName == params.reportNames[i]) {
                        Notify.alert('<em class="fa fa-warning">  报表名称重复，请修改！', { status: 'danger' });
                        return;
                    }
                }
            } else if (params.method === 'edite') {
                for (var i = 0; i < params.reportNames.length; i++) {
                    if (vm.reportName == params.reportNames[i] && vm.reportName != params.reportName) {
                        Notify.alert('<em class="fa fa-warning">  报表名称重复，请修改！', { status: 'danger' });
                        return;
                    }
                }
            };
            var reportId = params.method === 'edite' ? params.oldValue.reportId : $.Guid();
            
            if (params.method === 'edite') {
                if (vm.ljcdbj == 1 && params.file.isMenu == 0) {
                    Notify.alert('<em class="fa fa-warning">  请先给上级文件夹创建菜单，再进行该操作！', { status: 'danger' });
                    return;
                } 
            } else {
                if (vm.ljcdbj == 1 && params.file.isMenu == 0) {
                    Notify.alert('<em class="fa fa-warning">  请先给上级文件夹创建菜单，再进行该操作！', { status: 'danger' });
                    return;
                }
            };
            

            
            //前台数据格式化和后台一样

            var promise = [];
            for (var i = 0; i < result.length; i++) {
                var ajaxTableData = [];
                var ajaxFieldData = [];
                var ajaxTxxxData = [];
                var currentQK = JSON.parse(result[i].data); //当前区块的信息
                var qkid = params.method === 'edite' && currentQK.table[0] && currentQK.table[0].old ? currentQK.table[0].id : $.Guid(); //生成区块id

                packTable(ajaxTableData, currentQK, reportName, result, params, qkid);

                packFields(ajaxFieldData, currentQK, qkid);

                if (currentQK.type == 4 || currentQK.type == 5 || currentQK.type == 6) {
                    packtxxxs(ajaxTxxxData, currentQK, qkid);
                }
                vm.currenttype = currentQK.type;

                if (backEndResult) {
                    backEndResult.report = backEndResult.report.concat(ajaxTableData);
                    backEndResult.reportZdxx = backEndResult.reportZdxx.concat(ajaxFieldData);
                    if (currentQK.type == 4 || currentQK.type == 5 || currentQK.type == 6) {
                        backEndResult.reportTxxx = backEndResult.reportTxxx.concat(ajaxTxxxData);
                    }
                    
                } //如果顺序保存
                else if (saveMethod === 1) {
                    orderSave(params, promise, ajaxTableData, ajaxFieldData,ajaxTxxxData, qkid)
                }
            };
            //如果是一次性保存
            if (saveMethod === 2) mutipleSave(params, promise, backEndResult);

            promise.length > 0 && $q.all(promise).then(function () {
                $state.go('/MES/BI/ReportView', { args: reportId, title: '预览界面' });
            });

            //异步保存
            function ajaxSaveReport(result) {
                var deferred = $q.defer();
                //如果没有图形信息的，替换图形上的空数据
                result.biReportSetTxxxService = result.biReportSetTxxxService.replace(",[[]],", ",[],");
                //if (vm.isSave == 0) {
                ajaxService.post('/BiReportSet/SaveBiReportSet', result, function (data) {
                    if (data == 1) {
                        vm.isSave = 1;
                        deferred.resolve('success');
                        //插入或取消菜单连接
                        var position = '';
                        for (var i = 0; i < vm.menuData.length; i++) {
                            if (vm.menuId == vm.menuData[i].id) {
                                position = vm.menuData[i].position;
                            }
                        };
                        if (params.method === 'edite') {
                            if (vm.ljcdbj == 1 ) {
                                ajaxService.post('/BiReportSet/InsertLastMenu', { parentId: params.classId, menuId: reportId, position: position, menuName: vm.reportName }, function (data) {
                                });
                            } else if (vm.ljcdbj == 0 && oldvalue.isMenu == 1) {
                                ajaxService.post('/BiReportSet/CancelLastReportMenu', { id: reportId }, function (data) {
                                })
                            }
                        } else if (params.method === 'add') {
                            if (vm.ljcdbj == 1) {
                                ajaxService.post('/BiReportSet/InsertLastMenu', { parentId: params.classId, menuId: reportId, position: position, menuName: vm.reportName }, function (data) {
                                })
                            } else {
                                ajaxService.post('/BiReportSet/CancelLastReportMenu', { id: reportId }, function (data) {
                                })
                            }
                        }
                    } else {
                        vm.isSave = 1;
                        console.log("保存失败")
                    }
                        
                });
               // }
                
                return deferred.promise;
            };

            //单个保存 params原始数据  promise异步 table表 field 字段 qkid 区块id i 当前索引
            function orderSave(params, promise, ajaxTableData, ajaxFieldData, ajaxTxxxData, qkid, i) {
                var addObj = new Object();
                addObj['biReportSetService'] =$.JsonOrg('', JSON.stringify(ajaxTableData), 'tableId')
                addObj['biReportSetZdxxService'] = $.JsonOrg('', JSON.stringify(ajaxFieldData), 'id')
                addObj['biReportSetTxxxService'] = $.JsonOrg('', JSON.stringify(ajaxTxxxData), 'id');

                if (params.method === 'add') {
                    promise[i] = ajaxSaveReport(addObj);
                } else if (params.method === 'edite') {
                    var editeObj = new Object();
                    editeObj['biReportSetService'] = $.JsonOrg(JSON.stringify(params.oldValue[qkid].table), JSON.stringify(ajaxTableData), 'tableId');
                    editeObj['biReportSetZdxxService'] = $.JsonOrg(JSON.stringify(params.oldValue[qkid].tableField), JSON.stringify(ajaxFieldData), 'id');
                    editeObj['biReportSetTxxxService'] = $.JsonOrg(JSON.stringify(params.oldValue[qkid].tableTxxx), JSON.stringify(ajaxTxxxData), 'id')

                    promise[i] = ajaxSaveReport(editeObj);
                }
            }

            //多个保存 promise异步 所有的table和field数据
            function mutipleSave(params, promise, backEndResult) {

                if (params.method === 'add') {
                    var addObj = new Object();
                    addObj['biReportSetService'] = $.JsonOrg('', JSON.stringify(backEndResult.report), 'tableId');
                    addObj['biReportSetZdxxService'] = $.JsonOrg('', JSON.stringify(backEndResult.reportZdxx), 'id');                    
                    addObj['biReportSetTxxxService'] = $.JsonOrg('', JSON.stringify(backEndResult.reportTxxx), 'id');
                    promise[0] = ajaxSaveReport(addObj);
                } else if (params.method === 'edite') {
                    var tables = [];
                    var fields = [];
                    var txxxs = [];
                    for (var item in params.oldValue) {
                        if (!angular.isObject(params.oldValue[item])) continue;
                        tables = tables.concat(params.oldValue[item].table);
                        fields = fields.concat(params.oldValue[item].tableField);
                        txxxs = txxxs.concat(params.oldValue[item].tableTxxx);
                    }
                    var editeObj = new Object();
                    editeObj['biReportSetService'] = $.JsonOrg(JSON.stringify(tables), JSON.stringify(backEndResult.report), 'id');
                    editeObj['biReportSetZdxxService'] = $.JsonOrg(JSON.stringify(fields), JSON.stringify(backEndResult.reportZdxx), 'id');
                    editeObj['biReportSetTxxxService'] = $.JsonOrg(JSON.stringify(txxxs), JSON.stringify(backEndResult.reportTxxx), 'id')

                    promise[0] = ajaxSaveReport(editeObj);
                }
            }

            //ajaxFieldData组装tables
            function packTable(ajaxTableData, view, reportName, result, params, qkid) {
                //循环遍历表格信息
                for (var j = 0; j < view.table.length; j++) {
                    var tempTableJSON =
                        {
                            reportId: reportId,
                            name: reportName,
                            bgPic: $scope.backgroundId || '',
                            bgPicSize: $scope.bgWidth+'$'+ $scope.bgHeight||'',
                            divTitle: result[i].title || '',
                            id: qkid,
                            iid: view.table[j].iid,
                            tableId: view.table[j].tableId || $.Guid(),
                            classId: params.classId || '',
                            zslx: view.type || 0,
                            cssText: view.cssText && (JSON.stringify(view.cssText)) || '',
                            //  execSql: temp.table[j].sqlText.replace(/\$/g, ' '),
                            remark: view.table[0].remark  || '',
                            dposition: result[i].position,
                            createUser: $rootScope.app.userInfo.userName,
                            createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
                            isMenu: vm.ljcdbj,
                            whereStr: view.table[j].whereStr,
                        };
                        if (params.method === 'edite') {
                            tempTableJSON.createUser = params.createUser;
                            tempTableJSON.createTime = params.createTime;
                            tempTableJSON.bgPicSize = $scope.editeWidth + '$' + $scope.editeHeight;
                    }
                    //存储后表格信息
                    ajaxTableData.push(tempTableJSON);
                }
            }

            //ajaxFieldData组装fields
            function packFields(ajaxFieldData, view, qkid) {
                //循环遍历字段信息
                for (var j = 0; j < view.tableField.length; j++) {
                    var tempFieldJSON = {
                        id: view.tableField[j]['id'] || $.Guid(),
                        qkId: qkid,
                        zdmc: view.tableField[j]['zdmc'],
                        csmc: view.tableField[j]['csmc'] || '',
                        zdlx: view.tableField[j]['zdlx'] || 0,
                        zdgs: view.tableField[j]['zdgs'] || '',
                        xsbj: view.tableField[j]['xsbj'],
                        qztj: view.tableField[j]['qztj'],
                        ystj: view.tableField[j]['ystj'] || '',
                        glzdbj: view.tableField[j]['glzdbj'] || 0,
                    };
                    //存储后字段信息
                    ajaxFieldData.push(tempFieldJSON);
                }
            }

            //ajaxTxxxData组装txxx
            function packtxxxs(ajaxTxxxData, view, qkid) {
                //循环遍历字段信息
                for (var j = 0; j < view.tableTxxx.length; j++) {
                    var tempTxxxJSON = view.tableTxxx[j];
                    tempTxxxJSON.qkId = qkid;
                    //tempTxxxJSON[j]['id'] = 
                    //var tempTxxxJSON = {
                    //    id: view.tableTxxx[j]['id'] || $.Guid(),
                    //    qkId: qkid,
                    //    zdmc: view.tableTxxx[j]['zdmc'],
                    //    csmc: view.tableTxxx[j]['csmc'] || '',
                    //    zdlx: view.tableTxxx[j]['zdlx'] || 0,
                    //    zdgs: view.tableTxxx[j]['zdgs'] || '',
                    //    xsbj: view.tableTxxx[j]['xsbj'],
                    //    qztj: view.tableTxxx[j]['qztj'],
                    //    ystj: view.tableTxxx[j]['ystj'] || '',
                    //};

                    //存储后字段信息
                    ajaxTxxxData.push(tempTxxxJSON);
                } 
            }

        }

        //处理传输方法
        function allResult(result, backEndResult, reportName, params) {
            console.log(result, backEndResult, reportName, params);
        }


        function handleReport(reportNew, reportOld, reportZdxx,reportTxxx) {
            var qkid = $.objInArr(reportOld, ['id'])['id'] || [];

            for (var i = 0; i < qkid.length; i++) {
                var id = qkid[i];
                reportNew[id] = {};
                reportNew[id]['tableField'] = $.objFilter(reportZdxx, 'qkId', id);
                reportNew[id]['tableTxxx'] = $.objFilter(reportTxxx, 'qkId', id);
                reportNew[id]['table'] = $.objFilter(reportOld, 'id', id);
                reportNew[id]['type'] = $.objFilter(reportOld, 'id', id)[0]['zslx']
            }
        };

        //数组去重
        function distinct(arr) {
            //var arr = this;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    if (arr[i] === arr[j]) {
                        arr.splice(j, 1);
                        len--;
                        j--;
                    }
                }
            };
            return arr;
        };

        function main(data) {
            ajaxService.post('/BiReportSet/GetReportControl', null, function (data) {
                vm.listItem = data.Record;
                //console.log($.objInArr(vm.listItem, ["className"]));
                //console.log();

                vm.controlClass = distinct($.objInArr(vm.listItem, ["className"]).className);

                //console.log($.objFilter(vm.listItem, "className", distinct($.objInArr(vm.listItem, ["className"]).className)[0]))
                //for (var i = 0; i < distinct($.objInArr(vm.listItem, ["className"]).className) ; i++) {

                //}
            })

            if (params.method === 'edite') {
                ajaxService.post('/BiReportSet/GetReportSet', { reportId: params.reportId }, function (data) {
                    const REGCLIENT = /\d+(\.\d+)?%/g;  //获取定位比例 和 宽高比例
                    // const REGCLIENT = /\d+(\.\d+)?/g;  //获取定位比例 和 宽高比例
                    var reportNew = {};
                    var reportOld = data.report && data.report.Record || [];
                    var reportZdxx = data.reportZdxx && data.reportZdxx.Record || [];
                    var reportTxxx = data.reportTxxx && data.reportTxxx.Record || [];
                    vm.ljcdbj = reportOld[0].isMenu;
                    vm.menuId = reportOld[0].reportId;
                    handleReport(reportNew, reportOld, reportZdxx,reportTxxx);
                    params.oldValue = reportNew;
                    for (item in reportNew) {
                        if (reportNew['reportId'] === undefined) reportNew['reportId'] = reportNew[item]['table'][0]['reportId'];
                        reportNew[item]['original'] = { id: reportOld[0]['dbclassId'], name: reportOld[0]['dbclassName'] };
                        //console.log(item, reportNew[item]['table'][0]['dposition']);
                        var reportClient = reportNew[item]['table'][0]['dposition'].match(REGCLIENT);
                        reportNew[item]['table'].forEach(function (item) {
                            item.old = true;
                            return item;
                        })
                        reportClient = reportClient.map(clearChat);
                        var promisClient = { height: 0, width: 0 };
                        var promisOffset = { x: 0, y: 0 };
                        getRect({ x: reportClient[0], y: reportClient[1], height: reportClient[10], width: reportClient[11] }, promisClient, promisOffset);
                        $scope.dialogDivPromoise({ boolean: 'success', data: reportNew[item], offset: promisOffset, client: promisClient }, data.PicUrl);
                        oldvalue = reportNew[item].table[0];
                    }


                    function clearChat(item) {
                        return item.split('%')[0] * 1 / 100;
                    }
                    function getRect(config, client, offset) {
                        var box = document.querySelector('.drag-parentBg') || document.querySelector('.drag-parent');
                        if (box.offsetHeight == 0 || box.offsetWidth == 0) {
                            box = document.querySelector('.drag-parent');
                        }
                        client.height = box.offsetHeight * config.height;
                        client.width = box.offsetWidth * config.width;
                        offset.x = client.width * config.x;
                        offset.y = client.height * config.y;
                    }
                });
            }
        }
        main();


        vm.dragDown = function (item) {

            $scope.createBgDiv(item);
        }
        

        //创建按钮
        function createControl(type, typeNum) {
            var controlComponent = document.createElement('div');

            if (typeNum == undefined) {
                controlComponent.className = 'drag-control-component top_10';
            } else {
                controlComponent.className = 'drag-control-component';
            }
            var controlComponentDelete = document.createElement('em');
            controlComponentDelete.setAttribute('class', 'fa fa-times');
            controlComponentDelete.setAttribute('title', '删除');
            controlComponentDelete.style.cssText = 'float:right;height:22px;line-height:22px';
            //controlComponentDelete.innerText = '删除'
            controlComponentDelete.addEventListener('click', function (e) {
                var currentBox = e.target.parentNode.parentNode;
                currentBox.parentNode.removeChild(currentBox);
                currentBox = null;
            });

            var controlComponentCollect = document.createElement('button');
            controlComponentCollect.innerText = '。。。';
            controlComponentCollect.style.cssText = 'float:right;height:22px;line-height:16px';
            createControlCollect(controlComponent);
            controlComponentCollect.addEventListener('click', function (e) {
                var node = this.parentNode.querySelector('.drag-control-component-cols');
                node.style['display'] = 'block';
                node.focus();
                node = null;
            })

            var controlComponentSetting = document.createElement('button');
            controlComponentSetting.innerText = '设置';
            controlComponentSetting.style.cssText = 'float:right;height:22px;line-height:16px';
            controlComponentSetting.addEventListener('click', function (e) {
                var currentBox = e.target.parentNode.parentNode;
                var receive = JSON.parse(currentBox.getElementsByClassName('drag-content-box')[0].getAttribute('view-dist'));
                createBgDiv(receive, currentBox, 'setting')
                currentBox = null;
            });



            var controlComponentResize = document.createElement('button');
            controlComponentResize.innerText = '放大';
            controlComponentResize.style.cssText = 'float:right;height:22px;line-height:16px';
            controlComponentResize.addEventListener('click', function (e) {
                var box = e.target.parentElement.parentElement;
                var control = box.getElementsByClassName('drag-control')[0];  //获取control组件
                var controlHead = box.getElementsByClassName('drag-control-head')[0];//获取head组件
                if (e.target.innerText.indexOf('放大') > -1) {
                    box.setAttribute('data-transform', box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)');
                    box.setAttribute('data-height', getDomStyle(box, 'height'))
                    box.setAttribute('data-width', getDomStyle(box, 'width'))
                    box.style.cssText = 'height:100%;width:100%;transform:translate3d(0,0,0);z-index:9';
                    e.target.innerText = '还原';
                    control.className += ' ng-hide';
                    controlHead.className += ' ng-hide';
                } else {
                    control.className = control.className.replace('ng-hide', '');
                    controlHead.className = controlHead.className.replace('ng-hide', '');
                    e.target.innerText = '放大'
                    box.style.cssText = 'transform:' + box.getAttribute('data-transform') + ';height:' + box.getAttribute('data-height') + ';width:' + box.getAttribute('data-width') + ';-ms-transform:' + box.getAttribute('data-transform') + ';-moz-transform:' + box.getAttribute('data-transform') + ';-webkit-transform:' + box.getAttribute('data-transform') + ';-o-transform:' + box.getAttribute('data-transform') + ';';
                }
                control = null;
                controlHead = null;
                box = null;
            })

            var controlComponentResize_W = document.createElement('button');
            controlComponentResize_W.innerText = '横向';
            controlComponentResize_W.style.cssText = 'float:right;height:22px;line-height:16px';
            controlComponentResize_W.addEventListener('click', function (e) {
                var box = e.target.parentElement.parentElement;
                var control = box.getElementsByClassName('drag-control')[0];  //获取control组件
                var controlHead = box.getElementsByClassName('drag-control-head')[0];//获取head组件
                if (e.target.innerText.indexOf('横向') > -1) {
                    var trans = box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)';
                    box.setAttribute('data-transform', box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)');
                    var he = getDomStyle(box, 'height');
                    box.setAttribute('data-height', getDomStyle(box, 'height'))
                    box.setAttribute('data-width', getDomStyle(box, 'width'))
                    var hx = 'translate3d(0px,' + trans.split(",")[1] + ', 0px)';
                    var csstext = 'width:100%;z-index:9;transform:' + hx + ';height:' + he + '';
                    box.setAttribute('style', csstext);
                    e.target.innerText = '还原';
                    //control.className += ' ng-hide';
                    //controlHead.className += ' ng-hide';
                } else {
                    control.className = control.className.replace('ng-hide', '');
                    controlHead.className = controlHead.className.replace('ng-hide', '');
                    e.target.innerText = '横向'
                    box.style.cssText = 'transform:' + box.getAttribute('data-transform') + ';height:' + box.getAttribute('data-height') + ';width:' + box.getAttribute('data-width') + ';-ms-transform:' + box.getAttribute('data-transform') + ';-moz-transform:' + box.getAttribute('data-transform') + ';-webkit-transform:' + box.getAttribute('data-transform') + ';-o-transform:' + box.getAttribute('data-transform') + ';';
                }
                control = null;
                controlHead = null;
                box = null;
            })


            if (!type) {
                controlComponent.appendChild(controlComponentDelete);
                controlComponent.appendChild(controlComponentCollect);
                controlComponent.appendChild(controlComponentSetting);
                controlComponent.appendChild(controlComponentResize);
                controlComponent.appendChild(controlComponentResize_W);
            } else {
                if (type === 'delete') {
                    controlComponent.appendChild(controlComponentDelete);
                    if (typeNum == '102' || typeNum == '21' || typeNum == '20') {
                        controlComponent.appendChild(controlComponentSetting);
                    }
                }
            }

            controlComponentResize_W = null;
            controlComponentResize = null;
            controlComponentSetting = null;
            controlComponentDelete = null;
            controlComponentCollect = null;
            return controlComponent;
        };

        //设置按钮集合
        function createControlCollect(dom) {
            var ul = document.createElement('ul');
            ul.className += 'drag-control-component-cols';
            ul.style['display'] = 'none';
            ul.tabIndex = 99;

            //设置重命名
            var reName = document.createElement('li');
            reName.innerText = '重命名标题';
            reName.addEventListener('click', reNameClick)
            function reNameClick(e) {
                var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                var nodeClone = node.cloneNode(true);
                node.style['display'] = 'none';
                createInput(node, nodeClone);
                node = null;
                nodeClone = null;

                function createInput(dom, nodeClone) {
                    var input = document.createElement('input');
                    var inputBulr = function () {
                        this.style["display"] = "none";
                        nodeClone.innerText = this.value;
                        this.removeEventListener('blur', inputBulr);
                        this.parentNode.replaceChild(nodeClone, this);
                        nodeClone = null;
                    };
                    input.value = node.innerText;
                    input.addEventListener('blur', inputBulr);
                    dom.parentNode.replaceChild(input, dom);
                    input.focus();
                    input = null;
                }
            }

            //设置居左
            var alginNameLeft = document.createElement('li');
            alginNameLeft.innerText = '标题居左';
            alginNameLeft.addEventListener('click', alginNameLeftClick)
            function alginNameLeftClick(e) {
                var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                node.style['text-align'] = 'left';
                node = null;
            }

            //设置居右
            var alginNameRight = document.createElement('li');
            alginNameRight.innerText = '标题居中';
            alginNameRight.addEventListener('click', alginNameRightClick)
            function alginNameRightClick(e) {
                var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                node.style['text-align'] = 'center';
                node = null;
            }

            //标题隐含
            var alginNameHide = document.createElement('li');
            alginNameHide.innerText = '标题隐含';
            alginNameHide.addEventListener('click', alginNameHideClick)
            function alginNameHideClick(e) {
                var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                node.innerText = 'none';
                node.style['display'] = 'none';
                node = null;
            }

            //标题显示
            var alginNameShow = document.createElement('li');
            alginNameShow.innerText = '标题显示';
            alginNameShow.addEventListener('click', alginNameShowClick)
            function alginNameShowClick(e) {
                var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                node.innerText = '默认标题';
                node.style['display'] = 'block';
                node = null;
            }



            ul.appendChild(reName);
            ul.appendChild(alginNameLeft);
            ul.appendChild(alginNameRight);
            ul.appendChild(alginNameHide);
            ul.appendChild(alginNameShow);

            ul.addEventListener('blur', function () {
                this.style['display'] = 'none';
            })


            dom.appendChild(ul);
            ul = null;
            reName = null;
            dom = null;
        }

        //画旗标线函数
        $scope.beginPoint = {};
        $scope.stopPoint = {};
        vm.linecolor = '';
        vm.drawline = function (val,box,content,result) {
            
            if (val == 'edit') {
                recreate(box,content,result);
            } else {
                vm.linecolor = '#12b394';
                //记录起点beginPoint
                $(".drag-parentBg").mousedown(function (e) {
                    $scope.beginPoint.x = e.pageX - 135;
                    $scope.beginPoint.y = e.pageY - 100;
                });

                //记录终点stopPoint，绘图
                $(".drag-parentBg").mouseup(function (e) {
                    $scope.stopPoint.x = e.pageX - 135;
                    $scope.stopPoint.y = e.pageY - 100;
                    if (Math.abs($scope.stopPoint.x - $scope.beginPoint.x) < 10) return;
                    if ($scope.stopPoint.x == undefined || $scope.beginPoint.x == undefined) return;
                    draw();
                });
            };
            function recreate(box, content, result) {
                box.setAttribute('line-tool-bar', '');
                box.setAttribute('linecolor', 'vm.linecolor');
                box.setAttribute('data-x', '{{vm.linecolor}}');
                box.setAttribute('begin1', $scope.beginPoint.x);
                box.setAttribute('begin2', $scope.beginPoint.y);
                box.setAttribute('stop1', $scope.stopPoint.x);
                box.setAttribute('stop2', $scope.stopPoint.y);
                box.appendChild(createControl('delete', 104));
                content.setAttribute('style', 'background:transparent;height:' + Math.abs($scope.stopPoint.y - $scope.beginPoint.y) + 'px;')
                if ($scope.stopPoint.x - $scope.beginPoint.x > 0) {
                    var left = $scope.beginPoint.x;
                } else {
                    var left = $scope.stopPoint.x;
                };
                if ($scope.stopPoint.y - $scope.beginPoint.y > 0) {
                    var top = $scope.beginPoint.y;
                } else {
                    var top = $scope.stopPoint.y;
                };
                vm.linecolor = result.tableField[0].csmc;
                var canvas = document.createElement('canvas');
                canvas.setAttribute('class', 'drawLine');
                canvas.setAttribute('type', '104');
                canvas.setAttribute('point', [$scope.beginPoint.x, $scope.beginPoint.y, $scope.stopPoint.x, $scope.stopPoint.y]);
                canvas.setAttribute('fieldId', result.tableField[0].id);
                canvas.setAttribute('qkid', result.table[0]['id']);
                canvas.setAttribute('width', Math.abs($scope.stopPoint.x - $scope.beginPoint.x));
                canvas.setAttribute('height', Math.abs($scope.stopPoint.y - $scope.beginPoint.y));
                canvas.setAttribute('style', 'float:left;');
                canvas.setAttribute('color', vm.linecolor);
                content.appendChild(canvas);

                var ctx;
                ctx = canvas.getContext('2d');
                ctx.strokeStyle = vm.linecolor;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 5]);
                var canvasX = Math.abs($scope.stopPoint.x - $scope.beginPoint.x),
                    canvasY = Math.abs($scope.stopPoint.y - $scope.beginPoint.y);
                var angle = Math.atan2($scope.stopPoint.y - $scope.beginPoint.y, $scope.stopPoint.x - $scope.beginPoint.x) / Math.PI * 180;//获取旗标线的角度
                if (angle > -180 && angle < -90) {
                    ctx.moveTo(canvasX - 5, canvasY - 5);
                    ctx.lineTo(canvasX - 5, 5);
                    ctx.lineTo(5, 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(canvasX - 5, canvasY - 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '1');
                } else if (angle > -90 && angle < 0) {
                    ctx.moveTo(5, canvasY - 5);
                    ctx.lineTo(5, 5);
                    ctx.lineTo(canvasX - 5, 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(5, canvasY - 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '2');
                } else if (angle > 90 && angle < 180) {
                    ctx.moveTo(canvasX - 5, 5);
                    ctx.lineTo(canvasX - 5, canvasY - 5);
                    ctx.lineTo(5, canvasY - 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(canvasX - 5, 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '3');
                } else {
                    ctx.moveTo(5, 5);
                    ctx.lineTo(5, canvasY - 5);
                    ctx.lineTo(canvasX - 5, canvasY - 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(5, 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '4');
                }
            };

            function draw(val) {
                var bg = document.getElementsByClassName('drag-parentBg')[0];
                var container = document.createElement('div');
                container.setAttribute('dec-drag-status', '');
                container.setAttribute('class', 'line');
                container.setAttribute('line-tool-bar', '');
                container.setAttribute('linecolor', 'vm.linecolor');
                container.setAttribute('data-x', '{{vm.linecolor}}');
                container.setAttribute('begin1', $scope.beginPoint.x);
                container.setAttribute('begin2', $scope.beginPoint.y);
                container.setAttribute('stop1', $scope.stopPoint.x);
                container.setAttribute('stop2', $scope.stopPoint.y);
                container.appendChild(createControl('delete', 104));
                var content = document.createElement('div');
                //content.setAttribute('class', 'drag-content');
                if ($scope.stopPoint.x - $scope.beginPoint.x > 0) {
                    var left = $scope.beginPoint.x;
                } else {
                    var left = $scope.stopPoint.x;
                };
                if ($scope.stopPoint.y - $scope.beginPoint.y > 0) {
                    var top = $scope.beginPoint.y;
                } else {
                    var top = $scope.stopPoint.y;
                };
                content.setAttribute('class', 'drag-content');
                content.setAttribute('style', 'background:transparent;');
                container.setAttribute('style', 'width:' + Math.abs($scope.stopPoint.x - $scope.beginPoint.x) + 'px;height:' + Math.abs($scope.stopPoint.y - $scope.beginPoint.y) + 'px;position:absolute;transform: translate3d(' + left + 'px,' + top + 'px, 0px);');
                var canvas = document.createElement('canvas');
                canvas.setAttribute('class', 'drawLine');
                canvas.setAttribute('type', '104');
                canvas.setAttribute('point', [$scope.beginPoint.x, $scope.beginPoint.y, $scope.stopPoint.x, $scope.stopPoint.y]);
                canvas.setAttribute('fieldId', $.Guid());
                canvas.setAttribute('qkid', $.Guid());
                canvas.setAttribute('width', Math.abs($scope.stopPoint.x - $scope.beginPoint.x));
                canvas.setAttribute('height', Math.abs($scope.stopPoint.y - $scope.beginPoint.y));
                canvas.setAttribute('style', 'float:left;');
                canvas.setAttribute('color', '{{vm.linecolor}}');
                content.appendChild(canvas);
                container.appendChild(content);
                $compile(container)($scope);
                bg.appendChild(container);

                var ctx;
                ctx = canvas.getContext('2d');
                
                ctx.strokeStyle = vm.linecolor;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 5]);
                var canvasX = Math.abs($scope.stopPoint.x - $scope.beginPoint.x),
                    canvasY = Math.abs($scope.stopPoint.y - $scope.beginPoint.y);
                var angle = Math.atan2($scope.stopPoint.y - $scope.beginPoint.y, $scope.stopPoint.x - $scope.beginPoint.x) / Math.PI * 180;//获取旗标线的角度
                if (angle > -180 && angle < -90) {
                    ctx.moveTo(canvasX - 5, canvasY - 5);
                    ctx.lineTo(canvasX - 5, 5);
                    ctx.lineTo(5, 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(canvasX - 5, canvasY - 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '1');
                } else if (angle > -90 && angle < 0) {
                    ctx.moveTo(5, canvasY - 5);
                    ctx.lineTo(5, 5);
                    ctx.lineTo(canvasX - 5, 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(5, canvasY - 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '2');
                } else if (angle > 90 && angle < 180) {
                    ctx.moveTo(canvasX - 5, 5);
                    ctx.lineTo(canvasX - 5, canvasY - 5);
                    ctx.lineTo(5, canvasY - 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(canvasX - 5, 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '3');
                } else {
                    ctx.moveTo(5, 5);
                    ctx.lineTo(5, canvasY - 5);
                    ctx.lineTo(canvasX - 5, canvasY - 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(5, 5, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = vm.linecolor;
                    ctx.fill();
                    canvas.setAttribute('angel', '4');
                }
                $('.line').mouseover(function (e) {
                    container.getElementsByClassName('drag-control-component')[0].style['display'] = 'block';
                });
                $('.line').mouseout(function (e) {
                    container.getElementsByClassName('drag-control-component')[0].style['display'] = 'none';
                });
            }
            
        };

        $scope.$on('$destroy', function () {
            //$timeout.cancel(timeoutTb);
           $scope.type20Num = 0;
            $scope.destroy();
        })



        

    }
})();





(function () {
    angular.module('app.ReportSet').directive('decCreateLink', decCreateLink);
    decCreateLink.$inject = ['ngDialog', '$ocLazyLoad', '$compile', 'ajaxService'];
    function decCreateLink(ngDialog, $ocLazyLoad, $compile, ajaxService) {
        return {
            restrict: 'A',
            //scope: true,
            link: function (scope, ele, attr) {
                var backgroundId;  //背景图片id;
                //console.log(scope);
                ele = ele[0];
                scope.createBgDiv = createBgDiv;


                //创建box
                function createDragBox(result, offset, client) {
                    if (result === undefined) return;
                    //if (result.type == '104') {
                    //    specialType(box, result, content);
                    //    return;
                    //};
                    var box = document.createElement('div');
                    box.className = 'drag-box draggable';
                    //如果存在位移量
                    if (offset) {
                        box.style.cssText = 'transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);-ms-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);-moz-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);-webkit-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);-o-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);';
                       // box.style.cssText = 'top:' + (offset.y) + 'px;left:' + offset.x + 'px'
                        //box.style.cssText = '-moz-transform:translate(' + offset.x + 'px,' + offset.y + 'px)';
                        //box.style.cssText = '-moz-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);';
                        //box.style.cssText = '-webkit-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);';
                        //box.style.cssText = '-o-transform:translate3d(' + offset.x + 'px,' + (offset.y) + 'px,0);';
                       // box.setAttribute('style', '-moz-transform:translate(' + offset.x + 'px,' + offset.y + 'px)');
                    }
                    //如果存在宽高
                    if (client) box.style.cssText += 'height:' + client.height + 'px;width:' + client.width + 'px';
                    //添加拖拽指令
                    box.setAttribute('dec-drag-status', '')



                    var content = document.createElement('div');
                    content.className = 'drag-content';

                    //根据type添加内容
                    specialType(box, result, content);

                    box.appendChild(content);

                    box.addEventListener('mouseover', function (e) {
                        this.getElementsByClassName('drag-control-component')[0].style['display'] = 'block';
                    })  //为元素box添加hover效果 产生按钮

                    box.addEventListener('mouseleave', function (e) {
                        this.getElementsByClassName('drag-control-component')[0].style['display'] = 'none';
                    })  //为元素box移除hover效果


                    var dragParent = ele.getElementsByClassName('drag-parentBg')[0] || ele.getElementsByClassName('drag-parent')[0];
                    dragParent.appendChild(box);

                    box = null;

                }

                function specialType(box, result, content) {
                    //angular 生成 ng-include---start
                    if (result.type == 101 || result.type == 102) {
                        box.setAttribute('minwidth', '20');
                        box.setAttribute('minheight', '20');
                        var style = getStyle(result.table[0].cssText);
                        box.setAttribute('text-tool-bar', '')
                        if (style['content']) {
                            style['content'].split(';').forEach(function (item) {
                                if (!item) return;
                                content.style.cssText += item;
                                var obj = item.split(':');
                                var key = obj[0].trim();
                                var value = obj[1].trim();
                                if (key === 'font-size') box.setAttribute('fsc', parseInt(value));
                                if (key === 'color') box.setAttribute('color', colorRGB2Hex(value));
                                if (key === 'background') box.setAttribute('opc', colorRGB2Hex(value));
                            })
                        }
                        //编译指令
                        $compile(box)(scope);

                        result.type == 102? includeBoxView(content, result):includeBoxViewTextarea(content, result);
                        box.appendChild(createControl('delete', result.type));
                    }
                    else if (result.type == 105) {
                        box.setAttribute('minwidth', '20');
                        box.setAttribute('minheight', '20');
                        box.setAttribute('flag-tool-bar', '');
                        box.setAttribute('id', 'qibiao');
                        //content.setAttribute('style', 'background:#edf1f2;');
                        var title = document.createElement('div');
                                                
                        title.setAttribute('id', 'flagTitle');
                        var titleInput = document.createElement('input');
                        titleInput.setAttribute('class', 'drag-input drag-title-input');
                        titleInput.setAttribute('type', 'text');
                        titleInput.setAttribute('type1', result.type);
                        titleInput.setAttribute('qkid', result.table[0]['id'] || $.Guid());
                        if (result.tableField[0] != undefined && Object.keys(result.tableField[0]).length == 0) {
                            titleInput.setAttribute('fieldId', $.Guid())
                            titleInput.value = '';
                            title.setAttribute('style', 'width:100%;color:#000;background:#12b394;');
                        } else {
                            titleInput.setAttribute('fieldId', result.tableField[0]['id']);
                            titleInput.value = result.tableField[0]['csmc'];
                            titleInput.setAttribute('style', JSON.parse(result.table[0].cssText)['0-4-0-0']);
                            title.setAttribute('style', JSON.parse(result.table[0].cssText)['0-4-0']);
                            content.setAttribute('style', JSON.parse(result.table[0].cssText)['0-4']);
                        };
                        titleInput.setAttribute('placeholder', '请输入标题');
                        titleInput.setAttribute('style', 'width: 100%;resize: none;border: none;background-color: inherit;padding-left: 6px;');
                        title.appendChild(titleInput);
                        content.appendChild(title);
                        //var body = document.createElement("div");
                        //content.appendChild(body);
                        $compile(box)(scope);
                        
                        box.appendChild(createControl('delete', result.type));
                        
                    } else if (result.type == 104) {
                        var str = result.table[0].remark;
                        var arr = str.split(',');
                        scope.beginPoint.x = arr[0];
                        scope.beginPoint.y = arr[1];
                        scope.stopPoint.x = arr[2];
                        scope.stopPoint.y = arr[3];
                        //scope.linecolor = result.tableField[0].csmc;
                        scope.vm.drawline("edit", box, content, result);
                        $compile(box)(scope);
                        //box.appendChild(createControl('delete', result.type));
                    } else {
                        //编译指令
                        $compile(box)(scope);
                        includeBoxView(content, result);
                        box.appendChild(createControl());
                    }
                }

                //修改box
                function modfiyDragBox(result, currentBox) {
                    if (!currentBox) return;
                    var content = currentBox.getElementsByClassName('drag-content')[0];
                    content.innerHTML = '';
                    includeBoxView(content, result);
                    currentBox = null;
                }
                function getStyle(styles) {
                    var style = {};
                    if (!styles) return style;
                    styles = JSON.parse(styles);
                    for (var item in styles) {
                        if (!styles.hasOwnProperty(item)) continue;
                        if (item.match(/-/g).length === 1) style['content'] = styles[item];
                        if (item === '0-3-0-0') style['h4'] = styles[item];
                    }
                    return style
                }


                //创建按钮
                function createControl(type,typeNum) {
                    var controlComponent = document.createElement('div');
                    
                    if (typeNum ==undefined) {                       
                        controlComponent.className = 'drag-control-component top_10';
                    } else {
                        controlComponent.className = 'drag-control-component';
                    }
                    var controlComponentDelete = document.createElement('em');
                    controlComponentDelete.setAttribute('class', 'fa fa-times');
                    controlComponentDelete.setAttribute('title', '删除');
                    controlComponentDelete.style.cssText = 'float:right;height:22px;line-height:22px';
                    //controlComponentDelete.innerText = '删除'
                    controlComponentDelete.addEventListener('click', function (e) {
                        var currentBox = e.target.parentNode.parentNode;
                        currentBox.parentNode.removeChild(currentBox);
                        currentBox = null;
                    });

                    var controlComponentCollect = document.createElement('button');
                    controlComponentCollect.innerText = '。。。';
                    controlComponentCollect.style.cssText = 'float:right;height:22px;line-height:16px';
                    createControlCollect(controlComponent);
                    controlComponentCollect.addEventListener('click', function (e) {
                        var node = this.parentNode.querySelector('.drag-control-component-cols');
                        node.style['display'] = 'block';
                        node.focus();
                        node = null;
                    })

                    var controlComponentSetting = document.createElement('button');
                    controlComponentSetting.innerText = '设置';
                    controlComponentSetting.style.cssText = 'float:right;height:22px;line-height:16px';
                    controlComponentSetting.addEventListener('click', function (e) {
                        var currentBox = e.target.parentNode.parentNode;
                        var receive = JSON.parse(currentBox.getElementsByClassName('drag-content-box')[0].getAttribute('view-dist'));
                        createBgDiv(receive, currentBox, 'setting')
                        currentBox = null;
                    });


                   
                    var controlComponentResize = document.createElement('button');
                    controlComponentResize.innerText = '放大';
                    controlComponentResize.style.cssText = 'float:right;height:22px;line-height:16px';
                    controlComponentResize.addEventListener('click', function (e) {
                        var box = e.target.parentElement.parentElement;
                        var control = box.getElementsByClassName('drag-control')[0];  //获取control组件
                        var controlHead = box.getElementsByClassName('drag-control-head')[0];//获取head组件
                        if (e.target.innerText.indexOf('放大') > -1) {
                            box.setAttribute('data-transform', box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)');
                            box.setAttribute('data-height', getDomStyle(box, 'height'))
                            box.setAttribute('data-width', getDomStyle(box, 'width'))
                            box.style.cssText = 'height:100%;width:100%;transform:translate3d(0,0,0);z-index:9';
                            e.target.innerText = '还原';
                            control.className += ' ng-hide';
                            controlHead.className += ' ng-hide';
                        } else {
                            control.className = control.className.replace('ng-hide', '');
                            controlHead.className = controlHead.className.replace('ng-hide', '');
                            e.target.innerText = '放大'
                            box.style.cssText = 'transform:' + box.getAttribute('data-transform') + ';height:' + box.getAttribute('data-height') + ';width:' + box.getAttribute('data-width') + ';-ms-transform:'+box.getAttribute('data-transform') +';-moz-transform:'+box.getAttribute('data-transform') +';-webkit-transform:'+box.getAttribute('data-transform') + ';-o-transform:'+box.getAttribute('data-transform') + ';';
                        }
                        control = null;
                        controlHead = null;
                        box = null;
                    })

                    var controlComponentResize_W = document.createElement('button');
                    controlComponentResize_W.innerText = '横向';
                    controlComponentResize_W.style.cssText = 'float:right;height:22px;line-height:16px';
                    controlComponentResize_W.addEventListener('click', function (e) {
                        var box = e.target.parentElement.parentElement;
                        var control = box.getElementsByClassName('drag-control')[0];  //获取control组件
                        var controlHead = box.getElementsByClassName('drag-control-head')[0];//获取head组件
                        if (e.target.innerText.indexOf('横向') > -1) {
                            var trans = box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)';
                            box.setAttribute('data-transform', box.style.transform || getDomStyle(box, 'transform') || 'translate3d(0,0,0)');
                            var he=getDomStyle(box, 'height');
                            box.setAttribute('data-height', getDomStyle(box, 'height'))
                            box.setAttribute('data-width', getDomStyle(box, 'width')) 
                            var hx = 'translate3d(0px,' + trans.split(",")[1] + ', 0px)';
                            var csstext = 'width:100%;z-index:9;transform:' + hx + ';height:' + he+ '';
                            box.setAttribute('style', csstext);
                            e.target.innerText = '还原';
                            //control.className += ' ng-hide';
                            //controlHead.className += ' ng-hide';
                        } else {
                            control.className = control.className.replace('ng-hide', '');
                            controlHead.className = controlHead.className.replace('ng-hide', '');
                            e.target.innerText = '横向'
                            box.style.cssText = 'transform:' + box.getAttribute('data-transform') + ';height:' + box.getAttribute('data-height') + ';width:' + box.getAttribute('data-width') + ';-ms-transform:' + box.getAttribute('data-transform') + ';-moz-transform:' + box.getAttribute('data-transform') + ';-webkit-transform:' + box.getAttribute('data-transform') + ';-o-transform:' + box.getAttribute('data-transform') + ';';
                        }
                        control = null;
                        controlHead = null;
                        box = null;
                    })
                  

                    if (!type) {
                        controlComponent.appendChild(controlComponentDelete);
                        controlComponent.appendChild(controlComponentCollect);
                        controlComponent.appendChild(controlComponentSetting);
                        controlComponent.appendChild(controlComponentResize);
                        controlComponent.appendChild(controlComponentResize_W);
                    } else {
                        if (type === 'delete') {
                            controlComponent.appendChild(controlComponentDelete);
                            if (typeNum == '102' || typeNum == '21' || typeNum == '20') {
                                controlComponent.appendChild(controlComponentSetting);
                            }
                        }
                    }

                    controlComponentResize_W = null;
                    controlComponentResize = null;
                    controlComponentSetting = null;
                    controlComponentDelete = null;
                    controlComponentCollect = null;
                    return controlComponent;
                }

                //设置按钮集合
                function createControlCollect(dom) {
                    var ul = document.createElement('ul');
                    ul.className += 'drag-control-component-cols';
                    ul.style['display'] = 'none';
                    ul.tabIndex = 99;

                    //设置重命名
                    var reName = document.createElement('li');
                    reName.innerText = '重命名标题';
                    reName.addEventListener('click', reNameClick)
                    function reNameClick(e) {
                        var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                        var nodeClone = node.cloneNode(true);
                        node.style['display'] = 'none';
                        createInput(node, nodeClone);
                        node = null;
                        nodeClone = null;

                        function createInput(dom, nodeClone) {
                            var input = document.createElement('input');
                            var inputBulr = function () {
                                this.style["display"] = "none";
                                nodeClone.innerText = this.value;
                                this.removeEventListener('blur', inputBulr);
                                this.parentNode.replaceChild(nodeClone, this);
                                nodeClone = null;
                            };
                            input.value = node.innerText;
                            input.addEventListener('blur', inputBulr);
                            dom.parentNode.replaceChild(input, dom);
                            input.focus();
                            input = null;
                        }
                    }

                    //设置居左
                    var alginNameLeft = document.createElement('li');
                    alginNameLeft.innerText = '标题居左';
                    alginNameLeft.addEventListener('click', alginNameLeftClick)
                    function alginNameLeftClick(e) {
                        var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                        node.style['text-align'] = 'left';
                        node = null;
                    }

                    //设置居右
                    var alginNameRight = document.createElement('li');
                    alginNameRight.innerText = '标题居中';
                    alginNameRight.addEventListener('click', alginNameRightClick)
                    function alginNameRightClick(e) {
                        var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                        node.style['text-align'] = 'center';
                        node = null;
                    }

                    //设置隐含
                    var alginNameHide = document.createElement('li');
                    alginNameHide.innerText = '标题隐含';
                    alginNameHide.addEventListener('click', alginNameHideClick)
                    function alginNameHideClick(e) {
                        var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                        node.innerText = 'none';
                        node.style['display'] = 'none';
                        node = null;
                    }

                    //标题显示
                    var alginNameShow = document.createElement('li');
                    alginNameShow.innerText = '标题显示';
                    alginNameShow.addEventListener('click', alginNameShowClick)
                    function alginNameShowClick(e) {
                        var node = this.parentNode.parentNode.parentNode.querySelector('.drag-content .drag-dialog-content-body-h1');
                        node.innerText = '默认标题';
                        node.style['display'] = 'block';
                        node = null;
                    }

                    ul.appendChild(reName);
                    ul.appendChild(alginNameLeft);
                    ul.appendChild(alginNameRight);
                    ul.appendChild(alginNameHide);
                    ul.appendChild(alginNameShow);

                    ul.addEventListener('blur', function () {
                        this.style['display'] = 'none';
                    })


                    dom.appendChild(ul);
                    ul = null;
                    reName = null;
                    dom = null;
                }

                //创建模态框
                function createBgDiv(receive, currentBox, flag) {

                    if (receive.value && receive.value.boolean !== 'success') return;
                    if (receive.type == 101) {
                        createDragBox({ type: receive.type, table: [{}], tableField: [{}] }, receive.offset, { height: 200, width: 200 });
                        return;
                    } else if (receive.type == 103) {
                        setBackground(ajaxService);
                        return;
                    } else if (receive.type == 105) {
                        createDragBox({ type: receive.type, table: [{}], tableField: [{}] }, receive.offset, { height: 200, width: 300 });
                        return;
                    }
                    //else if (receive.type == 104) {
                    //    createDragBox({ type: receive.type, table: [{}], tableField: [{}] }, receive.offset, { height: 200, width: 300 });
                    //    return;
                    //}
                    else if (receive.type == 4 || receive.type == 5 || receive.type == 6) {
                        $ocLazyLoad.load(['../Modules/MES/BI/ReportSetEchart.js']).then(function () {
                            ///加载完成
                            var dialog = ngDialog.open({
                                template: '../Modules/MES/BI/ReportSetEchart.html',
                                className: 'drag-ngdialog',
                                overlay: true,
                                showClose: false,
                                closeByEscape: false,
                                closeByDocument: false,
                                controller: 'ReportSetEchart as vm',
                                // data: receive,
                                // preCloseCallback: createDragBox
                                resolve: {          //提供注入参数  数据传输
                                    dep: function () {
                                        return receive
                                    }
                                }
                            });
                            dialog.closePromise.then(function (data) {
                                //console.log("datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata");
                                //console.log(data);
                                //console.log(data.value + '-------- has been dismissed');


                                //console.log("returnValue")
                                //console.log(data);
                                if (data.value === undefined) return;
                                flag === 'setting' ? modfiyDragBox(data.value.data, currentBox) : createDragBox(data.value.data, data.value.offset);
                                currentBox && (currentBox = null);


                                console.log("clclclclc")
                            })
                        });
                        return;
                    } else {
                        $ocLazyLoad.load(['../Modules/MES/BI/ReportSetDialog.js']).then(function () {
                            ///加载完成
                            var dialog = ngDialog.open({
                                template: '../Modules/MES/BI/ReportSetDialog.html',
                                className: 'drag-ngdialog',
                                overlay: true,
                                showClose: false,
                                closeByEscape: false,
                                closeByDocument: false,
                                controller: 'ReportSetDialog as vm',
                                // data: receive,
                                // preCloseCallback: createDragBox
                                resolve: {          //提供注入参数  数据传输
                                    dep: function () {
                                        return receive
                                    }
                                }
                            });
                            dialog.closePromise.then(function (data) {
                                //console.log(data.value + '-------- has been dismissed');
                                if (data.value === undefined) return;
                                flag === 'setting' ? modfiyDragBox(data.value.data, currentBox) : createDragBox(data.value.data, data.value.offset);
                                currentBox && (currentBox = null);
                            })
                        });
                    }
                }

                //因为可能从报表重新进入来修改报表 所以把生成报表的方法提取到scope上 方便control调用
                scope.dialogDivPromoise = function (data, bgurl) {
                    if (data.boolean !== 'success') return;
                    var qkData = data.data;
                    var offset = data.offset;
                    var clinet = data.client;

                    if (bgurl !== '' && !backgroundId) {
                        
                        ele.querySelector('.drag-parentBg').setAttribute('style', 'height:' + data.data.table[0].bgPicSize.split("$")[1] * 1 + 'px;width:' + data.data.table[0].bgPicSize.split("$")[0] * 1 + 'px;background:url(' + bgurl + ')  no-repeat ;background-size: contain;');
                        
                        scope.editeHeight = data.data.table[0].bgPicSize.split("$")[1] * 1;

                        scope.editeWidth = data.data.table[0].bgPicSize.split("$")[0] * 1;
                        backgroundId = qkData.table[0]['bgPic'];
                    }
                    createDragBox(qkData, offset, clinet);

                    //设置区块内部高度
                    scope["viewHeight_" + qkData.table[0].iid] = clinet.height -25;
                }


                


                //创建ng-include  如果type类型小于100则不生成标题
                function includeBoxView(ele, data) {
                    data.style = getStyle(data.table[0].cssText);

                    // if (!angular.isObject(data.table[0].remark) && data.table[0].remark) data.table[0].remark = JSON.parse(data.table[0].remark);
                    var div = document.createElement('div');
                    div.setAttribute("oc-lazy-load", "'/Modules/Mes/BI/ReportBoxView.js'");
                    div.setAttribute('style', 'width:100%');
                    div.className = 'drag-dialog-content-body';
                    if (data.type < 100 || data.type == 104) div.innerHTML = '<h4 class="drag-dialog-content-body-h1" style="' + data.style.h4 + '">' + (data.table[0] && data.table[0].divTitle || "默认标题") + '</h4>';


                    var dataUnique =  + parseInt(Math.random() * 10000);
                    scope["data_" + dataUnique] = data;
                    scope["viewHeight_" + dataUnique] = 400;

                    div.innerHTML += "<div report-box-view id='{{" + dataUnique + "}}' view-dist='{{data_" + dataUnique + "}}' class='drag-content-box' style='width:100%'  view-height='{{viewHeight_" + dataUnique + "}}' view-choosetj=''></div>";//style="display:flex"
                    var $dom = $compile(div)(scope);
                    $dom.appendTo(ele);
                    ele = null;
                    $dom = null;
                }

                //创建文本控件
                function includeBoxViewTextarea(ele, result) {
                    var textarea = document.createElement('textarea');
                    textarea.className = 'drag-textarea';
                    textarea.setAttribute('type', result.type);
                    textarea.setAttribute('qkid', result.table[0]['id'] || $.Guid())
                    if (result.tableField[0]!=undefined &&Object.keys(result.tableField[0]).length == 0) {
                        textarea.setAttribute('fieldId', $.Guid())
                        textarea.value = '';
                    } else {
                        textarea.setAttribute('fieldId', result.tableField[0]['id']);
                        textarea.value = result.tableField[0]['csmc'];
                        textarea.setAttribute('style', JSON.parse(result.table[0].cssText)['0-4-0'])
                    }
                    

                    
                    ele.appendChild(textarea);
                    ele = null;
                    result = null;
                }


                ////创建输入框
                //function includeBoxViewSelect(ele, result) {
                //    var div = document.createElement('div');
                //    div.setAttribute("oc-lazy-load", "'/Modules/Mes/BI/ReportBoxView.js'");
                //    div.style.cssText = 'width:100%';
                //    div.style.cssText = 'display:flex';
                //    div.className = 'drag-dialog-content-body';
                //    var dataUnique = 'view' + parseInt(Math.random() * 1000);
                //    scope[dataUnique] = result;
                //    div.innerHTML += '<div report-box-view view-dist="{{' + dataUnique + '}}" class="drag-content-box" view-height="450" style="display:none"></div>';
                //    var textName = document.createElement('input');
                //    textName.setAttribute('type', 'text');
                //    textName.setAttribute('disabled', 'disabled');
                //    if (result.tableField.tableFieldContent == undefined) {
                //        textName.setAttribute('value', result.tableField[0].csmc);
                //    } else {
                //        textName.setAttribute('value', result.tableField.tableFieldContent[0].csmc);
                //    }
                //    textName.style.cssText = 'position:relative;z-index:10;width:20%;align-self:center;text-align:center';
                //    div.appendChild(textName);
                //    if (result.type == 21) {
                //        var input = document.createElement('input');
                //        input.setAttribute('type', 'text');
                //        input.style.cssText = 'position:relative;z-index:10;width:70%;margin-left:10px;align-self:center';
                //        div.appendChild(input);
                //    } else if (result.type == 20) {
                //        var input20_qs = document.createElement('input');
                //        input20_qs.setAttribute('type', 'text');
                //        input20_qs.setAttribute('name', 'dateinfo_qs' + scope.type20Num);
                //        input20_qs.setAttribute('class', 'dateinfo_qs' + scope.type20Num);
                //        input20_qs.style.cssText = 'position:relative;z-index:10;width:45%;margin-left:10px;float:left';

                //        var input20_js = document.createElement('input');
                //        input20_js.setAttribute('type', 'text');
                //        input20_js.setAttribute('name', 'dateinfo_js' + scope.type20Num);
                //        input20_js.setAttribute('class', 'dateinfo_js' + scope.type20Num);
                //        input20_js.style.cssText = 'position:relative;z-index:10;width:45%;margin-left:10px;float:left';

                //        var div20 = document.createElement('div');
                //        div20.setAttribute('style','align-self:center;width:70%');
                //        div20.appendChild(input20_qs);
                //        div20.appendChild(input20_js);

                //        div.appendChild(div20);
                //        scope.type20Num++;
                        
                //    }

                //    var $dom = $compile(div)(scope);
                //    $dom.appendTo(ele);
                //    ele = null;
                //    result = null;
                    

                //}

                

                //按钮事件
                scope.save = function (type) {
                    var boxs = [];
                    getBoxs(boxs);
                    type === 'save' ? scope.vm.boxSave(boxs) : scope.vm.preView(boxs);
                }

                //获取界面信息
                function getBoxs(boxs) {
                    var dragBoxs = ele.getElementsByClassName('drag-box')[0] || ele.getElementsByClassName('line')[0];
                    if (ele.getElementsByClassName('drag-parentBg')[0] == undefined) {
                        var parentHeight =  ele.getElementsByClassName('drag-parent')[0].offsetHeight;
                        var parentWidth =  ele.getElementsByClassName('drag-parent')[0].offsetWidth;
                    } else {
                        var parentHeight = ele.getElementsByClassName('drag-parentBg')[0].offsetHeight;
                        if (parentHeight == 0) {
                            parentHeight = ele.getElementsByClassName('drag-parent')[0].offsetHeight;
                        }
                        var parentWidth = ele.getElementsByClassName('drag-parentBg')[0].offsetWidth ;
                    }


                    while (dragBoxs) {
                        var params = {};
                        var transformOrigin = dragBoxs.style['transform'].replace(/[^\d\.]+/g, ',').split(',') || [];
                        var transformX =Math.round((transformOrigin[2] || 0) / dragBoxs.offsetWidth * 100);
                        var transformY =Math.round((transformOrigin[3] * 1 || 0) / dragBoxs.offsetHeight * 100);

                        var transform = '-ms-transform:translate3d(' + transformX + '%,' + transformY + '%,0);'
                                        + '-moz-transform:translate3d(' + transformX + '%,' + transformY + '%,0);'
                                        + '-webkit-transform:translate3d(' + transformX + '%,' + transformY + '%,0);'
                                        + '-o-transform:translate3d(' + transformX + '%,' + transformY + '%,0);'
                                        + 'transform:translate3d(' + transformX + '%,' + transformY + '%,0);'
                        var height = 'height:' + (dragBoxs.offsetHeight) / parentHeight * 100 + '%;';
                        var width = 'width:' + dragBoxs.offsetWidth / parentWidth * 100 + '%;';

                        params['position'] = transform + height + width;
                        if (dragBoxs.querySelector('.drag-textarea')) {
                            var textarea = dragBoxs.querySelector('.drag-textarea');
                            params['data'] = JSON.stringify({
                                'tableField': [{ 'csmc': textarea.value, zdmc: 'label', 'id': textarea.getAttribute('fieldId') }],
                                'table': [{ id: textarea.getAttribute('qkid') }],
                                'type': dragBoxs.querySelector('.drag-textarea').getAttribute('type'),
                                'cssText': getAllStyle(dragBoxs),
                            })
                        } else if (dragBoxs.querySelector('.drag-input')) {
                            var input = dragBoxs.querySelector('.drag-input');
                            params['data'] = JSON.stringify({
                                'tableField': [{ 'csmc': input.value, zdmc: 'qibiao', 'id': input.getAttribute('fieldId') }],
                                'table': [{ id: input.getAttribute('qkid') }],
                                'type': dragBoxs.querySelector('.drag-input').getAttribute('type1'),
                                'cssText': getAllStyle(dragBoxs),
                            })
                        } else if (dragBoxs.querySelector('.drawLine')) {
                            var line = dragBoxs.querySelector('.drawLine');
                            params['data'] = JSON.stringify({
                                'tableField': [{ 'csmc': line.getAttribute('color'), zdmc: 'qibiaoxian' + line.getAttribute('angel'), 'id': line.getAttribute('fieldId') }],
                                'table': [{ id: line.getAttribute('qkid'),remark:line.getAttribute('point') }],
                                'type': line.getAttribute('type'),
                                'cssText': getAllStyle(dragBoxs),
                            })
                        } else {
                            var h1 = dragBoxs.querySelector('.drag-content .drag-dialog-content-body-h1');
                            params['title'] = h1 && h1.innerText;
                            if (dragBoxs.getElementsByClassName('drag-content-box')[0] == undefined) {
                                return
                            }
                            params['data'] = dragBoxs.getElementsByClassName('drag-content-box')[0].getAttribute('view-dist');

                            params['cssText'] = getAllStyle(dragBoxs);
                            if (Object.keys(params['cssText']).length > 0) {
                                params['data'] = JSON.parse(params['data']);
                                params['data']['cssText'] = params['cssText'];
                                params['data'] = JSON.stringify(params['data']);
                            }
                            h1 = null;
                        }
                        if (backgroundId) scope.backgroundId = backgroundId;  //如果bgid不为空则
                        boxs.push(params);
                        dragBoxs = dragBoxs.nextSibling;
                    }
                    dragBoxs = null;
                }

                //获取所有的样式
                function getAllStyle(elem, order, style) {
                    if (!style) style = {};
                    if (!order) order = 0;
                    var children = Array.prototype.slice.call(angular.element(elem)[0].children);
                    children.reduce(function (style, item, index) {
                        var cssText = item.style.cssText;
                        if (item.className.indexOf('drag-control') > -1) return style;
                        if (!cssText) {
                            if (angular.element(item)[0].children.length > 0) getAllStyle(item, order + '-' + index, style);
                            return style;
                        }
                        style[order + '-' + index] = cssText;
                        if (angular.element(item)[0].children.length > 0) getAllStyle(item, order + '-' + index, style);
                        return style;
                    }, style)

                    return style;
                }




                //设置背景
                function setBackground(ajaxService) {
                    var input = document.createElement('input');
                    input.type = 'file';
                    input.style.display = 'none';
                    input.onchange = function () {
                        var file = input.files[0];
                        var path = input.value;
                        if (window.FileReader) {
                            var fr = new FileReader();
                            fr.onload = function (e) {
                                //console.log(e);
                                ajaxService.post('/MesCommon/saveFile', { fileContent: e.target.result, 'fileType': '.png' }, function (data) {
                                    backgroundId = data;
                                    scope.bgId = data;
                                })
                                var img = new Image();
                                img.src = e.target.result;
                                img.onload = function () {
                                    scope.bgWidth = this.width;
                                    scope.bgHeight = this.height;
                                    if (ele.getElementsByClassName('drag-parentBg').length < 1) {
                                        var div = document.createElement('div');
                                        div.setAttribute('class', 'drag-parentBg');                                       
                                        div.setAttribute('style', 'height:' + this.height + 'px;width:' + this.width + 'px;background:url(' + e.target.result + ')  no-repeat ;background-size: contain;position:absolute;');
                                        ele.getElementsByClassName('drag-parent')[0].appendChild(div);
                                    } else {
                                        ele.getElementsByClassName('drag-parentBg')[0].setAttribute('style', 'height:' + this.height + 'px;width:' + this.width + 'px;background:url(' + e.target.result + ')  no-repeat ;background-size: contain;position:absolute;');
                                    }
                                    
                                }
                                //ele.getElementsByClassName('drag-parent')[0].style.cssText += "background:url(" + e.target.result + ") no-repeat ;background-size: contain;";

                                input.parentElement.removeChild(input);
                                input = null;
                            }
                            fr.readAsDataURL(file);
                        }
                    }
                    document.body.appendChild(input);
                    $(input).click();
                }

                ///处理dom节点获取样式属性
                function getDomStyle(ele, attr) {
                    return ele.currentStyle ?
                    ele.currentStyle[attr] : getComputedStyle(ele, null)[attr];
                }

                function colorRGB2Hex(color) {
                    var rgb = color.split(',');
                    if (rgb[0] == 'transparent') {
                        return 'transparent'
                    } else {
                        var r = rgb[0].match(/\d+/)[0] * 1;
                        var g = rgb[1].match(/\d+/)[0] * 1;
                        var b = rgb[2].match(/\d+/)[0] * 1;
                        var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                        return hex;
                    }
                    
                }

                scope.destroy = function () {
                    //   document.getElementsByTagName('body')[0].removeEventListener('mouseup', bodyMouseUp);
                    //  ele.getElementsByClassName('drag-submit')[0].removeEventListener('click', dragSubmitClick);
                    scope = null;
                }

                //ele.getElementsByClassName('drag-submit')[0].addEventListener('click', dragSubmitClick);
                //ele.getElementsByClassName('drag-save')[0].addEventListener('click', dragSaveClick);


            }
        }
    }
})();


(function () {
    //控件拖动和缩放
    angular.module('app.dragControl', []).directive('decDragStatus', decDragStatus);
    decDragStatus.$inject = [];
    function decDragStatus() {
        return {
            restrict: 'A',
            link: link,
        }
        function link(scope, ele, attr) {


            var elem = ele[0];
            var dragItem = { down: false, className: '', mouse: { x: 0, y: 0 }, dragParent: null };
            var parent = elem.parentNode || document.getElementsByClassName('drag-parentBg')[0] || document.getElementsByClassName('drag-parent')[0];
            // var parent = elem;
            if (elem.getElementsByClassName('drag-control').length > 0) return;

            createNodes(elem);
            removeEvent(parent);

            angular.element(parent).mousedown(function (e) {
                dragItem.down = true;
                dragItem.className = e.target.className;
                dragItem.mouse = { x: e.pageX, y: e.pageY }
                dragItem.dragParent = dragItem.className.indexOf('drag-control-head') > -1 ? e.target.parentNode : e.target.parentNode.parentNode;
            })
            angular.element(parent).mousemove(function (e) {
                //console.log("eeeeeeeeeeeeeeeeeeeeeeeee")
                //console.log(scope);
                //console.log(ele);
                //console.log(attr);
                //console.log(e);
                if (!(dragItem.down && dragItem.className.indexOf('drag-control') > -1)) return;
                var elem = dragItem.dragParent;
                //elem.setAttribute('style', 'top: ;left: ;position: ');
                var offset = { x: e.pageX - dragItem.mouse.x, y: e.pageY - dragItem.mouse.y };
                var  minWidth = elem.getAttribute('minwidth') * 1 || 300;
                var  minHeight = elem.getAttribute('minheight') * 1 || 300;
                dragItem.className.indexOf('drag-control-head') > -1 ?
                        boxMove(elem, offset) : boxResize(scope,elem, offset, dragItem.className, minWidth, minHeight);
                dragItem.mouse.x = e.pageX;
                dragItem.mouse.y = e.pageY;

                

            })
            angular.element(parent).mouseleave(function (e) {
                dragItem.down = false;
                dragItem.className = '';
                dragItem.mouse = { x: 0, y: 0 }
            })
            angular.element(parent).mouseup(function (e) {
                dragItem.down = false;
                dragItem.className = '';
                dragItem.mouse = { x: 0, y: 0 }
            })


            //拖拽辅助线函数
            var MIN_DISTANCE = 10; //捕获的最小距离

            var guides = []; // 没有可用的引导 

            var innerOffsetX, innerOffsetY;


            $(".draggable").draggable({

                start: function (event, ui) {

                    guides = $.map($(".draggable").not(this), computeGuidesForElement);

                    //offsetX、offsetY：源元素（srcElement）的X,Y坐标

                    innerOffsetX = event.offsetX;

                    innerOffsetY = event.offsetY;

                },

                drag: function (event, ui) {

                    //迭代所有的guids，记住最近的h和v guids

                    var guideV, guideH, distV = MIN_DISTANCE + 1, distH = MIN_DISTANCE + 1, offsetV, offsetH;

                    var chosenGuides = { top: { dist: MIN_DISTANCE + 1 }, left: { dist: MIN_DISTANCE + 1 } };

                    var $t = $(this);

                    //pageX、pageY：文档坐标x、y ;

                    var pos = { top: event.pageY - innerOffsetY, left: event.pageX - innerOffsetX };

                    //outerHeight、outerWidth：整个浏览器的高度、宽度

                    var w = $t.outerWidth() - 1;

                    var h = $t.outerHeight() - 1;

                    var elemGuides = computeGuidesForElement(null, pos, w, h);

                    $.each(guides, function (i, guide) {

                        $.each(elemGuides, function (i, elemGuide) {

                            if (guide.type == elemGuide.type) {

                                var prop = guide.type == "h" ? "top" : "left";

                                var d = Math.abs(elemGuide[prop] - guide[prop]);

                                if (d < chosenGuides[prop].dist) {

                                    chosenGuides[prop].dist = d;

                                    chosenGuides[prop].offset = elemGuide[prop] - pos[prop];

                                    chosenGuides[prop].guide = guide;

                                }

                            }

                        });

                    });

                    if (chosenGuides.top.dist <= MIN_DISTANCE) {

                        $("#guide-h").css("top", chosenGuides.top.guide.top).show();

                        ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;

                    }

                    else {

                        $("#guide-h").hide();

                        ui.position.top = pos.top;

                    }

                    if (chosenGuides.left.dist <= MIN_DISTANCE) {

                        $("#guide-v").css("left", chosenGuides.left.guide.left).show();

                        ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;

                    }

                    else {

                        $("#guide-v").hide();

                        ui.position.left = pos.left;

                    }

                },

                stop: function (event, ui) {

                    $("#guide-v, #guide-h").hide();

                }

            });
            function computeGuidesForElement(elem, pos, w, h) {

                if (elem != null) {

                    var $t = $(elem);

                    //offset:返回当前元素 的偏移量

                    pos = $t.offset();

                    w = $t.outerWidth() - 1;

                    h = $t.outerHeight() - 1;

                }



                return [

                    { type: "h", left: pos.left, top: pos.top }, //垂直方向左下对齐线

                    { type: "h", left: pos.left, top: pos.top + h },

                    { type: "v", left: pos.left, top: pos.top },

                    { type: "v", left: pos.left + w, top: pos.top },

                    //您可以添加_any_其他指南在这里就好了（如指南10像素单元的左）

                    { type: "h", left: pos.left, top: pos.top + h / 2 },

                    { type: "v", left: pos.left + w / 2, top: pos.top }

                ];

            }



            elem.addEventListener('mouseleave', function (e) {
                this.getElementsByClassName('drag-control')[0].style['display'] = 'none';
                this.getElementsByClassName('drag-control-head')[0].style['display'] = 'none';
                this.style['z-index'] = '0';
               // this.getElementsByClassName('textToolBar')[0].style['display'] = 'none';
            })  //为元素box移除hover效果

            parent = null;

            scope.$on('destroy', function () {
                removeEvent(elem.parentNode);
                elem.parentNode.remove(elem);
                scope = null; 
            })
        }
        //移除绑定事件
        function removeEvent(node) {
            angular.element(node).unbind('mousedown')
            angular.element(node).unbind('mousemove')
            angular.element(node).unbind('mouseleave')
            angular.element(node).unbind('mouseup')
            node = null;
        }

        //添加控制组件
        function createNodes(node) {
            var childs = '<div class="drag-control-border drag-control-left-top"></div>'
                         + '<div class="drag-control-border drag-control-center-top"></div>'
                         + '<div class="drag-control-border drag-control-right-top"></div>'
                         + '<div class="drag-control-border drag-control-left"></div>'
                         + '<div class="drag-control-border drag-control-right"></div>'
                         + '<div class="drag-control-border drag-control-left-bottom"></div>'
                         + '<div class="drag-control-border drag-control-center-bottom"></div>'
                         + '<div class="drag-control-border drag-control-right-bottom"></div>';

            var sizeControl = document.createElement('div');
            sizeControl.className = 'drag-control';
            sizeControl.innerHTML = childs;
            var headControl = document.createElement('div');
            headControl.className = 'drag-control-head';
            node.appendChild(sizeControl);
            node.appendChild(headControl);
            //return {
            //    sizeControl: sizeControl,
            //    headControl: headControl,
            //}
        }

        //处理元素box的放大缩小
        function boxResize(scope,current, offset, className, minWidth, minHeight) {
            //if (current.childNodes[1].className == 'drawLine') return;
            //console.log("ppppppppppppppppppp")
            //current.childNodes[3].height = '100px';
            //console.log(current.childNodes[3].childNodes[0]);
            //console.log(current.childNodes[3].childNodes[0].childNodes[1].id);

            //var aaa = current.childNodes[3].childNodes[0].childNodes[1];
            //console.log("wwwwwwwwwwwwwwwwwwwww")
            var direct = className.indexOf('left-top') > -1 ? { x: -1, y: -1 } :
                        className.indexOf('center-top') > -1 ? { x: 0, y: -1 } :
                        className.indexOf('right-top') > -1 ? { x: 1, y: -1 } :
                        className.indexOf('left-bottom') > -1 ? { x: -1, y: 1 } :
                        className.indexOf('center-bottom') > -1 ? { x: 0, y: 1 } :
                        className.indexOf('right-bottom') > -1 ? { x: 1, y: 1 } :
                        className.indexOf('left') > -1 ? { x: -1, y: 0 } :
                        className.indexOf('right') > -1 ? { x: 1, y: 0 } : null;

            if (direct.x !== 0) {
                var width = getDomStyle(current, 'width').replace(/[^\d\.]+/g, '') * 1;
                if (minWidth && (width + direct.x * offset.x < minWidth)) {
                    return
                }
                current.style.width = width + direct.x * offset.x + 'px';
            }
            if (direct.y !== 0) {
                var height = getDomStyle(current, 'height').replace(/[^\d\.]+/g, '') * 1;
                if (minHeight && (height + direct.y * offset.y < minHeight)) {
                    return
                }
                current.style.height = height + direct.y * offset.y + 'px';

                scope["viewHeight_" + current.childNodes[3].childNodes[0].childNodes[1].id] = parseInt(height + direct.y * offset.y);

            }
            if (direct.x === -1 || direct.y === -1) {
                if (direct.x === 1 && direct.y === -1) direct.x = 0;
                if (direct.x === -1 && direct.y === 1) direct.y = 0;
                var transform = current.style['transform'].replace(/[^\d\.]+/g, ',').split(',') || [];
                var transformX = (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1);
                var transformY = (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1);
                //current.style['-ms-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
                //current.style['-moz-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
                //current.style['-webkit-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)'
                //current.style['-o-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)'
                current.style['transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)'
                //current.style['-ms-transform'] = 'translate3d(' + (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1) + 'px,' + (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1) + 'px,0)'
                //current.style['-moz-transform'] = 'translate3d(' + (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1) + 'px,' + (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1) + 'px,0)'
                //current.style['-webkit-transform'] = 'translate3d(' + (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1) + 'px,' + (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1) + 'px,0)'
                //current.style['-o-transform'] = 'translate3d(' + (offset.x * Math.abs(direct.x) + (transform[2] || 0) * 1) + 'px,' + (offset.y * Math.abs(direct.y) + (transform[3] || 0) * 1) + 'px,0)'
            }
            current = null;
            offset = null;
        }

        ///处理元素移动 相对之前位置的偏移
        function boxMove(current, offset) {
            var transform = current.style['transform'].replace(/[^\d\.]+/g, ',').split(',') || [];
            var transformX = (offset.x * 1 + (transform[2] || 0) * 1);
            var transformY = (offset.y * 1 + (transform[3] || 0) * 1);
            //var transformX = (offset.x * 1 + (current.style['left'].split('p')[0] || 0) * 1);
            //var transformY = (offset.y * 1 + (current.style['top'].split('p')[0] || 0) * 1);
            //current.style['-ms-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
            //current.style['-moz-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
            //current.style['-webkit-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
            //current.style['-o-transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
            current.style['transform'] = 'translate3d(' + transformX + 'px,' + transformY + 'px,0)';
            //current.style['top'] = transformY + 'px';
            //current.style['left'] = transformX + 'px';
            //current.style['-ms-transform'] = 'translate3d(' + (offset.x * 1 + (transform[2] || 0) * 1) + 'px,' + (offset.y * 1 + (transform[3] || 0) * 1) + 'px,0)';
            //current.style['-moz-transform'] = 'translate3d(' + (offset.x * 1 + (transform[2] || 0) * 1) + 'px,' + (offset.y * 1 + (transform[3] || 0) * 1) + 'px,0)';
            //current.style['-webkit-transform'] = 'translate3d(' + (offset.x * 1 + (transform[2] || 0) * 1) + 'px,' + (offset.y * 1 + (transform[3] || 0) * 1) + 'px,0)';
            //current.style['-o-transform'] = 'translate3d(' + (offset.x * 1 + (transform[2] || 0) * 1) + 'px,' + (offset.y * 1 + (transform[3] || 0) * 1) + 'px,0)';
            // reSizeContent(current);
            current = null;
        }
         
        ///处理容器的大小 ;每次移动都进行判断 容器是否应该被放大
        //function reSizeContent(ele) {
        //    var transform = ele.style['transform'].replace(/[^\d\.]+/g, ',').split(',') || [];
        //    var domHeight = parseInt(getDomStyle(ele, 'height'));
        //    var domWidth = parseInt(getDomStyle(ele, 'width')) ;
        //    var width = (transform[2] || 0) * 1 + domWidth;
        //    var height = (transform[3] || 0) * 1 + domHeight;
        //    if (domHeight < height) ele.parentElement.style.height = height + 'px';
        //    if (domWidth < width) ele.parentElement.style.width = width + 'px';
        //}

        ///处理dom节点获取样式属性
        function getDomStyle(ele, attr) {
            return ele.currentStyle ?
            ele.currentStyle[attr] : getComputedStyle(ele, null)[attr];
        }


    }
})();

(function () {
    //拖动生成控件
    angular.module('app.dragControl').directive('decDragItem', decDragItem);
    decDragItem.$inject = ['$compile'];
    function decDragItem($compile) {
        return {
            restrict: 'A',
            scope: {
                done: '&',
                draw:'&'
            },
            link: link,
        }

        function link(scope, ele, attr) {
            var ele = ele[0];
            var fromClass = attr.from;
            var inClass = attr.in;
            var to = attr.to;
            var thing = attr.thing;

            var dragDownItem = { down: false, className: '', transferData: null, dragParent: null, offset: { x: 0, y: 0 } };  ///存储侧栏数据的box

            ele.getElementsByClassName(fromClass)[0].addEventListener('mousedown', controlMouseDown) ///侧栏数据的box被按下时存储交换信息
            ele.getElementsByClassName(inClass)[0].addEventListener('mousemove', dragMouseMove)  ///侧栏数据的box移动
            ele.getElementsByClassName(inClass)[0].addEventListener('mouseup', dragMouseUp)  ///侧栏数据的box抬起
            ele.getElementsByClassName(inClass)[0].addEventListener('mouseleave', dragMouseLeave)  ///当前界面移除drag-parent 容器 关于drag-control的事件


            function controlMouseDown(e) {
                var node = e.target && e.target.parentNode || '';
                if (node && node.className.indexOf(thing) === -1) return;
                if (e.target.alt == '旗标线') {
                    //$(".drag-parentBg").unbind("mousedown");
                    //$(".drag-parentBg").unbind("mouseup");
                    scope.draw();
                    return;
                } else {
                    $(".drag-parentBg").unbind("mousedown");
                    $(".drag-parentBg").unbind("mouseup");
                }
                dragDownItem.down = true;
                dragDownItem.offset = { x: e.pageX, y: e.pageY };
                dragDownItem.transferData = { type: node.getAttribute('type'), offset: { x: e.pageX, y: e.pageY } }
            };
            

            function dragMouseMove(e) {
                if (dragDownItem.down) {
                    if (dragDownItem.dragParent === null) {
                         var div = document.createElement('div');
                        div.style.cssText = 'position:absolute;height:50px;width:50px;background-color:#000;top:0px;left:0px';
                        document.getElementsByClassName('drag')[0].appendChild(div);
                        dragDownItem.dragParent = div;
                    }
                    //   boxMove(dragDownItem.dragParent, { x: e.pageX, y: e.pageY });
                    dragDownItem.dragParent.style['transform'] = 'translate3d(' + e.pageX + 'px,' + e.pageY + 'px,0)';
                    //dragDownItem.dragParent.style['top'] = e.pageY + 'px';
                    //dragDownItem.dragParent.style['left'] = e.pageX + 'px';
                    //dragDownItem.dragParent.style['-ms-transform'] = 'translate3d(' + e.pageX + 'px,' + e.pageY + 'px,0)';
                    //dragDownItem.dragParent.style['-moz-transform'] = 'translate3d(' + e.pageX + 'px,' + e.pageY + 'px,0)';
                    //dragDownItem.dragParent.style['-webkit-transform'] = 'translate3d(' + e.pageX + 'px,' + e.pageY + 'px,0)';
                    //dragDownItem.dragParent.style['-o-transform'] = 'translate3d(' + e.pageX + 'px,' + e.pageY + 'px,0)';
                    dragDownItem.offset.x = e.pageX;
                    dragDownItem.offset.y = e.pageY;
                }
            }
            function dragMouseUp(e) {
                if (!dragDownItem.dragParent) {
                    dragDownItem.down = false;
                    return;
                }
                dragDownItem.dragParent.parentElement.removeChild(dragDownItem.dragParent);
                if (validRect(e.offsetX, e.offsetY)) {
                    var leftDom = document.getElementsByClassName(to)[0];
                    dragDownItem.transferData.offset = { x: e.offsetX - leftDom.offsetLeft, y: e.offsetY - leftDom.offsetTop };
                    leftDom = null;
                    scope.done({ data: dragDownItem.transferData });
                }

                dragDownItem = { down: false, className: '', transferData: null, dragParent: null, offset: { x: 0, y: 0 } };
            }
            function dragMouseLeave(e) {
                if (dragDownItem.dragParent === null) return;
                dragDownItem.dragParent.parentElement.removeChild(dragDownItem.dragParent);
                dragDownItem = { down: false, className: '', transferData: null, dragParent: null, offset: { x: 0, y: 0 } };
            }
            function validRect(x, y) {
                var rectNode = document.getElementsByClassName(to)[0];
                var flag = (rectNode.offsetTop < y && y < rectNode.clientHeight + rectNode.offsetTop) && (rectNode.offsetLeft < x && x < rectNode.clientWidth + rectNode.offsetLeft)
                rectNode = null;
                return flag;
            }
            
            

            scope.$on('destroy', function () {
                angular.element(fromClass).unbind('mousedown');
                angular.element(inClass).unbind('mousemove');
                angular.element(inClass).unbind('mouseup');
                angular.element(inClass).unbind('mouseleave');
                ele.remove();
                scope = null;
            })

        }




    }
})();

//旗标线工具栏
(function () {
    angular.module('app.lineToolBar', []).directive('lineToolBar', lineToolBar)
    lineToolBar.$inject = ['$compile'];
    function lineToolBar($compile) {
        return {
            restrict: 'A',
            link: link,
            scope: {
                linecolor: '=',
                //changeLineColor: '&',
                //canv: '=',
                begin1: '@',
                begin2:'@',
                stop1: '@',
                stop2:'@'
            }
        }

        function link(scope, elem, attr) {
            scope.canv = elem.find('canvas')[0];
            scope.change = function (color) {
                //scope.canvas = scope.canvas = elem.find('canvas')[0];
                scope.linecolor = color;
                var str = color
                scope.changeLineColor(elem);
            };
            scope.changeLineColor = function (elem) {

                var canvas = elem.find('canvas')[0];
                canvas.setAttribute('color', scope.linecolor);
                var ctx;
                ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, Math.abs(scope.stop1 - scope.begin1), Math.abs(scope.stop2 - scope.begin2));
                ctx.strokeStyle = scope.linecolor;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 5]);
                var canvasX = Math.abs(scope.stop1 - scope.begin1),
                        canvasY = Math.abs(scope.stop2 - scope.begin2);
                var angle = Math.atan2(scope.stop2 - scope.begin2, scope.stop1 - scope.begin1) / Math.PI * 180;//获取旗标线的角度
                    if (angle > -180 && angle < -90) {
                        ctx.moveTo(canvasX - 5, canvasY - 5);
                        ctx.lineTo(canvasX - 5, 5);
                        ctx.lineTo(5, 5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(canvasX - 5, canvasY - 5, 3, 0, 2 * Math.PI);
                        ctx.fillStyle = scope.linecolor;
                        ctx.fill();
                        canvas.setAttribute('angel', '1');
                    } else if (angle > -90 && angle < 0) {
                        ctx.moveTo(5, canvasY - 5);
                        ctx.lineTo(5, 5);
                        ctx.lineTo(canvasX - 5, 5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(5, canvasY - 5, 3, 0, 2 * Math.PI);
                        ctx.fillStyle = scope.linecolor;
                        ctx.fill();
                        canvas.setAttribute('angel', '2');
                    } else if (angle > 90 && angle < 180) {
                        ctx.moveTo(canvasX - 5, 5);
                        ctx.lineTo(canvasX - 5, canvasY - 5);
                        ctx.lineTo(5, canvasY - 5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(canvasX - 5, 5, 3, 0, 2 * Math.PI);
                        ctx.fillStyle = scope.linecolor;
                        ctx.fill();
                        canvas.setAttribute('angel', '3');
                    } else {
                        ctx.moveTo(5, 5);
                        ctx.lineTo(5, canvasY - 5);
                        ctx.lineTo(canvasX - 5, canvasY - 5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(5, 5, 3, 0, 2 * Math.PI);
                        ctx.fillStyle = scope.linecolor;
                        ctx.fill();
                        canvas.setAttribute('angel', '4');
                    }


            }

            elem.append($compile(template())(scope));

            scope.$on('destroy', function () {
                elem.unbind('mouseover');
                elem.unbind('mouseleave');
                scope = null;
            });

        };

        function template() {
            var textTool = '<div class="textToolBar">';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_input" ng-model="color" ng-change="change(color)">';
            textTool += '</div>';
            textTool += '</div>';
            return textTool;
        }
    }
})();

//标签工具栏指令
(function () {
    angular.module('app.flagToolBar', []).directive('flagToolBar', flagToolBar)
    flagToolBar.$inject = ['$compile'];
    function flagToolBar($compile) {
        return {
            restrict: 'A',
            link: link,
        }

        function link(scope, elem, attr) {
            scope.change = function (val) {
                var setAttr;
                var setVal;
                switch (val) {
                    case 'fsc': setAttr = 'font-size', setVal = scope.fsc + 'px'; break;
                    case 'color': setAttr = 'color', setVal = scope.color; break;
                    case 'colorBg1': setAttr = 'background', setVal = scope.colorBg1; break;
                    case 'colorBg2': setAttr = 'background', setVal = scope.colorBg2; break;
                    case 'opc': setAttr = 'background', setVal = scope.opc; break;
                    default: break;
                };
                if (val == 'opc') {
                    if (scope.opc == true) {
                        setVal = 'transparent'
                    } else {
                        setVal = scope.colorBg2 || '';
                    }
                    scope.opc = !scope.opc;
                };
                if (val == 'color') {
                    elem.find('.drag-title-input').css(setAttr, setVal);
                } else if (val == 'colorBg1') {
                    elem.find('#flagTitle').css(setAttr, setVal);
                } else if (val == 'colorBg2' || val == 'fsc' || val == 'opc') {
                    elem.find('.drag-content').css(setAttr, setVal);
                };

            }
            

            elem.append($compile(template())(scope));

            scope.$on('destroy', function () {
                elem.unbind('mouseover');
                elem.unbind('mouseleave');
                scope = null;
            })

        }

        function template() {
            var textTool = '<div class="textToolBar">';
            textTool += '<div style="min-width:55px">';
            textTool += '<select name="fsc" class="textToolBar_div_option" ng-model="fsc" ng-change="change(\'fsc\')">'
            textTool += '<option value="14">14</option>'
            textTool += '<option value="16">16</option>'
            textTool += '<option value="18">18</option>'
            textTool += '<option value="20">20</option>'
            textTool += '<option value="22">22</option>'
            textTool += '<option value="28">28</option>'
            textTool += '<option value="36">36</option>'
            textTool += '<option value="48">48</option>'
            textTool += '<option value="72">72</option>'
            textTool += '</select>'
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_input" ng-model="color" ng-change="change(\'color\')">';
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_inputBg" ng-model="colorBg1" ng-change="change(\'colorBg1\')" title="标题背景色">';
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_inputBg" ng-model="colorBg2" ng-change="change(\'colorBg2\')" title="主体背景色">';
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<button name="opc" style="width:30px;height:22px;line-height:16px" ng-model="opc" ng-click="change(\'opc\')" ng-init="opc=true">透';
            textTool += '</button>';
            textTool += '</div>';
            textTool += '</div>';
            return textTool;
        }
    }
})();


//标签工具栏指令
(function () {
    angular.module('app.textToolBar', []).directive('textToolBar', textToolBar)
    textToolBar.$inject = ['$compile'];
    function textToolBar($compile) {
        return {
            restrict: 'A',
            scope: {
                fsc: '@',
                color: '@',
                opc:'@'
            },
            link: link,
        }

        function link(scope, elem, attr) {
            scope.change = function (type) {
                var setAttr;
                var setVal;
                switch (type) {
                    case 'fsc': setAttr = 'font-size', setVal = scope.fsc + 'px'; break;
                    case 'color': setAttr = 'color', setVal = scope.color; break;
                    case 'colorBg': setAttr = 'background', setVal = scope.colorBg; break;
                    case 'opc': setAttr = 'background', setVal = scope.opc ; break;
                    default: break;

                }
                if (type == 'opc') {
                    if (scope.opc == true) {
                        setVal = 'transparent'
                    } else {
                        setVal=''
                    }
                    scope.opc = !scope.opc;
                }
                elem.find('.drag-content').css(setAttr, setVal);
                if (elem.find('.drag-title-input')) {
                    elem.find('.drag-title-input').css(setAttr, setVal);
                }
                if (elem.find('.drag-textarea')) {
                    elem.find('.drag-textarea').css(setAttr, setVal);
                }
            }
            

            elem.append($compile(template())(scope));

            //elem.bind('mouseover', function () {
            //    elem.find('.textToolBar').css('display', 'flex')
            //})

            //elem.find('.textToolBar').bind('mouseleave', function () {
            //   angular.element(this).css('display', 'none')
            //})

            scope.$on('destroy', function () {
                elem.unbind('mouseover');
                elem.unbind('mouseleave');
                scope = null;
            })

        }

        function template() {
            var textTool = '<div class="textToolBar">';
            textTool += '<div style="min-width:55px">';
            textTool += '<select name="fsc" class="textToolBar_div_option" ng-model="fsc" ng-change="change(\'fsc\')">'
            textTool += '<option value="14">14</option>'
            textTool += '<option value="16">16</option>'
            textTool += '<option value="18">18</option>'
            textTool += '<option value="20">20</option>'
            textTool += '<option value="22">22</option>'
            textTool += '<option value="28">28</option>'
            textTool += '<option value="36">36</option>'
            textTool += '<option value="48">48</option>'
            textTool += '<option value="72">72</option>'
            textTool += '</select>'
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_input" ng-model="color" ng-change="change(\'color\')">';
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<input type="color" class="textToolBar_div_inputBg" ng-model="colorBg" ng-change="change(\'colorBg\')">';
            textTool += '</div>';
            textTool += '<div>';
            textTool += '<button name="opc" style="width:30px;height:22px;line-height:16px" ng-model="opc" ng-click="change(\'opc\')" ng-init="opc=true">透';
            textTool += '</button>';
            textTool += '</div>';
            textTool += '</div>';
            return textTool;
        }
    }
})();








///给一个元素设置一个高度 使其距离文档底部15px;
(function (_window) {
    angular.module('app.ReportSet').directive('decHeight', decHeight);
    decHeight.$inject = [];
    function decHeight() {
        return {
            strict: 'A',
            scope: {
                heightBottom: '@'
            },
            link: function (scope, ele, attrs) {
                if (scope.heightBottom) scope.heightBottom = Number(scope.heightBottom);
                timeInter();   ///设置高度
                _window.addEventListener("resize", timeInter);///重新计算
                var timeoutTb;  //存储定时器
                function fullHeight() {
                    var clientHeight = document.body.clientHeight;
                    var top = ele[0].offsetTop;
                    var height = clientHeight - top - (scope.heightBottom || 15);  ///留15的空隙
                    var cszd = attrs.decHeight || 'height';
                    ele[0].style[cszd] = height + "px";
                }

                function timeInter() {
                    if (timeoutTb) clearTimeout(timeoutTb);
                    timeoutTb = setTimeout(fullHeight, 200)
                }

                scope.$on('$destroy', function () {
                    ele.remove();
                    _window.removeEventListener("resize", timeInter)
                })
            }
        }
    }
})(window);



//parent.addEventListener('mousedown', mousedown)
//parent.addEventListener('mousemove', mousemove)
//parent.addEventListener('mouseleave', mouseleave)
//document.getElementsByTagName('body')[0].addEventListener('mouseup', dragUp);
//function mousedown(e) {
//    dragItem.down = true;
//    dragItem.className = e.target.className;
//    dragItem.mouse = { x: e.pageX, y: e.pageY }
//}

//function mousemove(e) {
//    if (!(dragItem.down && dragItem.className.indexOf('drag-control') > -1)) return;
//    var offset = { x: e.pageX - dragItem.mouse.x, y: e.pageY - dragItem.mouse.y };
//    dragItem.className.indexOf('drag-control-head') > -1 ?
//            boxMove(elem, offset) : boxResize(elem, offset, dragItem.className);
//    dragItem.mouse.x = e.pageX;
//    dragItem.mouse.y = e.pageY;
//}

//function mouserleave() {
//    dragItem.down = false;
//    dragItem.className = '';
//    dragItem.mouse = { x: 0, y: 0 }
//}

//function dragUp() {
//    dragItem.down = false;
//    dragItem.className = '';
//    dragItem.mouse = { x: 0, y: 0 }
//}

//function removeEvent(node) {
//    node.removeEventListener('mousedown', 'mousedown')
//    node.removeEventListener('mousemove', mousemove)
//    node.removeEventListener('mouserleave', mouserleave)
//    document.getElementsByTagName('body')[0].removeEventListener('mouseup', dragUp);
//}