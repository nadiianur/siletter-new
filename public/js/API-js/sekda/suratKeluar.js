document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logOut')
    logoutButton.addEventListener('click', async function () {
        try {
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

    // View Surat Keluar
    try {
        const response = await fetch('/viewKeluarSekre');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success) {
            const suratKeluarBody = document.getElementById('suratKeluarBody');
            suratKeluarBody.innerHTML = '';
            data.data.forEach((surat, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <th scope="row" class="col-1">${index + 1}</th>
                        <td class="col-1">${surat.no_surat || '-'} </td>
                        <td class="col-2">${surat.perihal}</td>
                        <td class="col-2">${surat.dataMahasiswa.nama}</td>
                        <td class="col-1">${new Date(surat.created_at).toLocaleDateString()}</td>
                        <td class="col-2">${surat.file ? `<a href="#" class="file-link" data-file-url="${surat.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${surat.file}</a>` : '-'}</td>
                        <td class="col-1">
                            <button type="button" class="btn btn-secondary detail-btn" data-id="${surat.id_surat_keluar}" data-bs-toggle="modal" data-bs-target="#detail" style="background-color: grey; border-radius: 48%;">
                                <i class='bx bx-info-circle'></i>
                            </button>
                        </td>
                        <td class="col-2">
                            <button type="button" class="btn btn-danger" onclick="confirmDelete(${surat.id_surat_keluar})"><i class='bx bx-trash'></i> Hapus</button>
                        </td>
                    `;
                suratKeluarBody.appendChild(row);

                // Menampilkan File
                document.querySelectorAll('.file-link').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const fileUrl = link.dataset.fileUrl;
                        const objectElement = document.getElementById('fileObject');
                        objectElement.data = `/surat_keluar/${fileUrl}`;
                    });
                });

                // Menutup dan Reload Halaman
                const modalElement = document.getElementById('fileModal');
                modalElement.addEventListener('hidden.bs.modal', function () {
                    location.reload();
                });

                // Detail Surat Keluar
                document.querySelectorAll('.detail-btn').forEach(button => {
                    button.addEventListener('click', event => {
                        const id = event.currentTarget.getAttribute('data-id');
                        fetch(`/detailKeluarSekre/${id}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    const detail = data.data;
                                    document.getElementById('tujuan').value = detail.dataMahasiswa.nama;
                                    document.getElementById('tanggal').value = new Date(detail.created_at).toLocaleDateString();
                                    document.getElementById('instansi').value = detail.dataMahasiswa.instansi;
                                    document.getElementById('jurusan').value = detail.dataMahasiswa.jurusan;
                                    document.getElementById('perihal').value = detail.perihal;
                                    document.getElementById('no_surat').value = detail.no_surat ? detail.no_surat : '-';
                                    document.getElementById('fileSurat').textContent = detail.file;

                                    const fileSuratElement = document.getElementById('fileSurat');
                                    const filePath = `/surat_keluar/${detail.file}`;

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

            });
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

    // Menghapus Data Surat Masuk
    window.confirmDelete = async function (id_surat_keluar) {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin menghapus data surat keluar ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/deleteSuratKeluar/${id_surat_keluar}`, {
                        method: 'POST'
                    });
                    const data = await response.json();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data surat keluar berhasil dihapus',
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                location.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat menghapus data surat keluar',
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }
                } catch (error) {
                    console.error('Terjadi kesalahan:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat menghapus data surat keluar',
                        timer: 2000,
                        timerProgressBar: true
                    });
                }
            }
        });
    }
});