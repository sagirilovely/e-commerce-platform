import express from 'express';
import  orderController from '../controllers/orderController.js';
const routers = express.Router();

routers.post('/', orderController.createOrder);
routers.patch('/paid', orderController.paidOrder);
routers.patch('/refund', orderController.refundOrder);
routers.patch('/delivery', orderController.deliveryOrder);
routers.get('/detail', orderController.getOrderDetail);
routers.get('/summary', orderController.getOrderSummary);
routers.delete('/',orderController.delOrder);
routers.get('/merchant',orderController.getOrdersOfMerchant);
routers.patch('/merchant/logistics',orderController.updateLogistics);
routers.patch('/merchant/refund',orderController.updateRefund);
routers.delete('/merchant',orderController.delOrderByMerchant);
export default routers;