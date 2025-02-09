import {Request, Response} from "express";
import createVerifyCode from "./createVerifyCode.js";
import sendEmail from "./sendEmail.js";
import jwt from "jsonwebtoken";
import configMessage from "../dev/nodeConfig.js";
const {secret} = configMessage.authentication;
const {host} = configMessage.serveConfig;
/**
 * 发送新的验证码
 * @param req Express请求对象
 * @param res Express响应对象
 * @param email 用户邮箱地址，可能未定义
 */
function sendNewCode(req: Request, res: Response,email:string|undefined){
    //生成一个验证码
    const newVerifyCode = createVerifyCode(6);
    //发送验证码
    sendEmail(email, '诺,这是你要的验证码', newVerifyCode,host)
        .then(() => {//发送成功
            //把验证码加密偷偷塞进cookie里
            let encodeVerifyCode = jwt.sign({newVerifyCode: newVerifyCode,userEmail:email}, secret, {expiresIn: '300s'});
            res.cookie('newVerifyCode', encodeVerifyCode, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',//当浏览器识别到是本站点时才会返回这个cookie
                maxAge: 300000
            })
            res.status(200).send(JSON.stringify({
                message: '验证码已发送'
            }))
        })
        .catch(() => {//发送失败
            res.status(500).send(JSON.stringify({
                message: '验证码发送失败,可能是邮箱有误'
            }))
        })
}
export default sendNewCode;