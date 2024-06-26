const response = require('express')
const modelMahasiswa = require('../../models/mahasiswa')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const controllers = {}

//Update Profile
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/mahasiswa'))

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new multer.MulterError('Jenis File Tidak Di izinkan, Hanya JPEG dan PNG yg Di izinkan');
        error.message = 'Jenis File Tidak Di izinkan, Hanya JPEG dan PNG yg Di izinkan'
        return cb(error, false);
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
const uploadd = upload.single('file')

//update akun
const updateAkun = async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);

        const id_mahasiswa = req.session.id_mahasiswa;

        if (!id_mahasiswa) {
            return res.redirect('/loginUser');
        }

        const findAkun = await modelMahasiswa.findOne({
            where: {
                id_mahasiswa: id_mahasiswa
            }
        });

        if (!findAkun) {
            return res.status(400).json({
                success: false,
                message: 'Akun tidak ditemukan'
            });
        }

        const {
            username,
            nama,
            instansi,
            fakultas,
            jurusan,
            angkatan,
            no_hp,
            jenis_kelamin,
            password_lama,
            password_baru
        } = req.body;

        const foto = req.file;

        let updateFoto = false
        let updatePassword = false
        let update //foto dan pass baru
        let update2 //tidak foto pass baru

        if (foto) {
            updateFoto = true
        } else {
            updateFoto = false
        }

        if (password_baru) {
            updatePassword = true
        } else {
            updatePassword = false
        }

        if (updateFoto) {
            if (updatePassword) {
                update = true
            } else {
                update = false
            }
        } else {
            if (updatePassword) {
                update2 = true
            } else {
                update2 = false
            }
        }

        if (update) {
            if (!password_lama) {
                return res.status(400).json({
                    success: false,
                    message: 'Silahkan isi password lama anda terlebih dahulu'
                })
            }

            const passwordAsli = findAkun.password
            const passwordMatch = bcrypt.compareSync(password_lama, passwordAsli)
            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Password lama anda salah'
                })
            }

            const salt = bcrypt.genSaltSync(10)
            const encryptPass = bcrypt.hashSync(password_baru, salt)
            if (username && username !== findAkun.username) {
                const findUser = await modelMahasiswa.findOne({
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                if (!findUser) {
                    await modelMahasiswa.update({
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        instansi: instansi || findAkun.instansi,
                        fakultas: fakultas || findAkun.fakultas,
                        jurusan: jurusan || findAkun.jurusan,
                        angkatan: angkatan || findAkun.angkatan,
                        no_hp: no_hp || findAkun.no_hp,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                        foto: foto.originalname
                    }, {
                        where: {
                            id_mahasiswa: id_mahasiswa
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        message: 'Data akun berhasil diperbaharui'
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Username sudah terdaftar sebelumnya'
                    })
                }
            } else {
                await modelMahasiswa.update({
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    instansi: instansi || findAkun.instansi,
                    fakultas: fakultas || findAkun.fakultas,
                    jurusan: jurusan || findAkun.jurusan,
                    angkatan: angkatan || findAkun.angkatan,
                    no_hp: no_hp || findAkun.no_hp,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                    foto: foto.originalname
                }, {
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                return res.status(200).json({
                    success: true,
                    message: 'Data akun berhasil diperbaharui'
                })
            }
        } else if (update == false) {
            if (username && username !== findAkun.username) {
                const findUser = await modelMahasiswa.findOne({
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                if (!findUser) {
                    await modelMahasiswa.update({
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        instansi: instansi || findAkun.instansi,
                        fakultas: fakultas || findAkun.fakultas,
                        jurusan: jurusan || findAkun.jurusan,
                        angkatan: angkatan || findAkun.angkatan,
                        no_hp: no_hp || findAkun.no_hp,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        foto: foto.originalname
                    }, {
                        where: {
                            id_mahasiswa: id_mahasiswa
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        message: 'Data akun berhasil diperbaharui'
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Username sudah terdaftar sebelumnya'
                    })
                }
            } else {
                await modelMahasiswa.update({
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    instansi: instansi || findAkun.instansi,
                    fakultas: fakultas || findAkun.fakultas,
                    jurusan: jurusan || findAkun.jurusan,
                    angkatan: angkatan || findAkun.angkatan,
                    no_hp: no_hp || findAkun.no_hp,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    foto: foto.originalname
                }, {
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                return res.status(200).json({
                    success: true,
                    message: 'Data akun berhasil diperbaharui'
                })
            }
        } else if (update2 == true) {
            if (!password_lama) {
                return res.status(400).json({
                    success: false,
                    message: 'Silahkan isi password lama anda terlebih dahulu'
                })
            }
            const passwordAsli = findAkun.password
            const passwordMatch = bcrypt.compareSync(password_lama, passwordAsli)
            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Password lama anda salah'
                })
            }
            const salt = bcrypt.genSaltSync(10)
            const encryptPass = bcrypt.hashSync(password_baru, salt)
            if (username && username !== findAkun.username) {
                const findUser = await modelMahasiswa.findOne({
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                if (!findUser) {
                    await modelMahasiswa.update({
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        instansi: instansi || findAkun.instansi,
                        fakultas: fakultas || findAkun.fakultas,
                        jurusan: jurusan || findAkun.jurusan,
                        angkatan: angkatan || findAkun.angkatan,
                        no_hp: no_hp || findAkun.no_hp,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                    }, {
                        where: {
                            id_mahasiswa: id_mahasiswa
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        message: 'Data akun berhasil diperbaharui'
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Username sudah terdaftar sebelumnya'
                    })
                }
            } else {
                await modelMahasiswa.update({
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    instansi: instansi || findAkun.instansi,
                    fakultas: fakultas || findAkun.fakultas,
                    jurusan: jurusan || findAkun.jurusan,
                    angkatan: angkatan || findAkun.angkatan,
                    no_hp: no_hp || findAkun.no_hp,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                }, {
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                return res.status(200).json({
                    success: true,
                    message: 'Data akun berhasil diperbaharui'
                })
            }
        } else {
            if (username && username !== findAkun.username) {
                const findUser = await modelMahasiswa.findOne({
                    where: {
                        username: username
                    }
                })
                if (!findUser) {
                    await modelMahasiswa.update({
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        instansi: instansi || findAkun.instansi,
                        fakultas: fakultas || findAkun.fakultas,
                        jurusan: jurusan || findAkun.jurusan,
                        angkatan: angkatan || findAkun.angkatan,
                        no_hp: no_hp || findAkun.no_hp,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    }, {
                        where: {
                            id_mahasiswa: id_mahasiswa
                        }
                    })
                    return res.status(200).json({
                        success: true,
                        message: 'Data akun berhasil diperbaharui'
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Username sudah terdaftar sebelumnya'
                    })
                }
            } else {
                await modelMahasiswa.update({
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    instansi: instansi || findAkun.instansi,
                    fakultas: fakultas || findAkun.fakultas,
                    jurusan: jurusan || findAkun.jurusan,
                    angkatan: angkatan || findAkun.angkatan,
                    no_hp: no_hp || findAkun.no_hp,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                }, {
                    where: {
                        id_mahasiswa: id_mahasiswa
                    }
                })
                return res.status(200).json({
                    success: true,
                    message: 'Data akun berhasil diperbaharui'
                })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

controllers.updateAkun = [uploadd, updateAkun];

module.exports = controllers;