import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
import {ResultSetHeader} from "mysql2";

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

            return !(Array.isArray(rows) && (rows.length > 0));

        } catch (err) {
            logger.info('isEmailExist' + err);
            return false;
        }
    },
    saveUserInformation: async (userInfo: UserInfo): Promise<boolean> => {
        const {email, password, created_time, profile_photo, nickname} = userInfo;
        try {
            let [result] = await promisePool.execute<ResultSetHeader>( `INSERT INTO purchasers (password, email, created_time, profile_photo, nickname) VALUES (?, ?, ?, ?, ?);`, [password, email, created_time, profile_photo, nickname] );
            return (result.affectedRows !== 0);
        }catch (err){
            logger.info('saveUserInformation' + err);
            return false
        }
    }
}
