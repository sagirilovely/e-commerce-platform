import promisePool from "./dbPool.js";
import logger from "../dev/logger.js";
export default {
    //查询邮箱是否存在
    isEmailExist: async (email) => {
        if (!email) {
            return false;
        }
        try {
            let [rows] = await promisePool.execute('SELECT email FROM purchasers WHERE email = ?', [email]);
            return !(Array.isArray(rows) && (rows.length > 0));
        }
        catch (err) {
            logger.info('isEmailExist' + err);
            return false;
        }
    },
    //保存用户注册信息
    saveUserInformation: async (userInfo) => {
        const { email, password, created_time, profile_photo, nickname } = userInfo;
        try {
            let [result] = await promisePool.execute(`INSERT INTO purchasers (password, email, created_time, profile_photo, nickname) VALUES (?, ?, ?, ?, ?);`, [password, email, created_time, profile_photo, nickname]);
            return (result.affectedRows !== 0);
        }
        catch (err) {
            logger.info('saveUserInformation' + err);
            return false;
        }
    },
    //返回用户的密码(hash)
    getHashPassword: async (email) => {
        try {
            let [rows] = await promisePool.execute(`select password from purchasers where email = ?`, [email]);
            if (rows.length > 0) { //有长度说明查到了密码,则返回密码
                return rows[0]['password'];
            }
            else { //没长度,说明没查到密码
                return undefined;
            }
        }
        catch (err) {
            logger.info('getHashPassword' + err);
            return undefined;
        }
    }
};
