import goodsModel from "../models/goodsModel.js";
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
        const category = String(req.query.category);
        const recommend = (req.query.recommend === 'true');
        const offset = String(req.query.offset);
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
            if (userEmail) { //存在,说明是已经登录的用户
                //从用户数据库中查找用户的偏好分类
                goodsModel.getUserPreference(userEmail)
                    .then((value) => {
                    if (value) { //value是一个字符串,由逗号隔开用户喜好的分类
                        const preferenceList = value.split(',');
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
    },
    searchGoods: (req, res) => {
        const keyword = String(req.query.keyword);
        const offset = String(req.query.offset);
        const email = res.userEmail;
        if (keyword && offset) {
            goodsModel.searchGoods(keyword, offset, email)
                .then((value) => {
                if (value) {
                    res.status(200).json({
                        message: "商品列表已返回",
                        data: value
                    });
                }
                else {
                    res.status(404).json({
                        message: "商品已加载完毕"
                    });
                }
            })
                .catch((err) => {
                res.status(500).json({
                    message: "没有正常拿到商品列表"
                });
            });
        }
        else {
            res.status(404).json({
                message: "商品已加载完毕"
            });
            return;
        }
    }
};
