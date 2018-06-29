const login = require('../router/login');
const menuList = require('../router/menuList');
module.exports = (app,router,jwt)=>{
    app.get('/',function(req,res){
        res.sendfile('./angular-liar/Wframe/index.html');
    }),
    app.post('/userInfo',login(router,app,jwt)),
    app.post('/login',login(router,app,jwt)),
    app.get('/menuList',menuList(router,app,jwt))
};