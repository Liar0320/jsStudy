const sql = require('mssql');
const config = {
    user: 'sa',
    password: 'lch0320',
    server: 'localhost', 
    database: 'JX3_data',
    options: {
        encrypt: true //使用windows azure，需要设置次配置。
    }
};
const sqlPromise = sql.connect(config);
sqlPromise.then(()=>{
    return sql.query`select * from dbo.jx3_equip`
}).then(result =>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})
sqlPromise.then(()=>{
    return sql.query`select * from dbo.jx3_equip`
}).then(result =>{
    console.log(result);
}).catch(err=>{
    console.log(err);
})
sql.on('error',err=>{
    console.log(err);
})