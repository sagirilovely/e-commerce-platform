//导入数据库配置
import configMessage from '../dev/nodeConfig.js'
let databaseConfig=configMessage.databaseConfig;
//连接数据库
import {createPool} from 'mysql2/promise';
const promisePool = createPool({
  host:databaseConfig.host,
  user:databaseConfig.user,
  password:databaseConfig.password,
  database:databaseConfig.database, // 连接的数据库
  waitForConnections:databaseConfig.waitForConnections, // 当没有可用连接时，是否等待
  connectionLimit:databaseConfig.connectionLimit, // 最大连接数
  queueLimit:databaseConfig.queueLimit // 最大等待队列长度
})

export default promisePool;