const { pauseToken: PT } = require('../utils/token')

// 验证 token
const verifyToken = async (req, res, next) => {
  const { authorization: az } = req.headers
  const id = req.query.id || req.params.id || req.body.id

  if (!az) return next({
    message: `你的 请求头 里面没有 'authorization' 字段 (^o^)/~`,
    code: 401,
    tips: `请检查你是否设置了请求头信息, 检查单词是否正确 !!! 注意空格问题 !!!`
  })

  if (!id) return next({
    message: `想获取购物车, 你需要给我一个 'id' 信息, 但是你并没有哦 -_- `,
    code: 5
  })

  if (!/^\d+$/.test(id)) return next({
    message: 'id 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 id 内容是 : '${ id }'`
  })

  const result = await PT(id - 0, az)

  if (result === 0) return next({
    message: '抱歉 ! 你还没有登录 !',
    code: 0
  })

  if (result === 'jwt expired') return next({
    message: '抱歉 ! 你的登录状态已经过期, 请重新登录',
    code: 401,
    tips: '重新登录一遍就好了'
  })

  if (result === 'invalid signature') return next({
    message: '抱歉 ! 你的 token 标识有问题, 不是一个正确的 token',
    code: 401,
    tips: 'token 字符串出问题了, 重新登录一下试试吧 !'
  })

  next()
}

const getList = (req, res, next) => {
  let { current, pagesize } = req.query

  current === undefined && (current = 1)
  pagesize === undefined && (pagesize = 1)

  if (!/^\d+$/.test(current)) return next({
    message: 'current 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 current 内容是 : '${ current }'`
  })

  if (!/^\d+$/.test(pagesize)) return next({
    message: 'pagesize 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 pagesize 内容是 : '${ pagesize }'`
  })

  next()
}

const add = (req, res, next) => {
  const goodsId = req.body.goodsId || req.query.goodsId

  if (!goodsId) return next({
    message: 'goodsId 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 goodsId 内容是 : '${ goodsId }'`
  })

  next()
}

const selectAll = (req, res, next) => {
  const { type } = req.body

  if (!type) return next({
    message: `想要修改全部商品的购买状态, 需要传递一个 'type' 信息哦, 但是你并没有给我`,
    code: 5,
    tips: `你传递给后端的 type 内容是 : '${ type }'`
  })

  if (!/^[01]$/.test(type)) return next({
    message: `type 内容不对哦 (#^.^#), 需要的是一个 '0' 或者 '1', 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 type 内容是 : '${ type }'`
  })

  next()
}

const num = (req, res, next) => {
  const { number } = req.body

  if (!number) return next({
    message: `想要修改购买数量, 需要传递一个 'number' 信息哦, 但是你并没有给我`,
    code: 5,
    tips: `你传递给后端的 number 内容是 : '${ number }'`
  })

  if (!/^\d+$/.test(number)) return next({
    message: `number 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 number 内容是 : '${ number }'`
  })

  if (number - 0 < 1) return next({
    message: '你的购买数量不能少于 1 啊, 那不就没有了吗 ?  *_*',
    code: 0
  })

  next()
}

module.exports = {
  getList,
  verifyToken,
  add,
  selectAll,
  num
}
