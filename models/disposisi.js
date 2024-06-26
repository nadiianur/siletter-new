const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const disposisi = sequelize.define('disposisi', {
    id_disposisi:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_surat_masuk:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_pegawai:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.STRING(100),
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
    tableName: 'disposisi',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = disposisi