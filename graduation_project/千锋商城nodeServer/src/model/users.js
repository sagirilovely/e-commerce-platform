const fs = require('fs')
const path = require('path')

const getList = async s => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const list = JSON.parse(data).filter(item => item.nickname.search(s) !== -1 || item.identity.search(s) !== -1)
  return list
}

const login = async (username, password) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  return JSON.parse(data).filter(item => item.username === username && item.password === password)[0]
}

const getUserByUsername = async username => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  return JSON.parse(data).find(item => item.username === username)
}

const register = async (username, password, nickname) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)

  users.push({
    id: users.length ? users[users.length - 1].id - 0 + 1 : 1,
    username,
    password,
    nickname,
    identity: '学生',
    gender: '',
    age: '',
    createTime: Date.now(),
    updateTime: Date.now(),
    cart: []
  })

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'

}

const getUserById = async id => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  return JSON.parse(data).find(item => item.id === id)
}

const update = async (id, gender, age, nickname) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  if (gender) user.gender = gender
  if (nickname) user.nickname = nickname
  if (age) user.age = age
  user.updateTime = Date.now()

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

const password = async (id, p) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/users.json'), 'utf-8')
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  user.password = p
  user.updateTime = Date.now()

  fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(users))

  return 'ok'
}

module.exports = {
  getList,
  login,
  getUserByUsername,
  register,
  getUserById,
  update,
  password
}
