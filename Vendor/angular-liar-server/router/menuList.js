const db = require('../liarConfig/sqlServerMode');
function menuList(router,app,jwt){
  function transferMenu(record){
    var _record = [];
    record.reduce((result,item)=>{
        if(item.parentId === ''){
            result.push(item);
        }else{
            for(let i = 0;i<result.length;i++){
                if(result[i].menuId == item.parentId){
                   if(result[i].children === undefined )result[i].children = [];
                   result[i].children.push(item);
                }
            }
        }
        return result;
    },_record)
    return _record;
  }

  return router.get('/menuList',function(req,res){
        var receive = req.body;
        if(receive===undefined){
            res.send(false);
        }
        db.querySql(`select * from dbo.menuList`,'',(err,result) =>{
            console.log(result);
            if(!result){
                res.send(false);
            } else{
                var data = result.recordset;

                res.send({
                    record:transferMenu(data)
                });
            }
        })
    })
}
module.exports = menuList;