import {NextFunction, Request, Response} from 'express';
import configMessage from "../dev/nodeConfig.js";
import merchandiseModel from "../models/merchandiseModel.js";


export default {
    sendGoodsDetail:async (req: Request, res: Response): Promise<void> => {
        let goodsDetailFinal: object = {};//储存最终查询从出来的数据
        //拿到用户传来的goods_id
        const goods_id: string = String(req.query.goods_id);
        //拿到goods_id title img_small_logo price current_price goods_number goods_introduce category comment_count merchant_nikename
        merchandiseModel.getGoodsDetail(goods_id)
            .then((goodsDetail) => {
                if(goodsDetail){
                    Object.assign(goodsDetailFinal, goodsDetail);
                    if('merchant_id'in goodsDetail){
                        return merchandiseModel.getMerchantNikeName(<string>goodsDetail.merchant_id);
                    }else{return undefined}
                }else{
                    res.status(403).send(JSON.stringify({
                        message:"商品信息未找到"
                    }))
                    return undefined;
                }
            })
            .catch((err)=>{
                res.status(500).send(JSON.stringify({
                    "message":"没正常拿到该商品信息"
                }))
            })
            .then((merchantNikeName)=>{
                if(merchantNikeName){
                    Object.assign(goodsDetailFinal,{merchant_nikename:merchantNikeName});
                    //删除goodsDetailFinal中的merchant_id
                    if ('merchant_id' in goodsDetailFinal) {
                        delete goodsDetailFinal.merchant_id;
                    }
                    res.status(200).send(JSON.stringify({
                        message:"商品详情已返回",
                        data:goodsDetailFinal
                    }))
                }
            })
            .catch((err)=>{
                res.status(500).send(JSON.stringify({
                    "message":"没正常拿到该商品信息"
                }))
            })
    }
}