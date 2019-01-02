const express = require('express')
var app = express();
app.get(/^(\/.+)*/,(req,res) =>{
    console.log(req);
    res.send(req.url);
})
//   /\/?.+?/
app.listen(3000,()=>console.log("server listening on 3000"));