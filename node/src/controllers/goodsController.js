import goodsModel from "../models/goodsModel.js";
import logger from "../dev/logger.js";
import jwt from "jsonwebtoken";
import configMessage from "../dev/nodeConfig.js";
const { secret } = configMessage.authentication;
function sendRandomList(res) {
    const randomOffset = Math.floor(Math.random() * 900) + 1;
    goodsModel.getGoodsData('%', String(randomOffset), '10')
        .then((value) => {
        if (value === undefined) {
            res.status(404).send(JSON.stringify({ message: "商品已加载完毕" }));
        }
        else {
            res.status(200).send(JSON.stringify({
                message: "商品列表已返回",
                data: value
            }));
        }
    })
        .catch((err) => {
        res.status(500).send(JSON.stringify({ message: "没有正常拿到商品列表" }));
    });
}
async function sendPreferenceList(res, preferenceList) {
    let finalData = [];
    let preIndex = 0;
    while (finalData.length < 10) {
        let randomOffset = Math.floor(Math.random() * 100);
        preIndex++;
        if (preIndex > preferenceList.length - 1) {
            preIndex = 0;
        }
        let category = preferenceList[preIndex];
        try {
            const value = await goodsModel.getGoodsData(category, String(randomOffset), '1');
            if (value !== undefined) {
                finalData = finalData.concat(value);
            }
        }
        catch (err) {
            res.status(500).send(JSON.stringify({ message: "没有正常拿到商品列表" }));
        }
    }
    res.status(200).send(JSON.stringify({
        message: "商品列表已返回,用户偏好列表",
        data: finalData
    }));
}
export default {
    getGoodsList: (req, res) => {
        const category = req.body.category;
        const recommend = req.body.recommend;
        const offset = req.body.offset;
        const token = req.cookies['authentication'];
        let userEmail = undefined;
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                userEmail = undefined;
            }
            else {
                userEmail = decoded.userEmail;
            }
        });
        if (recommend) {
            logger.info('走到了recommend===true分支.userEmail:' + userEmail);
            if (userEmail) { //存在,说明是已经登录的用户
                //从用户数据库中查找用户的偏好分类
                goodsModel.getUserPreference(userEmail)
                    .then((value) => {
                    if (value) { //value是一个字符串,由逗号隔开用户喜好的分类
                        const preferenceList = value.split(',');
                        logger.info('preferenceList:' + preferenceList);
                        sendPreferenceList(res, preferenceList);
                    }
                    else { //还没收集到该用户的偏好,随机返回点商品
                        sendRandomList(res);
                    }
                });
            }
            else { //说明是游客访问,随机返回点商品
                sendRandomList(res);
            }
        }
        else {
            //查询某个分类的商品
            logger.info('正在查询' + category);
            goodsModel.getGoodsData(category, offset, '10')
                .then((value) => {
                if (value === undefined) {
                    res.status(404).send(JSON.stringify({ message: "商品已加载完毕" }));
                }
                else {
                    res.status(200).send(JSON.stringify({
                        message: "商品列表已返回",
                        data: value
                    }));
                }
            })
                .catch((err) => {
                res.status(500).send(JSON.stringify({ message: "没有正常拿到商品列表" }));
            });
        }
    }
};