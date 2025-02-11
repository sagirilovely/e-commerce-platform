import express from "express";
import merchantController from '../controllers/merchantController.js';
const routers = express.Router();
import { createUpload } from "../middlewares/multer.js";
const userUpload = createUpload("goods");
routers.get('/goods', merchantController.getMerchantGoodsList);
routers.post('/goods', merchantController.updateMerchantGoods);
routers.post('/img/convert', userUpload.single('img'), merchantController.imgConvert);
export default routers;
