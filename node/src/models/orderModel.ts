import promisePool from "./dbPool.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import logger from "../dev/logger.js";
interface OrderOfMerchant{
    order_id: string|number|undefined|null;
    title: string|undefined|null;
    receiver_address: string|undefined|null;
    logistics_information:string|undefined|null;
    is_refund:string|number|boolean|undefined|null;
    refund_reason:string|undefined|null;
    is_refund_allowed:string|number|boolean|undefined|null;
    is_paid:string|number|boolean|undefined|null;
    goods_count:string|number|undefined|null;
    created_time:string|undefined|null;
}
export default {
    getUserId: async (userEmail: string): Promise<string> => {
        try {
            const [rows] = await promisePool.execute<RowDataPacket[]>(
                `
                    select purchaser_id, receiver_address
                    from purchasers
                    where email = ?
                `,
                [userEmail]
            );
            if (Array.isArray(rows) && rows.length > 0) {
                return JSON.stringify({
                    purchaser_id: rows[0]["purchaser_id"],
                    receiver_address: rows[0]["receiver_address"],
                });
            } else {
                return JSON.stringify({purchaser_id: "", receiver_address: ""});
            }
        } catch (err) {
            return JSON.stringify({purchaser_id: "", receiver_address: ""});
        }
    },
    getGoodsMerchantId: async (goodsId: string) => {
        try {
            const [rows] = await promisePool.execute<RowDataPacket[]>(
                `
                    select merchant_id
                    from products
                    where goods_id = ?
                `,
                [goodsId]
            );
            if (Array.isArray(rows) && rows.length > 0) {
                return rows[0]["merchant_id"];
            } else {
                return "";
            }
        } catch (err) {
            return "";
        }
    },
    createOrder: async (
        goods_id: string,
        goods_count: string,
        purchaser_id: string,
        merchant_id: string,
        receiver_address: string,
        created_time: string
    ): Promise<string> => {
        try {
            const [rows] = await promisePool.execute<ResultSetHeader>(
                `
                    insert into orders (goods_id, goods_count, purchaser_id, merchant_id, receiver_address,
                                        created_time,
                                        logistics_information)
                    values (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    goods_id,
                    goods_count,
                    purchaser_id,
                    merchant_id,
                    receiver_address,
                    created_time,
                    "信息还未更新",
                ]
            );
            if (rows.affectedRows > 0) {
                //返回order_id
                return String(rows.insertId);
            } else {
                return "-1";
            }
        } catch (err) {
            return "-1";
        }
    },
    paidOrder: async (
        is_paid: string | boolean,
        order_id: string
    ): Promise<boolean> => {
        try {
            const [rows] = await promisePool.execute<RowDataPacket[]>(
                `
                    select is_paid
                    from orders
                    where order_id = ?;
                `,
                [order_id]
            );
            if (rows[0].is_paid === 1 || rows[0].is_paid === true) {
                logger.info("订单重复支付");
                return false;
            }
        } catch (err) {
            logger.error("paidOrder:" + err);
            return false;
        }
        try {
            if (typeof is_paid === "string") {
                is_paid = is_paid === "true";
            }
            const [rows] = await promisePool.execute<ResultSetHeader>(
                `
                    update orders
                    set is_paid = ?
                    where order_id = ?;
                `,
                [is_paid, order_id]
            );
            return rows.affectedRows > 0;
        } catch (err) {
            logger.error("paidOrder:" + err);
            return false;
        }
    },
    refundOrder: async (
        is_refund: string | boolean,
        order_id: string,
        refund_reason: string
    ): Promise<boolean> => {
        if (typeof is_refund === "string") {
            is_refund = is_refund === "true";
        }
        try {
            const [rows] = await promisePool.execute<ResultSetHeader>(
                `
                    update orders
                    set is_refund     = ?,
                        refund_reason = ?
                    where order_id = ?
                `,
                [is_refund, refund_reason, order_id]
            );
            return rows.affectedRows > 0;
        } catch (err) {
            logger.error("refundOrder:" + err);
            return false;
        }
    },
    takeDelivery: async (is_take_delivery: boolean, order_id: string) => {
        try {
            const [rows] = await promisePool.execute<ResultSetHeader>(
                `
                    update orders
                    set is_take_delivery = ?
                    where order_id = ?
                `,
                [is_take_delivery, order_id]
            );
            return rows.affectedRows > 0;
        } catch (err) {
            logger.error("takeDelivery:" + err);
            return false;
        }
    },
    getOrderDetail: async (order_id: string | undefined): Promise<string | undefined> => {
        if (!order_id) {
            return undefined;
        }
        try {
            let detailResult: { [key: string]: any } = {}
            let goods_id: string | number;
            let [rows] = await promisePool.execute<RowDataPacket[]>(
                `
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
                `,
                [order_id]
            );
            if (Array.isArray(rows) && rows.length > 0) {
                goods_id = rows[0].goods_id;
                for (let key in rows[0]) {
                    if (key !== "goods_id") {
                        detailResult[key] = rows[0][key];
                    }
                }
                try {
                    let [rows] = await promisePool.execute<RowDataPacket[]>(`
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
                } catch (err) {
                    logger.error("getOrderDetail:" + err);
                    return undefined;
                }
            } else {
                return undefined;
            }
        } catch (err) {
            logger.error("getOrderDetail:" + err);
            return undefined;
        }
    },
    getOrderSummary: async (userEmail: string) :Promise<undefined|object>=> {
        try {
            //通过userEmail获取purchaser_id
            const purchaser_id = (await promisePool.execute<RowDataPacket[]>(`
                select purchaser_id
                from purchasers
                where email = ? ;
            `,[userEmail]))[0][0].purchaser_id;
            //通过purchaser_id获取该用户的所有订单
            const [rows] = await promisePool.execute<RowDataPacket[]>(`
                select order_id,created_time,is_take_delivery,goods_count,is_refund,is_refund_allowed,is_paid,goods_id
                from orders
                where purchaser_id = ? ;
            `,[purchaser_id]);
            let orderSummaryList =rows;
            let productIdList: number[] = [];
            for(let order of orderSummaryList){
                productIdList.push(order.goods_id);
            }
            const result = await promisePool.execute<RowDataPacket[]>(`
                select title,img_big_logo,current_price,goods_id
             from products
                where goods_id in (${productIdList.join(',')})
            `)
            let goodsList = result[0];
            for (let orderSummary of orderSummaryList){
                for (let goods of goodsList){
                    if(orderSummary.goods_id === goods.goods_id){
                        Object.assign(orderSummary,goods);
                    }
                }
            }
            return orderSummaryList;
        }catch (err){
            logger.error("getOrderSummary:" + err);
            return undefined;
        }
    },
    delOrder: async (order_id: string):Promise<boolean>=> {
        try {
            const [rows] = await promisePool.execute<ResultSetHeader>(
              `delete from orders where order_id = ?`
            ,[order_id])
            return rows.affectedRows > 0;
        }catch (err){
            logger.error("delOrder:" + err);
            return false;
        }
    },
    getOrdersOfMerchant:async (orderStatus:string,email:string):Promise<OrderOfMerchant[]|boolean>=>{
      try{
        if(orderStatus==='refund'){
          const [rows]=await promisePool.execute<RowDataPacket[]>(`
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
            `,[email])
          if(rows.length){
            return rows as OrderOfMerchant[];
          }else{
            return false;
          }
        }else{
          const [rows]=await promisePool.execute<RowDataPacket[]>(`
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
            `,[email])
          if(rows.length){
            return rows as OrderOfMerchant[];
          }else{
            return false;
          }
        }
      }catch (err){
        logger.error("getOrdersOfMerchant:"+err);
        return false;
      }
},
    updateLogistics:async (order_id:string,logistics_information:string):Promise<boolean>=>{
        try{
            const [rows]=await promisePool.execute<ResultSetHeader>(`
                update orders
                set logistics_information = ? 
                where order_id = ? ;
            `,[logistics_information,order_id]);
            return rows.affectedRows === 1;

        }catch (err){
            logger.error("updateLogistics:"+err);
            return false;
        }
    },
  updateRefund:async (order_id:string):Promise<boolean>=>{
      try{
        const [rows]=await promisePool.execute<ResultSetHeader>(`
          update orders
          set is_refund_allowed = 1
          where order_id = ? ;
        `,[order_id])
        return rows.affectedRows === 1;
      }catch (err){
        logger.error("updateRefund:"+err);
        return false;
      }
  },
  delOrderByMerchant:async (order_id:string):Promise<boolean>=>{
      try{
        const [rows]=await promisePool.execute<RowDataPacket[]>(`
          select created_time,is_paid
              from orders
          where order_id = ? ;
        `,[order_id])
        if(rows.length){
          const orderCreateTime:string=String(rows[0].created_time);
          if((((Number(new Date())-Number(new Date(orderCreateTime)))/1000/60/60) > 24 )&&( rows[0].is_paid=== 0)){
            const [rows1]=await promisePool.execute<ResultSetHeader>(`
              delete from orders
              where order_id = ?;
            `,[order_id])
            if(rows1.affectedRows===1){
              return true;
            }
          }
        }
        return false;
      }catch (err){
        logger.error("delOrderByMerchant:"+err);
        return false;
      }
  }
};
