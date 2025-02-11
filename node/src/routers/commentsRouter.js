import Express from "express";
const routers = Express.Router();
import commentsController from "../controllers/commentsController.js";
routers.get('/detail', commentsController.getCommentsOfGoods);
routers.post('/', commentsController.addComments);
routers.get('/merchant', commentsController.getCommentsOfMerchant);
routers.post('/merchant', commentsController.addReply);
export default routers;
