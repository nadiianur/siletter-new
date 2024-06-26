const response = require('express')
const jwt = require('jsonwebtoken')
const controller = {}
const modelMahasiswa = require('../../models/mahasiswa')
const modelPegawai = require('../../models/pegawai')
const modelBiro = require('../../models/biro')
const {
    Op,
    where,
    Model
} = require('sequelize')
const path = require('path')

//Mahasiswa
const viewLoginMahasiswa = async (req, res) => {
    res.render('mahasiswa/loginMahasiswa')
}
controller.viewLoginMahasiswa = viewLoginMahasiswa;

const forgotPassMahasiswa = async (req, res) => {
    res.render('mahasiswa/forgotPass')
}
controller.forgotPassMahasiswa = forgotPassMahasiswa;

const changePasMahasiswa = async (req, res) => {
    res.render('mahasiswa/changePass')
}
controller.changePasMahasiswa = changePasMahasiswa;

const homeMahasiswa = async (req, res) => {
    const id_mahasiswa = req.session.id_mahasiswa
    try {
        const mahasiswa = await modelMahasiswa.findOne({
            where: {
                id_mahasiswa: id_mahasiswa
            },
            attributes: ['nama']
        });

        if (!mahasiswa) {
            return res.status(404).render('error', {
                error: 'User tidak ditemukan'
            });
        }

        return res.status(200).render('mahasiswa/home', {
            nama: mahasiswa.nama
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
}
controller.homeMahasiswa = homeMahasiswa;

const registerMahasiswa = async (req, res) => {
    res.render('mahasiswa/register')
}
controller.registerMahasiswa = registerMahasiswa;

const profileMahasiswa = async (req, res) => {
    res.render('mahasiswa/profile')
}
controller.profileMahasiswa = profileMahasiswa;

const suratKeluarMahasiswa = async (req, res) => {
    try {
        const viewBiro = await modelBiro.findAll()

        return res.status(200).render('mahasiswa/suratKeluar', {
            viewBiro
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
}
controller.suratKeluarMahasiswa = suratKeluarMahasiswa;

const suratMasukMahasiswa = async (req, res) => {
    res.render('mahasiswa/suratMasuk')
}
controller.suratMasukMahasiswa = suratMasukMahasiswa;

// Gubernur User
const viewLogin = async (req, res) => {
    res.render('loginPegawai')
}
controller.viewLogin = viewLogin;

const forgotView = async (req, res) => {
    res.render('forgotPass')
}
controller.forgotView = forgotView;

const changePasView = async (req, res) => {
    res.render('changePass')
}
controller.changePasView = changePasView;

// const profilePegawai = async (req, res) => {
//     res.render('profile')
// }
// controller.profilePegawai = profilePegawai;


//Sekretaris
const dashboardSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            },
            attributes: ['nama']
        });

        if (!pegawai) {
            return res.status(404).render('error', {
                error: 'User tidak ditemukan'
            });
        }

        return res.status(200).render('sekretaris/dashboard', {
            nama: pegawai.nama
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
}
controller.dashboardSekre = dashboardSekre;

const suratMasukSekre = async (req, res) => {
    res.render('sekretaris/suratMasuk')
}
controller.suratMasukSekre = suratMasukSekre;

const suratKeluarSekre = async (req, res) => {
    res.render('sekretaris/suratKeluar')
}
controller.suratKeluarSekre = suratKeluarSekre;

const disposisiSekre = async (req, res) => {
    res.render('sekretaris/disposisi')
}
controller.disposisiSekre = disposisiSekre;

const riwayatSekre = async (req, res) => {
    res.render('sekretaris/riwayat')
}
controller.riwayatSekre = riwayatSekre;

const riwayatDitolakSekre = async (req, res) => {
    res.render('sekretaris/riwayatDitolak')
}
controller.riwayatDitolakSekre = riwayatDitolakSekre;

const balasPenerimaan = async (req, res) => {
    res.render('sekretaris/balasPenerimaan')
}
controller.balasPenerimaan = balasPenerimaan;

const profileSekre = async (req, res) => {
    res.render('sekretaris/profile')
}
controller.profileSekre = profileSekre;

const riwayatAnggota = async (req, res) => {
    res.render('sekretaris/riwayatAnggota')
}
controller.riwayatAnggota = riwayatAnggota;


// Kabag
const dashboardKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            },
            attributes: ['nama']
        });

        if (!pegawai) {
            return res.status(404).render('error', {
                error: 'User tidak ditemukan'
            });
        }

        return res.status(200).render('kabag/dashboardKabag', {
            nama: pegawai.nama
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
}
controller.dashboardKabag = dashboardKabag;

const disposisiKabag = async (req, res) => {
    res.render('kabag/disposisi')
}
controller.disposisiKabag = disposisiKabag;

const riwayatKabag = async (req, res) => {
    res.render('kabag/riwayat')
}
controller.riwayatKabag = riwayatKabag;

const riwayatDisposisiKabag = async (req, res) => {
    res.render('kabag/riwayatDisposisi')
}
controller.riwayatDisposisiKabag = riwayatDisposisiKabag;

const profileKabag = async (req, res) => {
    res.render('kabag/profile')
}
controller.profileKabag = profileKabag;

// Kabir
const dashboardKabir = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            },
            attributes: ['nama']
        });

        if (!pegawai) {
            return res.status(404).render('error', {
                error: 'User tidak ditemukan'
            });
        }

        return res.status(200).render('kabir/dashboardKabir', {
            nama: pegawai.nama
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
}
controller.dashboardKabir = dashboardKabir;

const disposisiKabir = async (req, res) => {
    res.render('kabir/disposisi')
}
controller.disposisiKabir = disposisiKabir;

const riwayatKabir = async (req, res) => {
    res.render('kabir/riwayat')
}
controller.riwayatKabir = riwayatKabir;

const riwayatDisposisiKabir = async (req, res) => {
    res.render('kabir/riwayatDisposisi')
}
controller.riwayatDisposisiKabir = riwayatDisposisiKabir;

const profileKabir = async (req, res) => {
    res.render('kabir/profile')
}
controller.profileKabir = profileKabir;

module.exports = controller