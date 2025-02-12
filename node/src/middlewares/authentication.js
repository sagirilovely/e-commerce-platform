// 从配置文件获取密钥
import nodeConfig from '../dev/nodeConfig.js';
// 导入 jwt 模块
import jwt from 'jsonwebtoken';
import setToken from "../util/setToken.js";
// 密钥
const { secret, delay } = nodeConfig.authentication;
//验证token并延时
function updateToken(req, res, next, TokenType = 'authentication') {
    const token = req.cookies[TokenType]; //从cookies中取出authentication
    //由于在此中间件前已经使用了cookieParser,这里cookie是一个对象,可以直接靠.语法取出数据
    //验证token
    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            if (!token) {
                console.log('未提供Token');
                return res.status(401).json({ message: '未提供Token' });
            }
            //事实上,cookie与token设置的是同一个时间长度,根本不存在有token但无效的情况
            return res.status(401).json({ message: 'Token无效或已过期' });
        }
        else {
            //拿到上一次token的时间戳与当前时间戳,得到剩余天数,若小于delay/2则生成新token
            const remainingTime = (((new Date()).getTime()) - decoded.exp * 1000);
            //decoded.exp的时间戳是s, js的时间戳是ms
            if (remainingTime < (parseInt(delay) / 2)) {
                //往cookie里放新token
                setToken(res, decoded.userEmail);
            }
            // 通过验证，把用户 userEmail 挂在 res 对象上，并放行
            res.userEmail = decoded.userEmail;
            req.body.userEmail = decoded.userEmail;
            next();
        }
    });
}
// 验证 JWT Token 的中间件
function verifyToken(req, res, next) {
    // 获取客户端请求的路径
    const requested = req.url.split('/')[1]; // 这里可以拿到 "api/v1/" 后面的部分
    if (requested === 'verify' || requested === 'goods') {
        const token = req.cookies['authentication']; //从cookies中取出authentication
        jwt.verify(token, secret, (error, decoded) => {
            //如果userEmail存在,则写入res
            if (error) {
                next(); //如果客户端在请求注册或登录,则直接放行
            }
            else {
                res.userEmail = decoded.userEmail;
                next(); //如果客户端在请求注册或登录,则直接放行
            }
        });
    }
    else if (requested === 'admin') {
        updateToken(req, res, next, 'adminToken');
    }
    else {
        updateToken(req, res, next, 'authentication');
    }
}
export default verifyToken;
