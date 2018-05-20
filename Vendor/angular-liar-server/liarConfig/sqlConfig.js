//封装sql查询方法 
//直接查询 
//查询存储过程
const mssql = require('mssql');
const sqlConfig = {
    user: 'sa',
    password: 'lch0320', 
    server: 'localhost', 
    database: 'liar',
    options: {
      //  encrypt: true //使用windows azure，需要设置次配置。
    }
};

const sql = {};

const sqlPool = new mssql.ConnectionPool(sqlConfig);

sqlPromise = sqlPool.connect('error',err=>{
    console.log(err);
});





module.exports = (sqlText)=>{
    return sqlPromise.then(pool=>{
        return pool.request().query(sqlText);
    })
}

