const express = require('express');
const path = require('path')
const http = require('http');
const routerCreate = require('./liarConfig/routerCreate');
const appConf = require('./liarConfig/appConf');

const router = express.Router();
const jwt = require('jsonwebtoken');
router.use((req, res, next)=>{
    // 拿取token 数据 按照自己传递方式写
    if(req.url=="/login"){
        next();
        return;
    }
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {      
        // 解码 token (验证 secret 和检查有效期（exp）)
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: '无效的token.' });    
            } else {
                // 如果验证通过，在req中写入解密结果
                req.decoded = decoded;  
                //console.log(decoded)  ;
                next(); //继续下一步路由
            }
        });
      } else {
        // 没有拿到token 返回错误 
        return res.status(403).send({ 
            success: false, 
            message: '没有找到token.' 
        });
      }
});








const app = express();
app.use(express.static(path.join(__dirname, './angular-liar')));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('superSecret',appConf.CONSTVALUE.jwtsecret);

routerCreate(app,router,jwt);

app.listen('9191',function(){
    console.log('server is compiled host 9191');
});


