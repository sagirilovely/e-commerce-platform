import express from "express";
import userController from "../controllers/userController.js";
const routers=express.Router();
import { createUpload } from "../middlewares/multer.js";
const userUpload = createUpload("profile");


routers.patch('/trolley',userController.updateUserTrolley);
routers.get('/trolley',userController.getUserTrolley)
routers.get('/address',userController.getUserAddress)
routers.patch('/address',userController.updateUserAddress);
routers.get('/password/code',userController.getPasswordCode);
routers.patch('/password',userController.updatePassword);
routers.patch('/profile',userUpload.single("userProfile"),userController.updateUserProfile)
routers.get('/info',userController.getUserInfo);
routers.patch('/nikename',userController.updateUserNikename);

routers.get('/merchant',userController.getMerchantInfo);
routers.patch('/merchant',userController.logoutMerchant);
export default routers;