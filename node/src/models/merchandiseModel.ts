import promisePool from "./dbPool.js";
import { RowDataPacket } from "mysql2";


export default {
  getGoodsDetail: async (
    goodsId: string | undefined
  ): Promise<object | undefined> => {
      try{

          if (!goodsId) return undefined;
          const [rows] = await promisePool.execute<RowDataPacket[]>(
              `
            select goods_id,
                   title,
                   img_big_logo,
                   price,
                   current_price,
                   goods_number,
                   goods_introduce,
                   category,
                   comment_count,
                   merchant_id
            from products
            where goods_id = ?;
        `,
              [goodsId]
          );
          if (rows.length == 0) {
              return undefined;
          } else {
              return rows[0];
          }
      }catch (err){
          return undefined
      }
  },
  getMerchantNikeName: async (merchantId: string|undefined): Promise<string|undefined> => {
    if(!merchantId){return undefined}
    try{

        const [rows] = await promisePool.execute<RowDataPacket[]>(
            `
            select nickname
            from merchants
            where merchant_id = ?;
        `,
            [merchantId]
        );
        if (rows.length == 0) {
            return "未知商家";
        } else {
            return rows[0].nickname;
        }
    }catch (err){
        return undefined
    }

  },
};
