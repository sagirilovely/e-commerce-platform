import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getUserId: async (userEmail) => {
        try {
            const [rows] = await promisePool.execute(`
                select purchaser_id , receiver_address from purchasers where email = ?
            `, [userEmail]);
            if (Array.isArray(rows) && rows.length > 0) {
                return JSON.stringify({ "purchaser_id": rows[0]["purchaser_id"], "receiver_address": rows[0]["receiver_address"] });
            }
            else {
                return JSON.stringify({ purchaser_id: "", receiver_address: "" });
            }
        }
        catch (err) {
            return JSON.stringify({ purchaser_id: "", receiver_address: "" });
        }
    },
    getGoodsMerchantId: async (goodsId) => {
        try {
            const [rows] = await promisePool.execute(`
            select merchant_id from products where goods_id = ?
            `, [goodsId]);
            if (Array.isArray(rows) && rows.length > 0) {
                return rows[0]["merchant_id"];
            }
            else {
                return "";
            }
        }
        catch (err) {
            return "";
        }
    },
    createOrder: async (goods_id, goods_count, purchaser_id, merchant_id, receiver_address, created_time) => {
        try {
            const [rows] = await promisePool.execute(`
                insert into orders (
                    goods_id,goods_count,purchaser_id,merchant_id,receiver_address,created_time,logistics_information
                ) values (
                    ?,?,?,?,?,?,?
                    )
            `, [goods_id, goods_count, purchaser_id, merchant_id, receiver_address, created_time, '信息还未更新']);
            if (rows.affectedRows > 0) {
                //返回order_id
                return String(rows.insertId);
            }
            else {
                return "-1";
            }
        }
        catch (err) {
            return "-1";
        }
    },
    paidOrder: async (is_paid, order_id) => {
        try {
            const [rows] = await promisePool.execute(`
            select is_paid
            from orders
            where order_id= ?;
            `, [order_id]);
            if (rows[0].is_paid === 1 || rows[0].is_paid === true) {
                logger.info('订单重复支付');
                return false;
            }
        }
        catch (err) {
            logger.error('paidOrder:' + err);
            return false;
        }
        try {
            if (typeof is_paid === 'string') {
                is_paid = is_paid === 'true';
            }
            const [rows] = await promisePool.execute(`
                update orders
                set is_paid = ?
                where order_id= ?;
            `, [is_paid, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error('paidOrder:' + err);
            return false;
        }
    },
    refundOrder: async (is_refund, order_id, refund_reason) => {
        if (typeof is_refund === 'string') {
            is_refund = is_refund === 'true';
        }
        try {
            const [rows] = await promisePool.execute(`
                update orders
                set is_refund = ? ,refund_reason = ?
                where order_id =?
            `, [is_refund, refund_reason, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error('refundOrder:' + err);
            return false;
        }
    },
    takeDelivery: async (is_take_delivery, order_id) => {
        try {
            const [rows] = await promisePool.execute(`
            update orders
                set is_take_delivery = ? 
                where order_id =?
        `, [is_take_delivery, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error('takeDelivery:' + err);
            return false;
        }
    }
};
