import configMessage from "../dev/nodeConfig.js";
import jwt from "jsonwebtoken";
const { secret, delay } = configMessage.authentication;
export default function setToken(res, email) {
    const newToken = jwt.sign({ userEmail: email }, secret, { expiresIn: delay });
    res.cookie('authentication', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none', //当浏览器识别到是本站点时才会返回这个cookie
        maxAge: (delay)
    });
}
