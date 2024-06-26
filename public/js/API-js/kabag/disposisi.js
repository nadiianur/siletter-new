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

    // View Surat Permohonan Magang
    try {
        const response = await fetch('/viewPermohonanKabag');

        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success) {
            const dataDisposisiBody = document.getElementById('disposisiBody');
            dataDisposisiBody.innerHTML = '';
            data.data.forEach((surat, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <th scope="row" class="col-1">${index + 1}</th>
                        <td class="col-2">${surat.dataMahasiswa.nama}</td>
                        <td class="col-1">${surat.dataMahasiswa.instansi}</td>
                        <td class="col-1">${surat.dataMahasiswa.jurusan}</td> 
                        <td class="col-2"><a href="#" class="file-link" data-file-url="${surat.file}" data-bs-toggle="modal" data-bs-target="#fileModal">${surat.file ? surat.file : '-'}</a></td>
                        <td class="col-2">${surat.periode_magang}</td> 
                        <td class="col-1">
                            <button type="button" class="btn btn-secondary detail-btn" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#detailModal" style="background-color: grey; border-radius: 48%;">
                                <i class='bx bx-info-circle'></i>
                            </button>
                        </td>
                       <td class="col-2">
                            <button type="button" class="btn btn-success acc-btn" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#persetujuan" style="border-radius: 48%;"><i class='bx bx-check'></i></button>
                            <button type="button" class="btn btn-danger reject-btn" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#penolakan"><i class='bx bx-x'></i></button>
                             <div class="modal fade" id="penolakan" tabindex="-1" aria-labelledby="penolakanLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title fw-bold" id="penolakanLabel">Detail Penolakan</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="rejectForm">
                                                    <p>Keterangan Penolakan</p>
                                                    <div class="input-group mb-3">
                                                        <textarea class="form-control input-div" id="keterangan" name="keterangan" rows="3"
                                                            style="height: fit-content;"></textarea>
                                                    </div>
                                                    <button type="submit"
                                                        class="btn btn-primary btn-inmodal btn-tolak mx-auto mb-2">Kirim</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                      
                    `;
                dataDisposisiBody.appendChild(row);
            });

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

                                document.getElementById('keterangan').textContent = detail.keterangan ? detail.keterangan : '-';

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

            // View Nama Anggota Magang
            document.querySelectorAll('.acc-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id_surat_masuk = event.currentTarget.getAttribute('data-id');

                    document.querySelectorAll('.acc-btn').forEach(btn => btn.classList.remove('active'));
                    event.currentTarget.classList.add('active');

                    try {
                        const responseAnggota = await fetch(`/getAnggotaMagang/${id_surat_masuk}`);
                        const dataAnggota = await responseAnggota.json();

                        const responseBagian = await fetch('/getBagianByBiro');
                        const dataBagian = await responseBagian.json();

                        if (dataAnggota.success && dataBagian.success) {
                            const anggotaMagangContainer = document.getElementById('anggotaMagang');
                            anggotaMagangContainer.innerHTML = '';

                            dataAnggota.data.forEach((anggota, index) => {
                                const row = document.createElement('div');
                                row.classList.add('row', 'gx-3', 'gy-2', 'align-items-center', 'mt-2', 'mb-2');
                                row.innerHTML = `
                                    <div class="col-sm-6">
                                        <p>Nama Anggota ${index + 1}</p>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nama}" readonly>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <p>NIM</p>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control form-control-lg fs-6 rounded-4 input-div" value="${anggota.nim}" readonly>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <p>Bagian</p>
                                        <div class="input-group mb-3">
                                            <select class="form-select input-div" aria-label="Default select example" id="tujuan-${anggota.id_anggota_magang}">
                                                <option disabled selected>Pilih Bagian</option>
                                            </select>
                                        </div>
                                    </div>
                                `;
                                anggotaMagangContainer.appendChild(row);

                                const selectElement = document.getElementById(`tujuan-${anggota.id_anggota_magang}`);
                                dataBagian.data.forEach(bagian => {
                                    const option = document.createElement('option');
                                    option.value = bagian.id_bagian;
                                    option.text = bagian.nama_bagian;
                                    selectElement.appendChild(option);
                                });
                            });

                        } else {
                            if (!dataAnggota.success) {
                                console.error(dataAnggota.message);
                            }
                            if (!dataBagian.success) {
                                console.error(dataBagian.message);
                            }
                        }
                    } catch (error) {
                        console.error('Terjadi kesalahan:', error);
                    }
                });
            });

            // Acc Surat Permohonan Magang
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

                document.getElementById('kirimDisposisiBtn').addEventListener('click', async () => {
                    const anggotaMagangElements = document.querySelectorAll('#anggotaMagang .row');
                    const penempatanData = [];
                    let allAnggotaHaveBagian = true;

                    anggotaMagangElements.forEach(row => {
                        const idAnggotaMagang = row.querySelector('select').id.split('-')[1];
                        const idBagian = row.querySelector('select').value;
                        if (idBagian === 'Pilih Bagian') {
                            allAnggotaHaveBagian = false;
                            Swal.fire({
                                icon: 'info',
                                title: 'Attention',
                                text: 'Harap pilih bagian untuk semua anggota magang.'
                            });
                            return;
                        }
                        penempatanData.push({
                            id_anggota_magang: idAnggotaMagang,
                            id_bagian: idBagian
                        });
                    });

                    if (!allAnggotaHaveBagian) {
                        return;
                    }

                    const activeButton = document.querySelector('.acc-btn.active');
                    if (!activeButton) {
                        console.error('Tidak ada tombol acc-btn yang aktif');
                        alert('Silakan pilih surat terlebih dahulu.');
                        return;
                    }

                    const id_surat_masuk = activeButton.getAttribute('data-id');
                    try {
                        const response = await fetch(`/accDisposisiKabag/${id_surat_masuk}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                penempatanData,
                            })
                        });

                        const result = await response.json();
                        if (result.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: result.message,
                                willClose: () => {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: result.message
                            });
                        }
                    } catch (error) {
                        console.error('Terjadi kesalahan:', error);
                        alert('Terjadi kesalahan: ' + error.message);
                    }
                });
            });

            // Tolak Surat Permohonan Magang
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
                    const id_surat_masuk = event.currentTarget.getAttribute('data-id');
                    const rejectForm = document.getElementById('rejectForm');

                    rejectForm.onsubmit = async function (event) {
                        event.preventDefault();

                        const keterangan = document.getElementById('keterangan').value;

                        if (!keterangan) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: 'Keterangan penolakan harus diisi.'
                            });
                            return;
                        }

                        const formData = {
                            keterangan: keterangan
                        };

                        try {
                            const response = await fetch(`/tolakDisposisiKabag/${id_surat_masuk}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData)
                            });

                            const data = await response.json();

                            if (data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Berhasil',
                                    text: 'Disposisi berhasil ditolak.'
                                }).then(() => {
                                    location.reload();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal',
                                    text: data.message
                                });
                            }
                        } catch (error) {
                            console.error('Terjadi kesalahan:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: 'Terjadi kesalahan saat menolak disposisi.'
                            });
                        }
                    };
                });
            });
            
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }

});