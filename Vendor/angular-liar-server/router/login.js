const db = require('../liarConfig/sqlServerMode');
function login(router,app,jwt){
  return router.post('/login',function(req,res){
        console.log('in',req.body);
        var receive = req.body;
        if(receive===undefined){
            res.send(false);
        }
        db.querySql(`select password from dbo.userInfo where id = ${receive['id']}`,'',(err,result) =>{
            console.log(result);
            if(!result||result.recordset.length !== 1){
                res.send(false);
            } else{
                var token = jwt.sign(receive,app.get('superSecret'),{
                    expiresIn:60*60*24
                });
                res.send({
                    bool:result.recordset[0]['password']+'' === receive['password']+'',
                    token
                });
            }
        })
    })
}
module.exports = login;