document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logOut');
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logoutMahasiswa', {
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
                        window.location.href = '/loginUser';
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
    });

    async function fetchProfileData() {
        try {
            const response = await fetch('/dataProfileMahasiswa');
            const result = await response.json();

            if (result.success) {
                const profilePictureElement = document.getElementById('profilePicture');
                const profilePicturePath = result.data.foto ? `/images/mahasiswa/${result.data.foto}` : '/img/pp.png';
                profilePictureElement.src = profilePicturePath;
            } else {
                console.error('Failed to load profile data:', result.message);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    }
    fetchProfileData();
    
    // Kirim Surat
    document.getElementById('btnKirim').addEventListener('click', async function (event) {
        event.preventDefault();

        const idBiro = document.getElementById('tujuan').value;
        const periodeMagang = document.getElementById('periode_magang').value;
        const fileSurat = document.getElementById('formFile').files[0];
        const keterangan = document.getElementById('keterangan').value;

        const namaInputs = document.querySelectorAll('.nama');
        const nimInputs = document.querySelectorAll('.nim');
        const namaAnggota = Array.from(namaInputs).map(input => input.value);
        const nimAnggota = Array.from(nimInputs).map(input => input.value);

        if (!idBiro || !periodeMagang || !fileSurat || namaAnggota.some(nama => !nama) || nimAnggota.some(nim => !nim)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Silakan lengkapi semua data yang diperlukan.'
            });
            return;
        }

        if (fileSurat.type !== 'application/pdf') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'File harus dalam format PDF.'
            });
            return;
        }

        const formData = new FormData();
        formData.append('id_biro', idBiro);
        formData.append('periode_magang', periodeMagang);
        formData.append('file_surat', fileSurat);
        formData.append('keterangan', keterangan);
        namaAnggota.forEach((nama, index) => {
            formData.append('nama[]', nama);
            formData.append('nim[]', nimAnggota[index]);
        });

        try {
            const response = await fetch('/kirimSurat', {
                method: 'POST',
                body: formData
            });

            const responseData = await response.json();

            if (responseData.success === false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: responseData.message
                });
                return;
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Surat telah berhasil dikirim.'
                }).then(() => {
                    window.location.reload();
                });
            }

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message
            });
        }
    });

    // View Surat Keluar
    try {
        const response = await fetch('/viewSuratKeluar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginUser';
        }

        if (data.success && data.data.length > 0) {
            const tbody = document.getElementById('suratKeluarBody');
            tbody.innerHTML = '';

            data.data.forEach((item, index) => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${item.dataBiro.nama_biro}</td>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                        <a href="#" class="file-link" data-file-url="${item.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${item.file}</a>
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary btn-detail" data-bs-toggle="modal"
                            data-bs-target="#detail${item.id_surat_masuk}" style="background-color: grey; border-radius: 48%;">
                            <i class='bx bx-info-circle'></i>
                        </button>
                        <!-- Modal for details -->
                        <div class="modal fade" id="detail${item.id_surat_masuk}" tabindex="-1" aria-labelledby="detailLabel"
                            aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title fw-bold" id="detailLabel">Detail Surat</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body" id="detailSuratBody${item.id_surat_masuk}">
                                        <form>
                                            <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                                <div class="col-sm-7">
                                                    <h6>Tujuan</h6>
                                                    <div class="input-group mb-3">
                                                        <input type="text"
                                                            class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                            value="${item.dataBiro.nama_biro}" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-5">
                                                    <h6>Tanggal</h6>
                                                    <div class="input-group mb-3">
                                                        <input type="text"
                                                            class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                            value="${new Date(item.created_at).toLocaleDateString()}" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                            <h6>File Surat</h6>
                                            <div class="input-group mb-3">
                                                <a href="#">${item.file}</a>
                                            </div>
                                            <h6>Keterangan</h6>
                                            <div class="input-group mb-3">
                                                <textarea class="form-control input-div"
                                                    rows="3"
                                                    style="height: fit-content;">${item.keterangan || '-'}</textarea>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger" onclick="confirmDelete(${item.id_surat_masuk})"><i class='bx bx-trash'></i> Hapus</button>
                    </td>
                `;
                tbody.appendChild(tr);

                // Menampilkan File 
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

                // Detail Surat
                const detailButton = tr.querySelector('.btn-detail');
                detailButton.addEventListener('click', async () => {
                    try {
                        const detailResponse = await fetch(`/detailSuratKeluar/${item.id_surat_masuk}`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json'
                            },
                        });
                        const detailData = await detailResponse.json();

                        if (detailData.success) {
                            const detailSuratBody = document.getElementById(`detailSuratBody${item.id_surat_masuk}`);
                            detailSuratBody.innerHTML = '';

                            detailSuratBody.innerHTML = `
                                <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                    <div class="col-sm-7">
                                        <h6>Tujuan</h6>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" id="detailTujuan" value="${detailData.data.dataBiro.nama_biro}" readonly>
                                        </div>
                                    </div>
                                    <div class="col-sm-5">
                                        <h6>Tanggal</h6>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" id="detailTanggal" value="${new Date(detailData.data.created_at).toLocaleDateString()}" readonly>
                                        </div>
                                    </div>
                                </div>
                                <h6>File Surat</h6>
                                <div class="input-group mb-3">
                                     ${detailData.data.file ? `<a href="/surat_masuk/${detailData.data.file}" download="${detailData.data.file.split('/').pop()}">${detailData.data.file.split('/').pop()}</a>` : '-'}
                                </div>
                                <h6>Keterangan</h6>
                                <div class="input-group mb-3">
                                    <textarea class="form-control input-div" id="detailKeterangan" rows="3" readonly style="height: fit-content;">${detailData.data.keterangan || '-'}</textarea>
                                </div>
                                <hr>
                                <h6>Riwayat Pemeriksaan</h6>
                                ${getDisposisiCard('Sekretaris Biro', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Sekretaris Biro'))}
                                ${getDisposisiCard('Kepala Bagian', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Kepala Bagian'))}
                                ${getDisposisiCard('Kepala Biro', detailData.data.dataDisposisi.find(disposisi => disposisi.dataPegawai.dataRole.nama_role === 'Kepala Biro'))}
                            `;
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

    // Catatan Disposisi
    function getButtonText(disposisi) {
        if (!disposisi) {
            return 'Surat Permohonan Belum diperiksa';
        } else {
            return `Surat ${disposisi.status.toLowerCase()}`;
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
                    <p class="card-text" style="font-size: 14px;">Belum ada catatan pemeriksaan</p>
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
                    <p class="card-text" style="font-size: 14px;">${disposisi.keterangan || 'Belum ada catatan pemeriksaan'}</p>
                </div>
            </div>
            <br>
        `;
        }
    }

    //Delete surat keluar
    window.confirmDelete = async function (id_surat_masuk) {
        Swal.fire({
            title: 'Batal Mengirim Surat',
            text: 'Apakah Anda yakin ingin membatalkan pengiriman surat permohonan magang ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/deleteSuratKeluarMhs/${id_surat_masuk}`, {
                        method: 'POST'
                    });
                    const data = await response.json();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Pembatalan pengiriman surat berhasil dilakukan',
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                location.reload();
                            }
                        });
                    }  else if (!data.success) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Gagal',
                            text: data.message,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat menghapus data',
                            timer: 2000,
                            timerProgressBar: true
                        });
                    }
                } catch (error) {
                    console.error('Terjadi kesalahan:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat menghapus data surat masuk',
                        timer: 2000,
                        timerProgressBar: true
                    });
                }
            }
        });
    };

});