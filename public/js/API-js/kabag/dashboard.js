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

    // Total Permohonan
    try {
        const totalPermohonan = await fetch('/permohonanKabag', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        
        const dataTotalPermohonan = await totalPermohonan.json()
        if (dataTotalPermohonan.success) {
            const h1 = document.getElementById('TotalPermohonan')
            h1.textContent = `${dataTotalPermohonan.total}`
            console.log(dataTotalPermohonan.total);
        } else {
            Swal.fire({
                title: dataTotalPermohonan.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }

    // Total Anggota
    try {
        const totalSuratKeluar = await fetch('/totalRiwayatAnggota', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const dataTotalAnggota = await totalSuratKeluar.json()
        if (dataTotalAnggota.success) {
            const h1 = document.getElementById('totalAnggota')
            h1.textContent = `${dataTotalAnggota.total}`
        } else {
            Swal.fire({
                title: dataTotalAnggota.message,
                timer: 2000,
                icon: "error"
            });
        }
    } catch (error) {
        console.error(error);
    }
    
});