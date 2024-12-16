const router = require('express').Router()
const { getList: MGT, getGoodsById: MGBI } = require('../middleware/goods')
const { getList: CGT, getGoodsById: CGBI, category: CC } = require('../controller/goods')

router.get('/list', MGT, CGT)
router.get('/item/:id', MGBI, CGBI)
router.get('/item', MGBI, CGBI)
router.get('/category', CC)

module.exports = router
