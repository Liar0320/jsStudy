const sqlConfig = {
    user: 'sa',
    password: 'lch0320', 
    server: 'localhost', 
    database: 'liar',
    options: {
     //   encrypt: true //使用windows azure，需要设置次配置。
    }
};
const CONSTVALUE = {
    jwtsecret: 'liarJwt',
};
module.exports = {
    sqlConfig,
    CONSTVALUE,
};