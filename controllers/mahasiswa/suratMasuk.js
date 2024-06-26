const response = require('express')
require('dotenv').config()
const modalSuratKeluar = require('../../models/surat_keluar')
const modelBiro = require('../../models/biro')
const {Op, where, Model} = require('sequelize')

// menampilkan surat masuk mahasiswa (DB Surat Keluar)
const viewSuratMasuk = async (req, res) =>{
    const id_mahasiswa = req.session.id_mahasiswa

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const findSuratMasuk = await modalSuratKeluar.findAll({
        where:{
            id_mahasiswa: id_mahasiswa
        },
        include:[{
            model: modelBiro,
            as: 'dataBiro',
            attributes: ['id_biro', 'nama_biro']
        }],
        attributes:['id_biro', 'created_at', 'file', 'keterangan', 'id_surat_keluar']
    })

    if(findSuratMasuk.length == 0){
        return res.status(200).json({ success: false, message: 'Belum ada surat masuk'});
    }

    res.status(200).json({ success:  true, data: findSuratMasuk})
}

// menampilkan detail surat masuk mahasiswa (DB Surat Keluar)
const detailSuratMasuk = async (req, res) =>{
    const id_mahasiswa = req.session.id_mahasiswa
    const id_surat_keluar = req.params.id_surat_keluar

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const findDetail = await modalSuratKeluar.findOne({
        where:{
            id_surat_keluar: id_surat_keluar
        },
        include:[{
            model: modelBiro,
            as: 'dataBiro',
            attributes: ['id_biro', 'nama_biro']
        }],
        attributes:['id_biro', 'created_at', 'file', 'keterangan']
    })

    res.status(200).json({ success:  true, data: findDetail})
}

const deleteSuratMasuk = async (req, res) =>{
    try{
        const {id_surat_keluar} = req.params;
        const hapus = await modalSuratKeluar.destroy({
            where:{
                id_surat_keluar: id_surat_keluar
            }
        })
        if (!hapus) {
            return res.status(400).json({success:false, message:'Data Surat Masuk gagal dihapus! Silahkan ulangi kembali'})
        }
        res.status(200).json({success: true, message: 'Data Surat Masuk berhasil dihapus!'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message:error})
    }
}


module.exports = {
    viewSuratMasuk,
    detailSuratMasuk,
    deleteSuratMasuk
}