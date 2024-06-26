const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/mahasiswa/suratMasuk')
const middleware = require('../../middleware/authentication')

router.get('/viewSuratMasuk', middleware.verifyTokenMahasiswa, controllers.viewSuratMasuk)
router.get('/detailSuratMasuk/:id_surat_keluar', middleware.verifyTokenMahasiswa, controllers.detailSuratMasuk)
router.post('/deleteSuratMasuk/:id_surat_keluar', middleware.verifyTokenMahasiswa, controllers.deleteSuratMasuk)

module.exports = router

