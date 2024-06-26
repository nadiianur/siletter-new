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

    // View Surat Permohonan Diterima
    try {
        const response = await fetch('/viewRiwayatDiterima');
        let data;
        try {
            data = await response.json();
        } catch (error) {
            window.location.href = '/loginPegawai';
        }

        if (data.success) {
            const diterima = document.getElementById('riwayatDiterima');
            diterima.innerHTML = '';

            for (const [index, surat] of data.data.entries()) {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <th scope="row" class="col-1">${index + 1}</th>
                    <td class="col-3">${surat.dataMahasiswa.nama}</td>
                    <td class="col-2">${surat.dataMahasiswa.instansi}</td>
                    <td class="col-2">${surat.dataMahasiswa.jurusan}</td>
                    <td class="col-2">${surat.periode_magang}</td>
                    <td class="col-1">
                        <button type="button" class="btn btn-primary btn-balas" data-id="${surat.id_surat_masuk}" data-bs-toggle="modal" data-bs-target="#balas">
                            Balas
                        </button>
                    </td>
                `;
                diterima.appendChild(row);

                // Check disposition status
                try {
                    const dispoResponse = await fetch(`/checkSuratKeluarDT/${surat.id_surat_masuk}`);
                    const dispoData = await dispoResponse.json();

                    if (dispoData.suratKeluarExist) {
                        const balasButton = row.querySelector('.btn-balas');
                        balasButton.disabled = true;
                    }
                } catch (error) {
                    console.error('Terjadi kesalahan saat memeriksa status disposisi:', error);
                }
            }
        } else {
            console.log(data.message);
        }

         // Balas Penerimaan
         document.querySelectorAll('.btn-balas').forEach(button => {
            button.addEventListener('click', (event) => {
                const id_surat_masuk = event.currentTarget.getAttribute('data-id');
                window.location.href = `/balasPenerimaan/?id=${id_surat_masuk}`;
            });
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
});
