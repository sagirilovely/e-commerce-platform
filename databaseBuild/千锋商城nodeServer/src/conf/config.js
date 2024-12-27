module.exports = {
  // 免密登录保持时间, 单位: 秒(s)
  tokenKeep: 60 * 60,
  // token 的签证字符串, 可以自主更改
  tokenSignkey: 'guoxiang',
  // 用户名的正则, 可以自主更改
  username: /^[a-z0-9]\w{4,11}$/,
  // 密码的正则, 可以自主更改
  password: /\w{6,12}/,
  // 重启服务器是否保持登录状态
  keep: false
}
