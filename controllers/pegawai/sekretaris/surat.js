const response = require('express')
require('dotenv').config()
const modelSuratMasuk = require('../../../models/surat_masuk')
const modelSuratKeluar = require('../../../models/surat_keluar')
const modelMahasiswa = require('../../../models/mahasiswa')
const modelPegawai = require('../../../models/pegawai')
const modelAnggotaMagang = require('../../../models/anggota_magang')
const modelDisposisi = require('../../../models/disposisi')
const modelRole = require('../../../models/role')
const modelBiro = require('../../../models/biro')
const path = require('path');
const fs = require('fs');
var pdf = require("pdf-creator-node");
const {
    Op
} = require('sequelize')

// mMnampilkan surat masuk 
const viewMasukSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        if (!pegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const {
            id_biro
        } = pegawai;
        const findSuratMasuk = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro,
            },
            include: [{
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
            }],
            attributes: ['id_surat_masuk', 'file', 'created_at']
        })

        if (findSuratMasuk.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada surat masuk'
            });
        }

        res.status(200).json({
            success: true,
            data: findSuratMasuk
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// mMnampilkan detail surat masuk 
const detailMasukSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    const findDetail = await modelSuratMasuk.findOne({
        where: {
            id_surat_masuk: id_surat_masuk
        },
        include: [{
            model: modelMahasiswa,
            as: 'dataMahasiswa',
            attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
        }, {
            model: modelAnggotaMagang,
            as: 'dataAnggotaMagang',
            attributes: ['nama', 'nim']
        }],
        attributes: ['id_surat_masuk', 'created_at', 'file', 'keterangan', 'periode_magang']
    })

    res.status(200).json({
        success: true,
        data: findDetail
    })
}

// Check disposisi
const checkDisposisi = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const existingDisposisi = await modelDisposisi.findOne({
            where: {
                id_surat_masuk: id_surat_masuk,
                id_pegawai: id_pegawai,
            },
        });

        if (existingDisposisi) {
            return res.status(200).json({
                success: true,
                disposisiExist: true
            });
        } else {
            return res.status(200).json({
                success: true,
                disposisiExist: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memeriksa disposisi'
        });
    }
}

// Acc disposisi 
const accDisposisi = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const existingDisposisi = await modelDisposisi.findOne({
            where: {
                id_surat_masuk: id_surat_masuk,
                id_pegawai: id_pegawai,
            },
        });

        if (existingDisposisi) {
            return res.status(400).json({
                success: false,
                message: 'Disposisi telah dilakukan untuk surat masuk ini.'
            });
        }

        const newDisposisi = await modelDisposisi.create({
            id_surat_masuk: id_surat_masuk,
            id_pegawai: id_pegawai,
            status: 'Telah di setujui sekretaris biro',
        })

        res.status(200).json({
            success: true,
            message: 'Disposisi berhasil disetujui',
            data: newDisposisi
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyetujui disposisi'
        });
    }
}

// Tolak disposisi 
const tolakDisposisi = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_masuk = req.params.id_surat_masuk

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const newDisposisi = await modelDisposisi.create({
            id_surat_masuk: id_surat_masuk,
            id_pegawai: id_pegawai,
            status: 'Ditolak',
        })

        res.status(200).json({
            success: true,
            message: 'Disposisi berhasil',
            data: newDisposisi
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyetujui disposisi'
        });
    }
}

