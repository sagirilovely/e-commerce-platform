import { Request, Response } from "express";
import userModel from "../models/userModel.js";
import logger from "../dev/logger.js";
import sendNewCode from "../util/sendNewCode.js";
import jwt from "jsonwebtoken";
import configMessage from "../dev/nodeConfig.js";
import createHashPassword from "../util/createHashPassword.js";
import setToken from '../util/setToken.js'
import adminModel from '../models/adminModel.js'
const {secret}=configMessage.authentication;

export default {
  getMerchantInfo:(req:Request,res:Response)=>{
    const email=res.userEmail;
    const offset=String(req.query.offset);
    if(!email){
      res.status(403).json({
        message:"未登录"
      })
      return;
    }
    adminModel.getMerchantInfo(offset)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"返回商家信息成功",
            data:value
          })
        }else{
          res.status(500).json({
            message:"返回商家信息失败"
          })
        }
      })
      .catch((err)=>{
        logger.error(err)
        res.status(500).json({
          message:"返回商家信息失败"
        })
        return;
      })
  },
  updateMerchantGoods:(req:Request,res:Response)=>{
    const merchantNickname=String(req.body.nickname);
    const merchantId=String(req.body.merchant_id);
    if(!merchantNickname){
      res.status(500).json({
        message:"修改失败"
      })
      return;
    }
    adminModel.updateUserNickname(merchantId,merchantNickname)
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
      })
      .catch((err)=>{
        logger.error(err)
        res.status(500).json({
          message:"修改失败"
        })
        return;
      })
  },
  getGoodsInfo:(req:Request,res:Response)=>{
    //查询商品
    const goods_title=String(req.body.goods_title);
    const offset = String(req.body.offset);
    adminModel.getGoodsInfo(goods_title,offset)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"查询成功",
            data:value
          })
        }else{
          res.status(500).json({
            message:"查询失败"
          })
        }
      })
  },
  deleteGoods:(req:Request,res:Response)=>{
  // 删除商品
    const goods_id=String(req.query.goods_id);
    const email=res.userEmail;
    if(!email){
      res.status(403).json({
        message:"未登录"
      })
      return;
    }
    adminModel.deleteGoods(goods_id)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"删除成功"
          })
        }else{
          res.status(500).json({
            message:"删除失败"
          })
        }
      })
  },
  getPurchaserInfo:(req:Request,res:Response)=>{
    const offset = String(req.query.offset);
    const email = res.userEmail;
    if(!email){
      res.status(403).json({
        message:"未登录"
      })
      return;
    }
    adminModel.getPurchaserInfo(offset)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"成功返回用户信息",
            data:value
          })
        }else{
          res.status(500).json({
            message:"失败"
          })
        }
      })
  },
  updatePurchaserInfo:(req:Request,res:Response)=>{
    const purchaserId=String(req.body.purchaser_id);
    const newNickname=String(req.body.nickname);
    if(!purchaserId || !newNickname || !res.userEmail){
      res.status(500).json({
        message:"修改失败"
      })
      return;
    }
    adminModel.updateUserInfo(purchaserId,newNickname)
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
      })
      .catch((err)=>{
        logger.error(err)
        res.status(500).json({
          message:"修改失败"
        })
      })
  },
  getAdminInfo:(req:Request,res:Response)=>{
    const email=res.userEmail;
    const offset = String(req.query.offset);
    if(!email){
      res.status(403).json({
        message:"未登录"
      })
      return
    }
    adminModel.getAdminInfo(offset)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"返回管理员信息成功",
            data:value
          })
        }else{
          res.status(500).json({
            message:"返回管理员信息失败"
          })
        }
      })
  },
  addAdminInfo:(req:Request,res:Response)=>{
    const email=res.userEmail;
    if(!email){
      res.status(403).json({
        message:"未登录"
      })
      return;
    }
    const admin_email=req.body.admin_email;
    const password=req.body.password;
    const nickname=req.body.nickname;
    if(!admin_email || !password){
      res.status(500).json({
        message:"添加失败"
      })
      return;
    }
    adminModel.createAdmin(admin_email,password,nickname)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"添加成功"
          })
        }else{
          res.status(500).json({
            message:"添加失败"
          })
        }
      })
      .catch((err)=>{
        logger.error(err)
        res.status(500).json({
          message:"添加失败"
        })
      })
  },
  deleteAdmin:(req:Request,res:Response)=>{
    const admin_id=String(req.body.admin_id);
    if(!admin_id){
      res.status(500).json({
        message:"删除失败"
      })
      return
    }
    //管理员id为1的不能删
    if(admin_id==="1"){
      res.status(500).json({
        message:"删除失败"
      })
      return;
    }
    adminModel.deleteAdmin(admin_id)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:"删除成功"
          })
        }else{
          res.status(500).json({
            message:"删除失败"
          })
        }
      })
  }
}