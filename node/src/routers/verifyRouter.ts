import express from "express";
import verifyRouter from "../controllers/verifyController.js";
import configMessage from "../dev/nodeConfig.js";
import { createUpload } from "../middlewares/multer.js";

const routers = express.Router();
const { staticURL } = configMessage.expressStatic;

const userUpload = createUpload("profile");
routers.post(
  "/register",
  userUpload.single("userProfile"),
  verifyRouter.createUser
); //客户端提交注册信息
routers.post("/login/password", verifyRouter.loginByPassword); //客户端提交账密登录
routers.post("/login/code", verifyRouter.loginByCode); //客户端提交帐号验证码登录

export default routers;
