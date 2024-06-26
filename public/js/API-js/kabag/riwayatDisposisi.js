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

    // View Permohonan Kabir
    try {
        const response = await fetch('/viewRiwayatPermohonanKabag', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success && data.data.length > 0) {
            const disposisiBody = document.getElementById('disposisiBody');
            disposisiBody.innerHTML = '';

            data.data.forEach((surat, index) => {

                const tr = document.createElement('tr');
                const statusClass = surat.dataDisposisi[0].status === 'Ditolak' ? 'text-red' : 'text-green';

                tr.innerHTML = `
                        <th scope="row" class="col-1">${index + 1}</th>
                        <td class="col-2">${surat.dataMahasiswa.nama}</td>
                        <td class="col-2 ${statusClass}">${surat.dataDisposisi[0].status}</td>                        
                        <td class="col-2">${surat.periode_magang}</td> 
                        <td class="col-2"><a href="#" class="file-link" data-file-url="${surat.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${surat.file ? surat.file : '-'}</a></td>
                        <td class="col-1">${new Date(surat.dataDisposisi[0].created_at).toLocaleDateString()}</td>
                        <td class="col-1">
                            <button type="button" class="btn btn-secondary btn-detail" data-bs-toggle="modal"
                            data-bs-target="#detail${surat.id_surat_masuk}" style="background-color: grey; border-radius: 48%;">
                            <i class='bx bx-info-circle'></i>
                            </button>
                            <div class="modal fade" id="detail${surat.id_surat_masuk}" tabindex="-1" aria-labelledby="detailLabel"
                                aria-hidden="true">
                                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title fw-bold" id="detailLabel">Detail Disposisi Surat</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" id="detailSuratBody${surat.id_surat_masuk}">
                                            <!-- Modal content will be loaded here -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                         <td class="col-1">
                            <button type="button" class="btn btn-danger delete-btn" data-id="${surat.dataDisposisi[0].id_disposisi}"><i class='bx bx-trash'></i></button>
                        </td>
                    `;
                disposisiBody.appendChild(tr);

                // Menampilkan file
                document.querySelectorAll('.file-link').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const fileUrl = link.dataset.fileUrl;
                        const objectElement = document.getElementById('fileObject');
                        objectElement.data = `/surat_masuk/${fileUrl}`;
                    });
                });

                // Menutup dan reload halaman
                const modalElement = document.getElementById('fileModal');
                modalElement.addEventListener('hidden.bs.modal', function () {
                    location.reload();
                });

                // Detail Disposisi
                const detailButton = tr.querySelector('.btn-detail');
                detailButton.addEventListener('click', async () => {
                    try {
                        const detailResponse = await fetch(`/detailPermohonanKabir/${surat.id_surat_masuk}`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json'
                            },
                        });
                        const detailData = await detailResponse.json();

                        if (detailData.success) {
                            const detailSuratBody = document.getElementById(`detailSuratBody${surat.id_surat_masuk}`);
                            detailSuratBody.innerHTML = '';

                            detailSuratBody.innerHTML = `
                            <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                <div class="col-sm-7">
                                    <h6>Pengirim</h6>
                                    <div class="input-group mb-3">
                                        <input type="text"
                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                        value="${detailData.data.dataMahasiswa.nama}" readonly>
                                    </div>
                                </div>
                                <div class="col-sm-5">
                                    <h6>Tanggal</h6>
                                    <div class="input-group mb-3">
                                        <input type="text"
                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                        value="${new Date(detailData.data.created_at).toLocaleDateString()}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                <div class="col-sm-7">
                                    <h6>Instansi</h6>
                                    <div class="input-group mb-3">
                                        <input type="text"
                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                        value="${detailData.data.dataMahasiswa.instansi}" readonly>
                                    </div>
                                </div>
                                <div class="col-sm-5">
                                    <h6>Jurusan</h6>
                                    <div class="input-group mb-3">
                                        <input type="text"
                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                        value="${detailData.data.dataMahasiswa.jurusan}" readonly>
                                    </div>
                                </div>
                            </div>
                            <h6>File Surat Pengajuan</h6>
                            <div class="input-group mb-3">
                                ${detailData.data.file ? `<a href="/surat_masuk/${detailData.data.file}" download="${detailData.data.file.split('/').pop()}">${detailData.data.file.split('/').pop()}</a>` : '-'}
                            </div>
                            <h6>Keterangan</h6>
                            <div class="input-group mb-3">
                                <textarea class="form-control input-div" rows="3" readonly style="height: fit-content;">${detailData.data.keterangan || '-'}</textarea>
                            </div>
                            <hr>
                            <div id="anggotaMagangContainer" class="mb-4">
                                <h6>Anggota Magang</h6>
                            </div>
                            <hr>
                            <h6>Riwayat Pemeriksaan</h6>
                            ${getDisposisiCard('Sekretaris Biro', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Sekretaris Biro'))}
                            ${getDisposisiCard('Kepala Bagian', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Kepala Bagian'))}
                            ${getDisposisiCard('Kepala Biro', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Kepala Biro'))}
                            `;

                            const anggotaMagangContainer = document.getElementById('anggotaMagangContainer');
                            anggotaMagangContainer.innerHTML = '<h6>Anggota Magang</h6>';
                            detailData.data.dataAnggotaMagang.forEach((anggota, idx) => {
                                const anggotaRow = document.createElement('div');
                                anggotaRow.classList.add('row', 'gx-3', 'gy-2', 'align-items-center', 'mt-2', 'mb-2');
                                anggotaRow.innerHTML = `
                                        <div class="col-sm-4">
                                            <p style="font-size: 15px">Nama Anggota ${idx + 1}</p>
                                            <div class="input-group mb-1">
                                                <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nama}" readonly>
                                            </div>
                                        </div>
                                        <div class="col-sm-3">
                                            <p style="font-size: 15px">Nim</p>
                                            <div class="input-group mb-1">
                                                <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nim}" readonly>
                                            </div>
                                        </div>
                                        <div class="col-sm-5">
                                            <p style="font-size: 15px">Penempatan Bagian</p>
                                            <div class="input-group mb-1">
                                                <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.dataBagian.nama_bagian}" readonly>
                                            </div>
                                        </div>
                                    `;
                                anggotaMagangContainer.appendChild(anggotaRow);
                            });
                        } else {
                            Swal.fire({
                                title: detailData.message || "No data available",
                                timer: 2000,
                                icon: "error"
                            });
                        }

                    } catch (error) {
                        console.error(error);
                        Swal.fire({
                            title: 'Error fetching data',
                            text: error.message,
                            icon: 'error',
                            customClass: {
                                popup: 'swal2-popup-custom'
                            }
                        });
                    }
                });
            });

            //Delete disposisi
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id_disposisi = event.currentTarget.getAttribute('data-id');
                    Swal.fire({
                        title: 'Yakin ingin menghapus disposisi ini?',
                        text: "Data ini akan dihapus secara permanen!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, hapus!'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                const response = await fetch(`/deleteDisposisi/${id_disposisi}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });

                                const responseData = await response.json();

                                if (responseData.success) {
                                    Swal.fire(
                                        'Berhasil!',
                                        responseData.message,
                                        'success'
                                    ).then(() => {
                                        location.reload();
                                    });
                                } else if (!responseData.success){
                                    Swal.fire(
                                        'Gagal!',
                                        responseData.message,
                                        'error'
                                    );
                                } else {
                                    Swal.fire(
                                        'Gagal!',
                                        'Terjadi kesalahan saat menghapus data.',
                                        'error'
                                    );
                                }
                            } catch (error) {
                                console.error('Terjadi kesalahan:', error);
                                Swal.fire(
                                    'Gagal!',
                                    'Terjadi kesalahan saat menghapus data.',
                                    'error'
                                );
                            }
                        }
                    });
                });
            });

        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Error fetching data',
            text: error.message,
            icon: 'error',
            customClass: {
                popup: 'swal2-popup-custom'
            }
        });
    };

    // Pengaturan Warna Btn
    function getButtonColor(disposisi) {
        if (!disposisi) {
            return 'warning';
        } else if (disposisi.status === 'Telah di setujui sekretaris biro' ||
            disposisi.status === 'Telah di setujui kepala bagian' ||
            disposisi.status === 'Disetujui') {
            return 'success';
        } else if (disposisi.status === 'Ditolak') {
            return 'danger';
        } else {
            return 'warning';
        }
    }

    // Teks Catatan Disposisi
    function getButtonText(disposisi) {
        if (!disposisi) {
            return 'Surat Permohonan Belum diperiksa';
        } else {
            return `Surat ${disposisi.status.toLowerCase()} `;
        }
    }

    // Disposisi Card
    function getDisposisiCard(role, disposisi) {
        if (!disposisi) {
            return `
                <div class="card" style="width: 24rem;">
                    <div class="card-body">
                        <p class="card-text" style="font-size: 12px;"><i class='bx bx-time-five'></i> -</p>
                        <h6 class="card-title">${role}</h6>
                        <div class="btn btn-secondary mb-4">Surat Permohonan Belum diperiksa</div>
                        <h6 class="card-title">Catatan:</h6>
                        <p class="card-text" style="font-size: 14px;">Tidak ada catatan pemeriksaan</p>
                    </div>
                </div>
                <br>
            `;
        } else {
            return `
            <div class="card" style="width: 24rem;">
                <div class="card-body">
                    <p class="card-text" style="font-size: 12px;"><i class='bx bx-time-five'></i> ${new Date(disposisi.created_at).toLocaleString()}</p>
                    <h6 class="card-title">${role}</h6>
                    <div class="btn btn-${getButtonColor(disposisi)} mb-4">${getButtonText(disposisi)}</div>
                    <h6 class="card-title">Catatan:</h6>
                    <p class="card-text" style="font-size: 14px;">${disposisi.keterangan || 'Tidak ada catatan pemeriksaan'}</p>
                </div>
            </div>
            <br>
        `;
        }
    }

});