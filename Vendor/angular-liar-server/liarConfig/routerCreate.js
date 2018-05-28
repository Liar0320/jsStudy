const login = require('../router/login');
module.exports = (app,router,jwt)=>{
    app.get('/',function(req,res){
        res.sendfile('./Vendor/angular-liar-server/angular-liar/Wframe/index.html');
    }),
    app.post('/userInfo',login(router,app,jwt)),
    app.post('/login',login(router,app,jwt))
};