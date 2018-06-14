(function () {
    var module,
      __indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    module = angular.module('angularBootstrapNavTree', []);

    module.directive('abnTree', [
      '$timeout', function ($timeout) {
          return {
              restrict: 'E',
              template: "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree  \" >\n <li style=\"margin-bottom:5px; padding-left:4%\" ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-animate=\"'abn-tree-animate'\"  ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'') + ' ' +row.classes.join(' ')\" class=\"abn-tree-row  \" ><a class=''  ng-click=\" user_clicks_branch(row.branch)\" ng-dblclick=\"user_dbclicks_branch(row.branch)\" style=\"margin-left:0px;padding-left:7%;width:95%\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\" indented tree-icon\"  > </i><span class=\"indented tree-label txt-fs\">&nbsp{{ row.label }} </span></a></li>\n</ul>",
              replace: true,
              scope: {
                  treeData: '=',
                  onSelect: '&',
                  initialSelection: '@',
                  treeControl: '='
              },
              link: function (scope, element, attrs) {
                  var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree, Data_Chsoe, DouClik;
                  error = function (s) {
                      debugger;
                      return void 0;
                  };
                  if (attrs.iconExpand == null) {
                      attrs.iconExpand = 'icon-resize-vertical  glyphicon glyphicon-resize-vertical  fa fa-resize-vertical';
                  }
                  if (attrs.iconCollapse == null) {
                      attrs.iconCollapse = 'icon-plus indented fa fa-plus ';
                  }
                  if (attrs.iconLeaf == null) {
                      attrs.iconLeaf = ' fa fa-file font_20';
                  }
                  if (attrs.iconUncheck == null) {
                      attrs.iconUncheck = 'indented tree-icon icon-minus fa fa-minus';
                  }
                  if (attrs.expandLevel == null) {
                      attrs.expandLevel = '3';
                  }
                  expand_level = parseInt(attrs.expandLevel, 10);
                  if (!scope.treeData) {
                      scope.treeData = [];
                    //  return;
                  }
                  //if (scope.treeData.length == null) {
                  //    if (treeData.label != null) {
                  //        scope.treeData = [treeData];
                  //    } else {
                  //        console.log('数据必须是数组');
                  //        return;
                  //    }
                  //}
                  for_each_branch = function (f) {
                      var do_f, root_branch, _i, _len, _ref, _results;
                      do_f = function (branch, level) {
                          var child, _i, _len, _ref, _results;
                          f(branch, level);
                          if (branch.children != null) {
                              _ref = branch.children;
                              _results = [];
                              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                  //  console.log(_len);
                                  if (Object.prototype.toString.call(_ref[_i]) == "[object String]") {
                                      // console.log(_ref[_i]);
                                      //  child = _ref[_i].split(':')[0];
                                      child = _ref[_i];
                                      //  console.log(child);
                                      // branch.children[_i] = child;
                                      // console.log(branch.children);
                                      _results.push(do_f(child, level + 1));
                                      // console.log(branch)
                                  }
                                  else {
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
                  selected_branch = null;
                  select_branch = function (branch) {
                      if (!branch) {
                          if (selected_branch != null) {
                              selected_branch.selected = false;
                          }
                          selected_branch = null;
                          return;
                      }

                      if (selected_branch !== branch) {
                          if (selected_branch != null) {
                              selected_branch.selected = false;
                          }
                          //如果选择的节点已经选择
                          //console.log("Select_branch");
                          branch.selected = true;
                          selected_branch = branch;
                          if (branch.onSelect != null) {
                              return $timeout(function () {
                                  return branch.onSelect(branch);
                              });
                          } else {
                              if (scope.onSelect != null) {
                                  return $timeout(function () {
                                      // console.log(branch);
                                      return scope.onSelect({
                                          branch: branch
                                      });
                                  });
                              }
                          }
                      }
                  };
                  function initTreeSelect(branch_p, flag_P) {
                      if (!flag_P) {
                          if (branch_p.length == undefined) {
                              branch_p.length = 1;
                          }
                          for (var i = 0; i < branch_p.length; i++) {
                              if (branch_p[i].label != "全部") {
                                  if (branch_p[i].selected) {
                                      branch_p[i].selected = false;
                                  }
                              }
                              initTreeSelect(branch_p[i].children)
                          }
                          DouClik = false;
                      }

                  }

                  var timeduring;
                  scope.user_clicks_branch = function (branch) {
                      if (timeduring) {
                          $timeout.cancel(timeduring);
                      }
                      timeduring = $timeout(function () {
                          DouClik = true;
                          //if (attrs.iconCollapse == 'fa fa-cube font_24') {
                          return select_branch(branch);
                          //    }
                      }, 200)
                  };

                  scope.user_dbclicks_branch = function (branch) {
                      var flag = true;

                      if (branch.expanded) {
                          flag = false;
                          branch.expanded = flag;
                      }
                      else {
                          branch.expanded = flag;
                      }
                      for (var i = 0; i < branch.children.length; i++) {
                          if (branch.children[i].children.length > 0) {
                              childStates(branch.children[i], flag);
                          }
                      }
                  };
               function childStates(branch, flag) {
                      if (branch.expanded != flag) {
                          branch.expanded = flag;
                      }

                      for (var i = 0; i < branch.children.length; i++) {
                          if (branch.children[i].children.length > 0) {
                              childStates(branch.children[i], flag);
                          }
                      }
                  }


                  scope.tree_rows = [];
                  var exitsData = [];
                  var flagData = true;
                  function initData(treeNewData) {
                      flagData = true;;
                      for (var i = 0; i < exitsData.length; i++) {
                          if (exitsData[i] == treeNewData) {
                              flagData = false;
                          }
                      }

                      if (treeNewData[0].label != undefined) {
                          flagData = false;
                      }
                  }
                  var isfirst = true; //确保第一次展开父级
                  on_treeData_change = function () {
                      if (scope.treeData.length == 0) {
                          return;
                      }
                      initData(scope.treeData);
                      if (flagData) {
                          scope.treeData = ArrySort(scope.treeData);
                          exitsData.push(scope.treeData);
                      }
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
                      //    ArrySort(_ref);
                      return _results;
                  };
                  // scope.treeData[0].expanded = true;
                  scope.$watch('treeData', on_treeData_change, true);
                  n = scope.treeData.length;
                  //   console.log('num root branches3 = ' + n);
                  //for_each_branch(function(b, level) {
                  //  b.level = level;
                  //  return b.expanded = b.level < expand_level;
                  //});
                  if (scope.treeControl != null) {
                      if (angular.isObject(scope.treeControl)) {
                          tree = scope.treeControl;
                      }
                  }
                  //scope.user_clicks_branch(scope.treeData[0]);
                  // console.log(scope.treeData);
                  //2017.7.17
                  ///json字符串转化为json对象
                  function strToJson(str) {
                      //   console.log(str);
                      var json = eval('(' + str + ')');
                      return json;
                  }


                  function my_dataDesc(dataDesc, fff) {
                      if (fff == 1) {
                          return ',"children":[{"label":"' + dataDesc + '"}]';
                      }
                      else if (fff == 0) {
                          return ',{"label":"' + dataDesc + '"}';
                      }
                      else if (fff == -1) {
                          return ',{"label":"' + dataDesc + '"}';
                      }
                  }

                  function inset_falg(str, flag, data) {

                    var newstr = "";
                    var count = str.length;
                    var temF = str.substring(0, count-flag);
                    var temB = str.substring(count -flag,count );

                    newstr += temF + data + temB;

                    return newstr;
                }

  

                  function ArrySort(obj) {

                    if (obj[0].uname == '全部') {
                        if (!obj[0].uid) {
                            obj[0].uid = '000000000';
                        }
                        my_data = '[{"label":"全部:' + obj[0].uid + '"}';
                        obj.splice(0, 1);
                    } else {
                        my_data = '[{"label":"全部:000000000"}';
                    }
                    var newLength = my_data.length;
                    obj.forEach(function (item, index, arr) {
                        var flag = item.ujc;
                        var rowsData = '';
                        if (arr[index - 1] && (flag <= arr[index - 1].ujc)) {        ///确定在第几级   每级增加的}]  所以length=2 ， 当和 第一级同级时 往前推2 以此类推
                            rowsData = ',{"label": "' + $.trim(item.uname) + ':' + $.trim(item.uid) + '"}';
                            my_data = inset_falg(my_data, 2 * (flag), rowsData);
                        }
                        else {
                            rowsData = ',"children":[{"label":"' + $.trim(item.uname) + ':' + $.trim(item.uid) + '"}]';
                            my_data = inset_falg(my_data, 2 * (flag - 1) + 1, rowsData);  ///确定跳转下一级 需要向前跳过}
                        }
                    })
                    my_data += ']';
                    return JSON.parse(my_data);


                }











              }
          };
      }
    ]);


}).call(this);
