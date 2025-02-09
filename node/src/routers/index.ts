import express, {NextFunction, Request, Response} from 'express'
import configMessage from '../dev/nodeConfig.js'

import verifyRouter from "./verifyRouter.js";
import goodsRouter from "./goodsRouter.js"
import merchandiseRouter from "./merchandiseRouter.js"
import userRouter from "./userRouter.js";
import orderRouter from "./orderRouter.js";
import commentsRouter from "./commentsRouter.js";
import merchantsRouter from './merchantsRouter.js'
//引入各个子路由

const routers = express.Router();//生成主路由器

//-----routers---------------
routers.use('/verify',verifyRouter);
routers.use('/goods',goodsRouter);
routers.use('/merchandise',merchandiseRouter);
routers.use('/user',userRouter);
routers.use('/order',orderRouter);
routers.use('/comments',commentsRouter);
routers.use('/merchant',merchantsRouter);
//---------------------------

export default routers;