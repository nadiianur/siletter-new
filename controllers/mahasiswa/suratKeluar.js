const response = require('express')
require('dotenv').config()
const modelSuratMasuk = require('../../models/surat_masuk')
const modelBiro = require('../../models/biro')
const modelAnggotaMagang = require('../../models/anggota_magang')
const modelDisposisi = require('../../models/disposisi')
const modelPegawai = require('../../models/pegawai')
const modelRole = require('../../models/role')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util');
const rename = promisify(fs.rename);
const {Op, where, Model} = require('sequelize')

// menampilkan surat keluar mahasiswa (DB Surat Masuk)
const viewSuratKeluar = async (req, res) =>{
    const id_mahasiswa = req.session.id_mahasiswa

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const findSuratKeluar = await modelSuratMasuk.findAll({
        where:{
            id_mahasiswa: id_mahasiswa
        },
        include:[{
            model: modelBiro,
            as: 'dataBiro',
            attributes: ['id_biro', 'nama_biro']
        }],
        attributes:['id_biro', 'created_at', 'file', 'id_surat_masuk']
    })

    if(findSuratKeluar.length == 0){
        return res.status(200).json({ success: false, message: 'Belum ada surat keluar'});
    }

    res.status(200).json({ success:  true, data: findSuratKeluar})
}

// menampilkan detail surat keluar mahasiswa (DB Surat Masuk)
const detailSuratKeluar = async (req, res) =>{
    const id_mahasiswa = req.session.id_mahasiswa
    const id_surat_masuk = req.params.id_surat_masuk

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    const findDetail = await modelSuratMasuk.findOne({
        where:{
            id_surat_masuk: id_surat_masuk
        },
        include:[{
            model: modelBiro,
            as: 'dataBiro',
            attributes: ['id_biro', 'nama_biro']
        },{
            model: modelDisposisi,
            as: 'dataDisposisi',
            attributes: ['id_disposisi', 'keterangan', 'status', 'created_at'],
            include:[{
                model: modelPegawai,
                as: 'dataPegawai',
                attributes: ['id_pegawai', 'id_role'],
                include:[{
                    model: modelRole,
                    as: 'dataRole',
                    attributes:['nama_role']
                }]
            }]
        }],
        attributes:['id_biro', 'created_at', 'periode_magang', 'file', 'keterangan']
    })

    res.status(200).json({ success:  true, data: findDetail})
}

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../public/surat_masuk');
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: async (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        let fileName = path.basename(file.originalname, fileExtension);
        let newFileName = fileName + fileExtension;
        let counter = 1;

        const uploadPath = path.join(__dirname, '../../public/surat_masuk');

        while (fs.existsSync(path.join(uploadPath, newFileName))) {
            newFileName = `${fileName}(${counter})${fileExtension}`;
            counter++;
        }

        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: File yang diupload harus berupa PDF!'));
        }
    }
}).single('file_surat');

const kirimSurat = async (req, res) =>{
    const id_mahasiswa = req.session.id_mahasiswa

    if(!id_mahasiswa){
        return res.redirect('/loginUser')
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        try {
            const { 
                id_biro, 
                periode_magang, 
                keterangan, 
                nama,
                nim
            } = req.body;

            const id_mahasiswa = req.session.id_mahasiswa;

            if (req.file && req.file.mimetype !== 'application/pdf') {
                return res.status(400).json({ success: false, message: 'File harus dalam bentuk PDF!' });
            }

            const namaArray = Array.isArray(nama) ? nama : [nama];
            const nimArray = Array.isArray(nim) ? nim : [nim];

            const suratMasuk = await modelSuratMasuk.create({
                id_biro,
                id_mahasiswa,
                periode_magang,
                file: req.file.filename,
                keterangan
            });

            const anggotaMagangPromises = namaArray.map((namaMahasiswa, index) => {
                return modelAnggotaMagang.create({
                    id_surat_masuk: suratMasuk.id_surat_masuk,
                    nama: namaMahasiswa,
                    nim: nimArray[index]
                });
            });

            await Promise.all(anggotaMagangPromises);

            res.status(200).send({ message: 'Surat telah berhasil dikrim.' });

        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Terjadi kesalahan saat mengirim surat! Silahkan coba kembali' });
        }
    });
}

const deleteSuratKeluar = async (req, res) => {
    try {
        const {
            id_surat_masuk
        } = req.params;

        const disposisiCount = await modelDisposisi.count({
            where: {
                id_surat_masuk: id_surat_masuk
            }
        });

        if (disposisiCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus surat keluar karena surat permohonan telah diproses.'
            });
        }

        const hapus = await modelSuratMasuk.destroy({
            where: {
                id_surat_masuk: id_surat_masuk
            }
        })

        if (!hapus) {
            return res.status(400).json({
                success: false,
                message: 'Data Surat Keluar gagal dihapus! Silahkan ulangi kembali'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Surat keluar berhasil dihapus.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus surat keluar!'
        });
    }
};

module.exports = {
    viewSuratKeluar,
    detailSuratKeluar,
    kirimSurat,
    deleteSuratKeluar
}