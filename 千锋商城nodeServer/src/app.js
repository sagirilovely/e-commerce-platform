const express = require('express')
const cookieParser = require('cookie-parser')
const { errHandler, emptyHandler } = require('./controller/app')
const path = require('path')
const chalk = require('chalk')
const glob = require('glob')
const cors = require('cors')

const app = express()
app.use(cors())


// ***********************************
//    explanatory start 配置 art-template
// ***********************************

app.engine('html', require('express-art-template'))
app.set('view options', { debug: process.env.NODE_ENV !== 'production' })

// ***********************************
//    explanatory end 配置 art-template
// ***********************************





// ***********************************
//    explanatory start 请求解析
// ***********************************

// 配置解析请求体
app.use(express.urlencoded())

// 配置解析 cookie
app.use(cookieParser())

// ***********************************
//    explanatory end 请求解析
// ***********************************






// ***********************************
//    explanatory start 统一处理静态资源
// ***********************************

app.use('/public', express.static(path.join(__dirname, './public/')))

// ***********************************
//    explanatory end 统一处理静态资源
// ***********************************






// ***********************************
//    explanatory start 统一挂载路由
// ***********************************

glob.sync('./routes/**/*.js').forEach(item => {
  const fileName = item.slice(9, -3)
  typeof require(item) === 'function' && ( fileName === 'app' ? app.use(require(item)) : app.use('/' + fileName, require(item)) )
})

// ***********************************
//    explanatory end 统一挂载路由
// ***********************************


// 统一错误处理
app.use(errHandler)
app.use(emptyHandler)


const server = app.listen(process.argv[2] || 2332, () => {
  const port = server.address().port
  const text = `
    恭喜你, 服务器启动成功啦 ${ chalk.cyan('^_^') } !
    目前正在监听 ${ chalk.red(port) } 端口号 !
    基准地址: ${ chalk.red('http://localhost:' + port) }
  `
  console.log(text)
})
