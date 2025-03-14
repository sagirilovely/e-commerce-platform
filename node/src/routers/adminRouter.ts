import express from "express";
import adminController from '../controllers/adminController.js'

const routers=express.Router();

routers.get('/merchant',adminController.getMerchantInfo);
routers.patch('/merchant',adminController.updateMerchantGoods);
routers.get('/goods',adminController.getGoodsInfo);
routers.delete('/goods',adminController.deleteGoods);
routers.get('/purchaser',adminController.getPurchaserInfo);
routers.patch('/purchaser',adminController.updatePurchaserInfo);
routers.get('/admin',adminController.getAdminInfo);
routers.patch('/admin',adminController.addAdminInfo);
routers.delete('/admin',adminController.deleteAdmin);
routers.get('/logout',adminController.logout)
export default routers;