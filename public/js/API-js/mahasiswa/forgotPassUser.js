document.getElementById('forgotPassForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const nama = document.getElementById('nama').value;
    const instansi = document.getElementById('instansi').value;
    const nohp = document.getElementById('nohp').value;

    if (!username || !nama || !instansi || !nohp) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Silakan lengkapi semua data yang diperlukan.'
        });
        return;
    }

    try {
        const response = await fetch('/forgotPassMahasiswa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                nama: nama,
                instansi: instansi,
                no_hp: nohp
            })
        });

        const responseData = await response.json();
        console.log(responseData);

        if (!response.ok || responseData.succes === false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: responseData.message
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Akun ditemukan.'
            }).then(() => {
                window.location.href = "/changePassUser/?id=" + responseData.id_mahasiswa;
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