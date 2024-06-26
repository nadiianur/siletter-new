const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const anggota_magang = sequelize.define('anggota_magang', {
    id_anggota_magang:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_surat_masuk:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_bagian:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nama:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nim:{
        type: DataTypes.STRING(25),
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
    tableName: 'anggota_magang',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = anggota_magang