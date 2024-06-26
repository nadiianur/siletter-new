document.addEventListener('DOMContentLoaded', async () => {
    const logoutButton = document.getElementById('logOut');
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
    });

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

    // View Surat Permohonan Ditolak
    try {
        const response = await fetch('/viewRiwayatDitolak');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success) {
            const ditolak = document.getElementById('riwayatDitolak');
            ditolak.innerHTML = '';

            data.data.forEach(async (surat, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${surat.dataMahasiswa.nama}</td>
                <td>${surat.dataMahasiswa.instansi}</td>
                <td>${surat.dataMahasiswa.jurusan}</td>
                <td>${surat.periode_magang}</td>
                <td>
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary btn-balas" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal"
                        data-bs-target="#detail${surat.id_surat_masuk}">Balas</button>

                    <!-- Modal -->
                    <div class="modal fade" id="detail${surat.id_surat_masuk}" tabindex="-1" aria-labelledby="detailLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title fw-bold" id="detailLabel">Balas Penolakan</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="form${surat.id_surat_masuk}">
                                        <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                            <div class="col-sm-7">
                                                <h6>Tujuan</h6>
                                                <div class="input-group mb-3">
                                                    <input type="text"
                                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                        id="" value="${surat.dataMahasiswa.nama}">
                                                </div>
                                            </div>
                                            <div class="col-sm-5">
                                                <h6>Tanggal Permohonan</h6>
                                                <div class="input-group mb-3">
                                                    <input type="text"
                                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                        id="" value="${new Date(surat.created_at).toLocaleDateString()}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row gx-3 gy-2 align-items-center mt-2 mb-2">
                                            <div class="col-sm-7">
                                                <h6>Instansi</h6>
                                                <div class="input-group mb-3">
                                                    <input type="text"
                                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                        id="" value="${surat.dataMahasiswa.instansi}">
                                                </div>
                                            </div>
                                            <div class="col-sm-5">
                                                <h6>Jurusan</h6>
                                                <div class="input-group mb-3">
                                                    <input type="text"
                                                        class="form-control form-control-lg fs-6 rounded-4 input-div"
                                                        id="" value="${surat.dataMahasiswa.jurusan}">
                                                </div>
                                            </div>
                                        </div>
                                        <hr>
                                        <h6>File Surat Permohonan</h6>
                                        <div class="input-group mb-3">
                                            ${surat.file ? `<a href="/surat_masuk/${surat.file}" download="${surat.file.split('/').pop()}">${surat.file.split('/').pop()}</a>` : '-'}
                                        </div>
                                        <hr>
                                        <h6 class="mt-2" style="color: red">Keterangan Penolakan</h6>
                                        <div class="input-group mb-3 mt-2">
                                            <textarea class="form-control input-div"
                                                id="keterangan${surat.id_surat_masuk}" rows="3"
                                                style="height: fit-content;"></textarea>
                                        </div>
                                        <button type="button"
                                                class="btn btn-primary btn-inmodal mx-auto mb-2 btn-kirim")">Kirim</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            `;
                ditolak.appendChild(row);

                // Check Apakah Balasan Surat Sudah Ada arau Belum
                const checkResponse = await fetch(`/checkSuratKeluarDT/${surat.id_surat_masuk}`);
                const checkData = await checkResponse.json();
                if (checkData.success && checkData.suratKeluarExist) {
                    const balasButton = row.querySelector('.btn-balas');
                    balasButton.disabled = true;
                }

                const form = document.getElementById(`form${surat.id_surat_masuk}`);
                const btnKirim = form.querySelector('.btn-kirim');
                const keteranganInput = form.querySelector(`#keterangan${surat.id_surat_masuk}`);

                btnKirim.addEventListener('click', async () => {
                    const keterangan = keteranganInput.value;
                    try {
                        const response = await fetch(`/uploadPenolakan/${surat.id_surat_masuk}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                keterangan
                            })
                        });

                        const data = await response.json();
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Penjelasan penolakan berhasil dikirim',
                                timer: 2000,
                                timerProgressBar: true,
                                willClose: () => {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: 'Terjadi kesalahan saat mengirim penjelasan penolakan. Silakan coba lagi.'
                            });
                        }
                    } catch (error) {
                        console.error('Terjadi kesalahan:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat mengirim penjelasan penolakan. Silakan coba lagi.'
                        });
                    }
                });
            });
        } else {
            console.log(data.message);
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

});