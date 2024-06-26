const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/pegawai/kabir/permohonan')
const middleware = require('../../../middleware/authentication')

router.get('/viewPermohonanKabir', middleware.verifyTokenPegawai, controllers.viewPermohonanKabir)
router.get('/detailPermohonanKabir/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.detailPermohonanKabir)
router.get('/viewRiwayatKabir', middleware.verifyTokenPegawai, controllers.riwayatKabir)
router.post('/accDisposisiKabir/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.accDisposisiKabir)
router.post('/tolakDisposisiKabir/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.tolakDisposisiKabir)
router.get('/viewRiwayatPermohonanKabir', middleware.verifyTokenPegawai, controllers.viewRiwayatPermohonanKabir)
router.post('/deleteDisposisiKabir/:id_disposisi', middleware.verifyTokenPegawai, controllers.deleteDisposisi)

module.exports = router