const { getList: MGT, add: MA, select: MS, remove: MR, selectAll: MSA, removeSelect: MRS, clear: MC, num: MN } = require('../model/cart')

const getList = async (req, res, next) => {
  const { id, current, pagesize } = req.query

  const result = await MGT(id - 0, current, pagesize)

  result.forEach(item => {
    delete item.img_big_logo
    delete item.goods_introduce
  })

  res.send({
    message: '获取购物车列表成功',
    code: 1,
    yourParams: {
      msg: '这是你带来的参数, 我带回去给你看看 ^_^',
      id,
      current,
      pagesize
    },
    cart: result
  })
}

const add = async (req, res, next) => {
  const { id, goodsId } = req.body

  const result = await MA(id - 0, goodsId - 0)

  if (result === 0) return res.send({
    message: '加入购物车失败, 你给我的商品 id 不存在',
    code: 0,
    tips: `你传递给我的 'goodsId' 是 : '${ goodsId }' ^_^`
  })

  res.send({
    message: '加入购物车成功 ! 你太有钱了 ! O(∩_∩)O哈哈~',
    code: 1
  })
}

const select = async (req, res, next) => {
  const { id, goodsId } = req.body

  const result = await MS(id - 0, goodsId - 0)

  if (result === 0) return res.send({
    message: '修改信息失败, 你还没有购买这件商品哦',
    code: 0,
    tips: `你传递给我的 'goodsId' 是 : '${ goodsId }' ^_^`
  })

  res.send({
    message: '修改购买信息成功',
    code: 1
  })
}

const remove = async (req, res, next) => {
  const { id } = req.query
  const goodsId = req.body.goodsId || req.query.goodsId

  const result = await MR(id - 0, goodsId - 0)

  if (result === 0) return res.send({
    message: '删除商品失败, 你还没有购买这件商品哦',
    code: 0,
    tips: `你传递给我的 'goodsId' 是 : '${ goodsId }' ^_^`
  })

  res.send({
    message: '删除商品成功',
    code: 1
  })
}

const selectAll = async (req, res, next) => {
  const { id, type } = req.body

  await MSA(id - 0, type - 0)

  res.send({
    message: '修改全部商品购买信息成功',
    code: 1
  })
}

const removeSelect = async (req, res, next) => {
  const id  = req.query.id || req.params.id || req.body.id

  await MRS(id - 0)

  res.send({
    message: '删除所有已选中商品成功',
    code: 1
  })
}

const clear = async (req, res, next) => {
  const id  = req.query.id || req.params.id || req.body.id

  await MC(id - 0)

  res.send({
    message: '购物车已清空',
    code: 1
  })
}

const num = async (req, res, next) => {
  const { id, goodsId, number } = req.body

  const result = await MN(id - 0, goodsId - 0, number - 0)

  if (result === 0) return res.send({
    message: '修改购买数量失败, 你还没有购买这件商品哦',
    code: 0,
    tips: `你传递给我的 'goodsId' 是 : '${ goodsId }' ^_^`
  })

  if (result === 2) return res.send({
    message: '修改购买数量失败, 库存已经没有那么多了 ! 知道你有钱, 也不能乱花, 请理性消费 ! O(∩_∩)O哈哈~',
    code: 0
  })

  res.send({
    message: '修改购买数量成功 !',
    code: 1
  })
}

const pay = async (req, res, next) => {
  res.send({
    message: '你要给我钱, 哎 ~ 我就是不收 ! 哎 ~ 我就是玩 !',
    code: 1
  })
}

module.exports = {
  getList,
  add,
  select,
  remove,
  selectAll,
  removeSelect,
  clear,
  num,
  pay
}
