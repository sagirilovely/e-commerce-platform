import * as crypto from "node:crypto";
/**
 * 使用SHA-256算法生成密码的哈希值
 *
 * @param oriPassWord 原始密码字符串
 * @returns 返回经过SHA-256哈希处理后的密码字符串，使用base64编码
 */
function createHashPassword(oriPassWord) {
    const hash = crypto.createHash('sha256');
    hash.update(oriPassWord);
    return hash.digest('base64');
}
export default createHashPassword;
