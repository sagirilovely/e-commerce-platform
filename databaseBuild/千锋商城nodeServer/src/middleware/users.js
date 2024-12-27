const { username: uReg, password: pReg } = require('../conf/config')

const getList = (req, res, next) => {
  // 参数验证
  let { current, pagesize, search } = req.query

  current === undefined && (req.query.current = current = 1)
  pagesize === undefined && (req.query.pagesize = pagesize = 5)
  search === undefined && (req.query.search = '')

  // 验证数据格式
  if (!/^\d*$/.test(current)) return next({
    message: 'current 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 current 内容是 : '${ current }'`
  })

  if (!/^\d*$/.test(pagesize)) return next({
    message: 'pagesize 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 pagesize 内容是 : '${ pagesize }'`
  })

  next()
}

const login = (req, res, next) => {
  const { username, password } = req.body

  if (!username) return next({
    message: 'username 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 username 内容是 : '${ username }'`
  })

  if (!password) return next({
    message: 'password 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 password 内容是 : '${ password }'`
  })

  next()
}

const logout = (req, res, next) => {
  const id = req.query.id || req.params.id

  if (!id) return next({
    message: '注销登录需要你给我一个已经登录的用户 id, 但是你并没有给我哦 ^_^ ',
    code: 5
  })

  if (!/^\d+$/.test(id)) return next({
    message: 'id 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 id 内容是 : '${ id }'`
  })

  req.query.id = id

  next()
}

const register = (req, res, next) => {
  const { username, password, rpassword, nickname } = req.body

  if (!username) return next({
    message: 'username 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 username 内容是 : '${ username }'`
  })

  if (!password) return next({
    message: 'password 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 password 内容是 : '${ password }'`
  })

  if (!rpassword) return next({
    message: 'rpassword 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 rpassword 内容是 : '${ rpassword }'`
  })

  if (!nickname) return next({
    message: 'nickname 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能登录',
    code: 5,
    tips: `你传递给后端的 nickname 内容是 : '${ nickname }'`
  })

  if (password !== rpassword) return next({
    message: `你给我的 'password' 信息和 'rpassword' 信息不一致哦, 没有办法成功注册`,
    code: 0,
    tips: '仔细检查一下你传递给我的信息, 单词, 空格问题要尤其注意!!!',
    yourParams: {
      msg: '这是你带给我的内容, 你自己看看把',
      password,
      rpassword
    }
  })

  if (!uReg.test(username)) return next({
    message: '注册失败, 您的 用户名 不符合正则规则',
    code: 0
  })

  if (!pReg.test(password)) return next({
    message: '注册失败, 您的 密码 不符合正则规则',
    code: 0
  })

  next()
}

const info = (req, res, next) => {
  const id = req.query.id || req.params.id

  if (!id) return next({
    message: '获取用户详细信息, 需要你给我一个已经登录的用户 id, 但是你并没有给我哦 ^_^ ',
    code: 5
  })

  if (!/^\d+$/.test(id)) return next({
    message: 'id 内容不对哦 (#^.^#), 需要的是一个数字, 但是你给的并不是',
    code: 5,
    tips: `你传递给后端的 id 内容是 : '${ id }'`
  })

  next()
}

const update = (req, res, next) => {
  const { nickname, gender, age } = req.body

  if (age !== undefined && !/^\d+$/.test(age)) return next({
    message: 'age 内容不对哦 (#^.^#), 你给我的 age 信息必须是一个数字哦',
    code: 5,
    tips: `你传递给后端的 age 内容是 : '${ age }'`
  })

  if (gender !== undefined && !/^(男|女)$/.test(gender)) return next({
    message: `gender 内容不对哦 (#^.^#), 我只能接受 '男' 或者 '女', 暂时不接受其他性别`,
    code: 5,
    tips: `你传递给后端的 gender 内容是 : '${ gender }'`
  })

  next()
}

const password = (req, res, next) => {
  const { oldPassword: OP, newPassword: NP, rNewPassword: RNP } = req.body

  if (!OP) return next({
    message: 'oldPassword 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能修改密码',
    code: 5,
    tips: `你传递给后端的 oldPassword 内容是 : '${ OP }'`
  })

  if (!NP) return next({
    message: 'newPassword 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能修改密码',
    code: 5,
    tips: `你传递给后端的 newPassword 内容是 : '${ NP }'`
  })

  if (!pReg.test(NP)) return next({
    message: '注册失败, 您的 新密码 不符合正则规则',
    code: 0
  })

  if (!RNP) return next({
    message: 'rNewPassword 内容不对哦 (#^.^#), 你必须要给我这个信息, 不然不能修改密码',
    code: 5,
    tips: `你传递给后端的 rNewPassword 内容是 : '${ RNP }'`
  })

  if (NP !== RNP) return next({
    message: `你的 'newPassword' 和 'rNewPassword' 信息不一致, 不能进行修改密码操作`,
    code: 0,
    tips: '仔细检查一下, 注意 大小写 和 空格 问题哦!! ^_^',
    yourParams: {
      msg: '这是你给我的信息, 你自己看看把',
      newPassword: NP,
      rNewPassword: RNP
    }
  })

  next()
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
