const express =require('express');
const assert=require('assert');
const app=express();
app.get('/api',(req, res, next)=>{
    res.send('hello')
})

app.listen(2233,()=>{
    console.log('server is running');
})

