'use strict';
// https://www.jianshu.com/p/287e0bb867ae  es6

// https://segmentfault.com/a/1190000008866165        结合microtask和macrotask理解event-loop

///-----------------------------------------------------------关于promise的学习
// https://www.jianshu.com/p/78c10239f852  https://zhuanlan.zhihu.com/p/25407758  浅析Promise用法
var _promise = new Promise(function (resolve, reject) {
    setTimeout(() => {
        reject(asyncGreet());
    }, 1000);
});
_promise.then(function (res) {
    console.log(res);
    return res;
}, function (erroe) {
    console.log('failed2222222', erroe);
});

_promise.then(function (res) {
    console.log(res);
}).catch(function (res) {
    console.log('failed', res);
});

var _promise2 = new Promise(function (resolve, reject) {
    return reject(2);
}).then(function (res) {
    return res;
});

const asyncGreet = function () {
    return 909;
};

let a = a => a * 2;
