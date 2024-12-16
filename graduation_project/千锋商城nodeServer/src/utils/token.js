const path = require('path')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const { tokenKeep: TK, tokenSignkey: TSK } = require('../conf/config')

const getToken = async id => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/token.json'))
  const users = JSON.parse(data)

  const user = users.find(item => item.id === id)
  const token = jwt.sign({ id }, TSK, { expiresIn: TK })

  user ? user.token = token : users.push({ id, token })

  fs.writeFileSync(path.join(__dirname, '../db/token.json'), JSON.stringify(users))

  return token
}

const pauseToken = async (id, token) => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/token.json'))
  const users = JSON.parse(data)
  const user = users.find(item => item.id === id)

  if (!user) return 0

  const pause = await new Promise(resolve => {
    jwt.verify(token, 'guoxiang' ,(error, decoded) => {
      resolve(error ? error.message : 'ok', decoded)
    })
  })

  return pause
}

const removeToken = async id => {
  const data = await fs.readFileSync(path.join(__dirname, '../db/token.json'))
  const users = JSON.parse(data)

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      users.splice(i, 1)
      break
    }
  }

  await fs.writeFileSync(path.join(__dirname, '../db/token.json'), JSON.stringify(users))

  return true
}

module.exports = {
  getToken,
  pauseToken,
  removeToken
}
