const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/mahasiswa/dashboard')
const middleware = require('../../middleware/authentication')

router.get('/totalSuratMasuk', middleware.verifyTokenMahasiswa, controllers.totalSuratMasuk)
router.get('/totalSuratKeluar', middleware.verifyTokenMahasiswa, controllers.totalSuratKeluar)

module.exports = router