(function () {
    'use strict';

    function inset_falg(str, flag, data) {
        // var newstr ;
        var count = str.length;
        var temF = str.substring(0, count - flag);
        var temB = str.substring(count - flag, count);
        temF += data + temB;
        return temF;
    }

    function ArrySort(obj) {
        var my_data;
        if (obj[0].uname === '全部') {
            if (!obj[0].uid) {
                obj[0].uid = '000000000';
            }
            my_data = '[{"label":"全部:' + obj[0].uid + '"}';
            obj.splice(0, 1);
        } else {
            my_data = '[{"label":"全部:000000000"}';
        }
        obj.forEach(function (item, index, arr) {
            var flag = item.ujc;
            var rowsData = '';
            if (arr[index - 1] && (flag <= arr[index - 1].ujc)) { ///确定在第几级   每级增加的}]  所以length=2 ， 当和 第一级同级时 往前推2 以此类推
                rowsData = ',{"label": "' + item.uname.trim() + ':' + item.uid.trim() + '"}';
                my_data = inset_falg(my_data, 2 * (flag), rowsData);
            } else {
                rowsData = ',"children":[{"label":"' + item.uname.trim() + ':' + item.uid.trim() + '"}]';
                my_data = inset_falg(my_data, 2 * (flag - 1) + 1, rowsData); ///确定跳转下一级 需要向前跳过}
            }
        });
        my_data += ']';
        return JSON.parse(my_data);
    }

    //树形结构处理
    function extreeData(arr, name, jc, id) {
        var arrString = JSON.stringify(arr);
        var reg_name = new RegExp('"' + name + '"', 'g');
        var reg_jc = new RegExp('"' + jc + '"', 'g');
        var reg_id = new RegExp('"' + id + '"', 'g');
        arrString = arrString.replace(reg_name, '"uname"').replace(reg_jc, '"ujc"').replace(reg_id, '"uid"');
        return JSON.parse(arrString);
    }

    function go() {
        var GetJhlbxx = '[{"bmbh":"10","bmmc":"灯具","bmjc":1},{"bmbh":"1010","bmmc":"灯具成品","bmjc":2},{"bmbh":"1013","bmmc":"灯具部件","bmjc":2},{"bmbh":"15","bmmc":"换热器","bmjc":1},{"bmbh":"1510","bmmc":"钛管","bmjc":2},{"bmbh":"1513","bmmc":"高效罐","bmjc":2},{"bmbh":"25","bmmc":"LTCC","bmjc":1},{"bmbh":"2501","bmmc":"叠层粉料","bmjc":2},{"bmbh":"2504","bmmc":"成品计划","bmjc":2},{"bmbh":"2507","bmmc":"中道胚体","bmjc":2},{"bmbh":"28","bmmc":"节能灯","bmjc":1},{"bmbh":"2801","bmmc":"整灯","bmjc":2},{"bmbh":"2804","bmmc":"灯管","bmjc":2},{"bmbh":"31","bmmc":"LED照明","bmjc":1},{"bmbh":"3101","bmmc":"LED整灯","bmjc":2},{"bmbh":"3102","bmmc":"LED贴片","bmjc":2},{"bmbh":"3104","bmmc":"LED封装*","bmjc":2},{"bmbh":"3107","bmmc":"LED芯片*","bmjc":2},{"bmbh":"3110","bmmc":"LED插件","bmjc":2},{"bmbh":"34","bmmc":"元器件","bmjc":1},{"bmbh":"3401","bmmc":"电容器","bmjc":2},{"bmbh":"3404","bmmc":"微波器件","bmjc":2},{"bmbh":"37","bmmc":"介质计划","bmjc":1},{"bmbh":"3710","bmmc":"介质成品","bmjc":2},{"bmbh":"3713","bmmc":"胚体","bmjc":2},{"bmbh":"3716","bmmc":"粉料","bmjc":2},{"bmbh":"43","bmmc":"功率电感计划","bmjc":1},{"bmbh":"4310","bmmc":"功率成品计划","bmjc":2},{"bmbh":"46","bmmc":"声表计划","bmjc":1},{"bmbh":"4610","bmmc":"声表成品计划","bmjc":2},{"bmbh":"4613","bmmc":"声表返工计划","bmjc":2},{"bmbh":"49","bmmc":"汽配计划","bmjc":1}]';
        var sortData = extreeData(JSON.parse(GetJhlbxx), 'bmmc', 'bmjc', 'bmbh');
        var arrData = ArrySort(sortData);
        console.log(sortData, arrData);
    }
    go();
})();


