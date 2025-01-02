import promisePool from "./dbPool.js";
import { RowDataPacket } from "mysql2";
import logger from "../dev/logger.js";

type Goods = {
  goods_id: number;
  title: string;
  img_big_logo: string;
  current_price: number;
};
export default {
  getGoodsData: async (
    category: string,
    offset: string ,
    count: string
  ): Promise<object | undefined> => {
    let [rows] = await promisePool.execute<(Goods & RowDataPacket)[]>(
      `select goods_id, title, img_big_logo, current_price
             from products
             where category like ?
             limit ? , ? `,
      [category, offset, count]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows;
    } else {
      return undefined;
    }
  },
  getUserPreference: async (userEmail: string): Promise<undefined | string> => {
    let [rows] = await promisePool.execute<RowDataPacket[]>(
      `
            select preference
            from purchasers
            where email = ?
        `,
      [userEmail]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0]["preference"];
    } else {
      return undefined;
    }
  },
};
