const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/pegawai/role')

router.post('/tambahRole', controllers.tambahRole)

module.exports = router