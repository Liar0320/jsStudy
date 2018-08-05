const app = angular.module('app',['ui.select']);
app.controller('repeat',repeat);
repeat.$inject = ['$scope'];
function repeat($scope){
    $scope.itemArray = [
        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'},
    ];

    $scope.selected = { value: $scope.itemArray[0] };
}

/*
关于ui.select 指令  直接引入 可能会产生 模块加载问题   应该在每个 el指令 上 在加上 对应的class指令
ps:
    当报错Error: [ui.select:transcluded] Expected 1 .ui-select-match but got '0'.
	<ui-select class="ui-select mutiple-ui-select fr" name="position"  ng-model='formVal.position'  ng-disabled="status" validator='required' ng-change="shipPowerCtrl()">
        <ui-select-match class="ui-select-match">
            <span ng-bind="$select.selected.itemNameCn"></span>
        </ui-select-match>
        <ui-select-choices class="ui-select-choices" repeat="item.code as item in (original.positionList | filter: $select.search) track by item.code">
            <span ng-bind="item.itemNameCn"></span>
        </ui-select-choices>
    </ui-select>

如果通过懒加载 则无需 

    多选    
    <ui-select class="ui-select" multiple  ng-model="selected.value">
        <ui-select-match class="ui-select-match" placeholder="Select person...">
            {{$item.name}} &lt;1231&gt;
        </ui-select-match>
        <ui-select-choices class="ui-select-choices" repeat="item in (itemArray | filter: $select.search) track by item.id">
            <span ng-bind="item.name"></span>
        </ui-select-choices>
    </ui-select>

*/