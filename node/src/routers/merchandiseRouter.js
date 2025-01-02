import express from "express";
import merchandiseController from "../controllers/merchandiseController.js";
const routers = express.Router();
const { sendGoodsDetail } = merchandiseController;
routers.get('/detail', sendGoodsDetail);
export default routers;
