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

    // View Surat Masuk
    try {
        const response = await fetch('/viewMasukSekre');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }
        if (data.success) {
            const suratMasukBody = document.getElementById('suratMasukBody');
            suratMasukBody.innerHTML = '';
            data.data.forEach((surat, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <th scope="row" class="col-1">${index + 1}</th>
                        <td class="col-2">${surat.dataMahasiswa.nama}</td>
                        <td class="col-1">${surat.dataMahasiswa.instansi}</td>
                        <td class="col-1">${surat.dataMahasiswa.jurusan}</td> 
                        <td class="col-3"><a href="#" class="file-link" data-file-url="${surat.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${surat.file ? surat.file : '-'}</a></td>
                        <td class="col-1">${new Date(surat.created_at).toLocaleDateString()}</td>
                        <td class="col-1">
                            <button type="button" class="btn btn-secondary detail-btn" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#detailModal" style="background-color: grey; border-radius: 48%;">
                                <i class='bx bx-info-circle'></i>
                            </button>
                        </td>
                       <td class="col-2">
                            <button type="button" class="btn btn-success acc-btn" data-id="${surat.id_surat_masuk}"><i class='bx bx-check'></i></button>
                            <button type="button" class="btn btn-danger reject-btn" data-id="${surat.id_surat_masuk}"><i class='bx bx-x'></i></button>
                        </td>
                    `;
                suratMasukBody.appendChild(row);
            });

            // Menampilkan File
            document.querySelectorAll('.file-link').forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const fileUrl = link.dataset.fileUrl;
                    const objectElement = document.getElementById('fileObject');
                    objectElement.data = `/surat_masuk/${fileUrl}`;
                });
            });

            // Menutup dan Reload Halaman
            const modalElement = document.getElementById('fileModal');
            modalElement.addEventListener('hidden.bs.modal', function () {
                location.reload();
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
                                document.getElementById('periode_magang').value = detail.periode_magang;
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

            // Acc Surat Masuk
            const accButtons = document.querySelectorAll('.acc-btn');
            accButtons.forEach(button => {
                const idSuratMasuk = parseInt(button.getAttribute('data-id'));
                fetch(`/checkDisposisi/${idSuratMasuk}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.disposisiExist) {
                            button.setAttribute('disabled', 'disabled');
                        }
                    });


                button.addEventListener('click', event => {
                    const id = event.currentTarget.getAttribute('data-id');
                    fetch(`/accDisposisi/${id}`, {
                            method: 'POST'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Berhasil',
                                    text: data.message,
                                    willClose: () => {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal',
                                    text: data.message
                                });
                            }
                        });
                });
            });

            // Tolak Surat Masuk
            const tolakButtons = document.querySelectorAll('.reject-btn');
            tolakButtons.forEach(button => {
                const idSuratMasuk = parseInt(button.getAttribute('data-id'));
                fetch(`/checkDisposisi/${idSuratMasuk}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.disposisiExist) {
                            button.setAttribute('disabled', 'disabled');
                        }
                    });

                button.addEventListener('click', event => {
                    const id = event.currentTarget.getAttribute('data-id');
                    fetch(`/tolakDisposisi/${id}`, {
                            method: 'POST'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Berhasil',
                                    text: data.message,
                                    willClose: () => {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal',
                                    text: data.message
                                });
                            }
                        });
                });
            });
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

});