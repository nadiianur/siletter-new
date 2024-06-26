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
    })

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

    // Total Surat Masuk
    try {
        const totalSuratMasuk = await fetch('/totalSuratMasuk', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalSM = await totalSuratMasuk.json()
        if (dataTotalSM.success) {
            const h1 = document.getElementById('totalSM')
            h1.textContent = `${dataTotalSM.total}`
            console.log(dataTotalSM.total);
        } else {
            Swal.fire({
                title: dataTotalSM.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        window.location.href = '/loginPegawai';
    }

    // Total Data Penilaian
    try {
        const totalSuratKeluar = await fetch('/totalSuratKeluar', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalSK = await totalSuratKeluar.json()
        if (dataTotalSK.success) {
            const h1 = document.getElementById('totalSK')
            h1.textContent = `${dataTotalSK.total}`
        } else {
            Swal.fire({
                title: dataTotalSK.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        window.location.href = '/loginPegawai';
    }

});