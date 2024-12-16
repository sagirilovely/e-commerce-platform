var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

//密钥：zOyNSLMTQdgeacbl7ARSwWuUaF
let weather=require('./routes/weather');
let almanac=require('./routes/almanac');
let analysisDream=require('./routes/analysisDream');
let historyToday=require('./routes/historyToday');
let locations=require('./routes/location');
// 配置ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//配置从前端拿到的json和form数据的解析工具
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//配置开发者日志工具
app.use(logger('dev'));
//配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
//配置跨域请求
app.use('/',(req,res,next)=>{
  //允许跨域
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
})

app.use('/api/weather',weather)//获取天气
app.use('/api/historyToday',historyToday)//获取历史上的今天
app.use('/api/almanac',almanac)//获取黄历
app.use('/api/analysisDream',analysisDream)//获取解梦
app.use('/api/location',locations)//获取用户地理位置


// 404页面
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误页面渲染
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(2233,()=>{
  console.log('serve is running port is :2233');
})

module.exports = app;
