const jwt = require('jsonwebtoken');

const verifyTokenMahasiswa = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/loginUser');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.mahasiswa = decoded.id_mahasiswa;
        next();
    } catch (error) {
        return res.redirect('/loginUser');
    }
};

const verifyTokenPegawai = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/loginPegawai');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.karyawan = decoded.id_karyawan;
        next();
    } catch (error) {
        return res.redirect('/loginPegawai');
    }
};

module.exports = {
    verifyTokenMahasiswa,
    verifyTokenPegawai,
}