// Menampilkan surat keluar 
const viewKeluarSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        })

        const {
            id_biro
        } = pegawai;

        const findSuratKeluar = await modelSuratKeluar.findAll({
            where: {
                id_biro: id_biro,
            },
            include: [{
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['id_mahasiswa', 'nama']
            }],
            attributes: ['id_surat_keluar', 'file', 'created_at', 'perihal', 'no_surat']
        })

        if (findSuratKeluar.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada surat keluar'
            });
        }

        res.status(200).json({
            success: true,
            data: findSuratKeluar
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Menampilkan detail surat Keluar 
const detailKeluarSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai
    const id_surat_keluar = req.params.id_surat_keluar

    if (!id_pegawai) {
        return res.redirect('/loginPegawai')
    }

    const findDetail = await modelSuratKeluar.findOne({
        where: {
            id_surat_keluar: id_surat_keluar
        },
        include: [{
            model: modelMahasiswa,
            as: 'dataMahasiswa',
            attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
        }],
        attributes: ['id_surat_keluar', 'perihal', 'created_at', 'file', 'keterangan', 'no_surat']
    })

    res.status(200).json({
        success: true,
        data: findDetail
    })
}

// Menampilkan disposisi
const viewDisposisiSekre = async (req, res) => {
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

        const {
            id_biro
        } = pegawai;
        const findDisposisi = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro
            },
            include: [{
                    model: modelDisposisi,
                    as: 'dataDisposisi',
                    attributes: ['id_disposisi', 'status', 'created_at'],
                    separate: true,
                    order: [
                        ['created_at', 'DESC']
                    ],
                    limit: 1
                },
                {
                    model: modelMahasiswa,
                    as: 'dataMahasiswa',
                    attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
                }
            ],
            attributes: ['id_surat_masuk', 'created_at', 'file']
        });

        if (findDisposisi.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada disposisi'
            });
        }

        res.status(200).json({
            success: true,
            data: findDisposisi
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Menampilkan detail disposisi 
const detailDisposisiSekre = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const findDetail = await modelSuratMasuk.findOne({
            where: {
                id_surat_masuk: id_surat_masuk
            },
            include: [{
                    model: modelBiro,
                    as: 'dataBiro',
                    attributes: ['id_biro', 'nama_biro']
                }, {
                    model: modelDisposisi,
                    as: 'dataDisposisi',
                    attributes: ['id_disposisi', 'keterangan', 'status', 'created_at'],
                    include: [{
                        model: modelPegawai,
                        as: 'dataPegawai',
                        attributes: ['id_pegawai', 'id_role'],
                        include: [{
                            model: modelRole,
                            as: 'dataRole',
                            attributes: ['nama_role']
                        }]
                    }]
                },
                {
                    model: modelMahasiswa,
                    as: 'dataMahasiswa',
                    attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
                }
            ],
            attributes: ['id_biro', 'created_at', 'periode_magang', 'file', 'keterangan']
        });

        if (!findDetail) {
            return res.status(404).json({
                success: false,
                message: 'Detail disposisi tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            data: findDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching detail disposisi'
        });
    }
};


//View Riwayat Acc Disposisi
const viewRiwayatAcc = async (req, res) => {
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

        const {
            id_biro
        } = pegawai;
        const findRiwayat = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro
            },
            include: [{
                    model: modelDisposisi,
                    as: 'dataDisposisi',
                    where: {
                        status: 'Disetujui'
                    },
                    attributes: ['id_disposisi', 'status', 'keterangan'],
                },
                {
                    model: modelMahasiswa,
                    as: 'dataMahasiswa',
                    attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
                }
            ],
            attributes: ['id_surat_masuk', 'periode_magang']
        });

        const filteredRiwayat = findRiwayat.filter(riwayat => riwayat.dataDisposisi.length > 0);

        if (filteredRiwayat.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada riwayat penerimaan magang'
            });
        }

        res.status(200).json({
            success: true,
            data: filteredRiwayat
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}


// View Riwayat Disposisi ditolak
const viewRiwayatDitolak = async (req, res) => {
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

        const {
            id_biro
        } = pegawai;
        const findRiwayat = await modelSuratMasuk.findAll({
            where: {
                id_biro: id_biro
            },
            include: [{
                    model: modelDisposisi,
                    as: 'dataDisposisi',
                    where: {
                        status: 'Ditolak'
                    },
                    attributes: ['id_disposisi', 'status', 'keterangan'],
                },
                {
                    model: modelMahasiswa,
                    as: 'dataMahasiswa',
                    attributes: ['id_mahasiswa', 'nama', 'instansi', 'jurusan']
                }
            ],
            attributes: ['id_surat_masuk', 'periode_magang', 'created_at', 'file']
        });

        if (findRiwayat.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Belum ada riwayat penolakan magang'
            });
        }

        res.status(200).json({
            success: true,
            data: findRiwayat
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data'
        });
    }
}

