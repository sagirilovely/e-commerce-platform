import promisePool from "./dbPool.js";
export default {
    getGoodsData: async (category, offset, count) => {
        let [rows] = await promisePool.execute(`select goods_id, title, img_big_logo, current_price
             from products
             where category like ?
             limit ? , ? `, [category, offset, count]);
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
