// 从配置文件获取密钥
import nodeConfig from '../dev/nodeConfig.js';
// 导入 jwt 模块
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import logger from "../dev/logger.js";
import setToken from "../util/setToken.js";

// 密钥
const {secret, delay} = nodeConfig.authentication;

// 扩展 Response 接口以包含 userEmail 属性
declare global {
    namespace Express {
        interface Response {
            userEmail?: string;
        }
    }
}

//若客户端向 /verify /goods  请求则直接放行
// 否则进入token验证环节
// 先从cookie拿出token
// 放入verify验证,通过则放行,并把用户userEmail挂在res上方便后面的中间件直接拿;并更新token的时间
// 没通过则返回错误码401

// 验证 JWT Token 的中间件
function verifyToken(req: Request, res: Response, next: NextFunction) {
    // 获取客户端请求的路径
    const requested = req.url.split('/')[1]; // 这里可以拿到 "api/v1/" 后面的部分
    if (requested === 'verify' ||  requested === 'goods') {
        next();//如果客户端在请求注册或登录,则直接放行
    } else {
        const token = req.cookies['authentication'];//从cookies中取出authentication
        //由于在此中间件前已经使用了cookieParser,这里cookie是一个对象,可以直接靠.语法取出数据
        //验证token
        jwt.verify(token, secret, (error: jwt.VerifyErrors | null, decoded: any) => {
            if (error) {
                if (!token) {
                    console.log('未提供Token')
                    return res.status(401).json({message: '未提供Token'});
                }
                //事实上,cookie与token设置的是同一个时间长度,根本不存在有token但无效的情况
                return res.status(401).json({message: 'Token无效或已过期'});
            } else {
                //拿到上一次token的时间戳与当前时间戳,得到剩余天数,若小于delay/2则生成新token
                const remainingTime = (((new Date()).getTime()) - decoded.exp * 1000)
                //decoded.exp的时间戳是s, js的时间戳是ms
                if (remainingTime < (parseInt(delay) / 2)) {
                    //往cookie里放新token
                    setToken(res,decoded.userEmail);
                }
                // 通过验证，把用户 userEmail 挂在 res 对象上，并放行
                res.userEmail = decoded.userEmail;
                req.body.userEmail=decoded.userEmail;
                next();
            }
        });
    }
}

export default verifyToken;
