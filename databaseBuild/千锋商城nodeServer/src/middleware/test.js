const third = (req, res, next) => {
  const { name, age } = req.query

  if (name === undefined || name === '') return next({
    message: '你需要传递给我一个 name 参数, 但是你并没有给我哎 ! (*^▽^*)',
    code: 5,
    tips: '着重检查一下单词有没有写错, 你确定你分得清 name 和 nmae 的区别吗 ? '
  })

  if (age === undefined || age === '') return next({
    message: '你需要传递给我一个 age 参数, 但是你并没有给我哎 ! (*^▽^*)',
    code: 5,
    tips: '着重检查一下单词有没有写错'
  })

  next()
}

const fourth = (req, res, next) => {
  const { name, age } = req.body

  if (name === undefined || name === '') return next({
    message: '你需要传递给我一个 name 参数, 但是你并没有给我哎 ! (*^▽^*)',
    code: 5,
    tips: '因为你发送的是 POST 请求, 检查一下有没有设置请求头 !'
  })

  if (age === undefined || age === '') return next({
    message: '你需要传递给我一个 age 参数, 但是你并没有给我哎 ! (*^▽^*)',
    code: 5,
    tips: '因为你发送的是 POST 请求, 检查一下有没有设置请求头 !'
  })

  next()
}

module.exports = {
  third,
  fourth
}
