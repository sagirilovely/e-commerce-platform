import configMessage from "../dev/nodeConfig.js";
import jwt from "jsonwebtoken";
import logger from "../dev/logger.js";
const { secret, delay } = configMessage.authentication;
export default function setToken(res, email) {
    const newToken = jwt.sign({ userEmail: email }, secret, { expiresIn: delay });
    res.cookie('authentication', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', //当浏览器识别到是本站点时才会返回这个cookie
        maxAge: (delay)
    });
    logger.info('成功写入token:' + newToken);
}