const router = require('express').Router()
const { getList: MGT, login: ML, logout: MLO, register: MR, info: MI, update: MU, password: MP } = require('../middleware/users')
const { getList: CGT, login: CL, logout: CLO, register: CR, info: CI, update: CU, password: CP } = require('../controller/users')
const { verifyToken: VT } = require('../middleware/cart')

router.get('/list', MGT, CGT)
router.post('/login', ML, CL)
router.get('/logout', MLO, CLO)
router.get('/logout/:id', MLO, CLO)
router.post('/register', MR, CR)
router.get('/info/:id', VT, MI, CI)
router.get('/info', VT, MI, CI)
router.post('/update', VT, MU, CU)
router.post('/rpwd', VT, MP, CP)

module.exports = router
