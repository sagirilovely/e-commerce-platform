import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

let filePath = fileURLToPath(import.meta.url);//这里拿到是本js文件的绝对路径
let dirPath = path.dirname(filePath)//这里拿到的是本js文件的目录路径
//本js文件与json配置文件在同一个目录,因此可以拼出配置文件的完整绝对路径:
let logsPath = path.join(dirPath, 'logs.txt');
let order=0;//记录序号
function logger(logMessage:string|undefined, logLevel:string='INFO'):void {
    order++;
    //获取时间:
    let now=new Date();
    let time:string=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    //控制台打印信息:
    let printMessage:string=`## |${order}| ${time}
## [${logLevel}] ${logMessage} 
-----------------------------------------------------------------------------------`
    console.log(printMessage);

    //追加进入logs.txt
    fs.appendFileSync(logsPath,printMessage+'\n');
}

export default {
    info:(message:string|undefined):void=>{logger(message,'INFO')},
    warn:(message:string|undefined):void=>{logger(message,'WARN')},
    error:(message:string|undefined):void=>{logger(message,'ERROR')},
}
