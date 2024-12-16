const router = require('express').Router()
const { third: MT, fourth: MF } = require('../middleware/test')
const { first: CF, second: CS, third: CT, fourth: CFO } = require('../controller/test')

router.get('/first', CF)
router.get('/second', CS)
router.get('/third', MT, CT)
router.post('/fourth', MF, CFO)

module.exports = router
