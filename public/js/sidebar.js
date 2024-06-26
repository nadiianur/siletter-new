const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle");

// Cek apakah sidebar sebelumnya sudah dibuka
if (!localStorage.getItem("sidebarClosed")) {
    sidebar.classList.remove("close");
}

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    // Simpan status sidebar di localStorage
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("sidebarClosed", "true");
    } else {
        localStorage.removeItem("sidebarClosed");
    }
});
