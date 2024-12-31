import configMessage from "../dev/nodeConfig.js";
import nodemailer from "nodemailer";
function sendEmail(to, subject, newVerifyCode, host) {
    return new Promise((resolve, reject) => {
        nodemailer.createTransport(configMessage.eMailConfig).sendMail({
            from: configMessage.eMailConfig.auth.user,
            to: to,
            subject: subject,
            html: `
            <h1>才...才不是特意发给你的呢！(哼！(￣^￣))</h1>
            <div>是你在本小姐的网站上要的那...那个嘛，诺，给你好了(///▽///):</div> 
            <h2 style="color: red;">${newVerifyCode}</h2>
            <div>你...你可以记得保管好哦！可不能弄丢了(其实也只有5分钟有效期嘻嘻~(≧▽≦))</div> 
            <div>咳咳嗯，呀什么？！你没有要过这个？才...才不是本小姐搞错了！(///▽///)</div> 
             <div>一定是有人用了你的邮箱啦，本小姐来都来了，你要不要...顺便来本小姐的网站看看？(￣▽￣)</div>
            <br> <span>就...就是这个哦：<a href="http://${host}">http://${host}</a></span>
             <div>才...才不是喜欢你呢！哼！(///▽///)</div>
            `,
        }, (err, info) => {
            if (err) {
                reject(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
export default sendEmail;
