import usersModel from "../models/usersModel.js";
import userModels from "../models/usersModel.js";
import createVerifyCode from "../util/createVerifyCode.js";
import jwt from 'jsonwebtoken';
import configMessage from "../dev/nodeConfig.js";
import sendEmail from "../util/sendEmail.js";
import logger from "../dev/logger.js";
import createHashPassword from "../util/createHashPassword.js";
import path from "path";
const saveUserInformation = userModels.saveUserInformation;
const { secret } = configMessage.authentication;
const { host } = configMessage.serveConfig;
const { staticURL } = configMessage.expressStatic;
export default {
    //用户注册
    createUser: (req, res, next) => {
        const email = req.body.userEmail; //用户提交的 邮箱
        logger.info(req.body.userEmail);
        const verifyCode = req.body.verifyCode; //用户提交的 验证码
        logger.info('用户提交的验证码' + verifyCode);
        let newVerifyCode; //存放新的验证码
        //向数据库查询,该邮箱是否存在
        usersModel.isEmailExist(email)
            .then((value) => {
            if (!value) {
                //邮箱已存在,用户应当直接去登录
                res.status(409).send(JSON.stringify({
                    message: '账号已存在',
                }));
            }
            else if (!verifyCode) {
                //确认是新邮箱,用户发验证码过来,说明是要一个验证码
                //生成一个验证码
                newVerifyCode = createVerifyCode(6);
                //发送验证码
                sendEmail(email, '诺,这是你要的验证码', newVerifyCode, host)
                    .then(() => {
                    //把验证码加密偷偷塞进cookie里
                    let encodeVerifyCode = jwt.sign({ newVerifyCode: newVerifyCode, usrEmail: email }, secret, { expiresIn: '300s' });
                    res.cookie('newVerifyCode', encodeVerifyCode, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict', //当浏览器识别到是本站点时才会返回这个cookie
                        maxAge: 300000
                    });
                    res.status(200).send(JSON.stringify({
                        message: '验证码已发送'
                    }));
                })
                    .catch(() => {
                    res.status(500).send(JSON.stringify({
                        message: '验证码发送失败,可能是邮箱有误'
                    }));
                });
            }
            else if (verifyCode) {
                //用户带了一个验证码来,从cookie与body中拿到验证码检查是否匹配
                const cookieVerifyCode = req.cookies.newVerifyCode;
                logger.info("cookie里的验证码:" + cookieVerifyCode);
                jwt.verify(cookieVerifyCode, secret, (error, decoded) => {
                    if (error) {
                        //cookie里有但过期
                        res.status(401).send(JSON.stringify({ message: '验证码已过期' }));
                    }
                    else {
                        if ((decoded.newVerifyCode === verifyCode) && (decoded.usrEmail === req.body.userEmail)) {
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
                            logger.info(JSON.stringify(userInfo));
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
    //用户登录
    putInformation: (req, res) => {
    },
    //获取用户信息
    getUInformation: (req, res) => {
    },
    //更新用户信息
    updateInformation: (req, res) => {
    },
};
