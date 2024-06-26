const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/pegawai/sekretaris/surat')
const middleware = require('../../../middleware/authentication')

router.get('/viewMasukSekre', middleware.verifyTokenPegawai, controllers.viewMasukSekre)
router.get('/detailMasukSekre/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.detailMasukSekre)
router.get('/checkDisposisi/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.checkDisposisi);
router.post('/accDisposisi/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.accDisposisi)
router.post('/tolakDisposisi/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.tolakDisposisi)
router.get('/viewKeluarSekre', middleware.verifyTokenPegawai, controllers.viewKeluarSekre);
router.get('/detailKeluarSekre/:id_surat_keluar', middleware.verifyTokenPegawai, controllers.detailKeluarSekre);
router.get('/viewDisposisiSekre', middleware.verifyTokenPegawai, controllers.viewDisposisiSekre)
router.get('/detailDisposisiSekre/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.detailDisposisiSekre)
router.get('/viewRiwayatDiterima', middleware.verifyTokenPegawai, controllers.viewRiwayatAcc)
router.get('/viewRiwayatDitolak', middleware.verifyTokenPegawai, controllers.viewRiwayatDitolak)
router.post('/uploadPenolakan/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.uploadPenolakan);
router.get('/checkSuratKeluarDT/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.checkSuratKeluar);
router.post('/deleteSuratKeluar/:id_surat_keluar', middleware.verifyTokenPegawai, controllers.deleteSuraKeluar)
router.post('/uploadSuratBalasan/:id_surat_masuk', middleware.verifyTokenPegawai, controllers.createSuratBalasan);
router.post('/generateSuratBalasan/:id_surat_keluar', middleware.verifyTokenPegawai, controllers.generateSuratBalasan);

module.exports = router