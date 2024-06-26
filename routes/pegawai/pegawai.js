const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/pegawai/pegawai')
const middleware = require('../../middleware/authentication')

router.post('/tambahPegawai', controllers.tambahPegawai)
router.post('/loginPegawai', controllers.loginPegawai)
router.delete('/logoutPegawai', middleware.verifyTokenPegawai, controllers.logoutPegawai)
router.post('/forgotPass', controllers.forgotPassword)
router.post('/changePassPegawai/:id_pegawai', controllers.confirmPassword)
router.get('/dataProfile', middleware.verifyTokenPegawai, controllers.detailAkun)
router.get('/checkTtdPegawai', middleware.verifyTokenPegawai, controllers.getCurrentUser)

module.exports = router