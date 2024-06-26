const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelPegawai = require('../../models/pegawai')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    Op,
} = require('sequelize')

//tambah pegawai
const tambahPegawai = async (req, res) => {
    try {
        const {
            id_role,
            id_biro,
            id_bagian,
            username,
            nama,
            nip,
            email,
            password,
        } = req.body

        if (!id_role || !id_biro || !username || !nip || !email || !nama || !password) {
            return res.status(400).json({
                success: false,
                message: 'Silahkan Lengkapi Data Pegawai'
            })
        }

        const findPegawai = await modelPegawai.findOne({
            where: {
                nip: nip
            }
        })

        if (findPegawai) {
            return res.status(400).json({
                success: false,
                message: 'Pegawai sudah terdaftar'
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const tambahPegawai = await modelPegawai.create({
            id_role: id_role,
            id_biro: id_biro,
            id_bagian: id_bagian,
            nama: nama,
            email: email,
            nip: nip,
            username: username,
            password: hashedPass,
        })

        if (tambahPegawai) {
            res.status(200).json({
                success: true,
                message: 'Data Pegawai Berhasil ditambahkan'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Data Pegawai gagal ditambahkan! Silahkan coba kembali'
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

//login pegawai
const loginPegawai = async (req, res) => {
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

        const findPegawai = await modelPegawai.findOne({
            where: {
                username: username
            }
        })
        if (!findPegawai) {
            return res.status(400).json({
                success: false,
                message: 'Username tidak ditemukan'
            })
        }

        bcrypt.compare(password, findPegawai.password, async (err, results) => {
            if (err || !results) {
                return res.status(400).json({
                    success: false,
                    message: 'Password anda salah'
                })
            }
            const id_pegawai = findPegawai.id_pegawai
            const username = findPegawai.username
            const id_role = findPegawai.id_role
            const token = jwt.sign({
                    username,
                    id_pegawai,
                    id_role
                },
                process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1w'
                }

            );

            req.session.id_pegawai = id_pegawai

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                token,
                id_pegawai,
                id_role
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

//logout pegawai
const logoutPegawai = async (req, res) => {
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

const getCurrentUser = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        });

        if (!pegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
        }

        return res.status(200).json({
            success: true,
            data: pegawai
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
};

//forgot password 
const forgotPassword = async (req, res) => {
    try {
        const {
            username,
            email
        } = req.body

        if (!username || !email) {
            return res.status(400).json({
                succes: false,
                message: 'Silahkan lengkapi data'
            })
        }
        const findAkun = await modelPegawai.findOne({
            where: {
                [Op.and]: {
                    username: username,
                    email: email,
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
            id_pegawai: findAkun.id_pegawai
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
            id_pegawai
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
            await modelPegawai.update({
                password: hashedPass
            }, {
                where: {
                    id_pegawai: id_pegawai
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
        const id_pegawai = req.session.id_pegawai

        if (!id_pegawai) {
            return res.redirect('/loginPegawai')
        }
        const findAkun = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            },
            attributes: ['username', 'nama', 'nip', 'email', 'foto', 'id_pegawai']
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
    tambahPegawai,
    loginPegawai,
    logoutPegawai,
    forgotPassword,
    confirmPassword,
    detailAkun,
    getCurrentUser
}