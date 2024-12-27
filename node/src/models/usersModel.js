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
    }
};
