const fs = require('fs')
const path = require('path')
const { keep } = require('../conf/config')
!keep && fs.writeFileSync(path.join(__dirname, '../db/token.json'), JSON.stringify([]))

const errHandler =  (err, req, res, next) => {

  let result = { ...err }
  const tips = {
    teacher1: '细心一些, 仔细检查。',
    teacher2: '请求方式对不对 ? ',
    teacher3: '参数携带对不对 ? ',
    teacher4: '参数有没有带够 ? ',
    teacher5: '如果是 POST 请求, 你是否设置了请求头 ? ',
    teacher6: '如果你设置了请求头, 那么你的请求头是不是写错了 ? '
  }

  if (err.code === 5) result = { ...err, ...tips }

  res.send(result)
}

const emptyHandler = (req, res, next) => {
  const href = `http://${ req.get('host') }${ req.originalUrl }`
  res.render('error.html', { href: href })
}

module.exports = {
  errHandler,
  emptyHandler
}
