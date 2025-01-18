import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
import {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";

interface UserInfo {
    email: string;
    password: string;
    created_time: string;
    profile_photo: string;
    nickname: string;
}
export default {
    //查询邮箱是否存在
    isEmailExist: async (email: string | undefined): Promise<boolean> => {
        if (!email) {
            return false;
        }
        try {
            let [rows] = await promisePool.execute('SELECT email FROM purchasers WHERE email = ?', [email])
            return (Array.isArray(rows) && (rows.length > 0));

        } catch (err) {
            logger.info('isEmailExist' + err);
            return false;
        }
    },
    //保存用户注册信息
    saveUserInformation: async (userInfo: UserInfo): Promise<boolean> => {
        const {email, password, created_time, profile_photo, nickname} = userInfo;
        try {
            let [result] = await promisePool.execute<ResultSetHeader>( `INSERT INTO purchasers (password, email, created_time, profile_photo, nickname) VALUES (?, ?, ?, ?, ?);`, [password, email, created_time, profile_photo, nickname] );
            return (result.affectedRows !== 0);
        }catch (err){
            logger.info('saveUserInformation' + err);
            return false
        }
    },
    //返回用户的密码(hash)
    getHashPassword:async (email:string):Promise<string|undefined>=>{
        type QueryResult = { password: string }& RowDataPacket; // 定义返回结果的类型
        try{
            let [rows]=await promisePool.execute<QueryResult []>(`select password from purchasers where email = ?`,[email]);
            if(rows.length > 0){//有长度说明查到了密码,则返回密码
                return rows[0]['password']
            }else{//没长度,说明没查到密码
                return undefined;
            }
        }catch(err){
            logger.info('getHashPassword' + err);
            return undefined;
        }
    }
}
