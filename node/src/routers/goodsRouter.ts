import configMessage from "../dev/nodeConfig.js";
import express from "express";
import goodsController from "../controllers/goodsController.js";
const routers=express.Router();

routers.get('/list',goodsController.getGoodsList);
routers.get('/search',goodsController.searchGoods);
export default routers;