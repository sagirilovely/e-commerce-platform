import promisePool from "./dbPool.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import logger from "../dev/logger.js";

export default {
    getCommentsOfGoods: async (goods_id: string): Promise<object | undefined> => {
        try {
            let commentsList = [];
            const [commnetsRows] = await promisePool.execute<RowDataPacket[]>(`
                select comment_id, purchaser_id, merchant_id, purchaser_comment, merchant_reply, goods_grade
                from comments
                where goods_id = ?;
            `, [goods_id]);
            if (!(commnetsRows.length > 0)) {
                return undefined;
            }
            commentsList = commnetsRows;
            let purchaserList: number | string[] = [];
            let merchantList: number | string[] = [];
            for (let comment of commentsList) {
                purchaserList.push(comment.purchaser_id);
                merchantList.push(comment.merchant_id);
            }
            const [purchaserRows] = await promisePool.execute<RowDataPacket[]>(`
                select nickname, purchaser_id
                from purchasers
                where purchaser_id in (${purchaserList.join(',')})
            `)
            const [merchantRows] = await promisePool.execute<RowDataPacket[]>(`
                select nickname, merchant_id
                from merchants
                where merchant_id in (${merchantList.join(',')})
            `)
            for (let comment of commentsList) {
                comment.purchaser_nikename = (<any>purchaserRows.find(el => el.purchaser_id === comment.purchaser_id)).nickname;
                comment.merchant_nikename = (<any>merchantRows.find(el => el.merchant_id === comment.merchant_id)).nickname;
                delete comment.purchaser_id;
                delete comment.merchant_id;
            }
            return commentsList;
        } catch (err) {
            logger.info("getCommentsOfGoods" + err);
            return undefined;
        }
    },
    addComments: async (goods_id: string, purchaser_comment: string, goods_grade: string,user_email:string): Promise<boolean> => {
        try {
            //根据user_email查询到purchaser_id 根据goods_id查询到merchant_id
            const [pId] = await promisePool.execute<RowDataPacket[]>(`select purchaser_id from purchasers where email = ?`,[user_email])
            const [mId]= await promisePool.execute<RowDataPacket[]>(`select merchant_id from products where goods_id = ?`,[goods_id])
            let purchaser_id = pId[0].purchaser_id;
            let merchant_id = mId[0].merchant_id;
            //限制每个用户对某个商品商品只能评价一次:查询是否有goods_id与purchaser_id的记录
            const[commentRows]=await promisePool.execute<RowDataPacket[]>(`
                select count(*) as comment_count
                from comments
                where goods_id=? and comments.purchaser_id=?;
            `,[goods_id,purchaser_id])
            if(commentRows[0].comment_count>0){
                return false;
            }
            //往comments表中插入一条记录
            const [result] = await promisePool.execute<ResultSetHeader>(`
                insert into comments
                (purchaser_id, merchant_id, purchaser_comment, goods_grade, merchant_reply, goods_id)
                values (?, ?,?,?,?,?);
            `,[purchaser_id,merchant_id,purchaser_comment,goods_grade,'',goods_id])
            //更新products表中评论的数量
            promisePool.execute<RowDataPacket[]>(`
                update products
                set comment_count = comment_count + 1
                where goods_id = ?;
            `,[goods_id])
            return result.affectedRows > 0;
        }catch (err) {
            logger.info("addComments" + err);
            return false;
        }
    }
}