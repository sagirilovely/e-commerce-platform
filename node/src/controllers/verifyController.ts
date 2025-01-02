//引入express以及相关的类型定义
import {NextFunction, Request, Response} from 'express';

import verifyModel from "../models/verifyModel.js";
import createVerifyCode from "../util/createVerifyCode.js";
import jwt, {VerifyErrors} from 'jsonwebtoken'
import configMessage from "../dev/nodeConfig.js";
import sendEmail from "../util/sendEmail.js";
import logger from "../dev/logger.js";
import createHashPassword from "../util/createHashPassword.js";
import path from "path";
import setToken from "../util/setToken.js";
import sendNewCode from "../util/sendNewCode.js";

const saveUserInformation = verifyModel.saveUserInformation;
const getHashPassword =verifyModel.getHashPassword;

interface UserInfo {
    email: string;
    password: string;
    created_time: string;
    profile_photo: string;
    nickname: string;
}

const {secret} = configMessage.authentication;
const {host} = configMessage.serveConfig;
const {staticURL} = configMessage.expressStatic

export default {
    //用户注册
    createUser: (req: Request, res: Response, next: NextFunction) => {
        const email: string | undefined = req.body.userEmail;//用户提交的 邮箱
        const verifyCode: string | undefined = req.body.verifyCode;//用户提交的 验证码
        //向数据库查询,该邮箱是否存在
        verifyModel.isEmailExist(email)
            .then((value) => {
                if (!value) {
                    //邮箱已存在,用户应当直接去登录
                    res.status(409).send(JSON.stringify({
                        message: '账号已存在',
                    }))
                } else if (!verifyCode) {
                    //确认是新邮箱,用户发验证码过来,说明是要一个验证码
                    sendNewCode(req,res,email);
                } else if (verifyCode) {
                    //用户带了一个验证码来,从cookie与body中拿到验证码检查是否匹配
                    const cookieVerifyCode = req.cookies.newVerifyCode;
                    jwt.verify(cookieVerifyCode, secret, (error: VerifyErrors | null, decoded: any) => {
                        if (error) {
                            //cookie里有但过期
                            res.status(401).send(JSON.stringify({message: '验证码已过期'}))
                        } else {
                            if ((decoded.newVerifyCode === verifyCode) && (decoded.userEmail===req.body.userEmail)) {
                                //验证码验证成功,开始将用户数据写入数据库
                                if (!req.file) {
                                    return res.status(400).send({message: '头像未上传'});
                                }
                                const time = new Date();
                                const userInfo: UserInfo = {
                                    email: req.body.userEmail,
                                    password: createHashPassword(req.body.userPassword),
                                    created_time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
                                    profile_photo: `${req.body.userEmail}${path.extname(req.file.originalname)}`,
                                    nickname: req.body.userNickname
                                };
                                saveUserInformation(userInfo)
                                    .then((value) => {
                                        res.status(201).send({message: '注册成功'});
                                    })
                                    .catch((err) => {
                                        res.status(500).send({message: '注册失败'});
                                    });
                            } else {
                                    if(decoded.newVerifyCode !== verifyCode){
                                        res.status(401).send(JSON.stringify({
                                            message: '验证码错误'
                                        }))
                                    }else{
                                        res.status(401).send(JSON.stringify({
                                            message: '邮箱与之前的不一致'
                                        }))
                                    }

                            }
                        }
                    })
                }
            })
    },

    //用户使用账密登录
    loginByPassword: (req: Request, res: Response) => {
        const email=req.body.userEmail;
        const password=req.body.userPassword;
        if(!email || !password){
            res.status(401).send(JSON.stringify({
                message:'账号或密码为空'
            }));
        }else{
            getHashPassword(email)
                .then((value)=>{
                    if(value){//拿到hash密码
                        const hashPassword:string=createHashPassword(password);
                        if(value===hashPassword){//密码正确
                            setToken(res,email);

                            res.status(201).send(JSON.stringify({
                                message:'登录成功'
                            }))
                        }else{
                            res.status(401).send(JSON.stringify({
                                message:'账号与密码不匹配'
                            }))
                        }
                    }else{//返回的undefined,说明没有该账户
                        res.status(401).send(JSON.stringify({
                            message:'账号不存在'
                        }))
                    }
                })
                .catch((err)=>{
                    res.status(401).send(JSON.stringify({
                        message:'后台错误,请稍后重试'
                    }))
                })
        }
    },
    //用户使用账号验证码登录
    loginByCode: (req: Request, res: Response) => {
        const email=req.body.userEmail;
        const bodyCode=req.body.verifyCode;
        const cookieCode=req.cookies.newVerifyCode;
        if(!bodyCode && !cookieCode){//用户是要一个验证码,接下来应该发送一个验证码
            sendNewCode(req,res,email);
        }
        if (bodyCode && cookieCode){//用户已经拿到了验证码,接下来进行验证
            jwt.verify(cookieCode, secret, (error: VerifyErrors | null, decoded: any) => {
                if (error) {
                    //cookie里有但过期
                    res.status(401).send(JSON.stringify({message: '验证码已过期'}))
                }else{//cookie里的验证码没动过手脚,开始对比body的 邮箱 验证码 与cookie的是否一致
                    if((decoded.newVerifyCode === bodyCode) && (decoded.userEmail===email)){//全部一致,则成功登录
                        setToken(res,email);
                        res.status(201).send(JSON.stringify({
                            message:'登录成功'
                        }))
                    }else{
                        res.status(401).send(JSON.stringify({
                            message:'验证码错误'
                        }))
                    }
                }
            })
        }
        if(bodyCode && !cookieCode){//用户还没拿到验证码
            res.status(401).send(JSON.stringify({
                message:'系统还未发送验证码'
            }))
        }
        if(!bodyCode && cookieCode){//用户拿到了一个验证码,但提交的是空的验证码
            res.status(401).send(JSON.stringify({
                message:'验证码错误'
            }))
        }
    }
}
