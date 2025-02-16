import promisePool from "./dbPool.js";
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import logger from "../dev/logger.js";

interface GoodsOfMerchant  {
  [key: string]: any;
  goods_id: string|undefined;
  title:string|undefined;
  img_big_logo:string|undefined;
  img_small_logo:string|undefined;
  current_price:string|undefined;
  price:string|undefined;
  goods_number:string|undefined;
  goods_introduce:string|undefined;
  category:string|undefined;
}
export default {
  getGoodsOfMerchant:async (email:string,offset:string):Promise<GoodsOfMerchant[]|boolean>=>{
    try{
      //1. 根据Email查出该商家的id
      let [rows] = await promisePool.execute<RowDataPacket[]>(`
          select merchant_id from merchants where email = ?;
      `,[email]);
      const merchantId=rows[0]["merchant_id"];
      if(!merchantId){
        // 没有找到商家
        return false;
      }
      //2. 根据商家id查出该商家的商品
      let [rows1] = await promisePool.execute<RowDataPacket[]>(`
          select goods_id,title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category 
          from products
          where merchant_id = ?
          limit ?,10;
        `,[merchantId,offset]);
      if(rows1.length>0){
        // 返回商品信息
        return <GoodsOfMerchant[]>rows1;
      }else{
        // 没有找到商品
        return false;
      }
    }catch (err){
      logger.error('getGoodsOfMerchant'+err);
      return false;
    }
  },
  updateMerchantGoods:async (goodsInfo:GoodsOfMerchant):Promise<boolean>=>{
    //1.先从数据库中查询原数据
    try{
      const [rows]=await promisePool.execute<RowDataPacket[]>(`
        select title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category from products
        where goods_id = ?;
      `,[goodsInfo.goods_id])
      if(rows.length<=0){
        //没有查到原始数据
        return false;
      }
      //2. 查到原始数据后,遍历要更新的数据,如果里面是undefined则说明不需要更新,用原数据去覆盖
      for(let key in goodsInfo){
        if(!goodsInfo[key]){
          goodsInfo[key]=rows[0][key];
        }
      }
      //3.更新数据
      const [rows1]=await promisePool.execute<ResultSetHeader>(`
          update products
          set title = ?,
              img_big_logo = ?,
              img_small_logo = ?,
              price = ?,
              current_price = ?,
              goods_number = ?,
              goods_introduce = ?,
              category = ?
              where goods_id = ? ;
      `,[goodsInfo.title,goodsInfo.img_big_logo,goodsInfo.img_small_logo,
        goodsInfo.price,goodsInfo.current_price,goodsInfo.goods_number,
        goodsInfo.goods_introduce,goodsInfo.category,goodsInfo.goods_id]);
        return (rows1.affectedRows>0);
    }
    catch (err){
      logger.error('updateMerchantGoods'+err);
      return false;
    }
  },
  deleteMerchantGoods:async (goods_id:string):Promise<boolean>=>{
    try{
      const [rows]=await promisePool.execute<ResultSetHeader>(`
        delete from products
        where goods_id = ? ;
      `,[goods_id])
      return rows.affectedRows === 1;
    }catch (err){
      logger.error('deleteMerchantGoods:'+err)
      return false;
    }
  },
  addMerchantGoods:async (goodsInfo:GoodsOfMerchant,email:string):Promise<boolean>=>{
      try{
        const [rows] = await promisePool.execute<ResultSetHeader>(`
            insert into products (title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category,merchant_id)
                values (?,?,?,?,?,?,?,?,(select merchant_id from merchants where email = ? ));
        `,[goodsInfo.title,goodsInfo.img_big_logo,goodsInfo.img_small_logo,goodsInfo.price,goodsInfo.current_price,goodsInfo.goods_number,goodsInfo.goods_introduce,goodsInfo.category,email])
        return (rows.affectedRows===1);
      }catch (err){
        logger.error('addMerchantGoods'+err);
        return false;
      }
  }
}