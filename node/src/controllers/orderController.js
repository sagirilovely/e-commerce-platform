import orderModel from "../models/orderModel.js";
export default {
    createOrder: async (req, res) => {
        const goods_id = req.body.goods_id;
        const goods_count = req.body.goods_count;
        const userEmail = res.userEmail;
        const time = new Date();
        if (!goods_id || !goods_count || !userEmail) {
            res.status(500).json({ message: "创建订单失败" });
            return;
        }
        //通过email查询用户id 和收货地址
        const merchant = await orderModel.getUserId(userEmail);
        const purchaser_id = JSON.parse(merchant).purchaser_id;
        const receiver_address = JSON.parse(merchant).receiver_address;
        if (purchaser_id === "" || receiver_address === "") {
            res
                .status(403)
                .json({ message: "缺少一些用户信息,请确认收货地址等信息填写正确" });
        }
        const created_time = time.getFullYear() +
            "-" +
            (time.getMonth() + 1) +
            "-" +
            time.getDate() +
            " " +
            time.getHours() +
            ":" +
            time.getMinutes() +
            ":" +
            time.getSeconds();
        //通过商品id查询商家id
        const merchant_id = await orderModel.getGoodsMerchantId(goods_id);
        //创建订单
        orderModel
            .createOrder(goods_id, goods_count, purchaser_id, merchant_id, receiver_address, created_time)
            .then((value) => {
            if (value === "-1") {
                res.status(500).json({ message: "创建订单失败" });
                return;
            }
            else {
                res.status(200).json({
                    message: "创建订单成功",
                    data: {
                        order_id: value,
                    },
                });
                return;
            }
        })
            .catch((err) => {
            res.status(500).json({ message: "创建订单失败" });
        });
    },
    paidOrder: (req, res) => {
        const is_paid = req.body.is_paid;
        const order_id = req.body.order_id;
        if (!is_paid || !order_id) {
            res.status(403).json({ message: "支付订单失败" });
            return;
        }
        orderModel
            .paidOrder(is_paid, order_id)
            .then((value) => {
            if (value) {
                res.status(200).json({ message: "支付订单成功" });
            }
            else {
                res.status(403).json({ message: "支付订单失败" });
            }
        })
            .catch((err) => {
            res.status(500).json({ message: "服务器出错" });
        });
    },
    refundOrder: (req, res) => {
        let is_refund = req.body.is_refund;
        const order_id = req.body.order_id;
        const refund_reason = req.body.refund_reason;
        if (refund_reason.length > 100) {
            res.status(403).json({ message: "退款原因过长" });
            return;
        }
        if (!is_refund || !order_id) {
            res.status(403).json({ message: "申请退款失败" });
            return;
        }
        if (typeof is_refund === "string") {
            is_refund = is_refund === "true";
        }
        orderModel
            .refundOrder(is_refund, order_id, refund_reason)
            .then((value) => {
            if (value) {
                res.status(200).json({ message: "成功更新用户申请退款状态" });
            }
            else {
                res.status(403).json({ message: "申请退款失败" });
            }
        })
            .catch((err) => {
            res.status(500).json({ message: "服务器出错" });
        });
    },
    deliveryOrder: (req, res) => {
        const order_id = req.body.order_id;
        let is_take_delivery = req.body.is_take_delivery;
        if (!is_take_delivery || !order_id) {
            res.status(403).json({ message: "确认收货失败" });
            return;
        }
        if (typeof is_take_delivery === "string") {
            is_take_delivery = is_take_delivery === "true";
        }
        orderModel
            .takeDelivery(is_take_delivery, order_id)
            .then((value) => {
            if (value) {
                res.status(200).json({ message: "确认收货成功" });
            }
            else {
                res.status(403).json({ message: "确认收货失败" });
            }
        })
            .catch((err) => {
            res.status(500).json({ message: "服务器出错" });
        });
    },
    getOrderDetail: (req, res) => {
        let order_id = String(req.query.order_id);
        const userEmail = res.userEmail;
        if (!order_id || !userEmail) {
            res.status(403).json({ message: "获取订单详情失败" });
            return;
        }
        orderModel.getOrderDetail(order_id)
            .then((value) => {
            if (!value) {
                res.status(403).json({ message: "获取订单详情失败" });
                return;
            }
            else {
                res.status(200).json({
                    message: "获取订单详情成功",
                    data: JSON.parse(value)
                });
                return;
            }
        }).catch((err) => {
            res.status(500).json({ message: "服务器出错" });
        });
    }
};