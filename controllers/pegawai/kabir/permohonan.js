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
const viewPermohonanKabir = async (req, res) => {
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
                    status: "Telah di setujui kepala bagian"
                }
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
const detailPermohonanKabir = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const findDetail = await modelSuratMasuk.findOne({
            where: {
                id_surat_masuk: id_surat_masuk
            },
            include: [{
                model: modelBiro,
                as: 'dataBiro',
                attributes: ['id_biro', 'nama_biro']
            }, {
                model: modelDisposisi,
                as: 'dataDisposisi',
                attributes: ['id_disposisi', 'keterangan', 'status', 'created_at'],
                include: [{
                    model: modelPegawai,
                    as: 'dataPegawai',
                    attributes: ['id_pegawai', 'id_role'],
                    include: [{
                        model: modelRole,
                        as: 'dataRole',
                        attributes: ['nama_role']
                    }]
                }]
            },{
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
            },{
                model: modelAnggotaMagang,
                as: 'dataAnggotaMagang',
                attributes: ['nama', 'nim', 'id_bagian'],
                include: [{
                    model: modelBagian,
                    as: 'dataBagian',
                    attributes: ['nama_bagian']
                }]
            }],
            attributes: ['id_biro', 'created_at', 'periode_magang', 'file', 'keterangan']
        })

        res.status(200).json({
            success: true,
            data: findDetail
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}


// Acc disposisi 
const accDisposisiKabir = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const newDisposisi = await modelDisposisi.create({
            id_surat_masuk: id_surat_masuk,
            id_pegawai: id_pegawai,
            status: 'Disetujui',
        })

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
}


//Tolak disposisi 
const tolakDisposisiKabir = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk
    const {keterangan} = req.body

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
            message: 'Disposisi berhasil ditolak',
            data: newDisposisi
        });
    } catch (error) {
        console.error(error);
        2
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyetujui disposisi'
        });
    }
}


// Menampilkan Riwayat
const riwayatKabir = async (req, res) => {
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

// Menampilkan riwayat disposisi 
const viewRiwayatPermohonanKabir = async (req, res) => {
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
                    status: ['Disetujui', 'Ditolak'],
                },
                attributes: ['id_disposisi', 'status','created_at']
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
const deleteDisposisi = async (req, res) =>{
    try{
        const {id_disposisi} = req.params;

        const hapus = await modelDisposisi.destroy({
            where:{
                id_disposisi: id_disposisi
            }
        })
        if (!hapus) {
            return res.status(400).json({success:false, message:'Data Disposisi gagal dihapus! Silahkan ulangi kembali'})
        }
        res.status(200).json({success: true, message: 'Data Disposisi berhasil dihapus!'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message:error})
    }
}


module.exports = {
    viewPermohonanKabir,
    detailPermohonanKabir,
    riwayatKabir,
    accDisposisiKabir,
    tolakDisposisiKabir,
    viewRiwayatPermohonanKabir,
    deleteDisposisi
}