import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    getUserId: async (userEmail) => {
        try {
            const [rows] = await promisePool.execute(`
                    select purchaser_id, receiver_address
                    from purchasers
                    where email = ?
                `, [userEmail]);
            if (Array.isArray(rows) && rows.length > 0) {
                return JSON.stringify({
                    purchaser_id: rows[0]["purchaser_id"],
                    receiver_address: rows[0]["receiver_address"],
                });
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
                    select merchant_id
                    from products
                    where goods_id = ?
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
                    insert into orders (goods_id, goods_count, purchaser_id, merchant_id, receiver_address,
                                        created_time,
                                        logistics_information)
                    values (?, ?, ?, ?, ?, ?, ?)
                `, [
                goods_id,
                goods_count,
                purchaser_id,
                merchant_id,
                receiver_address,
                created_time,
                "信息还未更新",
            ]);
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
                    where order_id = ?;
                `, [order_id]);
            if (rows[0].is_paid === 1 || rows[0].is_paid === true) {
                logger.info("订单重复支付");
                return false;
            }
        }
        catch (err) {
            logger.error("paidOrder:" + err);
            return false;
        }
        try {
            if (typeof is_paid === "string") {
                is_paid = is_paid === "true";
            }
            const [rows] = await promisePool.execute(`
                    update orders
                    set is_paid = ?
                    where order_id = ?;
                `, [is_paid, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error("paidOrder:" + err);
            return false;
        }
    },
    refundOrder: async (is_refund, order_id, refund_reason) => {
        if (typeof is_refund === "string") {
            is_refund = is_refund === "true";
        }
        try {
            const [rows] = await promisePool.execute(`
                    update orders
                    set is_refund     = ?,
                        refund_reason = ?
                    where order_id = ?
                `, [is_refund, refund_reason, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error("refundOrder:" + err);
            return false;
        }
    },
    takeDelivery: async (is_take_delivery, order_id) => {
        try {
            const [rows] = await promisePool.execute(`
                    update orders
                    set is_take_delivery = ?
                    where order_id = ?
                `, [is_take_delivery, order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error("takeDelivery:" + err);
            return false;
        }
    },
    getOrderDetail: async (order_id) => {
        if (!order_id) {
            return undefined;
        }
        try {
            let detailResult = {};
            let goods_id;
            let [rows] = await promisePool.execute(`
                    select order_id,
                           goods_id,
                           goods_count,
                           created_time,
                           receiver_address,
                           logistics_information,
                           is_take_delivery,
                           is_refund,
                           is_refund_allowed,
                           is_paid
                    from orders
                    where order_id = ?;
                `, [order_id]);
            if (Array.isArray(rows) && rows.length > 0) {
                goods_id = rows[0].goods_id;
                for (let key in rows[0]) {
                    if (key !== "goods_id") {
                        detailResult[key] = rows[0][key];
                    }
                }
                try {
                    let [rows] = await promisePool.execute(`
                        select title, img_small_logo, current_price,goods_id
                        from products
                        where goods_id = ?;
                    `, [goods_id]);
                    if (Array.isArray(rows) && rows.length > 0) {
                        for (let key in rows[0]) {
                            detailResult[key] = rows[0][key];
                        }
                        return JSON.stringify(detailResult);
                    }
                }
                catch (err) {
                    logger.error("getOrderDetail:" + err);
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }
        catch (err) {
            logger.error("getOrderDetail:" + err);
            return undefined;
        }
    },
    getOrderSummary: async (userEmail) => {
        try {
            //通过userEmail获取purchaser_id
            const purchaser_id = (await promisePool.execute(`
                select purchaser_id
                from purchasers
                where email = ? ;
            `, [userEmail]))[0][0].purchaser_id;
            //通过purchaser_id获取该用户的所有订单
            const [rows] = await promisePool.execute(`
                select order_id,created_time,is_take_delivery,goods_count,is_refund,is_refund_allowed,is_paid,goods_id
                from orders
                where purchaser_id = ? ;
            `, [purchaser_id]);
            let orderSummaryList = rows;
            let productIdList = [];
            for (let order of orderSummaryList) {
                productIdList.push(order.goods_id);
            }
            const result = await promisePool.execute(`
                select title,img_big_logo,current_price,goods_id
             from products
                where goods_id in (${productIdList.join(',')})
            `);
            let goodsList = result[0];
            for (let orderSummary of orderSummaryList) {
                for (let goods of goodsList) {
                    if (orderSummary.goods_id === goods.goods_id) {
                        Object.assign(orderSummary, goods);
                    }
                }
            }
            return orderSummaryList;
        }
        catch (err) {
            logger.error("getOrderSummary:" + err);
            return undefined;
        }
    },
    delOrder: async (order_id) => {
        try {
            const [rows] = await promisePool.execute(`delete from orders where order_id = ?`, [order_id]);
            return rows.affectedRows > 0;
        }
        catch (err) {
            logger.error("delOrder:" + err);
            return false;
        }
    },
    getOrdersOfMerchant: async (orderStatus, email) => {
        try {
            if (orderStatus === 'refund') {
                const [rows] = await promisePool.execute(`
                select o.order_id,p.title,o.receiver_address,o.logistics_information
                        ,o.is_refund,o.refund_reason,o.is_refund_allowed,o.is_paid,o.goods_count,
                       o.created_time
                from orders as o
                         join products as p
                              on o.goods_id=p.goods_id
                where o.merchant_id = (
                    select merchant_id
                    from merchants
                    where email = ?
                ) and o.is_refund= 1 ;
            `, [email]);
                if (rows.length) {
                    return rows;
                }
                else {
                    return false;
                }
            }
            else {
                const [rows] = await promisePool.execute(`
                select o.order_id,p.title,o.receiver_address,o.logistics_information
                        ,o.is_refund,o.refund_reason,o.is_refund_allowed,o.is_paid,o.goods_count,
                       o.created_time
                from orders as o
                         join products as p
                              on o.goods_id=p.goods_id
                where o.merchant_id = (
                    select merchant_id
                    from merchants
                    where email = ?
                )
            `, [email]);
                if (rows.length) {
                    return rows;
                }
                else {
                    return false;
                }
            }
        }
        catch (err) {
            logger.error("getOrdersOfMerchant:" + err);
            return false;
        }
    },
    updateLogistics: async (order_id, logistics_information) => {
        try {
            const [rows] = await promisePool.execute(`
                update orders
                set logistics_information = ? 
                where order_id = ? ;
            `, [logistics_information, order_id]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error("updateLogistics:" + err);
            return false;
        }
    },
    updateRefund: async (order_id) => {
        try {
            const [rows] = await promisePool.execute(`
          update orders
          set is_refund_allowed = 1
          where order_id = ? ;
        `, [order_id]);
            return rows.affectedRows === 1;
        }
        catch (err) {
            logger.error("updateRefund:" + err);
            return false;
        }
    },
    delOrderByMerchant: async (order_id) => {
        try {
            const [rows] = await promisePool.execute(`
          select created_time,is_paid
              from orders
          where order_id = ? ;
        `, [order_id]);
            if (rows.length) {
                const orderCreateTime = String(rows[0].created_time);
                if ((((Number(new Date()) - Number(new Date(orderCreateTime))) / 1000 / 60 / 60) > 24) && (rows[0].is_paid === 0)) {
                    const [rows1] = await promisePool.execute(`
              delete from orders
              where order_id = ?;
            `, [order_id]);
                    if (rows1.affectedRows === 1) {
                        return true;
                    }
                }
            }
            return false;
        }
        catch (err) {
            logger.error("delOrderByMerchant:" + err);
            return false;
        }
    }
};
