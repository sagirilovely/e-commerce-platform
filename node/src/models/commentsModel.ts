import promisePool from "./dbPool.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import logger from "../dev/logger.js";

interface Comments{
    comment_id: number|string;
    purchaser_nickname: string;
    merchant_nickname: string;
    purchaser_comment: string;
    merchant_reply: string;
    goods_grade: number|string;
}
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
    },
    getCommentsOfMerchant:async (email:string):Promise<Comments[]|boolean>=>{
        try{
            //1.通过商家email查出他的id 和 昵称
            const [rows] = await promisePool.execute<RowDataPacket[]>(`
                select merchants.merchant_id,merchants.nickname from merchants
                where email = ? ;
            `,[email])
            if(!rows.length){
                return false;
            }
            const merchant_id = rows[0].merchant_id;
            const merchant_nickname = rows[0].nickname;
            //2.通过商家id查出该商家的评论
            const [rows1] = await promisePool.execute<RowDataPacket[]>(`
                select comment_id,purchaser_id,purchaser_comment,merchant_reply,goods_grade from comments
                where merchant_id = ?;
            `,[merchant_id]);
            if(!rows1.length){
                return false;
            }
            //3.遍历评论列表,根据购买者id去查询他的昵称,并向rows1中加入购买者昵称 删除purchaser_id
            for(let comment of rows1){
                const [rows2] = await promisePool.execute<RowDataPacket[]>(`
                    select nickname from purchasers
                    where purchaser_id = ? ;
                `,[comment.purchaser_id])
                if(!rows2.length){
                   return false;
                }
                comment.purchaser_nikename = rows2[0].nickname;
                delete comment.purchaser_id;
            }
            //4.返回评论列表
            let commentsList:Comments[]=[];
            for(let comment of rows1){
                commentsList.push({
                    comment_id:comment.comment_id,
                    purchaser_nickname:comment.purchaser_nikename,
                    merchant_nickname:merchant_nickname,
                    purchaser_comment:comment.purchaser_comment,
                    merchant_reply:comment.merchant_reply,
                    goods_grade:comment.goods_grade
                })
            }
            return commentsList;
        }
        catch(err){
            logger.error("getCommentsOfMerchant" + err);
            return false;
        }
    },
    addReply:async (commentId:string,reply:string):Promise<boolean>=>{
        //1.通过commentId查询该评论信息
        try{
            const [rows] = await promisePool.execute<RowDataPacket[]>(`
                select * from comments
                where  comment_id = ? ;
            `,[commentId])
            if(!rows.length){
                return false;//该id没有对应的评论信息
            }
            //2.更新该条评论信息
            if(rows[0].merchant_reply){
                return false;//已经评价过了
            }
           const[rows1]= await promisePool.execute<ResultSetHeader>(`
                update comments
                set merchant_reply = ?
                where comment_id = ?;
            `,[reply,commentId])
            return rows1.affectedRows > 0;

        }
        catch (err){
            logger.error("addReply" + err);
            return false;
        }
}
}