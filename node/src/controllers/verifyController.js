import verifyModel from "../models/verifyModel.js";
import jwt from 'jsonwebtoken';
import configMessage from "../dev/nodeConfig.js";
import logger from "../dev/logger.js";
import createHashPassword from "../util/createHashPassword.js";
import path from "path";
import setToken from "../util/setToken.js";
import sendNewCode from "../util/sendNewCode.js";
import userModel from '../models/userModel.js';
const saveUserInformation = verifyModel.saveUserInformation;
const getHashPassword = verifyModel.getHashPassword;
const { secret } = configMessage.authentication;
const { host } = configMessage.serveConfig;
const { staticURL } = configMessage.expressStatic;
export default {
    //用户注册
    createUser: (req, res, next) => {
        const email = req.body.userEmail; //用户提交的 邮箱
        const verifyCode = req.body.verifyCode; //用户提交的 验证码
        //向数据库查询,该邮箱是否存在
        verifyModel.isEmailExist(email)
            .then((value) => {
            if (value) {
                //邮箱已存在,用户应当直接去登录
                res.status(409).send(JSON.stringify({
                    message: '账号已存在',
                }));
            }
            else if (!verifyCode) {
                //确认是新邮箱,用户发验证码过来,说明是要一个验证码
                sendNewCode(req, res, email);
            }
            else if (verifyCode) {
                //用户带了一个验证码来,从cookie与body中拿到验证码检查是否匹配
                const cookieVerifyCode = req.cookies.newVerifyCode;
                jwt.verify(cookieVerifyCode, secret, (error, decoded) => {
                    if (error) {
                        //cookie里有但过期
                        res.status(401).send(JSON.stringify({ message: '验证码已过期' }));
                    }
                    else {
                        if ((decoded.newVerifyCode === verifyCode) && (decoded.userEmail === req.body.userEmail)) {
                            //验证码验证成功,开始将用户数据写入数据库
                            if (!req.file) {
                                return res.status(400).send({ message: '头像未上传' });
                            }
                            const time = new Date();
                            const userInfo = {
                                email: req.body.userEmail,
                                password: createHashPassword(req.body.userPassword),
                                created_time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
                                profile_photo: `${req.body.userEmail}${path.extname(req.file.originalname)}`,
                                nickname: req.body.userNickname
                            };
                            saveUserInformation(userInfo)
                                .then((value) => {
                                res.status(201).send({ message: '注册成功' });
                            })
                                .catch((err) => {
                                res.status(500).send({ message: '注册失败' });
                            });
                        }
                        else {
                            if (decoded.newVerifyCode !== verifyCode) {
                                res.status(401).send(JSON.stringify({
                                    message: '验证码错误'
                                }));
                            }
                            else {
                                res.status(401).send(JSON.stringify({
                                    message: '邮箱与之前的不一致'
                                }));
                            }
                        }
                    }
                });
            }
        });
    },
    //用户使用账密登录
    loginByPassword: (req, res) => {
        const email = req.body.userEmail;
        const password = req.body.userPassword;
        if (!email || !password) {
            res.status(401).send(JSON.stringify({
                message: '账号或密码为空'
            }));
        }
        else {
            getHashPassword(email)
                .then((value) => {
                if (value) { //拿到hash密码
                    const hashPassword = createHashPassword(password);
                    if (value === hashPassword) { //密码正确
                        setToken(res, email);
                        res.status(201).send(JSON.stringify({
                            message: '登录成功'
                        }));
                    }
                    else {
                        res.status(401).send(JSON.stringify({
                            message: '账号与密码不匹配'
                        }));
                    }
                }
                else { //返回的undefined,说明没有该账户
                    res.status(401).send(JSON.stringify({
                        message: '账号不存在'
                    }));
                }
            })
                .catch((err) => {
                res.status(401).send(JSON.stringify({
                    message: '后台错误,请稍后重试'
                }));
            });
        }
    },
    //用户使用账号验证码登录
    loginByCode: async (req, res) => {
        const email = req.body.userEmail;
        const bodyCode = req.body.verifyCode;
        const cookieCode = req.cookies.newVerifyCode;
        let isGetCode = req.body.isGetCode;
        isGetCode = (isGetCode === 'true');
        const isEmailExist = await verifyModel.isEmailExist(email);
        if (!isEmailExist) {
            res.status(401).json({
                message: '该邮箱还未注册'
            });
            return;
        }
        if (isGetCode) { //用户是要一个验证码,接下来应该发送一个验证码
            console.log('发送验证码');
            sendNewCode(req, res, email);
        }
        else { //用户已经拿到了验证码,接下来进行验证
            jwt.verify(cookieCode, secret, (error, decoded) => {
                if (error) {
                    //cookie里有但过期
                    res.status(401).send(JSON.stringify({ message: '验证码已过期' }));
                }
                else { //cookie里的验证码没动过手脚,开始对比body的 邮箱 验证码 与cookie的是否一致
                    if ((decoded.newVerifyCode === bodyCode) && (decoded.userEmail === email)) { //全部一致,则成功登录
                        setToken(res, email);
                        res.status(201).send(JSON.stringify({
                            message: '登录成功'
                        }));
                    }
                    else {
                        res.status(401).send(JSON.stringify({
                            message: '验证码错误'
                        }));
                    }
                }
            });
        }
    },
    createMerchant: (req, res) => {
        //1. 从body中获取验证码,若为空则发送新验证码到邮箱
        //2. 若不为空,则验证验证码是否正确,正确则创建商户
        const verifyCode = req.body.verifyCode;
        if (!verifyCode) {
            //发送新验证码
            sendNewCode(req, res, req.body.userEmail);
            return;
        }
        else {
            //验证验证码
            jwt.verify(req.cookies.newVerifyCode, secret, (error, decoded) => {
                if (error) {
                    res.status(401).send(JSON.stringify({ message: '验证码已过期' }));
                }
                else {
                    if (decoded.newVerifyCode === verifyCode && decoded.userEmail === req.body.userEmail) {
                        //验证码正确,创建商户
                        if (!req.file) {
                            res.status(401).send(JSON.stringify({ message: '头像为空' }));
                            return;
                        }
                        const time = new Date();
                        const userInfo = {
                            email: req.body.userEmail,
                            password: createHashPassword(req.body.userPassword),
                            created_time: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
                            profile_photo: `${req.body.userEmail}${path.extname(req.file.originalname)}`,
                            nickname: req.body.userNickname
                        };
                        userModel.createMerchant(userInfo)
                            .then((value) => {
                            if (value) {
                                res.status(201).send(JSON.stringify({ message: '创建成功' }));
                            }
                            else {
                                res.status(401).send(JSON.stringify({ message: '账户可能已经存在' }));
                            }
                        })
                            .catch((err) => {
                            logger.error('商家注册失败');
                        });
                    }
                    else {
                        //验证码错误
                        res.status(401).send(JSON.stringify({ message: '验证码错误' }));
                    }
                }
            });
        }
    },
    merchantLoginByPassword: async (req, res) => {
        //商家密码登录
        const userEmail = req.body.userEmail;
        let userPassword = req.body.userPassword;
        //取出账密,将密码转为hash与数据库的hash对比;正确则写入token
        if (!userEmail || !userPassword) {
            //密码为空
            res.status(401).json({ "message": "账号或密码为空" });
            return;
        }
        userPassword = createHashPassword(userPassword);
        const isPass = await userModel.merchantLoginByPassword(userEmail, userPassword);
        if (isPass) {
            //密码正确
            setToken(res, userEmail);
            res.status(201).json({ "message": "登录成功" });
        }
        else {
            res.status(401).json({ "message": "账号与密码不匹配" });
        }
    },
    merchantLoginByCode: (req, res) => {
        //商家验证码登录
        const verifyCodeBody = req.body.verifyCode;
        const userEmail = req.body.userEmail;
        if (!userEmail) {
            res.status(401).json({ "message": "邮箱为空" });
            return;
        }
        if (!verifyCodeBody) {
            //若body没有带verifyCode则说明是要一个验证码
            sendNewCode(req, res, userEmail);
            return;
        }
        jwt.verify(req.cookies.newVerifyCode, secret, (error, decoded) => {
            if (!error) {
                if (decoded.newVerifyCode === verifyCodeBody && decoded.userEmail === userEmail) {
                    //验证码正确
                    setToken(res, userEmail);
                    res.status(201).json({ "message": "登录成功" });
                    return;
                }
                else {
                    //验证码错误
                    res.status(401).json({ "message": "验证码错误" });
                    return;
                }
            }
            else {
                //验证码过期
                res.status(401).json({ "message": "验证码已过期" });
                return;
            }
        });
    },
    adminLogin: (req, res) => {
        const email = req.body.userEmail;
        const password = req.body.userPassword;
        if (!email && !password) {
            //账号或密码为空
            res.status(401).json({ "message": "账号或密码为空" });
            return;
        }
        userModel.adminLogin(email, createHashPassword(password))
            .then((value) => {
            if (value) {
                setToken(res, email);
                res.status(201).json({ "message": "登录成功" });
                return;
            }
            else {
                res.status(401).json({ "message": "账号或密码错误" });
                return;
            }
        })
            .catch((err) => {
            logger.error('管理员登录失败');
            res.status(401).json({ "message": "账号或密码错误" });
            return;
        });
    }
};
