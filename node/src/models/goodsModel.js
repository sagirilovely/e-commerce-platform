import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getGoodsData: async (category, offset, count) => {
        let [rows] = await promisePool.execute(`select goods_id, title, img_small_logo, current_price
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
    searchGoods: async (keyword, offset, email) => {
        try {
            const [rows] = await promisePool.execute(`
        select goods_id,title,img_small_logo,current_price,category from products 
        where title like CONCAT('%',?,'%')
        limit ?,10;
    `, [keyword, offset]);
            if (rows.length) {
                //获取该商品的分类,放入用户的偏好中
                if (email) {
                    //1. 查出该用户的偏好信息
                    const [rows1] = await promisePool.execute(`
            select preference from purchasers where email = ? ;
          `, [email]);
                    if (rows1.length) {
                        let preference = (rows1[0]["preference"]);
                        if (preference) {
                            //已经有了偏好
                            preference = preference.split(",");
                        }
                        else {
                            //没有偏好
                            preference = [];
                        }
                        //2. 加入一个偏好
                        preference.push(rows[0]["category"]);
                        if (preference.length > 5) {
                            //若存在超过5个偏好，删除第一个
                            preference.shift();
                        }
                        //3. 更新偏好
                        await promisePool.execute(`
            update purchasers set preference = ? where email = ?;
           `, [preference.join(","), email]);
                    }
                }
                for (let goods of rows) {
                    delete goods.category;
                }
                return rows;
            }
            else {
                return false;
            }
        }
        catch (err) {
            logger.error('searchGoods:' + err);
            return false;
        }
    }
};
