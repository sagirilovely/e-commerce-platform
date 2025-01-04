import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
import path from "path";
export default {
    updateUserTrolley: async (userEmail, goods_id, goods_count) => {
        try {
            //通过邮箱查询到用户的购物车信息
            const [rows] = await promisePool.execute(`select shopping_trolley
                                                from purchasers
                                                where email = ?`, [userEmail]);
            if (rows.length === 0) {
                return false;
            }
            const userTrolley = JSON.parse(rows[0].shopping_trolley);
            if (userTrolley[goods_id]) {
                userTrolley[goods_id] = String(parseInt(goods_count) + parseInt(userTrolley[goods_id]));
            }
            else {
                userTrolley[goods_id] = goods_count;
            }
            try {
                const [rows] = await promisePool.execute(`update purchasers
                                                    set shopping_trolley = ?
                                                    where email = ?`, [JSON.stringify(userTrolley), userEmail]);
                return rows.affectedRows === 1;
            }
            catch (err) {
                logger.info('getUserTrolley' + err);
                return false;
            }
        }
        catch (err) {
            logger.info('getUserTrolley' + err);
            return false;
        }
    },
    getUserTrolleyDetail: async (userEmail) => {
        try {
            //通过邮箱查询到用户的购物车信息
            const [rows] = await promisePool.execute(`select shopping_trolley
                                                from purchasers
                                                where email = ?`, [userEmail]);
            if (rows.length === 0) {
                return 0;
            }
            const userTrolley = JSON.parse(rows[0].shopping_trolley);
            //得到一个由逗号分隔的字符串
            const goodsIdList = Object.keys(userTrolley).map((goodsId) => {
                return parseInt(goodsId);
            }).join(',');
            try {
                //通过商品id查询商品的 goods_title img_small_logo current_price
                const [rows] = await promisePool.execute(`
              select goods_id,title,img_small_logo,current_price
              from products 
              where goods_id in (${goodsIdList})
              `);
                if (rows.length === 0) {
                    return undefined;
                }
                for (let goodsDetailObj of rows) {
                    //将商品数量添加到商品详情中
                    goodsDetailObj.goods_count = userTrolley[goodsDetailObj.goods_id];
                    //将购买总数与价格改为字符串
                    goodsDetailObj.goods_count = String(goodsDetailObj.goods_count);
                    goodsDetailObj.current_price = String(goodsDetailObj.current_price);
                }
                return rows;
            }
            catch (err) {
                logger.info('getUserTrolley' + err);
                return undefined;
            }
        }
        catch (err) {
            logger.info('getUserTrolley' + err);
            return undefined;
        }
    },
    getUserAddress: async (userEmail) => {
        try {
            const [rows] = await promisePool.execute(`
               select receiver_address
                from purchasers
                where email = ?
            `, [userEmail]);
            if (rows.length === 0 || rows[0].receiver_address === '') {
                return 0;
            }
            return JSON.parse(rows[0].receiver_address);
        }
        catch (err) {
            logger.info('getUserAddress' + err);
            return undefined;
        }
    },
    updateUserAddress: async (userEmail, receiverAddress) => {
        try {
            const [rows] = await promisePool.execute(`
            update purchasers
            set receiver_address = ?
            where email= ?;
        `, [receiverAddress, userEmail]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.info('updateUserAddress' + err);
            return false;
        }
    },
    updatePassword: async (userEmail, newPassword) => {
        try {
            const [rows] = await promisePool.execute(`
                update purchasers
                set password = ?
                where email= ?;
            `, [newPassword, userEmail]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.info('updatePassword' + err);
            return false;
        }
    },
    updateUserProfile: async (userEmail, newProfilePath) => {
        //提取出文件的后缀
        const suffix = path.extname(newProfilePath);
        try {
            const [rows] = await promisePool.execute(`
                update purchasers
                set profile_photo = ?
                where email= ?;
                `, [(userEmail + suffix), userEmail]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.info('updateUserProfile' + err);
            return false;
        }
    }
};
