import configMessage from "../dev/nodeConfig.js";
import jwt from "jsonwebtoken";
import {Response} from "express";
import logger from "../dev/logger.js";
const {secret,delay}=configMessage.authentication;

export default function setToken (res: Response,email:string,isLogout:boolean=false,isAdmin:boolean=false):void{
    const newToken = jwt.sign({userEmail: email}, secret, {expiresIn: delay});
    if(isAdmin){
        res.cookie('adminToken', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',//当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (delay)
        })
        if(isLogout){
            //注销
            res.cookie('adminToken', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',//当浏览器识别到是本站点时才会返回这个cookie
                maxAge: (1)
            })
        }
    }
    if(!isLogout){
        //登录
        res.cookie('authentication', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',//当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (delay)
        })
    }else{
        //注销
        res.cookie('authentication', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',//当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (1)
        })
    }
}