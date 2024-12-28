import * as crypto from "node:crypto";
function createHashPassword(oriPassWord) {
    const hash = crypto.createHash('sha256');
    hash.update(oriPassWord);
    return hash.digest('base64');
}
export default createHashPassword;
