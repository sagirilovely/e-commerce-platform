function createVerifyCode(digit) {
    let newVerifyCode = '';
    for (let i = 0; i < digit; i++) {
        newVerifyCode = newVerifyCode + String(Math.floor(Math.random() * 10));
    }
    return newVerifyCode;
}
export default createVerifyCode;
