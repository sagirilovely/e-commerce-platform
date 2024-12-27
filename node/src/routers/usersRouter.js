import express from 'express';
import usersRouter from '../controllers/usersController.js';
// import saveFile from "../middlewares/multer.js";
import configMessage from "../dev/nodeConfig.js";
import { createUpload } from "../middlewares/multer.js";
const routers = express.Router();
const { staticURL } = configMessage.expressStatic;
const userUpload = createUpload('profile');
routers.post('/register', userUpload.single('userProfile'), usersRouter.createUser); //客户端提交注册信息
routers.post('/login', usersRouter.putInformation); //客户端提交登录信息
routers.get('/information', usersRouter.getUInformation); //客户端获取个人信息
routers.post('/information', usersRouter.updateInformation); //客户端修改个人信息
export default routers;
