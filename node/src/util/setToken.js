import configMessage from "../dev/nodeConfig.js";
import jwt from "jsonwebtoken";
const { secret, delay } = configMessage.authentication;
export default function setToken(res, email, isLogout = false, isAdmin = false) {
    const newToken = jwt.sign({ userEmail: email }, secret, { expiresIn: delay });
    if (isAdmin) {
        res.cookie('adminToken', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (delay)
        });
        if (isLogout) {
            //注销
            res.cookie('adminToken', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none', //当浏览器识别到是本站点时才会返回这个cookie
                maxAge: (1)
            });
        }
    }
    if (!isLogout) {
        //登录
        res.cookie('authentication', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (delay)
        });
    }
    else {
        //注销
        res.cookie('authentication', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //当浏览器识别到是本站点时才会返回这个cookie
            maxAge: (1)
        });
    }
}
