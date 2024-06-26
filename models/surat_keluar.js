const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const surat_keluar = sequelize.define('surat_keluar', {
    id_surat_keluar:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_surat_masuk:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_mahasiswa:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_biro:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    no_surat:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    perihal:{
        type: DataTypes.STRING(256),
        allowNull: false
    },
    file:{
        type: DataTypes.STRING(256),
        allowNull: true
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'surat_keluar',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = surat_keluar