const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const pegawai = sequelize.define('pegawai', {
    id_pegawai:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_role:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_biro:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_bagian:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nama:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nip:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    username:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(256),
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
    tableName: 'pegawai',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = pegawai