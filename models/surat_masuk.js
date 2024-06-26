const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const surat_masuk = sequelize.define('surat_masuk', {
    id_surat_masuk:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_mahasiswa:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_biro:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    periode_magang:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    file:{
        type: DataTypes.STRING(256),
        allowNull: false
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
    tableName: 'surat_masuk',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = surat_masuk