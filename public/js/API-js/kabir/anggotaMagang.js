document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logOut')
    logoutButton.addEventListener('click', async function () {
        try {
            const userResponse = await fetch('/checkTtdPegawai');
            const userData = await userResponse.json();

            if (!userData.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mendapatkan data pengguna. Silakan coba lagi.'
                });
                return;
            }

            const user = userData.data;

            // Periksa apakah pengguna sudah menambahkan foto
            if (!user.foto) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Info',
                    text: 'Silahkan tambahakan TTD Digital terlebih dahulu sebelum logout.',
                    willClose: () => {
                        window.location.href = '/profileKepalaBiro';
                    }
                });
                return;
            }

            const response = await fetch('/logoutPegawai', {
                method: 'DELETE'
            });
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Logout Berhasil',
                    text: 'Anda akan diarahkan ke halaman login.',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        window.location.href = '/loginPegawai';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Logout Gagal',
                    text: 'Terjadi kesalahan saat logout. Silakan coba lagi.'
                });
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    })
    
    async function fetchProfileData() {
        try {
            const response = await fetch('/dataProfile');
            const result = await response.json();

            if (result.success) {
                const profilePictureElement = document.getElementById('profilePicture');
                const profilePicturePath = result.data.foto ? `/images/pegawai/${result.data.foto}` : '/img/pp.png';
                profilePictureElement.src = profilePicturePath;
            } else {
                console.error('Failed to load profile data:', result.message);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    }
    fetchProfileData();

    // View Riwayat Anggota
    try {
        const response = await fetch('/riwayatAnggota');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success) {
            const tr = document.getElementById('anggotaMagangBody');
            tr.innerHTML = '';
            if (data.data.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="6" class="text-center">Belum ada riwayat anggota magang</td>
                `;
                tr.appendChild(row);
            } else {

                data.data.forEach((anggota, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row" class="col-1">${index + 1}</th>
                        <td class="col-2">${anggota.nama}</td>
                        <td class="col-2">${anggota.nim}</td>
                        <td class="col-3">${anggota.dataSuratMasuk.periode_magang}</td> 
                        <td class="col-3">${anggota.dataBagian.nama_bagian}</td> 
                        <td class="col-1">
                            <button type="button" class="btn btn-secondary detail-btn" data-id="${anggota.dataSuratMasuk.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#detailModal" style="background-color: grey; border-radius: 48%;">
                                <i class='bx bx-info-circle'></i>
                            </button>
                        </td>
                    `;
                    tr.appendChild(row);
                });

                // Detail Surat Masuk
                document.querySelectorAll('.detail-btn').forEach(button => {
                    button.addEventListener('click', event => {
                        const id = event.currentTarget.getAttribute('data-id');
                        fetch(`/detailMasukSekre/${id}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    const detail = data.data;
                                    document.getElementById('pengirim').value = detail.dataMahasiswa.nama;
                                    document.getElementById('tanggal').value = new Date(detail.created_at).toLocaleDateString();
                                    document.getElementById('instansi').value = detail.dataMahasiswa.instansi;
                                    document.getElementById('jurusan').value = detail.dataMahasiswa.jurusan;
                                    document.getElementById('fileSurat').textContent = detail.file;

                                    const fileSuratElement = document.getElementById('fileSurat');
                                    const filePath = `/surat_masuk/${detail.file}`;

                                    if (detail.file) {
                                        fileSuratElement.setAttribute('href', filePath);
                                        fileSuratElement.setAttribute('download', detail.file);
                                        fileSuratElement.textContent = `${detail.file}`;
                                    } else {
                                        fileSuratElement.textContent = '-';
                                        fileSuratElement.removeAttribute('href');
                                        fileSuratElement.removeAttribute('download');
                                    }

                                    document.getElementById('keterangan').textContent = detail.keterangan;

                                    const anggotaMagangContainer = document.getElementById('anggotaMagangContainer');
                                    anggotaMagangContainer.innerHTML = '<h6>Anggota Magang</h6>';
                                    detail.dataAnggotaMagang.forEach((anggota, idx) => {
                                        const anggotaRow = document.createElement('div');
                                        anggotaRow.classList.add('row', 'gx-3', 'gy-2', 'align-items-center', 'mt-2', 'mb-2');
                                        anggotaRow.innerHTML = `
                                        <div class="col-sm-7">
                                            <p style="font-size: 15px">Nama Anggota ${idx + 1}</p>
                                            <div class="input-group mb-1">
                                                <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nama}" readonly>
                                            </div>
                                        </div>
                                        <div class="col-sm-5">
                                            <p style="font-size: 15px">Nim</p>
                                            <div class="input-group mb-1">
                                                <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nim}" readonly>
                                            </div>
                                        </div>
                                    `;
                                        anggotaMagangContainer.appendChild(anggotaRow);
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Gagal',
                                        text: detail.message
                                    });
                                }
                            });
                    });
                });
            }
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

});