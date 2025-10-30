async function login() {
    const nik = document.getElementById("username").value;
    const nama = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    try {
    const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik: nik, nama: nama })
    });

    const data = await res.json();

    if (data.success) {
        message.classList.add("hidden");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("nik", data.data.nik);
        localStorage.setItem("nama", data.data.nama);

        document.getElementById("login").classList.add("hidden");
        document.getElementById("navbar").classList.remove("hidden");
    showSection("home");
    } else {
        message.textContent = data.message || "Login gagal";
        message.classList.remove("hidden");
    }
    } catch (err) {
        message.textContent = "Tidak bisa terhubung ke server.";
        message.classList.remove("hidden");
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("nik");
    localStorage.removeItem("nama");
    document.getElementById("navbar").classList.add("hidden");
    document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));
    document.getElementById("login").classList.remove("hidden");
}
