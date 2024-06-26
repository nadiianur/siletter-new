const server = {}
const mahasiswa = require('./mahasiswa/mahasiswa')
const dashboardMahasiswa = require('./mahasiswa/dashboard')
const suratKeluarMahasiswa = require('./mahasiswa/suratKeluar')
const suratMasukMahasiswa = require('./mahasiswa/suratMasuk')
const profile = require('./mahasiswa/profile')
const biro = require('./biro/biro')
const role = require('./pegawai/role')
const pegawai = require('./pegawai/pegawai')
const profilePegawai = require('./pegawai/profilePegawai')
const dashboardPegawai = require('./pegawai/dashboard')
const suratSekre = require('./pegawai/sekretaris/surat')
const permohonanKabag = require('./pegawai/kabag/permohonan')
const permohonanKabir = require('./pegawai/kabir/permohonan')
const view = require('./viewsWeb/views')

server.mahasiswa = mahasiswa
server.dashboardMahasiswa = dashboardMahasiswa
server.suratKeluarMahasiswa = suratKeluarMahasiswa
server.suratMasukMahasiswa = suratMasukMahasiswa
server.profile = profile
server.biro = biro
server.role = role
server.pegawai = pegawai
server.profilePegawai = profilePegawai
server.dashboardPegawai = dashboardPegawai
server.suratSekre = suratSekre
server.permohonanKabag = permohonanKabag
server.permohonanKabir = permohonanKabir
server.view = view

module.exports = server