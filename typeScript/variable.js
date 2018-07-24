"use strict";
let [a, b] = [1, 2];
[b, a] = [a, b];
function bubleSort(list) {
    for (let j = 0; j < list.length; j++) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] > list[i + 1]) {
                [list[i], list[i + 1]] = [list[i + 1], list[i]];
            }
        }
    }
}
let list = [1, 3, 4, 7, 4, 2, 5];
bubleSort(list);
console.log(list);
function printLabel(labelledObj) {
    console.log(labelledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
