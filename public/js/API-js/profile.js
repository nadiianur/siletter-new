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

    try {
        const response = await fetch('/dataProfile');
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const data = result.data;
                document.getElementById('namaPegawai').textContent = data.nama;
                document.getElementById('username').value = data.username
                document.getElementById('nama').value = data.nama
                document.getElementById('nip').value = data.nip
                document.getElementById('email').value = data.email

                const imagePath = data.foto ? `/images/pegawai/${data.foto}` : '/img/pp.png';
                const imgElement = document.getElementById('pp');
                imgElement.src = imagePath;
            } else {
                Swal.fire({
                    title: result.message,
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: response.statusText,
                icon: "error"
            });
        }
    } catch (error) {
        window.location.href = '/loginPegawai';
    }

    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', document.getElementById('username').value);
        formData.append('nama', document.getElementById('nama').value);
        formData.append('nip', document.getElementById('nip').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password_lama', document.getElementById('password').value);
        formData.append('password_baru', document.getElementById('newPassword').value);

        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            const response = await fetch('/updateProfilePegawai', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            } else {
                Swal.fire({
                    title: result.message,
                    icon: "error"
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memperbarui data akun');
        }
    })

});