const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/biro/biroBagian')

router.post('/tambahBiro', controllers.tambahBiro)
router.post('/tambahBagian', controllers.tambahBagian)
router.get('/namaBiro', controllers.namaBiro)

module.exports = router