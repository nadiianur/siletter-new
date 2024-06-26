document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logOut')
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

    // View Surat Masuk
    try {
        const response = await fetch('/viewSuratMasuk');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginUser';
        }

        if (data.success) {
            const suratMasukBody = document.getElementById('suratMasukBody');
            suratMasukBody.innerHTML = '';
            data.data.forEach((surat, index) => {
                const row = `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${surat.dataBiro.nama_biro}</td>
                        <td>${new Date(surat.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                        ${surat.file ? `<a href="#" class="file-link" data-file-url="${surat.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${surat.file}</a>` : '-'}
                        </td>
                        <td>${surat.keterangan}</td>
                        <td>
                            <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#detail${surat.id_surat_keluar}">
                                <i class='bx bx-info-circle'></i>
                            </button>
                            <!-- Modal -->
                            <div class="modal fade" id="detail${surat.id_surat_keluar}" tabindex="-1" aria-labelledby="detailLabel${surat.id_biro}" aria-hidden="true">
                                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title fw-bold" id="detailLabel${surat.id_biro}">Detail Surat</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form action="">
                                                <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                                    <div class="col-sm-7">
                                                        <h6>Pengirim</h6>
                                                        <div class="input-group mb-3">
                                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" id="" value="${surat.dataBiro.nama_biro}" readonly>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-5">
                                                        <h6>Tanggal</h6>
                                                        <div class="input-group mb-3">
                                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" id="" value="${new Date(surat.created_at).toLocaleDateString('id-ID')}" readonly>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>File Surat Balasan</p>
                                                <div class="input-group mb-3">
                                                    ${surat.file ? `<a href="/surat_keluar/${surat.file}" download="${surat.file.split('/').pop()}">${surat.file.split('/').pop()}</a>` : '-'}
                                                </div>
                                                <p>Keterangan</p>
                                                <div class="input-group mb-3">
                                                    <textarea class="form-control input-div" id="exampleFormControlTextarea1" rows="3" style="height: fit-content;" readonly>${surat.keterangan}</textarea>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" onclick="confirmDelete(${surat.id_surat_keluar})"><i class='bx bx-trash'></i> Hapus</button>
                        </td>
                    </tr>
                `;
                suratMasukBody.innerHTML += row;

                // Menampilkan file
                document.querySelectorAll('.file-link').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const fileUrl = link.dataset.fileUrl;
                        const objectElement = document.getElementById('fileObject');
                        objectElement.data = `/surat_keluar/${fileUrl}`;
                    });
                });

                // Menutup dan reload halaman
                const modalElement = document.getElementById('fileModal');
                modalElement.addEventListener('hidden.bs.modal', function () {
                    location.reload();
                });

            });
        } else {
            console.error('Gagal mengambil data surat masuk');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

    // Detail Surat Masuk
    window.viewDetail = async function (id_surat_keluar) {
        try {
            const response = await fetch(`/detailSuratMasuk/${id_surat_keluar}`);
            const data = await response.json();
            if (data.success) {
                // Data Detail
            } else {
                console.error('Gagal mengambil detail surat masuk');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    // Menghapus Data Surat Masuk
    window.confirmDelete = async function (id_surat_keluar) {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin menghapus data surat masuk ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/deleteSuratMasuk/${id_surat_keluar}`, {
                        method: 'POST'
                    });
                    const data = await response.json();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data surat masuk berhasil dihapus',
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
                            text: 'Terjadi kesalahan saat menghapus data surat masuk',
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