import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getMerchantInfo: async (offset) => {
        const [row] = await promisePool.execute(`
      select nickname,profile_photo,merchant_id from merchants
      limit ?,10;
    `, [offset]);
        if (row.length === 0) {
            return false;
        }
        return row;
    },
    updateUserNickname: async (merchantId, newNickname) => {
        const [rows] = await promisePool.execute(`
      update merchants
        set nickname = ?
        where merchant_id = ? ;
    `, [newNickname, merchantId]);
        return rows.affectedRows === 1;
    },
    getGoodsInfo: async (goods_title, offset) => {
        try {
            const [rows] = await promisePool.execute(`
        SELECT p.title as title, p.current_price as current_price, m.nickname as merchant
        FROM products p
        JOIN merchants m ON p.merchant_id = m.merchant_id
        where p.title like concat('%',?,'%')
        limit ?,10
    `, [goods_title, offset]);
            if (rows.length) {
                return rows;
            }
            else {
                return false;
            }
        }
        catch (err) {
            logger.error('getGoodsInfo:' + err);
            return false;
        }
    },
    deleteGoods: async (goods_id) => {
        try {
            const [rows] = await promisePool.execute(`
        delete from products
        where goods_id = ? ;
      `, [goods_id]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error('deleteGoods:' + err);
            return false;
        }
    },
    getPurchaserInfo: async (offset) => {
        try {
            const [row] = await promisePool.execute(`
        select purchaser_id,nickname,profile_photo from purchasers
        limit ?,10 ;
    `, [offset]);
            if (row.length === 0) {
                return false;
            }
            let purchaserInfo = [];
            for (let purchaser of row) {
                purchaserInfo.push({
                    purchaser_id: purchaser.purchaser_id,
                    nickname: purchaser.nickname,
                    profile_url: purchaser.profile_photo
                });
            }
            return purchaserInfo;
        }
        catch (err) {
            logger.error('getPurchaserInfo:' + err);
            return false;
        }
    },
    updateUserInfo: async (purchaserId, newNickname) => {
        try {
            const [row] = await promisePool.execute(`
        update purchasers
        set nickname = ? 
        where purchaser_id = ?;
      `, [newNickname, purchaserId]);
            return row.affectedRows === 1;
        }
        catch (err) {
            logger.error('updateUserInfo:' + err);
            return false;
        }
    },
    getAdminInfo: async (offset) => {
        try {
            const [row] = await promisePool.execute(`
          select administrator_id,nickname,profile_photo,email from administrators
          limit ?,10;
        `, [offset]);
            if (row.length) {
                let adminInfo = [];
                for (let admin of row) {
                    adminInfo.push({
                        administrator_id: admin.administrator_id,
                        nickname: admin.nickname,
                        profile_url: admin.profile_photo,
                        email: admin.email
                    });
                }
                return adminInfo;
            }
            return false;
        }
        catch (err) {
            logger.error('getAdminInfo:' + err);
            return false;
        }
    },
    createAdmin: async (admin_email, password, nickname) => {
        try {
            //生成一个本地时间 格式如 2023-06-01 12:00:00
            const time = new Date();
            const created_time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
            const [rows] = await promisePool.execute(`
          INSERT INTO administrators ( password, email, created_time, profile_photo, nickname)
        VALUES (?, ?, ?, 'guowenjie1970@qq.com.png', ?);
        `, [password, admin_email, created_time, nickname]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error('createAdmin:' + err);
            return false;
        }
    },
    deleteAdmin: async (admin_id) => {
        try {
            const [rows] = await promisePool.execute(`
        delete from administrators
        where administrator_id = ? ;
      `, [admin_id]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error('deleteAdmin:' + err);
            return false;
        }
    }
};
