import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import logger from "./logger.js";

//import.meta.url;这里拿到是本js文件的绝对路径,但是前面加了个 `file://`协议头
// 因此需要通过fileURLToPath来把协议头去除
let filePath = fileURLToPath(import.meta.url);//这里拿到是本js文件的绝对路径
let dirPath = path.dirname(filePath)//这里拿到的是本js文件的目录路径
//本js文件与json配置文件在同一个目录,因此可以拼出配置文件的完整绝对路径:
let jsonPath = path.join(dirPath, 'nodeConfig.json');
let configMessage = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

configMessage.expressStatic.staticURL=path.join(path.dirname(dirPath),'public');

export default configMessage;
