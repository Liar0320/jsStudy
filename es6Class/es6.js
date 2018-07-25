'use strict';
// 转码结果输出到标准输出
// babel example.js

// # 转码结果写入一个文件
// # --out-file 或 -o 参数指定输出文件
// babel example.js --out-file compiled.js
// # 或者
// babel example.js -o compiled.js

// # 整个目录转码
// # --out-dir 或 -d 参数指定输出目录
// babel src --out-dir lib
// # 或者
// babel src -d lib

// # -s 参数生成source map文件
// babel src -d lib -s
// https://www.jianshu.com/p/287e0bb867ae  es6

// https://segmentfault.com/a/1190000008866165        结合microtask和macrotask理解event-loop

///-----------------------------------------------------------关于promise的学习
// https://www.jianshu.com/p/78c10239f852  https://zhuanlan.zhihu.com/p/25407758  浅析Promise用法
var _promise = new Promise(function(resolve,reject){
    setTimeout(() => {
        reject(asyncGreet());
    }, 1000);
})
_promise.then(function(res){
    console.log(res);
    return res;
},function(erroe){
    console.log('failed2222222',erroe);
})

_promise.then(function(res){
          console.log(res)
        })
        .catch(function(res){
            console.log('failed',res)
        })

var _promise2 = new Promise(function(resolve,reject){
  return reject(2);
}).then(function(res){
    return res;
})


const asyncGreet = function (){
    return 909;
}

let a = a=>a*2




