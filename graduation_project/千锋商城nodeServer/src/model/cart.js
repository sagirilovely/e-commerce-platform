const fs = require('fs')
const path = require('path')

const getList = async (id, c, p) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  let cart = JSON.parse(data).find(item => item.id === id).cart

  if (c && p) return cart.slice((c - 1) * p, c * p)

  return cart
}

const add = async (id, gId) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const cart = users.find(item => item.id === id).cart

  const data2 = await fs.readFileSync(path.join(__dirname, '../db/goods.json'), 'utf-8')
  const item = JSON.parse(data2).find(item => item.goods_id === gId)

  if (!item) return 0

  const goods = cart.find(item => item.goods_id === gId)

  if (!goods) {
    item.cart_number = 1
    delete item.goods_introduce
    cart.push(item)
  } else {
    goods.cart_number++
  }

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const select = async (id, gId) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const cart = users.find(item => item.id === id).cart

  const goods = cart.find(item => item.goods_id === gId)

  if (!goods) return 0

  goods.is_select = !goods.is_select

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const remove = async (id, gId) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  const goods = user.cart.find(item => item.goods_id === gId)

  if (!goods) return 0

  user.cart = user.cart.filter(item => item.goods_id !== gId)

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const selectAll = async (id, type) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  user.cart.forEach(item => item.is_select = type ? true : false)

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const removeSelect = async id => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  user.cart = user.cart.filter(item => !item.is_select)

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const clear = async id => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  user.cart = []

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const num = async (id, gId, n) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const cart = users.find(item => item.id === id).cart

  const item = cart.find(item => item.goods_id === gId)

  if (!item) return 0

  if (n > item.goods_number) return 2

  item.cart_number = n

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

module.exports = {
  getList,
  add,
  select,
  remove,
  selectAll,
  removeSelect,
  clear,
  num
}
