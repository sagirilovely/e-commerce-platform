import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getGoodsData: async (category, offset, count) => {
        let [rows] = await promisePool.execute(`select goods_id, title, img_big_logo, current_price
             from products
             where category like ?
             limit ? , ? `, [category, offset, count]);
        logger.info("数据库查到的rows:" + JSON.stringify(rows[0]));
        if (Array.isArray(rows) && rows.length > 0) {
            return rows;
        }
        else {
            return undefined;
        }
    },
    getUserPreference: async (userEmail) => {
        let [rows] = await promisePool.execute(`
            select preference
            from purchasers
            where email = ?
        `, [userEmail]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0]["preference"];
        }
        else {
            return undefined;
        }
    },
};
