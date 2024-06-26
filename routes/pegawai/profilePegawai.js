const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/pegawai/profile');
const middleware = require('../../middleware/authentication')

router.post('/updateProfilePegawai', middleware.verifyTokenPegawai, controllers.updateAkunPegawai)

module.exports = router