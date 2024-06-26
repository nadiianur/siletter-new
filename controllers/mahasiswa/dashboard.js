const response = require('express')
require('dotenv').config()
const modelSuratMasuk = require('../../models/surat_masuk')
const modelSuratKeluar = require('../../models/surat_keluar')
const modelMahasiswa = require('../../models/mahasiswa')
const {Op, where, Model} = require('sequelize')

// total Surat Keluar (DB Surat Masuk)
const totalSuratKeluar = async (req,res) => {
    const id_mahasiswa = req.session.id_mahasiswa

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const totalKeluar = await modelSuratMasuk.count({
        where:{
            id_mahasiswa: id_mahasiswa
        }
    })
    if(totalKeluar === 0 ){
        return res.status(200).json({success: true, total: 0})
    } else{
        return res.status(200).json({success: true, total: totalKeluar})
    }

}

// total Surat Masuk (DB Surat Keluar)
const totalSuratMasuk = async (req,res) => {
    const id_mahasiswa = req.session.id_mahasiswa

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const totalMasuk = await modelSuratKeluar.count({
        where:{
            id_mahasiswa: id_mahasiswa
        }
    })

    if (totalMasuk === 0){
        return res.status(200).json({success: true, total: 0})
    } else{
        return res.status(200).json({success: true, total: totalMasuk})
    }

}

module.exports = {
    totalSuratKeluar, 
    totalSuratMasuk,
}