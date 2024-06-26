const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/mahasiswa/mahasiswa')
const middleware = require('../../middleware/authentication')

router.post('/tambahMahasiswa', controllers.tambahMahasiswa)
router.post('/loginMahasiswa', controllers.loginMahasiswa)
router.delete('/logoutMahasiswa', middleware.verifyTokenMahasiswa, controllers.logoutMahasiswa)
router.post('/forgotPassMahasiswa', controllers.forgotPassword)
router.post('/confirmPassword/:id_mahasiswa', controllers.confirmPassword)
router.get('/dataProfileMahasiswa', middleware.verifyTokenMahasiswa, controllers.detailAkun)

module.exports = router