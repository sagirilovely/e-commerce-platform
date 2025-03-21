import commentsModel from "../models/commentsModel.js";
import {Request, Response} from "express";

export default {
    getCommentsOfGoods: (req: Request, res: Response) => {
        const goods_id = String(req.query.goods_id);
        if (!(goods_id)) {
            res.status(403).json({message: "获取评论失败"});
            return;
        }
        commentsModel.getCommentsOfGoods(goods_id)
            .then((value) => {
                if (!value) {
                    res.status(403).json({message: "获取评论失败"});
                    return;
                }
                res.status(200).json({
                    message: "获取评论成功",
                    data: value
                })
            })
    },
    addComments: (req: Request, res: Response) => {
        const goods_id = String(req.body.goods_id);
        const purchaser_comment =req.body.purchaser_comment;
        const goods_grade= String(req.body.goods_grade);
        const userEmail=res.userEmail;
        if (!(goods_id && purchaser_comment && goods_grade && userEmail)) {
            res.status(403).json({message: "添加评论失败"});
            return;
        }
        if(!(parseInt(goods_grade)>=1 && parseInt(goods_grade)<=5)){
            res.status(403).json({message: "评分等级应该在 1-5"});
            return;
        }
        commentsModel.addComments(goods_id,purchaser_comment,goods_grade,userEmail)
            .then((value) => {
                if (value) {
                    res.status(200).json({
                        message: "添加评论成功"
                    })
                }else {
                    res.status(403).json({message: "添加评论失败"});
                }
            }).catch((err) => {
                res.status(500).json({message: "服务器出错"});
        })
    },
    getCommentsOfMerchant:(req:Request,res:Response)=>{
        const email=res.userEmail;
        if(!email){
            // 未登录
            res.status(500).json({message:"未登录"});
            return;
        }
        commentsModel.getCommentsOfMerchant(email)
          .then((value)=>{
              if(!value){
                  res.status(403).json({message:"获取评论失败"});
                  return;
              }
              res.status(200).json({message:"获取评论成功",data:value})
          })
          .catch((err)=>{
              res.status(500).json({message:"获取评论失败"});
          })
    },
    addReply:(req:Request,res:Response)=>{
        const commentId=String(req.body.comment_id);
        const reply =String(req.body.reply);
        const email=res.userEmail;
        if(!email || !commentId || !reply){
            res.status(403).json({message:"添加回复失败"});
            return;
        }
        commentsModel.addReply(commentId,reply)
          .then((value)=>{
              if(value){
                  res.status(200).json({message:"回复成功"});
                  return ;
              }else{
                  res.status(500).json({message:"回复失败"});
                  return ;
              }
          })
          .catch((err)=>{
              res.status(500).json({message:"回复失败"});
              return
          })
    }
}