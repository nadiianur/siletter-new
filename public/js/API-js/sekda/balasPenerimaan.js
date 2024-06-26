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

    // Balas Penerimaan
    document.getElementById('submitBtn').addEventListener('click', async () => {
        const id_surat_masuk = new URLSearchParams(window.location.search).get('id');
        const no_surat = document.getElementById('no_surat').value;
        const keterangan = document.getElementById('keterangan').value;
    
        if (!id_surat_masuk || !no_surat || !keterangan) {
            alert('Mohon lengkapi semua data.');
            return;
        }
    
        try {
            const uploadResponse = await fetch(`/uploadSuratBalasan/${id_surat_masuk}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    no_surat: no_surat,
                    keterangan: keterangan
                })
            });
    
            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: uploadData.message,
                    confirmButtonText: 'Kirim Surat',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Loading...',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
    
                        try {
                            const generateResponse = await fetch(`/generateSuratBalasan/${uploadData.id_surat_keluar}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
    
                            const generateData = await generateResponse.json();
                            if (!generateData.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Berhasil',
                                    text: generateData.message,
                                }).then(() => {
                                    window.location.href = '/suratKeluarSekda';
                                });
                            }
                        } catch (error) {
                            console.error('Terjadi kesalahan:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: 'Terjadi kesalahan saat mengirim data.'
                            });
                        }
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: uploadData.message
                });
            }
    
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat mengirim data.'
            });
        }
    });
    


});