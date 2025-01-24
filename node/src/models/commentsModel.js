import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getCommentsOfGoods: async (goods_id) => {
        try {
            let commentsList = [];
            const [commnetsRows] = await promisePool.execute(`
                select comment_id, purchaser_id, merchant_id, purchaser_comment, merchant_reply, goods_grade
                from comments
                where goods_id = ?;
            `, [goods_id]);
            if (!(commnetsRows.length > 0)) {
                return undefined;
            }
            commentsList = commnetsRows;
            let purchaserList = [];
            let merchantList = [];
            for (let comment of commentsList) {
                purchaserList.push(comment.purchaser_id);
                merchantList.push(comment.merchant_id);
            }
            const [purchaserRows] = await promisePool.execute(`
                select nickname, purchaser_id
                from purchasers
                where purchaser_id in (${purchaserList.join(',')})
            `);
            const [merchantRows] = await promisePool.execute(`
                select nickname, merchant_id
                from merchants
                where merchant_id in (${merchantList.join(',')})
            `);
            for (let comment of commentsList) {
                comment.purchaser_nikename = purchaserRows.find(el => el.purchaser_id === comment.purchaser_id).nickname;
                comment.merchant_nikename = merchantRows.find(el => el.merchant_id === comment.merchant_id).nickname;
                delete comment.purchaser_id;
                delete comment.merchant_id;
            }
            return commentsList;
        }
        catch (err) {
            logger.info("getCommentsOfGoods" + err);
            return undefined;
        }
    },
    addComments: async (goods_id, purchaser_comment, goods_grade, user_email) => {
        try {
            //根据user_email查询到purchaser_id 根据goods_id查询到merchant_id
            const [pId] = await promisePool.execute(`select purchaser_id from purchasers where email = ?`, [user_email]);
            const [mId] = await promisePool.execute(`select merchant_id from products where goods_id = ?`, [goods_id]);
            let purchaser_id = pId[0].purchaser_id;
            let merchant_id = mId[0].merchant_id;
            //限制每个用户对某个商品商品只能评价一次:查询是否有goods_id与purchaser_id的记录
            const [commentRows] = await promisePool.execute(`
                select count(*) as comment_count
                from comments
                where goods_id=? and comments.purchaser_id=?;
            `, [goods_id, purchaser_id]);
            if (commentRows[0].comment_count > 0) {
                return false;
            }
            //往comments表中插入一条记录
            const [result] = await promisePool.execute(`
                insert into comments
                (purchaser_id, merchant_id, purchaser_comment, goods_grade, merchant_reply, goods_id)
                values (?, ?,?,?,?,?);
            `, [purchaser_id, merchant_id, purchaser_comment, goods_grade, '', goods_id]);
            //更新products表中评论的数量
            promisePool.execute(`
                update products
                set comment_count = comment_count + 1
                where goods_id = ?;
            `, [goods_id]);
            return result.affectedRows > 0;
        }
        catch (err) {
            logger.info("addComments" + err);
            return false;
        }
    }
};
