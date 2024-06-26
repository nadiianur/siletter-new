const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelRole = require('../../models/role')
const {Op, where, Model} = require('sequelize')

//tambah role
const tambahRole = async (req, res) => {
    try {
        const {
            nama_role
        } = req.body

        const findRole = await modelRole.findOne({
            where:{
                nama_role: nama_role
            }
        })

        if (findRole) {
            return res.status(400).json({ success: false, message: 'Role sudah terdaftar'})
        }

        const tambahRole = await modelRole.create({
            nama_role: nama_role,
        })

        if (tambahRole) {
            res.status(200).json({
                success: true,
                message: 'Data Role Berhasil di tambahkan'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Data Role Gagal di tambahkan! Silahkan ulangi'
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

module.exports = {
    tambahRole
}