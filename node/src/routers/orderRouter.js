import express from 'express';
import orderController from '../controllers/orderController.js';
const routers = express.Router();
routers.post('/', orderController.createOrder);
routers.patch('/paid', orderController.paidOrder);
routers.patch('/refund', orderController.refundOrder);
routers.patch('/delivery', orderController.deliveryOrder);
routers.get('/detail', orderController.getOrderDetail);
export default routers;