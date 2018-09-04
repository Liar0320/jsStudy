/**
 * 行合并函数
 */
(function () {
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
	"use strict";
	angular.module("myToolDec", []).directive("decRowsMerge", function () {
		return {
			link: function (scope, elem, attrs) {
				var column = attrs.column;
				var index = attrs.index;
				var rows = attrs.decRowsMerge;
				// if (vaildExist()) return;
				// var rowsSpanCounts = 1;
				if (!column || !index || !rows) { return console.warn("合并行 绑定的参数不正确"); }
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
})();
