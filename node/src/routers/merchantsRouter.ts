import configMessage from "../dev/nodeConfig.js";
import express from "express";
import merchantController from '../controllers/merchantController.js'
const routers=express.Router();
import { createUpload } from "../middlewares/multer.js";
const userUpload = createUpload("goods");
routers.get('/goods',merchantController.getMerchantGoodsList);
routers.patch('/goods',merchantController.updateMerchantGoods);
routers.post('/goods',merchantController.addMerchantGoods);
routers.delete('/goods',merchantController.deleteMerchantGoods)
routers.post('/img/convert',userUpload.single('img'),merchantController.imgConvert);
export default routers;