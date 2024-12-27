const { getList: MGT, login: ML, getUserByUsername: MGUBU, register: MR, getUserById: MGUBI, update: MU, password: MP } = require('../model/users')
const { getToken: GT, removeToken: RT } = require('../utils/token')
const { tokenKeep: TK } = require('../conf/config')

const getList = async (req, res, next) => {
  const { current: c, pagesize: p, search: s } = req.query

  const result = await MGT(s)

  res.send({
    message: '获取用户列表成功',
    code: 1,
    yourParams: { msg: "这里是你传递过来的参数, 带给你看看 ^_^ ", current: c + '', pagesize: p + '', search: s },
    list: result.slice((c - 1) * p, c * p),
    total: Math.ceil(result.length / p)
  })
}

const login = async (req, res, next) => {
  const { username, password } = req.body

  const result = await ML(username, password)

  if (!result) return next({
    message: '登录失败, 用户名或者密码不对 ! ',
    code: 0,
    tips: '你给我的用户名和密码不太对哦, 仔细检查一下有没有空格之类的错误!'
  })

  // 登录成功, 生成 token
  const token = await GT(result.id - 0)

  const hours = (TK / 3600).toFixed(2)

  res.send({
    message: '恭喜你, 登录成功了 ! ^_^ ',
    code: 1,
    user: {
      msg: '这是你目前登录的账户的信息, 喏, 给你 -_- !',
      id: result.id,
      username: result.username,
      nickname: result.nickname,
      createTime: result.createTime,
      "identity": result.identity,
      "gender": result.gender,
      "age": result.age,
    },
    tips: `登录有效期是 ${ hours } 个小时, 你的登录状态会在 ${ hours } 个小时后自动注销`,
    token
  })
}

const logout = async (req, res, next) => {
  const { id } = req.query

  await RT(id - 0)

  res.send({
    message: '注销登录成功',
    code: 1
  })
}

const register = async (req, res, next) => {
  const { username, password, nickname } = req.body
  const result = await MGUBU(username)

  if (result) return res.send({
    message: '注册失败, 该用户名已经存在了, 请更换后重试, (#^.^#) !',
    code: 0
  })

  const rResult = await MR(username, password, nickname)

  if (rResult === 'ok') res.send({
    message: '注册成功',
    code: 1
  })

}

const info = async (req, res, next) => {
  const id = req.query.id || req.params.id

  const user = await MGUBI(id - 0)

  if (!user) return res.send({
    message: '获取用户信息失败, 你查找的用户已经被注销, 请更换 id 后重试',
    code: 0
  })

  delete user.password
  delete user.cart

  res.send({
    message: '获取用户信息成功! ^_^ ',
    code: 1,
    info: user
  })
}

const update = async (req, res, next) => {
  const { id, gender, age, nickname } = req.body

  const result = await MU(id - 0, gender, age - 0, nickname)

  if (result === 'ok') res.send({
    message: '修改用户信息成功 ! O(∩_∩)O哈哈~',
    code: 1
  })
}

const password = async (req, res, next) => {
  const { id, oldPassword, newPassword } = req.body
  const user = await MGUBI(id - 0)
  if (user.password !== oldPassword) return res.send({
    message: '修改密码失败, 原始密码不正确',
    code: 0
  })

  const result = await MP(id - 0, newPassword)

  await RT(id - 0)

  if (result === 'ok') res.send({
    message: '修改密码成功, 已经注销登录状态, 请重新登录 ! ^_^',
    code: 1
  })
}

module.exports = {
  getList,
  login,
  logout,
  register,
  info,
  update,
  password
}
