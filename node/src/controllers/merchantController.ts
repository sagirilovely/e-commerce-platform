import {NextFunction, Request, Response} from 'express';
import merchantModel from '../models/merchantModel.js'
import nodeConfig from '../dev/nodeConfig.js'
import configMessage from "../dev/nodeConfig.js";
const {secret}= configMessage.authentication;
interface GoodsInfo{
  goods_id:string|undefined,
  title:string|undefined,
  img_big_logo:string|undefined,
  img_small_logo:string|undefined,
  price:string|undefined,
  current_price:string|undefined,
  goods_number:string|undefined,
  goods_introduce:string|undefined,
  category:string|undefined
}
export default{
  getMerchantGoodsList:(req:Request,res:Response)=>{
    //查询该商家名下的所有商品
    const email = res.userEmail;
    if(email){
      //已登录
      const offset = String(req.query.offset);
      merchantModel.getGoodsOfMerchant(email,offset)
        .then((value)=>{
          if(value===false){
            res.status(500).send(JSON.stringify({message:"该商家还没有商品"}));
            return;
          }else{
            res.status(200).send(JSON.stringify({message:"获取成功",data:value}));
            return;
          }
        })
        .catch((err)=>{
          res.status(500).send(JSON.stringify({message:"获取失败"}));
          return;
        })
    }else{
      //未登录
      res.status(401).send(JSON.stringify({message:"未登录"}));
    }
  },
  updateMerchantGoods:(req:Request,res:Response)=>{
    //从req接收商品信息
      const goodsInfo:GoodsInfo={
        goods_id:String(req.body.goods_id),
        title:String(req.body.title),
        img_big_logo:String(req.body.img_big_logo),
        img_small_logo:String(req.body.img_small_logo),
        price:String(req.body.price),
        current_price:String(req.body.current_price),
        goods_number:String(req.body.goods_number),
        goods_introduce:String(req.body.goods_introduce),
        category:String(req.body.category)
      };
      //更新商品信息
      merchantModel.updateMerchantGoods(goodsInfo)
        .then((value)=>{
          if(value){
            //更新成功
            res.status(200).send(JSON.stringify({message:"更新成功"}));
            return;
          }else{
            //更新失败
            res.status(500).send(JSON.stringify({message:"更新失败"}));
            return;
          }
        })
        .catch((err)=>{
          res.status(500).send(JSON.stringify({message:"更新失败"}));
          return;
        })
  },
  addMerchantGoods:(req:Request,res:Response)=>{
  //从req接收商品信息
    const goodsInfo:GoodsInfo={
      goods_id:String(1),
      title:String(req.body.title),
      img_big_logo:String(req.body.img_big_logo),
      img_small_logo:String(req.body.img_small_logo),
      price:String(req.body.price),
      current_price:String(req.body.current_price),
      goods_number:String(req.body.goods_number),
      goods_introduce:String(req.body.goods_introduce),
      category:String(req.body.category)
    };
    const email=String(res.userEmail);
    merchantModel.addMerchantGoods(goodsInfo,email)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:'成功'
          })
        }else{
          res.status(500).json({
            message:"失败"
          })
        }
      })
      .catch((err)=>{
        res.status(500).json({
          message:"失败"
        })
      })
  },
  deleteMerchantGoods:(req:Request,res:Response)=>{
    const goods_id=String(req.query.goods_id);
    merchantModel.deleteMerchantGoods(goods_id)
      .then((value)=>{
        if(value){
          res.status(200).json({
            message:'删除成功'
          })
        }else{
          res.status(500).json({
            message:"删除失败"
          })
        }
      })
      .catch((err)=>{
        res.status(500).json({
          message:"删除失败"
        })
      })
  },
  imgConvert:(req:Request,res:Response)=>{
    const category=req.body.category;
    if(!req.file){
      res.status(500).send(JSON.stringify({message:"上传失败"}));
      return;
    }else{
      const img_url:string=nodeConfig.expressStatic.goodsImg+'/goods/'+req.file.filename;
      if(category==='img_url'){
        res.status(200).json({message:"上传成功",data:`${img_url}`})
      }else if(category==='html_introduce'){
        const introduceHTML=`<div style=\\"width: 100%; height: 100%;overflow-x: hidden;overflow-y: scroll\\"><img src=\\"${img_url}\\" alt=\\"商品详情\\" style=\\"width: 100%;\\"></div>`;
        res.status(200).json({message:"上传成功",data:`${introduceHTML}`})
      }else{
        res.status(500).json({message:"上传失败"})
        return;
      }
      return;
    }
  }
}