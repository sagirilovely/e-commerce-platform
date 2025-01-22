import multer from "multer";
import path from "path";
import configMessage from "../dev/nodeConfig.js";
const { staticURL } = configMessage.expressStatic;
export function createUpload(savePath) {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            // 配置要保存到什么位置
            callback(null, path.join(staticURL, savePath));
        },
        filename: (req, file, callback) => {
            // 配置要保存的文件名
            const saveFileName = req.body.userEmail;
            callback(null, saveFileName + path.extname(file.originalname));
        }
    });
    const upload = multer({
        storage,
        limits: { fileSize: 1024 * 1024 * 5 }, // 可选限制文件大小
        fileFilter(req, file, callback) {
            // 只允许上传图片类型
            const filetypes = /jpeg|jpg|png|gif/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            if (extname && mimetype) {
                return callback(null, true); // 文件类型符合要求
            }
            else {
                return callback(null, false); // 文件类型不符合要求
            }
        }
    });
    return upload;
}
