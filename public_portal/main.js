
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", search);
});

// Logout
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("nik");
  localStorage.removeItem("nama");
  window.location.href = "login.html";
}

// Navigasi antar halaman
function showSection(section) {
  document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
}

// Ganti placeholder sesuai pilihan layanan
function updatePlaceholder() {
  const layanan = document.getElementById("layananSelect").value;
  const idInput = document.getElementById("id");
  const regionInput = document.getElementById("region");

  if (layanan === "project") {
    idInput.placeholder = "Masukkan Nama Proyek";
    regionInput.classList.remove("hidden");
  } else {
    idInput.placeholder = "Masukkan NIK";
    regionInput.classList.add("hidden");
  }
}

// Fungsi pencarian data
async function search() {
  const layanan = document.getElementById("layananSelect").value;
  const idValue = document.getElementById("id").value;
  const regionValue = document.getElementById("region").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = `<p class="text-center text-gray-500">Mencari data...</p>`;

  try {
    let url = "";

    if (layanan === "citizen") {
      url = `http://localhost:5001/getCitizenData?id=${idValue}`;
    } else if (layanan === "tax") {
      url = `http://localhost:5002/getTaxData?id=${idValue}`;
    } else if (layanan === "health") {
      url = `http://localhost:5003/getHealthData?id=${idValue}`;
    } else if (layanan === "project") {
      url = `http://localhost:5004/getProjectData?region=${regionValue || ""}&nama_proyek=${idValue || ""}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    // ===========================
    // DATA PROYEK (DINAS PEKERJAAN UMUM)
    // ===========================
    if (layanan === "project") {
      if (!data.list || data.list.length === 0) {
        resultDiv.innerHTML = `<p class="text-center text-red-500">Tidak ada proyek ditemukan.</p>`;
        return;
      }

      resultDiv.innerHTML = data.list
        .map((p) => {
          let statusColor = "bg-gray-400 text-white";
          if (p.status.toLowerCase().includes("selesai")) statusColor = "bg-green-500 text-white";
          else if (p.status.toLowerCase().includes("berjalan")) statusColor = "bg-blue-500 text-white";
          else if (p.status.toLowerCase().includes("rencana")) statusColor = "bg-yellow-400 text-gray-900";

          return `
          <div class="card hover:shadow-lg transition-all">
            <h2 class="text-2xl font-semibold text-blue-700 mb-4">${p.nama_proyek}</h2>

            <div class="space-y-3">
              <dl class="flex flex-col sm:flex-row gap-1">
                <dt class="min-w-40 text-sm text-gray-500">ID Proyek:</dt>
                <dd class="text-sm text-gray-800">${p.id}</dd>
              </dl>

              <dl class="flex flex-col sm:flex-row gap-1">
                <dt class="min-w-40 text-sm text-gray-500">Wilayah:</dt>
                <dd class="text-sm text-gray-800">${p.wilayah}</dd>
              </dl>

              <dl class="flex flex-col sm:flex-row gap-1">
                <dt class="min-w-40 text-sm text-gray-500">Anggaran:</dt>
                <dd class="text-sm text-gray-800">Rp${p.anggaran.toLocaleString()}</dd>
              </dl>

              <dl class="flex flex-col sm:flex-row gap-1">
                <dt class="min-w-40 text-sm text-gray-500">Status:</dt>
                <dd>
                  <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                    ${p.status}
                  </span>
                </dd>
              </dl>
            </div>
          </div>`;
        })
        .join("");
    }

    // ===========================
// DATA DINAS (LAINNYA)
// ===========================
else {
  if (data.message) {
    resultDiv.innerHTML = `<p class="text-center text-red-500">${data.message}</p>`;
    return;
  }

  let content = "";

  // DINAS KEPENDUDUKAN
if (layanan === "citizen") {
    content = `
    <div class="card hover:shadow-lg transition-all">
        <h2 class="text-2xl font-semibold text-blue-700 mb-4">Data Kependudukan</h2>
        <div class="space-y-3">
        <dl class="flex flex-col sm:flex-row gap-1">
            <dt class="min-w-40 text-sm text-gray-500">NIK:</dt>
            <dd class="text-sm text-gray-800">${data.id}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
            <dt class="min-w-40 text-sm text-gray-500">Nama:</dt>
            <dd class="text-sm text-gray-800">${data.nama}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
            <dt class="min-w-40 text-sm text-gray-500">Alamat:</dt>
            <dd class="text-sm text-gray-800">${data.alamat}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
            <dt class="min-w-40 text-sm text-gray-500">Tanggal Lahir:</dt>
            <dd class="text-sm text-gray-800">${data.tanggal_lahir || "-"}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
            <dt class="min-w-40 text-sm text-gray-500">Status:</dt>
            <dd class="text-sm text-gray-800">${data.status}</dd>
        </dl>
        </div>
    </div>`;
}

  // DINAS PAJAK
else if (layanan === "tax") {
  let statusColor = "bg-red-500 text-white"; // default belum lunas
  if (data.status_pajak.toLowerCase() === "lunas") statusColor = "bg-green-500 text-white";

  content = `
    <div class="card hover:shadow-lg transition-all">
      <h2 class="text-2xl font-semibold text-blue-700 mb-4">Data Pajak</h2>
      <div class="space-y-3">
        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">NIK:</dt>
          <dd class="text-sm text-gray-800">${data.id}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Tahun:</dt>
          <dd class="text-sm text-gray-800">${data.tahun}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Jumlah Pajak:</dt>
          <dd class="text-sm text-gray-800">Rp${data.jumlah_pajak.toLocaleString()}</dd>
        </dl>
        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Status Pembayaran:</dt>
          <dd>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
              ${data.status_pajak}
            </span>
          </dd>
        </dl>
      </div>
    </div>`;
}

  // DINAS KESEHATAN
else if (layanan === "health") {
  const riwayat = data.riwayat && data.riwayat.length > 0
    ? data.riwayat.join(", ")
    : "Tidak ada riwayat penyakit";

  // Ambil data kependudukan tambahan
  let citizenData = {};
  try {
    const resCitizen = await fetch(`http://localhost:5001/getCitizenData?id=${idValue}`);
    citizenData = await resCitizen.json();
  } catch (err) {
    console.error("Gagal ambil data kependudukan:", err);
  }

  // Hitung umur dari tanggal_lahir
const umur = citizenData.tanggal_lahir
  ? Math.floor((new Date() - new Date(citizenData.tanggal_lahir)) / (365.25 * 24 * 60 * 60 * 1000))
  : "Tidak diketahui";


  content = `
    <div class="card hover:shadow-lg transition-all">
      <h2 class="text-2xl font-semibold text-blue-700 mb-4">Data Kesehatan</h2>
      <div class="space-y-3">
        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">NIK:</dt>
          <dd class="text-sm text-gray-800">${data.id}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Nama:</dt>
          <dd class="text-sm text-gray-800">${citizenData.nama || "-"}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Alamat:</dt>
          <dd class="text-sm text-gray-800">${citizenData.alamat || "-"}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Umur:</dt>
          <dd class="text-sm text-gray-800">${umur}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Status Vaksin:</dt>
          <dd class="text-sm text-gray-800">${data.status_vaksin}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Golongan Darah:</dt>
          <dd class="text-sm text-gray-800">${data.golongan_darah}</dd>
        </dl>

        <dl class="flex flex-col sm:flex-row gap-1">
          <dt class="min-w-40 text-sm text-gray-500">Riwayat Penyakit:</dt>
          <dd class="text-sm text-gray-800">${riwayat}</dd>
        </dl>
      </div>
    </div>`;
}

  resultDiv.innerHTML = content;
}

  } catch (error) {
    resultDiv.innerHTML = `<div class="text-center text-red-500">Terjadi kesalahan: ${error}</div>`;
  }
}


