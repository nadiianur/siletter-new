const response = require('express')
require('dotenv').config()
const modelSuratMasuk = require('../../../models/surat_masuk')
const modelMahasiswa = require('../../../models/mahasiswa')
const modelPegawai = require('../../../models/pegawai')
const modelAnggotaMagang = require('../../../models/anggota_magang')
const modelDisposisi = require('../../../models/disposisi')
const modelBagian = require('../../../models/bagian')
const modelBiro = require('../../../models/biro')
const modelRole = require('../../../models/role')
const {
    Op
} = require('sequelize')
const sequelize = require('sequelize')

// Menampilkan surat masuk 
const viewPermohonanKabag = async (req, res) => {
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

        if (!pegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const {
            id_biro
        } = pegawai;

        const findPermohonan = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro,
            },
            include: [{
                model: modelDisposisi,
                as: 'dataDisposisi',
                where: {
                    status: "Telah di setujui sekretaris biro"
                },
                attributes: ['id_disposisi']
            }, {
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
            }],
            attributes: ['id_surat_masuk', 'file', 'created_at', 'periode_magang']
        })

        if (findPermohonan.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada permohonan'
            });
        }

        res.status(200).json({
            success: true,
            data: findPermohonan
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Menampilkan detail surat masuk 
const detailPermohonanKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    const findDetail = await modelSuratMasuk.findOne({
        where: {
            id_surat_masuk: id_surat_masuk
        },
        include: [{
            model: modelMahasiswa,
            as: 'dataMahasiswa',
            attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
        }, {
            model: modelDisposisi,
            as: 'dataDisposisi',
            attributes: ['keterangan', 'status', 'created_at'],
            include: [{
                model: modelPegawai,
                as: 'dataPegawai',
                attributes: []
            }]
        }],
        attributes: ['id_surat_masuk', 'created_at', 'file', 'keterangan', 'periode_magang']
    })

    res.status(200).json({
        success: true,
        data: findDetail
    })
}


// Detail data acc disposisi
const dataAccKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const findDataAnggota = await modelSuratMasuk.findOne({
            where: {
                id_surat_masuk: id_surat_masuk
            },
            include: [{
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
            }, {
                model: modelAnggotaMagang,
                as: 'dataAnggotaMagang',
                attributes: ['nama', 'nim', 'id_bagian'],
                include: [{
                    model: modelBagian,
                    as: 'dataBagian',
                    attributes: ['nama_bagian']
                }]
            }],
            attributes: ['created_at']
        })

        res.status(200).json({
            success: true,
            data: findDataAnggota
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Check disposisi
const checkDisposisiKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const existingDisposisi = await modelDisposisi.findOne({
            where: {
                id_surat_masuk: id_surat_masuk,
                id_pegawai: id_pegawai,
            },
        });

        if (existingDisposisi) {
            return res.status(200).json({
                success: true,
                disposisiExist: true
            });
        } else {
            return res.status(200).json({
                success: true,
                disposisiExist: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memeriksa disposisi'
        });
    }
}

// Menampilkan nama anggota magang
const getAnggotaMagang = async (req, res) => {
    const {
        id_surat_masuk
    } = req.params;

    try {
        const anggotaMagang = await modelAnggotaMagang.findAll({
            where: {
                id_surat_masuk: id_surat_masuk
            },
            include: [{
                model: modelSuratMasuk,
                as: 'dataSuratMasuk',
                include: [{
                    model: modelMahasiswa,
                    as: 'dataMahasiswa',
                    attributes: ['instansi', 'jurusan']
                }]
            }],
        });
        res.status(200).json({
            success: true,
            data: anggotaMagang
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data anggota magang'
        });
    }
}

// Acc disposisi 
const accDisposisiKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;
    const {
        penempatanData
    } = req.body;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const newDisposisi = await modelDisposisi.create({
            id_surat_masuk: id_surat_masuk,
            id_pegawai: id_pegawai,
            status: 'Telah di setujui kepala bagian'
        });

        for (const penempatan of penempatanData) {
            await modelAnggotaMagang.update({
                id_bagian: penempatan.id_bagian
            }, {
                where: {
                    id_anggota_magang: penempatan.id_anggota_magang
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Disposisi berhasil disetujui',
            data: newDisposisi
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyetujui disposisi'
        });
    }
};

// Tolak disposisi 
const tolakDisposisiKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk
    const {
        keterangan
    } = req.body;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const newDisposisi = await modelDisposisi.create({
            id_surat_masuk: id_surat_masuk,
            id_pegawai: id_pegawai,
            status: 'Ditolak',
            keterangan: keterangan
        })

        res.status(200).json({
            success: true,
            message: 'Disposisi berhasil',
            data: newDisposisi
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyetujui disposisi'
        });
    }
}


