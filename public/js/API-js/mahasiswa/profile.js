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

    try {
        const response = await fetch('/dataProfileMahasiswa');
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                const data = result.data;
                document.getElementById('namaMahasiswa').textContent = data.nama;
                document.getElementById('username').value = data.username;
                document.getElementById('nama').value = data.nama;
                document.getElementById('instansi').value = data.instansi;
                document.getElementById('fakultas').value = data.fakultas;
                document.getElementById('jurusan').value = data.jurusan;
                document.getElementById('angkatan').value = data.angkatan;
                document.getElementById('jenis_kelamin').value = data.jenis_kelamin;
                document.getElementById('NoHp').value = data.no_hp;

                const imagePath = data.foto ? `/images/mahasiswa/${data.foto}` : '/img/pp.png';
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
        console.error('Error:', error);
    }

    document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', document.getElementById('username').value);
        formData.append('nama', document.getElementById('nama').value);
        formData.append('instansi', document.getElementById('instansi').value);
        formData.append('fakultas', document.getElementById('fakultas').value);
        formData.append('jurusan', document.getElementById('jurusan').value);
        formData.append('angkatan', document.getElementById('angkatan').value);
        formData.append('no_hp', document.getElementById('NoHp').value);
        formData.append('jenis_kelamin', document.getElementById('jenis_kelamin').value);
        formData.append('password_lama', document.getElementById('password').value);
        formData.append('password_baru', document.getElementById('newPassword').value);

        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            const response = await fetch('/updateProfileMahasiswa', {
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