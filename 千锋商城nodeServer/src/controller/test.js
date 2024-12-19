const first = (req, res, next) => {
  res.send('哇塞, 你已经成功使用 ajax 发送给我了一个请求, 这是我给你的回应, 我是一个字符串类型 ^_^ !')
}

const second = (req, res, next) => {
  res.send({
    message: '我已经接受到了你的请求, 这是我给你的回应, 我是一个 json 格式',
    tips: '后端返回给前端的数据',
    code: 1,
    age: 18
  })
}

const third = (req, res, next) => {
  const { name, age } = req.query

  res.send({
    message: `我接收到了你的请求, 你的请求方式是 GET, 并且正确携带了 'name' 和 'age' 参数给我 ! <(*￣▽￣*)/`,
    code: 1,
    info: {
      msg: '这是你带来的参数, 我还返回给你, 让你看看, 证明你带过来了',
      name,
      age
    }
  })
}

const fourth = (req, res, next) => {
  const { name, age } = req.body

  res.send({
    message: `我接收到了你的请求, 你的请求方式是 POST, 并且正确携带了 'name' 和 'age' 参数给我 ! <(*￣▽￣*)/`,
    code: 1,
    info: {
      msg: '这是你带来的参数, 我还返回给你, 让你看看, 证明你带过来了',
      name,
      age
    }
  })
}

module.exports = {
  first,
  second,
  third,
  fourth
}