// Menampilkan Riwayat
const riwayatKabag = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        });

        const {
            id_biro
        } = pegawai;

        const bagian = await modelBagian.findAll({
            where: {
                id_biro: id_biro
            },
            attributes: ['id_bagian']
        });

        const idBagianList = bagian.map(b => b.id_bagian);

        const findRiwayat = await modelAnggotaMagang.findAll({
            where: {
                id_bagian: idBagianList
            },
            include: [{
                model: modelBagian,
                as: 'dataBagian',
                attributes: ['nama_bagian'],
            }],
            include: [{
                model: modelSuratMasuk,
                as: 'dataSuratMasuk',
                attributes: ['periode_magang'],
            }],
            attributes: ['nama', 'nim']
        });

        const idSuratMasukList = findRiwayat.map(riwayat => riwayat.id_surat_masuk);

        const disposisi = await modelDisposisi.findAll({
            where: {
                id_surat_masuk: idSuratMasukList,
                status: 'Disetujui'
            },
            attributes: ['id_surat_masuk']
        });

        const diterimaSuratMasukList = disposisi.map(d => d.id_surat_masuk);

        const filteredRiwayat = findRiwayat.filter(riwayat =>
            diterimaSuratMasukList.includes(riwayat.id_surat_masuk)
        );

        if (filteredRiwayat.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada riwayat anggota magang'
            });
        }

        res.status(200).json({
            success: true,
            data: findRiwayat
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}


// Data nama bagian pada biro
const getBagianByBiro = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai
            },
            include: {
                model: modelBiro,
                as: 'dataBiro',
                attributes: ['id_biro', 'nama_biro']
            }
        });

        if (!pegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const id_biro = pegawai.id_biro;

        const bagian = await modelBagian.findAll({
            where: {
                id_biro
            },
            attributes: ['id_bagian', 'nama_bagian']
        });

        res.status(200).json({
            success: true,
            data: bagian
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data bagian'
        });
    }
};


// Data riwayat anggota
const riwayatAnggota = async (req, res) => {
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

        const anggotaMagang = await modelAnggotaMagang.findAll({
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
            attributes: ['nama', 'nim', 'id_anggota_magang']
        });

        res.status(200).json({
            success: true,
            data: anggotaMagang
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data anggota magang'
        });
    }
};

const updateAnggotaMagang = async (req, res) => {
    const id_anggota_magang = req.params.id_anggota_magang;
    const {
        id_bagian,
    } = req.body;

    if (!id_anggota_magang) {
        return res.status(400).json({
            success: false,
            message: 'Anggota magang tidak ditemukan'
        });
    }

    try {
        const anggotaMagang = await modelAnggotaMagang.findByPk(id_anggota_magang);

        if (!anggotaMagang) {
            return res.status(404).json({
                success: false,
                message: 'Anggota magang tidak ditemukan'
            });
        }

        await anggotaMagang.update({
            id_bagian: id_bagian,
        });

        res.status(200).json({
            success: true,
            message: 'Data penempatan anggota magang berhasil diperbarui',
            data: anggotaMagang
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui data anggota magang'
        });
    }
};

//Mendapatkan data untuk update
const getAnggotaMagangById = async (req, res) => {
    const id_anggota_magang = req.params.id_anggota_magang;

    try {
        const anggotaMagang = await modelAnggotaMagang.findByPk(id_anggota_magang);

        if (!anggotaMagang) {
            return res.status(404).json({
                success: false,
                message: 'Anggota magang tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            data: anggotaMagang
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data anggota magang'
        });
    }
};

// Menampilkan riwayat disposisi 
const viewRiwayatPermohonanKabag = async (req, res) => {
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

        if (!pegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const {
            id_biro
        } = pegawai;

        const findPermohonan = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro,
            },
            include: [{
                model: modelDisposisi,
                as: 'dataDisposisi',
                where: {
                    id_pegawai: id_pegawai,
                    status: ['Telah di setujui kepala bagian', 'Ditolak']
                },
                attributes: ['id_disposisi', 'status', 'created_at']
            }, {
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
            }],
            attributes: ['id_surat_masuk', 'file', 'created_at', 'periode_magang']
        })

        if (findPermohonan.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada permohonan'
            });
        }

        res.status(200).json({
            success: true,
            data: findPermohonan
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Delete Disposisi
const deleteDisposisi = async (req, res) => {
    try {
        const {
            id_disposisi
        } = req.params;
        const id_pegawai_login = req.session.id_pegawai;

        const pegawaiLogin = await modelPegawai.findByPk(id_pegawai_login);
        if (!pegawaiLogin) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const {
            id_biro
        } = pegawaiLogin;

        const pegawaiRole1 = await modelPegawai.findOne({
            where: {
                id_biro: id_biro,
                id_role: 1
            }
        });

        if (!pegawaiRole1) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai dengan id_role 1 tidak ditemukan'
            });
        }

        const disposisi = await modelDisposisi.findByPk(id_disposisi);
        if (!disposisi) {
            return res.status(404).json({
                success: false,
                message: 'Disposisi tidak ditemukan'
            });
        }

        const {
            id_surat_masuk
        } = disposisi;

        const disposisiTerhubung = await modelDisposisi.findOne({
            where: {
                id_surat_masuk: id_surat_masuk,
                id_pegawai: pegawaiRole1.id_pegawai
            }
        });

        if (disposisiTerhubung) {
            return res.status(400).json({
                success: false,
                message: 'Disposisi tidak dapat dihapus, telah disetujui Kepala Biro'
            });
        }

        const hapus = await modelDisposisi.destroy({
            where: {
                id_disposisi: id_disposisi
            }
        });

        if (!hapus) {
            return res.status(400).json({
                success: false,
                message: 'Data Disposisi gagal dihapus! Silahkan ulangi kembali'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data Disposisi berhasil dihapus!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    viewPermohonanKabag,
    detailPermohonanKabag,
    riwayatKabag,
    dataAccKabag,
    accDisposisiKabag,
    tolakDisposisiKabag,
    checkDisposisiKabag,
    getAnggotaMagang,
    getBagianByBiro,
    riwayatAnggota,
    viewRiwayatPermohonanKabag,
    deleteDisposisi,
    updateAnggotaMagang,
    getAnggotaMagangById
}