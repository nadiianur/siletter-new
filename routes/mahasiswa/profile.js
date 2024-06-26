const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/mahasiswa/profile');
const middleware = require('../../middleware/authentication')

router.post('/updateProfileMahasiswa', middleware.verifyTokenMahasiswa, controllers.updateAkun)

module.exports = router