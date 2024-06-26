document.getElementById('changePassForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const new_password = document.getElementById('password').value;
    const confirm_new = document.getElementById('confirmpass').value;

    if (!new_password || !confirm_new) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Silakan lengkapi semua data yang diperlukan.'
        });
        return;
    }

    if (new_password !== confirm_new) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password dan Konfirmasi Password tidak sesuai.'
        });
        return;
    }

    try {
        const response = await fetch(`/confirmPassword/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_password,
                confirm_new
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
                text: 'Password telah diperbaharui.'
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