import express from 'express';
import verify from "./verifyRouter.js";
"./goodsRouter.js";
//引入各个子路由
const routers = express.Router(); //生成主路由器
//-----routers---------------
routers.use('/verify', verify);
//---------------------------
export default routers;
