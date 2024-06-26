const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const mahasiswa = sequelize.define('mahasiswa', {
    id_mahasiswa:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nama:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    username:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(256),
        allowNull: false
    },
    instansi:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fakultas:{
        type: DataTypes.STRING(50),
        allowNull: true
    },
    jurusan:{
        type: DataTypes.STRING(50),
        allowNull: true
    },
    angkatan:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    jenis_kelamin:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    no_hp:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    foto:{
        type: DataTypes.STRING(256),
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
    tableName: 'mahasiswa',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = mahasiswa