(function () {
    'use strict';
    var module,
        __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    module = angular.module('lichLineTree', []);

    module.directive('decTree', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'E',
                template: "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree  \" >\n <li style=\"margin-bottom:5px; padding-left:4%\" ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-animate=\"'abn-tree-animate'\"  ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'') + ' ' +row.classes.join(' ')\" class=\"abn-tree-row  \" ><a class=''  ng-click=\" user_clicks_branch(row.branch)\" ng-dblclick=\"user_dbclicks_branch(row.branch)\" style=\"margin-left:0px;padding-left:7%;width:95%\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\" indented tree-icon\"  > </i><span class=\"indented tree-label txt-fs\">&nbsp{{ row.label }} </span></a></li>\n</ul>",
                replace: true,
                // scope: {
                //     treeData: '=',
                //     onSelect: '&',
                //     initialSelection: '@',
                //     treeControl: '='
                // },
                link: function (scope, element, attrs) {
                    var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree, Data_Chsoe, DouClik;
                    error = function (s) {
                        debugger;
                        return void 0;
                    };

                    expand_level = parseInt(attrs.expandLevel, 10);
                    if (!scope.treeData) {
                        scope.treeData = [];
                        //  return;
                    }

                    for_each_branch = function (f) {
                        var do_f, root_branch, _i, _len, _ref, _results;
                        do_f = function (branch, level) {
                            var child, _i, _len, _ref, _results;
                            f(branch, level);
                            if (branch.children != null) {
                                _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    if (Object.prototype.toString.call(_ref[_i]) == "[object String]") {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    } else {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                }
                                return _results;
                            }
                        };
                        _ref = scope.treeData;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            root_branch = _ref[_i];
                            _results.push(do_f(root_branch, 1));
                        }
                        return _results;
                    };

                    on_treeData_change = function () {
                        var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                        for_each_branch(function (b, level) {
                            if (!b.uid) {
                                var labelData;
                                if (b.label != undefined) {
                                    labelData = b.label.split(':');
                                    b.label = labelData[0];
                                }
                                return b.uid = labelData[1];
                            }
                        });

                        for_each_branch(function (b) {
                            var child, _i, _len, _ref, _results;
                            if (angular.isArray(b.children)) {
                                _ref = b.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    _results.push(child.parent_uid = b.uid);
                                }
                                return _results;
                            }
                        });
                        scope.tree_rows = [];
                        for_each_branch(function (branch) {
                            var child, f;
                            if (branch.children) {
                                if (branch.children.length > 0) {
                                    f = function (e) {
                                        if (typeof e === 'string') {
                                            return {
                                                label: e,
                                                children: []
                                            };
                                        } else {
                                            return e;
                                        }
                                    };
                                    return branch.children = (function () {
                                        var _i, _len, _ref, _results;
                                        _ref = branch.children;
                                        _results = [];
                                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                            child = _ref[_i];
                                            _results.push(f(child));
                                        }
                                        return _results;
                                    })();
                                }
                            } else {
                                return branch.children = [];
                            }
                        });

                        //往repeate中加入数据;
                        add_branch_to_list = function (level, branch, visible) {
                            //
                            var child, child_visible, tree_icon, _i, _len, _ref, _results, tree_color, isParent;

                            if (branch.expanded == null) {
                                branch.expanded = false;
                            }
                            if (branch.label == '全部' && isfirst) {
                                branch.expanded = true;
                                isfirst = false;
                                scope.user_clicks_branch(branch);
                                DouClik = false;
                            }
                            if (branch.classes == null) {
                                branch.classes = [];
                            }
                            if (!branch.noLeaf && (!branch.children || branch.children.length === 0)) {

                                tree_icon = attrs.iconLeaf;
                                if (__indexOf.call(branch.classes, "leaf") < 0) {
                                    branch.classes.push("leaf");
                                }
                                if (!branch.expanded) {
                                    tree_icon = attrs.iconLeaf;
                                } else {
                                    tree_icon = attrs.iconLeaf;
                                }
                            } else {
                                if (branch.expanded) {
                                    tree_icon = attrs.iconUncheck;
                                } else {
                                    tree_icon = attrs.iconCollapse;
                                }
                            }
                            //判断否已经展开完全 如果是择iconExpand
                            //
                            scope.tree_rows.push({
                                level: level,
                                branch: branch,
                                label: branch.label,
                                classes: branch.classes,
                                tree_icon: tree_icon,
                                visible: visible,
                                isParent: isParent
                            });
                            if (branch.children != null) {
                                _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    child_visible = visible && branch.expanded;
                                    _results.push(add_branch_to_list(level + 1, child, child_visible));
                                }
                                return _results;
                            }
                            //向子集合中插入
                        };
                        _ref = scope.treeData;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            root_branch = _ref[_i];
                            // console.log('root_branch' + root_branch);
                            _results.push(add_branch_to_list(1, root_branch, true));
                        }

                        initTreeSelect(_ref, DouClik);
                        return _results;
                    };
              
                    scope.$watch('treeData', on_treeData_change, true);


                    function inset_falg(str, flag, data) {
                        // var newstr ;
                        var count = str.length;
                        var temF = str.substring(0, count - flag);
                        var temB = str.substring(count - flag, count);
                        temF += data + temB;
                        return temF;
                    }
                
                    function ArrySort(obj) {
                        var my_data;
                        if (obj[0].uname === '全部') {
                            if (!obj[0].uid) {
                                obj[0].uid = '000000000';
                            }
                            my_data = '[{"label":"全部:' + obj[0].uid + '"}';
                            obj.splice(0, 1);
                        } else {
                            my_data = '[{"label":"全部:000000000"}';
                        }
                        obj.forEach(function (item, index, arr) {
                            var flag = item.ujc;
                            var rowsData = '';
                            if (arr[index - 1] && (flag <= arr[index - 1].ujc)) { ///确定在第几级   每级增加的}]  所以length=2 ， 当和 第一级同级时 往前推2 以此类推
                                rowsData = ',{"label": "' + item.uname.trim() + ':' + item.uid.trim() + '"}';
                                my_data = inset_falg(my_data, 2 * (flag), rowsData);
                            } else {
                                rowsData = ',"children":[{"label":"' + item.uname.trim() + ':' + item.uid.trim() + '"}]';
                                my_data = inset_falg(my_data, 2 * (flag - 1) + 1, rowsData); ///确定跳转下一级 需要向前跳过}
                            }
                        });
                        my_data += ']';
                        return JSON.parse(my_data);
                    }
                
                    //树形结构处理
                    function extreeData(arr, name, jc, id) {
                        var arrString = JSON.stringify(arr);
                        var reg_name = new RegExp('"' + name + '"', 'g');
                        var reg_jc = new RegExp('"' + jc + '"', 'g');
                        var reg_id = new RegExp('"' + id + '"', 'g');
                        arrString = arrString.replace(reg_name, '"uname"').replace(reg_jc, '"ujc"').replace(reg_id, '"uid"');
                        return JSON.parse(arrString);
                    }
                
                }
            };
        }
    ]);
}).call(this);