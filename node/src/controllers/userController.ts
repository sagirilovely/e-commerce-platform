import { Request, Response } from "express";
import userModel from "../models/userModel.js";
import logger from "../dev/logger.js";
import sendNewCode from "../util/sendNewCode.js";
import jwt from "jsonwebtoken";
import configMessage from "../dev/nodeConfig.js";
import createHashPassword from "../util/createHashPassword.js";
const {secret}=configMessage.authentication;
export default {
 updateUserTrolley:(req:Request,res:Response)=>{
     const goods_id=req.body.goods_id;
     const goods_count=req.body.goods_count;
     const userEmail=res.userEmail;
     if(!(goods_id) || !(goods_count) || !(userEmail) ){
         res.status(500).json({message:"放入购物车失败"});
         return;
     }
     userModel.updateUserTrolley(userEmail,goods_id,goods_count)
         .then((value)=>{
             if(value){
                 res.status(200).json({
                     message:"商品已放入购物车"
                 })
             }else{
                 res.status(500).json({
                     message:"放入购物车失败"
                 })
             }
         })
         .catch((err)=>{
             logger.error(err)
             res.status(500).json({
                 message:"放入购物车失败"
             })
         })
 },
    getUserTrolley:(req:Request,res:Response)=>{
        const userEmail=res.userEmail;
        if(!(userEmail)){
            res.status(500).json({
                message:"查询失败"
            })
            return;
        }
        userModel.getUserTrolleyDetail(userEmail)
            .then((value)=>{
                if(value){
                    res.status(200).json({
                        message:"成功返回购物车信息",
                        data:value
                    })
                }else{
                    if(value===0){
                        res.status(403).json({
                            message:"购物车为空"
                        })
                        return;
                    }
                    res.status(500).json({
                        message:"查询失败"
                    })
                }
            }).catch((err)=>{
                logger.error(err)
            res.status(500).json({
                message:"查询失败"
            })
        })

    },
    getUserAddress:(req:Request,res:Response)=>{
        const userEmail=res.userEmail;
        if(!(userEmail)){
            res.status(403).json({
                message:"未登录"
            })
            return;
        }
        userModel.getUserAddress(userEmail)
            .then((value)=>{
                if(value){
                    res.status(200).json({
                        "message":"成功拿到用户收货地址",
                        data:value
                    })
                }else{
                    if(value===0){
                        res.status(403).json({
                            message:"该用户没有设置收货地址"
                        })
                        return;
                    }else{
                        res.status(500).json({
                            message:"服务器出错"
                        })
                    }
                }
            })
            .catch((err)=>{
                logger.error(err)
                res.status(500).json({
                    message:"服务器出错"
                })
            })

    },
    updateUserAddress:(req:Request,res:Response)=>{
        const recipient=req.body.recipient;
        const phone_number=req.body.phone_number;
        const country=req.body.country;
        const province=req.body.province;
        const city=req.body.city;
        const detail = req.body.detail;
        const userEmail=res.userEmail;
        if(!(recipient) || !(phone_number) || !(country) || !(province) || !(city) || !(detail) || !(userEmail)){
            res.status(403).json({
                message:"更新地址失败"
            })
            return;
        }
        const address={
            recipient,
            phone_number,
            country,
            province,
            city,
            detail
        }
        userModel.updateUserAddress(userEmail,JSON.stringify(address))
            .then((value)=>{
                if(value){
                    res.status(200).json({
                        message:"更新地址成功"
                    })
                }else{
                    res.status(403).json({
                        message:"更新地址失败"
                    })
                }
            })
            .catch((err)=>{
                logger.error(err)
                res.status(500).json({
                    message:"服务器出错"
                })
            })
    },
    getPasswordCode:(req:Request,res:Response)=>{
     if(!res.userEmail){
         res.status(403).json({
             message:"未登录"
         })
         return;
     }
        sendNewCode(req,res,res.userEmail);
    },
    updatePassword:(req:Request,res:Response)=>{
        jwt.verify( req.cookies.newVerifyCode, secret,(error: jwt.VerifyErrors | null, decoded: any)=>{
            if(!res.userEmail){
                res.status(403).json({
                    message:"未登录"
                })
                return;
            }
            if(error){
                res.status(401).json({
                    message:"验证码错误或过期"
                })
                return;
            }else{
                if(req.body.code===decoded.newVerifyCode && decoded.userEmail===res.userEmail){
                    //验证码正确,修改数据库中的密码
                    userModel.updatePassword(res.userEmail,createHashPassword(req.body.password))
                        .then((value)=>{
                            if(value){
                                //清空cookie中的验证码
                                res.clearCookie("newVerifyCode");
                                res.status(200).json({
                                    message:"修改密码成功"
                                })
                            }else{
                                res.status(500).json({
                                    message:"修改密码失败"
                                })
                            }
                        }).catch((err)=>{
                            logger.error(err)
                            res.status(500).json({
                                message:"修改密码失败"
                            })
                    })
                }else{
                    res.status(401).json({
                        message:"验证码错误或过期"
                    })
                }
            }
        })
    },
    updateUserProfile:(req:Request,res:Response)=>{
     const userEmail=res.userEmail;
     if(userEmail!== req.body.userEmail){
         res.status(500).json({
             message:"修改失败"
         })
         return;
     }
     if(!userEmail){
         res.status(403).json({
             message:"未登录"
         })
         return;
     }
     if(!req.file){
         res.status(403).json({
             message:"未上传图片"
         })
         return;
     }
     else{
         userModel.updateUserProfile(userEmail,req.file.path)
             .then((value)=>{
                 if(value){
                     res.status(200).json({
                         message:"修改成功"
                     })
                 }else{
                     res.status(500).json({
                         message:"修改失败"
                     })
                 }
             }).catch((err)=>{
                 logger.error(err)
                 res.status(500).json({
                     message:"修改失败"
                 })
         })
     }
   }

}