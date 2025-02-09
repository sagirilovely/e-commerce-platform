import express from "express";
import verifyController from "../controllers/verifyController.js";
import configMessage from "../dev/nodeConfig.js";
import { createUpload } from "../middlewares/multer.js";
const routers = express.Router();
const { staticURL } = configMessage.expressStatic;
const userUpload = createUpload("profile");
routers.post("/register", userUpload.single("userProfile"), verifyController.createUser); //客户端提交注册信息
routers.post("/login/password", verifyController.loginByPassword); //客户端提交账密登录
routers.post("/login/code", verifyController.loginByCode); //客户端提交帐号验证码登录
//-----商家注册与登录
routers.post('/merchant/register', userUpload.single("userProfile"), verifyController.createMerchant);
routers.post('/merchant/login/password', verifyController.merchantLoginByPassword);
routers.post('/merchant/login/code', verifyController.merchantLoginByCode);
routers.post('/admin', verifyController.adminLogin);
export default routers;
