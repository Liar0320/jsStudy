const express = require('express');
const path = require('path')
const http = require('http');
const app = express();
app.use(express.static(path.join(__dirname, './angularjs-liar')));
console.log(__dirname);
app.get('/*',function(req,res){
    console.log('in');
    console.log(__dirname);
    res.sendfile('./angularjs-liar/Wframe/index.html');
})
app.listen('9191',function(){
    console.log('server is compiled');
})