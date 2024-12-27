const router = require('express').Router()
const { getList: MGT, verifyToken: VT, add: MA, selectAll: MSA, num: MN } = require('../middleware/cart')
const { getList: CGT, add: CA, select: CS, remove: CR, selectAll: CSA, removeSelect: CRS, clear: CC, num: CN, pay: CP } = require('../controller/cart')

router.use(VT)
router.get('/list', MGT, CGT)
router.post('/add', MA, CA)
router.post('/select', MA, CS)
router.post('/select/all', MSA, CSA)
router.get('/remove', MA, CR)
router.get('/remove/select', CRS)
router.get('/clear', CC)
router.get('/clear/:id', CC)
router.post('/number', MA, MN, CN)
router.post('/pay', CP)

module.exports = router
