const express = require('express');
const path = require('path')
const http = require('http');
// const bodyParser = require('body-parser');
const app = express();
app.use(express.static(path.join(__dirname, './angular-liar')));
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
console.log(__dirname);
app.get('/',function(req,res){
    console.log('in');
    console.log(__dirname);
    res.sendfile('./angular-liar/Wframe/index.html');
});
app.post('/getdata',function(req,res){
    console.log('in',req.body);
    res.send("Hello world from CROS.😡"); 
});
app.listen('9191',function(){
    console.log('server is compiled host 9191');
})