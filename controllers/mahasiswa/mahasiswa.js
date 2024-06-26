const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelMahasiswa = require('../../models/mahasiswa')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    Op,
    where,
    Model
} = require('sequelize')

//tambah mahasiswa
const tambahMahasiswa = async (req, res) => {
    try {
        const {
            username,
            nama,
            instansi,
            fakultas,
            jurusan,
            angkatan,
            jenis_kelamin,
            no_hp,
            password,
            confirmPassword
        } = req.body

        if (!nama || !instansi || !password || !username || !fakultas || !jurusan || !angkatan || !no_hp) {
            return res.status(400).json({
                success: false,
                message: 'Silahkan Lengkapi Data Registration Account'
            })
        }

        const findMahasiswa = await modelMahasiswa.findOne({
            where: {
                username: username
            }
        })

        if (findMahasiswa) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah terdaftar'
            })
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Silahkan cek kembali Password dan Konfirmasi Password'
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const tambahMahasiswa = await modelMahasiswa.create({
            username: username,
            nama: nama,
            instansi: instansi,
            fakultas: fakultas,
            jurusan: jurusan,
            angkatan: angkatan,
            no_hp: no_hp,
            jenis_kelamin: jenis_kelamin,
            password: hashedPass,
        })

        if (tambahMahasiswa) {
            res.status(200).json({
                success: true,
                message: 'Registration Account Mahasiswa berhasil'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Registration Account Gagal! Silahkan coba kembali'
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

//login mahasiswa
const loginMahasiswa = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lengkapi data akun anda'
            })
        }

        const findMahasiswa = await modelMahasiswa.findOne({
            where: {
                username: username
            }
        })
        if (!findMahasiswa) {
            return res.status(400).json({
                success: false,
                message: 'Username tidak ditemukan'
            })
        }

        bcrypt.compare(password, findMahasiswa.password, async (err, results) => {
            if (err || !results) {
                return res.status(400).json({
                    success: false,
                    message: 'Password anda salah'
                })
            }
            const id_mahasiswa = findMahasiswa.id_mahasiswa

            const token = jwt.sign({
                    username,
                    id_mahasiswa
                },
                process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1w'
                }

            );

            req.session.id_mahasiswa = id_mahasiswa

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                token,
                id_mahasiswa
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}

//logout mahasiswa
const logoutMahasiswa = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal logout',
                });
            }

            res.clearCookie('sessionID');
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                message: 'Logout berhasil',
            });
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//forgot password 
const forgotPassword = async (req, res) => {
    try {
        const {
            username,
            nama,
            instansi,
            no_hp
        } = req.body

        if (!username || !nama || !instansi || !no_hp) {
            return res.status(400).json({
                succes: false,
                message: 'Silahkan lengkapi data'
            })
        }
        const findAkun = await modelMahasiswa.findOne({
            where: {
                [Op.and]: {
                    username: username,
                    nama: nama,
                    instansi: instansi,
                    no_hp: no_hp
                }
            }
        })
        if (!findAkun) {
            return res.status(400).json({
                succes: false,
                message: 'Akun tidak ditemukan'
            })
        }
        return res.status(200).json({
            succes: true,
            message: 'Akun ditemukan',
            id_mahasiswa: findAkun.id_mahasiswa
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            succes: false,
            message: error
        })
    }

}

const confirmPassword = async (req, res) => {
    try {
        const {
            id_mahasiswa
        } = req.params

        const {
            new_password,
            confirm_new
        } = req.body

        if (!new_password || !confirm_new) {
            return res.status(400).json({
                succes: false,
                message: 'Silahkan lengkapi data'
            })
        }
        if (new_password == confirm_new) {
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = bcrypt.hashSync(new_password, salt)
            await modelMahasiswa.update({
                password: hashedPass
            }, {
                where: {
                    id_mahasiswa: id_mahasiswa
                }
            })
            return res.status(200).json({
                succes: true,
                message: 'Password telah diperbaharui'
            })
        }
        return res.status(400).json({
            succes: false,
            message: 'Password baru tidak sama dengan konfirmasi'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: error
        })
    }
}

//tampil detail akun
const detailAkun = async (req, res) => {
    try {
        const id_mahasiswa = req.session.id_mahasiswa

        if (!id_mahasiswa) {
            return res.redirect('/loginUser')
        }
        const findAkun = await modelMahasiswa.findOne({
            where: {
                id_mahasiswa: id_mahasiswa
            },
            attributes: ['username', 'nama', 'instansi', 'fakultas', 'foto', 'id_mahasiswa', 'jurusan', 'angkatan', 'jenis_kelamin', 'no_hp']
        })
        if (!findAkun) {
            return res.status(400).json({
                success: false,
                message: 'Data akun tidak tersedia'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Data akun ditemukan',
            data: findAkun
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {
    tambahMahasiswa,
    loginMahasiswa,
    logoutMahasiswa,
    forgotPassword,
    confirmPassword,
    detailAkun,
}