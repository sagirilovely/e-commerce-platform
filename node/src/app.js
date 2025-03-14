//引入express以及相关的类型定义
import express from 'express';
//引入cors解决跨域问题
import cors from 'cors';
//引入cookie解析模块
import cookieParser from 'cookie-parser';
//引入JWT验证中间件
import verifyToken from './middlewares/authentication.js';
//拿到网络配置信息
import configMessage from './dev/nodeConfig.js';
//引入日志记录模块
import logger from "./dev/logger.js";
//解决前端history模式地址问题
import history from 'connect-history-api-fallback';
//引入主路由器
import routers from "./routers/index.js";
const { host, port } = configMessage.serveConfig;
const { originAllowed } = configMessage.originConfig;
//express构建app
let app = express();
// 使用cors模块解决跨域
app.use('/', cors({
    origin: (origin, callback) => {
        if (originAllowed.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'authentication', 'credentials', 'adminToken'], // 允许的请求头
    credentials: true, // 是否允许发送凭证（如 Cookies）
}));
//配置静态资源
let publicPath = configMessage.expressStatic.staticURL;
app.use('/public', express.static(publicPath));
//处理json格式的数据
app.use(express.json());
//处理表单提交的数据
app.use(express.urlencoded({ extended: true }));
//解析cookie数据
app.use(cookieParser());
//进入token验证中间件
app.use('/api/v1', verifyToken);
//进入index.js主路由器
app.use('/api/v1', routers);
//解决history模式地址问题
app.use(history());
//错误处理中间件
app.use((err, req, res, next) => {
    logger.error(err.message); //记录日志
    res.status(500).json({ error: err.message }); //给客户端返回错误状态信息
});
//启动服务器
app.listen(port, host, () => {
    logger.info(`服务器启动成功，地址为 http://${host}:${port}`);
});