// Upload Penolakan
const uploadPenolakan = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    const id_surat_masuk = req.params.id_surat_masuk;
    const {
        keterangan
    } = req.body;

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        });

        const {
            id_biro
        } = pegawai;

        const suratMasuk = await modelSuratMasuk.findOne({
            where: {
                id_surat_masuk: id_surat_masuk
            }
        });

        const {
            id_mahasiswa
        } = suratMasuk;

        await modelSuratKeluar.create({
            id_surat_masuk,
            id_mahasiswa,
            id_biro,
            perihal: 'Penolakan Permohonan Magang Mahasiswa',
            keterangan: keterangan
        });

        res.status(200).json({
            success: true,
            message: 'Penolakan Permohonan Magang berhasil dikirim'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan keterangan penolakan'
        });
    }
}

// Check disposisi surat ditolak
const checkSuratKeluar = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const existingSuratKeluar = await modelSuratKeluar.findOne({
            where: {
                id_surat_masuk: id_surat_masuk,
            },
        });

        if (existingSuratKeluar) {
            return res.status(200).json({
                success: true,
                suratKeluarExist: true
            });
        } else {
            return res.status(200).json({
                success: true,
                suratKeluarExist: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memeriksa surat keluar'
        });
    }
};

const deleteSuraKeluar = async (req, res) => {
    try {
        const {
            id_surat_keluar
        } = req.params;
        const hapus = await modelSuratKeluar.destroy({
            where: {
                id_surat_keluar: id_surat_keluar
            }
        })
        if (!hapus) {
            return res.status(400).json({
                success: false,
                message: 'Data Surat Masuk gagal dihapus! Silahkan ulangi kembali'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Data Surat Masuk berhasil dihapus!'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error
        })
    }
}


// Upload surat keluar (penerimaan)
const createSuratBalasan = async (req, res) => {
    const id_pegawai = req.session.id_pegawai;
    const id_surat_masuk = req.params.id_surat_masuk;
    const {
        no_surat,
        keterangan
    } = req.body;

    if (!id_pegawai) {
        return res.redirect('/loginPegawai');
    }

    try {
        const pegawai = await modelPegawai.findOne({
            where: {
                id_pegawai: id_pegawai
            }
        });

        const {
            id_biro
        } = pegawai;

        const suratMasuk = await modelSuratMasuk.findOne({
            where: {
                id_surat_masuk: id_surat_masuk
            }
        });

        if (!suratMasuk) {
            return res.status(404).json({
                success: false,
                message: 'Surat masuk tidak ditemukan'
            });
        }

        const tahun_sekarang = new Date().getFullYear();
        const nomor_surat = `${no_surat}.${tahun_sekarang}`;

        const existingSurat = await modelSuratKeluar.findOne({
            where: {
                no_surat: nomor_surat
            }
        });

        if (existingSurat) {
            return res.status(400).json({
                success: false,
                message: 'Nomor surat sudah terdaftar'
            });
        }

        const {
            id_mahasiswa
        } = suratMasuk;

        const newSuratBalasan = await modelSuratKeluar.create({
            id_surat_masuk,
            id_mahasiswa,
            id_biro,
            perihal: 'Penerimaan Permohonan Magang Mahasiswa',
            no_surat: nomor_surat,
            keterangan: keterangan
        });

        const id_surat_keluar = newSuratBalasan.id_surat_keluar;

        res.status(200).json({
            success: true,
            message: 'Surat balasan berhasil dibuat.',
            id_surat_keluar: id_surat_keluar
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMimeType = (ext) => {
    switch (ext.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        default:
            return 'application/octet-stream';
    }
};

// Generate Surat
const generateSuratBalasan = async (req, res) => {
    try {
        const {
            id_surat_keluar
        } = req.params;
        const id_pegawai = req.session.id_pegawai;

        const pegawai = await modelPegawai.findByPk(id_pegawai, {
            include: [{
                model: modelBiro,
                as: 'dataBiro',
                attributes: ['nama_biro', 'id_biro']
            }]
        });

        if (!pegawai) {
            return res.redirect('/loginPegawai');
        }

        const {
            id_biro,
            nama_biro,
        } = pegawai.dataBiro;

        const findPegawai = await modelPegawai.findOne({
            where: {
                id_biro,
                id_role: 1
            },
            attributes: ['nama', 'nip', 'foto']
        });

        if (!findPegawai) {
            return res.status(404).json({
                success: false,
                message: 'Pegawai tidak ditemukan'
            });
        }

        const { nama, nip, foto } = findPegawai;

        const suratKeluar = await modelSuratKeluar.findOne({
            where: {
                id_surat_keluar: id_surat_keluar
            },
            include: [{
                model: modelMahasiswa,
                as: 'dataMahasiswa',
                attributes: ['instansi', 'jurusan', 'fakultas']
            }, {
                model: modelSuratMasuk,
                as: 'dataSuratMasuk',
                attributes: ['periode_magang'],
                include: [{
                    model: modelAnggotaMagang,
                    as: 'dataAnggotaMagang',
                    attributes: ['nama', 'nim']
                }]
            }]
        });

        if (!suratKeluar) {
            return res.status(404).json({
                success: false,
                message: 'Surat keluar tidak ditemukan'
            });
        }

        const fotoPath = path.resolve(__dirname, '../../../public/images/pegawai', foto);
        let ttd_kabir = '';

        if (fs.existsSync(fotoPath)) {
            const ext = path.extname(fotoPath);
            const mimeType = getMimeType(ext);
            const fotoBase64 = fs.readFileSync(fotoPath, 'base64');
            ttd_kabir = `data:${mimeType};base64,${fotoBase64}`;
        } else {
            console.warn('Gambar tanda tangan tidak ditemukan:', fotoPath);
        }

        const dataSurat = {
            nomor_surat: suratKeluar.no_surat,
            created_at: new Date(suratKeluar.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            jurusan: suratKeluar.dataMahasiswa.jurusan,
            fakultas: suratKeluar.dataMahasiswa.fakultas,
            universitas: suratKeluar.dataMahasiswa.instansi,
            nama_biro: nama_biro,
            tahun_sekarang: new Date().getFullYear(),
            periode_magang: suratKeluar.dataSuratMasuk.periode_magang,
            nama,
            nip,
            ttd_kabir,
            mahasiswa: suratKeluar.dataSuratMasuk.dataAnggotaMagang.map((anggota, index) => ({
                no: index + 1,
                nama: anggota.nama,
                nim: anggota.nim
            }))
        };

        const html = fs.readFileSync(path.resolve(__dirname, '../', '../', '../', 'public', 'docs', 'templateSurat.html'), 'utf8');
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm"
        };

        let fileName = `Surat_Balasan_${dataSurat.nomor_surat}.pdf`;
        let filePath = path.resolve(__dirname, '../../../public/surat_keluar', fileName);

        let count = 1;
        while (fs.existsSync(filePath)) {
            count++;
            fileName = `Surat_Balasan_${dataSurat.nomor_surat}(${count}).pdf`;
            filePath = path.resolve(__dirname, '../../../public/surat_keluar', fileName);
        }

        const document = {
            html: html,
            data: dataSurat,
            path: filePath,
            type: "",
        };

        pdf.create(document, options)
            .then(async (result) => {
                await modelSuratKeluar.update({
                    file: fileName
                }, {
                    where: {
                        id_surat_keluar
                    }
                });

                res.setHeader('Content-Type', 'application/pdf');
                res.attachment(`Surat Balasan Magang ${dataSurat.nomor_surat}.pdf`);
                res.send(result);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    viewMasukSekre,
    detailMasukSekre,
    accDisposisi,
    tolakDisposisi,
    viewKeluarSekre,
    detailKeluarSekre,
    viewDisposisiSekre,
    detailDisposisiSekre,
    viewRiwayatAcc,
    viewRiwayatDitolak,
    checkDisposisi,
    uploadPenolakan,
    checkSuratKeluar,
    deleteSuraKeluar,
    createSuratBalasan,
    generateSuratBalasan
}