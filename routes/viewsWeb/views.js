const express = require('express')
const router = express.Router()
const controller = require('../../controllers/viewsWeb/views')
const middleware = require('../../middleware/authentication')

// Mahasiswa
router.get('/loginUser', controller.viewLoginMahasiswa)
router.get('/forgotPassUser', controller.forgotPassMahasiswa)
router.get('/changePassUser', controller.changePasMahasiswa)
router.get('/registerAccount', controller.registerMahasiswa)
router.get('/homeUser',middleware.verifyTokenMahasiswa, controller.homeMahasiswa)
router.get('/profileUser',middleware.verifyTokenMahasiswa, controller.profileMahasiswa)
router.get('/suratMasukUser',middleware.verifyTokenMahasiswa, controller.suratMasukMahasiswa)
router.get('/suratKeluarUser',middleware.verifyTokenMahasiswa, controller.suratKeluarMahasiswa)

// Gubernur User
router.get('/loginPegawai', controller.viewLogin)
router.get('/forgotPassword', controller.forgotView)
router.get('/changePassword', controller.changePasView)

// Sekda
router.get('/dashboardSekda', controller.dashboardSekre)
router.get('/suratMasukSekda', controller.suratMasukSekre)
router.get('/suratKeluarSekda', controller.suratKeluarSekre)
router.get('/disposisiSekda', controller.disposisiSekre)
router.get('/riwayatSekda', controller.riwayatSekre)
router.get('/riwayatDitolakSekda', controller.riwayatDitolakSekre)
router.get('/balasPenerimaan', controller.balasPenerimaan)
router.get('/riwayatAnggotaMagang', controller.riwayatAnggota)
router.get('/profileSekda', controller.profileSekre)

// Kepala Bagian
router.get('/dashboardKepalaBagian', controller.dashboardKabag)
router.get('/disposisiKepalaBagian', controller.disposisiKabag)
router.get('/riwayatKepalaBagian', controller.riwayatKabag)
router.get('/riwayatDisposisiKabag', controller.riwayatDisposisiKabag)
router.get('/profileKepalaBagian', controller.profileKabag)

// Kepala Biro
router.get('/dashboardKepalaBiro', controller.dashboardKabir)
router.get('/disposisiKepalaBiro', controller.disposisiKabir)
router.get('/riwayatKepalaBiro', controller.riwayatKabir)
router.get('/riwayatDisposisiKabir', controller.riwayatDisposisiKabir)
router.get('/profileKepalaBiro', controller.profileKabir)

module.exports = router