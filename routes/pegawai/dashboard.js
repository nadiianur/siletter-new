const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/pegawai/dashboard')
const middleware = require('../../middleware/authentication')

router.get('/totalMasukSekre', middleware.verifyTokenPegawai, controllers.totalMasukSekre)
router.get('/totalKeluarSekre', middleware.verifyTokenPegawai, controllers.totalKeluarSekre)
router.get('/permohonanKabag', middleware.verifyTokenPegawai, controllers.pemohonanKabag)
router.get('/pemohonanKabir', middleware.verifyTokenPegawai, controllers.pemohonanKabir)
router.get('/totalRiwayatAnggota', middleware.verifyTokenPegawai, controllers.totalRiwayatAnggota)

module.exports = router