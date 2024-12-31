import configMessage from "../dev/nodeConfig.js";
import express from "express";
import goodsController from "../controllers/goodsController.js";
const routers=express.Router();
const getGoodsList=goodsController.getGoodsList;
routers.get('/list',getGoodsList);

export default routers;