const { getList: MGT, getGoodsById: MGBI, category: MC } = require('../model/goods')

const getList = async (req, res, next) => {
  const { current, pagesize, search, filter, saleType, sortType, sortMethod, category } = req.query

  const clist = await MC()

  if (category && !clist.some(item => item === category)) return next({
    message: '获取商品列表失败, 没有你所选择的分类',
    code: 0,
    tips: `你传递给我的 'category' 信息是 : ${ category }`
  })

  const { list, total } = await MGT(current, pagesize, search, filter, saleType, sortType, sortMethod, category)

  list.forEach(item => {
    delete item.img_small_logo
    delete item.is_select
    delete item.cart_number
    delete item.goods_introduce
  })

  res.send({
    message: '获取商品列表成功',
    code: 1,
    yourParams: { msg: "这里是你传递过来的参数, 带给你看看 ^_^ ", current: current + '', pagesize: pagesize + '', search, filter, saleType: saleType.slice(0, -2), sortType, sortMethod, category },
    list,
    total
  })
}

const getGoodsById = async (req, res, next) => {
  const { id } = req.query
  const result = await MGBI(id)

  if (!result) return next({
    message: `你要查询的 goods_id 为 ${ id } 的商品不存在, 请仔细检查一下 'id' 再次查询 ^_^`,
    code: 2,
    tips: `你传递给后端的 id 内容是 : '${ id }'`
  })

  delete result.img_small_logo
  delete result.is_select
  delete result.cart_number

  res.send({
    message: '获取商品详细信息成功',
    code: 1,
    yourParams: { msg: "这里是你传递过来的参数, 带给你看看 ^_^ ", id: id + ''},
    info: result
  })
}

const category = async (req, res, next) => {
  const result = await MC()

  res.send({
    message: '获取分类列表成功',
    code: 1,
    list: result
  })
}

module.exports = {
  getList,
  getGoodsById,
  category
}
