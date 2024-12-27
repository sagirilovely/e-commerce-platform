import express from 'express';
import users from "./usersRouter.js";
//引入各个子路由
const routers = express.Router(); //生成主路由器
//-----routers---------------
routers.use('/users', users);
//---------------------------
export default routers;
