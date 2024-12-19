const fs = require('fs')
const path = require('path')

const getList = async (c, p, s, f, st, sortT, sortM, category) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/goods.json'), 'utf-8')
  let list = JSON.parse(data)

  if (category) list = list.filter(item => item.category === category)

  if (s) list = list.filter(item => item.title.search(s) !== -1 || item.goods_introduce.search(s) !== -1 || item.price.search(s) !== -1)

  if (f) {
    const tmp = f.split(',')
    tmp.forEach(item => {
      if (item === 'hot') list = list.filter(t => t.is_hot)
      if (item === 'sale') list = list.filter(t => t.is_sale)
    })
  }

  if (st !== '100%') list = list.filter(item => item.sale_type === st)

  switch (sortT) {
    case 'id': list.sort((a, b) => sortM === 'ASC' ? a.goods_id - b.goods_id : b.goods_id - a.goods_id); break
    case 'price': list.sort((a, b) => sortM === 'ASC' ? a.price - b.price : b.price - a.price); break
    case 'sale': list.sort((a, b) => sortM === 'ASC' ? parseInt(a.sale_type) - parseInt(b.sale_type) : parseInt(b.sale_type) - parseInt(a.sale_type)); break
  }

  return {
    list: list.slice((c - 1) * p, c * p),
    total: Math.ceil(list.length / p)
  }
}

const getGoodsById = async (id) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/goods.json'), 'utf-8')
  return JSON.parse(data).find(item => item.goods_id === id)
}

const category = async () => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/goods.json'), 'utf-8')
  const goods = JSON.parse(data)
  const arr = []

  goods.forEach(item => arr.push(item.category))

  return [ ...new Set(arr) ]
}

module.exports = {
  getList,
  getGoodsById,
  category
}
