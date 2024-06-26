document.getElementById('forgotPassForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    if (!username || !email) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Silakan lengkapi semua data yang diperlukan.'
        });
        return;
    }

    try {
        const response = await fetch('/forgotPass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email
            })
        });

        const responseData = await response.json();

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
                window.location.href = "/changePassword/?id=" + responseData.id_pegawai;
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