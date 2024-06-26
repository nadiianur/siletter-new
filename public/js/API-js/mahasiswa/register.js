document.getElementById('simpanProfil').addEventListener('click', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const nama = document.getElementById('nama').value;
    const instansi = document.getElementById('instansi').value;
    const fakultas = document.getElementById('fakultas').value;
    const jurusan = document.getElementById('jurusan').value;
    const angkatan = document.getElementById('angkatan').value;
    const jenis_kelamin = document.getElementById('jenis_kelamin').value;
    const no_hp = document.getElementById('NoHp').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !nama || !instansi || !fakultas || !jurusan || !angkatan || !jenis_kelamin || !no_hp || !password || !confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Silakan lengkapi semua data yang diperlukan.'
        });
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password dan Konfirmasi Password tidak sesuai.'
        });
        return;
    }

    try {
        const response = await fetch('/tambahMahasiswa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                nama,
                instansi,
                fakultas,
                jurusan,
                angkatan,
                jenis_kelamin,
                no_hp,
                password,
                confirmPassword
            })
        });

        const responseData = await response.json();

        if (!response.ok || responseData.success === false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: responseData.message
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Registration Account Mahasiswa berhasil.'
            }).then(() => {
                window.location.href = '/loginUser';
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