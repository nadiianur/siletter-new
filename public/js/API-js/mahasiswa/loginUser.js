document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/loginMahasiswa', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const dataLogin = await response.json();
        if (dataLogin.success) {
            Swal.fire({
                title: dataLogin.message,
                timer: 2000,
                icon: "success",
                customClass: {
                    popup: 'swal2-popup-custom',
                },
                willClose: () => {
                    window.location.href = '/homeUser';
                }
            });
        } else {
            Swal.fire({
                title: dataLogin.message,
                timer: 2000,
                icon: "error",
                customClass: {
                    popup: 'swal2-popup-custom',
                }
            });
        }
    });
});
