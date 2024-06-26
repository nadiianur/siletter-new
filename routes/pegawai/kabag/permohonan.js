const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/pegawai/kabag/permohonan')
const middleware = require('../../../middleware/authentication')

router.get('/viewPermohonanKabag', middleware.verifyTokenPegawai, controllers.viewPermohonanKabag)
router.get('/detailPermohonanKabag/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.detailPermohonanKabag)
router.get('/checkDisposisiKabag/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.checkDisposisiKabag)
router.get('/viewRiwayatKabag', middleware.verifyTokenPegawai, controllers.riwayatKabag)
router.post('/accDisposisiKabag/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.accDisposisiKabag)
router.get('/dataAccKabag/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.dataAccKabag)
router.post('/tolakDisposisiKabag/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.tolakDisposisiKabag)
router.get('/getAnggotaMagang/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.getAnggotaMagang)
router.get('/getBagianByBiro', controllers.getBagianByBiro);
router.get('/riwayatAnggota', middleware.verifyTokenPegawai, controllers.riwayatAnggota);
router.get('/dataAnggotaUpdate/:id_anggota_magang', middleware.verifyTokenPegawai, controllers.getAnggotaMagangById)
router.post('/updateRiwayatAnggota/:id_anggota_magang', middleware.verifyTokenPegawai, controllers.updateAnggotaMagang);
router.get('/viewRiwayatPermohonanKabag', middleware.verifyTokenPegawai, controllers.viewRiwayatPermohonanKabag)
router.post('/deleteDisposisi/:id_disposisi', middleware.verifyTokenPegawai, controllers.deleteDisposisi)

module.exports = router