import express from 'express';
import verifyRouter from "./verifyRouter.js";
import goodsRouter from "./goodsRouter.js";
import merchandiseRouter from "./merchandiseRouter.js";
import userRouter from "./userRouter.js";
import orderRouter from "./orderRouter.js";
//引入各个子路由
const routers = express.Router(); //生成主路由器
//-----routers---------------
routers.use('/verify', verifyRouter);
routers.use('/goods', goodsRouter);
routers.use('/merchandise', merchandiseRouter);
routers.use('/user', userRouter);
routers.use('/order', orderRouter);
//---------------------------
export default routers;
