"use strict";
exports.__esModule = true;
var _a;
var lib_1 = require("./lib");
var _b = [1, 2], a = _b[0], b = _b[1];
_a = [a, b], b = _a[0], a = _a[1];
function bubleSort(list) {
    var _a;
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] > list[i + 1]) {
                _a = [list[i + 1], list[i]], list[i] = _a[0], list[i + 1] = _a[1];
            }
        }
    }
}
var list = [1, 3, 4, 7, 4, 2, 5];
bubleSort(list);
console.log(list);
function printLabel(labelledObj) {
    console.log(labelledObj.label);
}
var myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
console.log(lib_1["default"].sum(1, 5));
