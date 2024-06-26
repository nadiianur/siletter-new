const response = require('express')
require('dotenv').config()
const modelSuratMasuk = require('../../models/surat_masuk')
const modelSuratKeluar = require('../../models/surat_keluar')
const modelPegawai = require('../../models/pegawai')
const modelDisposisi = require('../../models/disposisi')
const modelAnggota = require('../../models/anggota_magang')
const modelBagian = require('../../models/bagian')
const {
    Op,
    where,
    Model
} = require('sequelize')

// total Surat Masuk
const totalMasukSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        const {
            id_biro
        } = pegawai;

        const totalMasuk = await modelSuratMasuk.count({
            where: {
                id_biro: id_biro,
            },
        });

        return res.status(201).json({
            success: true,
            total: totalMasuk
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }

}

// total Surat Keluar
const totalKeluarSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        const {
            id_biro
        } = pegawai;

        const totalKeluar = await modelSuratKeluar.count({
            where: {
                id_biro: id_biro,
            },
        });

        return res.status(201).json({
            success: true,
            total: totalKeluar
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// total Riwayat Anggota
const totalRiwayatAnggota = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const disposisiData = await modelDisposisi.findAll({
            attributes: ['id_surat_masuk'],
            where: {
                status: 'Disetujui'
            }
        });

        const id_surat_masuks_disetujui = disposisiData.map(disposisi => disposisi.id_surat_masuk);

        const pegawai = await modelPegawai.findByPk(id_pegawai);
        const id_biro_user = pegawai.id_biro;


        const totalAnggota = await modelAnggota.count({
            where: {
                id_surat_masuk: {
                    [Op.in]: id_surat_masuks_disetujui
                }
            },
            include: [{
                model: modelBagian,
                as: 'dataBagian',
                where: {
                    id_biro: id_biro_user
                }
            }, {
                model: modelSuratMasuk,
                as: 'dataSuratMasuk',
            }],
        });

        return res.status(200).json({
            success: true,
            total: totalAnggota
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
};

//total permohonan masuk kabag
const pemohonanKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        // return res.status(400).json({success: false, message: 'Silahkan login terlebih dahulu'})
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        const {
            id_biro
        } = pegawai;

        const {
            id_role
        } = pegawai

        const pemohonan = await modelDisposisi.count({
            include: [{
                model: modelPegawai,
                as: 'dataPegawai',
                where: {
                    id_biro: id_biro
                }
            }],
            where: {
                status: "Telah di setujui sekretaris biro"
            }
        });

        if (id_role === 2) {
            if (pemohonan === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Belum ada permohonan surat"
                })
            } else {
                return res.status(201).json({
                    success: true,
                    total: pemohonan
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Role tidak sesuai"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

//total permohonan masuk kabir
const pemohonanKabir = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        // return res.status(400).json({success: false, message: 'Silahkan login terlebih dahulu'})
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        const {
            id_biro
        } = pegawai;

        const {
            id_role
        } = pegawai

        const pemohonan = await modelDisposisi.count({
            include: [{
                model: modelPegawai,
                as: 'dataPegawai',
                where: {
                    id_biro: id_biro
                }
            }],
            where: {
                status: "Telah di setujui kepala bagian"
            }
        });

        if (id_role === 1) {
            if (pemohonan === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Belum ada permohonan surat"
                })
            } else {
                return res.status(201).json({
                    success: true,
                    total: pemohonan
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Role tidak sesuai"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}
module.exports = {
    totalMasukSekre,
    totalKeluarSekre,
    pemohonanKabir,
    pemohonanKabag,
    totalRiwayatAnggota
}