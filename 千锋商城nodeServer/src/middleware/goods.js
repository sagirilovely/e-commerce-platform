const getList = (req, res, next) => {
  // 参数验证
  let { current, pagesize, search, filter, saleType, sortType, sortMethod } = req.query

  current === undefined && (req.query.current = current = 1)
  pagesize === undefined && (req.query.pagesize = pagesize = 12)
  search === undefined && (req.query.search = '')
  filter === undefined && (req.query.filter = '')
  saleType === undefined && (req.query.saleType = saleType = 10)
  sortType === undefined && (req.query.sortType = sortType = 'id')
  sortMethod === undefined && (req.query.sortMethod = sortMethod = 'ASC')

  // 验证 current
  if (!/^\d*$/.test(current)) return next({
    message: 'current 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 current 内容是 : '${ current }'`
  })

  // 验证 pagesize
  if (!/^\d*$/.test(pagesize)) return next({
    message: 'pagesize 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 pagesize 内容是 : '${ pagesize }'`
  })

  // 验证 filter
  if (!/^([a-z]+?,??)*?$/ig.test(filter)) return next({
    message: `filter 内容不对哦 (#^.^#), 需要的是 'key,key2' 这样子的字符串, 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 filter 内容是 : '${ filter }'`
  })

  // 验证 saleType
  if (!/^([5-9]|10)$/.test(saleType)) return next({
    message: `saleType 内容不对哦 (#^.^#), 需要的是 5 到 10 之间的数字, 表示 5折 到 没有折扣, 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 saleType 内容是 : '${ saleType }'`
  })

  // 验证 sortType
  if (!/^(id|price|sale)$/i.test(sortType)) return next({
    message: `sortType 内容不对哦 (#^.^#), 需要的是 'id' 或者 'sale' 或者 'price', 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 sortType 内容是 : '${ sortType }'`
  })

  // 验证 sortMethod
  if (!/^(asc|desc)$/i.test(sortMethod)) return next({
    message: `sortMethod 内容不对哦 (#^.^#), 需要的是 'ASC' 或者 'DESC', 但是你给的并不是`,
    code: 5,
    tips: `你传递给后端的 sortMethod 内容是 : '${ sortMethod }'`
  })

  req.query.saleType += '0%'

  next()
}

const getGoodsById = (req, res, next) => {
  const id = req.query.id || req.params.id

  if (id === undefined) return next({
    message: '你想查询某一个商品的详细信息, 需要传递该商品的 id 给我哦 ^_^ ',
    code: 5,
    tips: `你传递给后端的 id 内容是 : 'undefined'`
  })

  if (!/^\d+$/.test(id)) return next({
    message: 'id 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 id 内容是 : '${ id }'`
  })

  req.query.id = id - 0

  next()
}

module.exports = {
  getList,
  getGoodsById
}
