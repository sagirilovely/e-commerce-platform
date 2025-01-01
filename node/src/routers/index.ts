import express, {NextFunction, Request, Response} from 'express'
import configMessage from '../dev/nodeConfig.js'

import verifyRouter from "./verifyRouter.js";
import goodsRouter from "./goodsRouter.js"
//引入各个子路由

const routers = express.Router();//生成主路由器

//-----routers---------------
routers.use('/verify',verifyRouter);
routers.use('/goods',goodsRouter);
// routers.use('/merchandise',)
//---------------------------

export default routers;