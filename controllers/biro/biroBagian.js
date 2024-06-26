const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelBiro = require('../../models/biro')
const modelBagian = require('../../models/bagian')
const {Op, where, Model} = require('sequelize')

//tambah biro
const tambahBiro = async (req, res) => {
    try {
        const {
            nama_biro
        } = req.body

        const findBiro = await modelBiro.findOne({
            where:{
                nama_biro: nama_biro
            }
        })

        if (findBiro) {
            return res.status(400).json({ success: false, message: 'Biro sudah terdaftar'})
        }

        const tambahBiro = await modelBiro.create({
            nama_biro: nama_biro,
        })

        if (tambahBiro) {
            res.status(200).json({
                success: true,
                message: 'Data Biro Berhasil di tambahkan'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Data Biro Gagal di tambahkan! Silahkan ulangi'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            messgae: error
        })
    }
}

//tambah biro
const tambahBagian = async (req, res) => {
    try {
        const {
            id_biro,
            nama_bagian
        } = req.body

        if (!nama_bagian) {
            return res.status(400).json({
                success: false,
                message: 'Silahkan Lengkapi Data Bagian'
            })
        } 

        const tambahBagian = await modelBagian.create({
            id_biro: id_biro,
            nama_bagian: nama_bagian,
        })

        if (tambahBagian) {
            res.status(200).json({
                success: true,
                message: 'Data Bagian Berhasil di tambahkan'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Data Bagian Gagal di tambahkan! Silahkan ulangi'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            messgae: error
        })
    }
}


//tambah biro
const namaBiro = async (req, res) => {
    const findBiro = await modelBiro.findAll({
        attributes:['id_biro', 'nama_biro']
    })

    res.status(200).render('/suratKeluarUser', {findBiro})
}

module.exports = {
    tambahBiro,
    tambahBagian,
    namaBiro,
}