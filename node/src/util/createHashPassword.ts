import * as crypto from "node:crypto";
const hash=crypto.createHash('sha256');

function createHashPassword(oriPassWord:string):string{
    hash.update(oriPassWord);
    return hash.digest('base64');
}
export default createHashPassword;