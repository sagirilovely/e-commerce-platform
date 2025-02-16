import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getGoodsOfMerchant: async (email, offset) => {
        try {
            //1. 根据Email查出该商家的id
            let [rows] = await promisePool.execute(`
          select merchant_id from merchants where email = ?;
      `, [email]);
            const merchantId = rows[0]["merchant_id"];
            if (!merchantId) {
                // 没有找到商家
                return false;
            }
            //2. 根据商家id查出该商家的商品
            let [rows1] = await promisePool.execute(`
          select goods_id,title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category 
          from products
          where merchant_id = ?
          limit ?,10;
        `, [merchantId, offset]);
            if (rows1.length > 0) {
                // 返回商品信息
                return rows1;
            }
            else {
                // 没有找到商品
                return false;
            }
        }
        catch (err) {
            logger.error('getGoodsOfMerchant' + err);
            return false;
        }
    },
    updateMerchantGoods: async (goodsInfo) => {
        //1.先从数据库中查询原数据
        try {
            const [rows] = await promisePool.execute(`
        select title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category from products
        where goods_id = ?;
      `, [goodsInfo.goods_id]);
            if (rows.length <= 0) {
                //没有查到原始数据
                return false;
            }
            //2. 查到原始数据后,遍历要更新的数据,如果里面是undefined则说明不需要更新,用原数据去覆盖
            for (let key in goodsInfo) {
                if (!goodsInfo[key]) {
                    goodsInfo[key] = rows[0][key];
                }
            }
            //3.更新数据
            const [rows1] = await promisePool.execute(`
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
      `, [goodsInfo.title, goodsInfo.img_big_logo, goodsInfo.img_small_logo,
                goodsInfo.price, goodsInfo.current_price, goodsInfo.goods_number,
                goodsInfo.goods_introduce, goodsInfo.category, goodsInfo.goods_id]);
            return (rows1.affectedRows > 0);
        }
        catch (err) {
            logger.error('updateMerchantGoods' + err);
            return false;
        }
    },
    deleteMerchantGoods: async (goods_id) => {
        try {
            const [rows] = await promisePool.execute(`
        delete from products
        where goods_id = ? ;
      `, [goods_id]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error('deleteMerchantGoods:' + err);
            return false;
        }
    },
    addMerchantGoods: async (goodsInfo, email) => {
        try {
            const [rows] = await promisePool.execute(`
            insert into products (title,img_big_logo,img_small_logo,price,current_price,goods_number,goods_introduce,category,merchant_id)
                values (?,?,?,?,?,?,?,?,(select merchant_id from merchants where email = ? ));
        `, [goodsInfo.title, goodsInfo.img_big_logo, goodsInfo.img_small_logo, goodsInfo.price, goodsInfo.current_price, goodsInfo.goods_number, goodsInfo.goods_introduce, goodsInfo.category, email]);
            return (rows.affectedRows === 1);
        }
        catch (err) {
            logger.error('addMerchantGoods' + err);
            return false;
        }
    }
};
