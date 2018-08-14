(function(angular){
    'use strict';
    angular.module("decSearchMod",[]).directive("decSearch",decSearchCtrl);
    //decSearchCtrl.$inject = ["$scope"];
    function decSearchCtrl(){
     //   console.log($scope);
        return{
            restrict:"AEC",
            templateUrl:"directive/searchCtrl/searchCtrl.html",
            scope:{
                decCallback:"&",
            },
            link:function(scope,elem,attr){
                console.log("link");
            },
            controllerAs:'vm',
            controller:function($scope){
                console.log("controller");
                var vm = this;
                vm.menuType = ['战略&目标任务','行政协同','党务工作'];
                		//筛选分类
                vm.searchData = [{
                    searchMenu: '战略&目标任务',
                    searchItems: [{
                        itemMenu: '战略规划&年度规划',
                        subItems: []
                    }, {
                        itemMenu: '调查研究',
                        subItems: []
                    }, {
                        itemMenu: '督查督办',
                        subItems: []
                    }, {
                        itemMenu: '公文办理',
                        subItems: []
                    }, {
                        itemMenu: '通知公告',
                        subItems: []
                    }]
                }, {
                    searchMenu: '行政协同',
                    searchItems: [{
                        itemMenu: '人事管理',
                        subItems: ['人才培养', '人事信息', '人员考勤', '绩效评价']
                    }, {
                        itemMenu: '财务&资产',
                        subItems: ['财务审批', '固定资产', '装备管理']
                    }, {
                        itemMenu: '具体事务',
                        subItems: ['会议管理', '网站管理', '统计管理', '后勤服务']
                    }]
                }, {
                    searchMenu: '党务工作',
                    searchItems: [{
                        itemMenu: '党群团建设',
                        subItems: []
                    }, {
                        itemMenu: '纪检监察',
                        subItems: []
                    }, {
                        itemMenu: '精神文明',
                        subItems: []
                    }]
                }];

                vm.setMenuParent = function(index,item){
                    vm.changeIndex = index;
                    vm.parentName = item;
                };
                //默认进来是菜单第一个，每次点击切换
                vm.setMenuParent(0, '战略&目标任务');


                vm.selected = {
                    '战略&目标任务':[],
                    '行政协同':[],
                    '党务工作':[]
                };

                //只有第二级菜单点击切换申请列表
                vm.changeApply = function(event,parent,item,type) {
                    stopBubble(event);
                    if(!type) return ;
                    if(type === 'add') {
                        vm.selected[parent].push(item);
                        if($scope.decCallback)$scope.decCallback({item:vm.selected});
                    } else if(type ==='delete') {
                        var index = vm.selected[parent].indexOf(item);
                        if(index === -1) return ;
                        vm.selected[parent].splice(index,1);
                        if($scope.decCallback)$scope.decCallback({item:vm.selected});
                    }
                    console.log(vm.selected);
                    if(isEmptySelected(vm.selected))vm.changeStatus(true);
                };

                function isEmptySelected(selected){
                    var isEmpty = false;
                    for (var i = 0; i < vm.menuType.length; i++) {
                       isEmpty = selected[vm.menuType[i]].length > 0; 
                       if(isEmpty) return !isEmpty;
                    }
                    return !isEmpty;
                }

                //阻止冒泡事件
                //在ie下cancelbubble  不支持stoppropagation
                function stopBubble(event) {
                    if (event.stopPropagation) {
                    event.stopPropagation();
                    } else {
                    event.cancelBubble = true;
                    }
                }
                vm.isSelected = function(parentName,item){
                    return vm.selected[parentName].indexOf(item) >-1 ;
                };
                vm.changeStatus = function(isStatus){
                    var result;
                    if(isStatus){
                        result = {};
                        for (var j = 0; j < vm.searchData.length; j++) {
                            var key =  vm.searchData[j].searchMenu;
                            var temp = vm.searchData[j].searchItems;
                            result[key] = [];
                            for (var i = 0; i < temp.length; i++) {
                                if(temp[i].subItems.length === 0){
                                    result[key].push(temp[i].itemMenu);
                                }else{
                                    result[key] = result[key].concat(temp[i].subItems)
                                }
                            }                        
                        }
                    }


                    if($scope.decCallback)$scope.decCallback({item:result || vm.selected});
                };
            },
            replace:true
        };
    }
})(angular);