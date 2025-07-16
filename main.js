const program = document.getElementById("program");
const metode = document.getElementById("metode");
const lokasi = document.getElementById("lokasi");
const estimasi = document.getElementById("estimasi");
const jenisPendaftar = document.getElementById("jenisPendaftar");
const genderSelect = document.getElementById("gender");

jenisPendaftar.addEventListener("change", function () {
  const jenis = this.value;
  genderSelect.value = ""; // reset pilihan
  const options = genderSelect.options;

  if (jenis === "dewasa") {
    // Jika dewasa, sembunyikan laki-laki
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === "pria") {
        options[i].hidden = true;
      } else {
        options[i].hidden = false;
      }
    }
    genderSelect.value = "wanita"; // otomatis pilih perempuan
  } else {
    // Selain dewasa, tampilkan semua opsi
    for (let i = 0; i < options.length; i++) {
      options[i].hidden = false;
    }
  }
});

const namaOrtuField = document.getElementById("namaOrtu").parentElement;
const namaAnakField = document.getElementById("namaAnak").parentElement;
const usiaField = document.getElementById("usia").parentElement;
const labelNamaAnak = document.getElementById("labelNamaAnak");

function setupInputValidations() {
  document.getElementById("namaOrtu").addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
  });
  document.getElementById("namaAnak").addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
  });
  document.getElementById("noHpOrtu").addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "").slice(0, 12);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupInputValidations();
  updateFieldByJenis();
  updateLokasiOptions();
  jenisPendaftar.addEventListener("change", updateFieldByJenis);
});

const noHpOrtuField = document.getElementById("noHpOrtuField");

function updateFieldByJenis() {
  const jp = jenisPendaftar.value;
  const usiaInput = document.getElementById("usia");
  const usiaLabel = usiaInput.previousElementSibling;

  if (jp === "dewasa") {
    namaOrtuField.style.display = "none";
    namaAnakField.style.display = "block";
    usiaField.style.display = "block";
    labelNamaAnak.textContent = "Nama Lengkap:";

    usiaLabel.textContent = "Usia:";
    usiaInput.placeholder = "Masukan usia minimal 18 tahun & maksimal 70 tahun";
    usiaInput.min = 18;
    usiaInput.max = 70;
  } else {
    namaOrtuField.style.display = "block";
    namaAnakField.style.display = "block";
    usiaField.style.display = "block";
    labelNamaAnak.textContent = "Nama Anak:";

    usiaLabel.textContent = "Usia anak:";
    usiaInput.placeholder = "Masukan usia anak minimal 5 tahun";
    usiaInput.min = 5;
    usiaInput.max = 17;

    // tampilkan nomor HP ortu jika anak yang isi sendiri
    noHpOrtuField.style.display = jp === "anak" ? "block" : "none";
    const noHpOrtu = document.getElementById("noHpOrtu");
    noHpOrtu.required = jp === "anak";
  }
}

function hitungBiaya() {
  const p = program.value;
  const m = metode.value;
  const l = parseInt(lokasi.value);

  let biayaNgaji = 0;
  let transport = 0;
  let teksBiaya = "";

  if (p && m) {
    if (p === "iqro") biayaNgaji = m === "offline" ? 40000 : 30000;
    else if (p === "quran") biayaNgaji = m === "offline" ? 45000 : 35000;
    else if (p === "lanjutan") biayaNgaji = m === "offline" ? 55000 : 45000;

    if (m === "offline" && !isNaN(l)) {
      if (l <= 2) {
        transport = 0;
        teksBiaya = `Rp ${biayaNgaji.toLocaleString()} + Transport (PP) Gratis = Rp ${biayaNgaji.toLocaleString()}`;
      } else if (l <= 10) {
        transport = 8000;
        teksBiaya = `Rp ${biayaNgaji.toLocaleString()} + Transport (PP) Rp ${transport.toLocaleString()} = Rp ${(biayaNgaji + transport).toLocaleString()}`;
      } else {
        transport = 15000;
        teksBiaya = `Rp ${biayaNgaji.toLocaleString()} + Transport (PP) Rp ${transport.toLocaleString()} = Rp ${(biayaNgaji + transport).toLocaleString()}`;
      }
    } else {
      // ONLINE, tanpa transport
      teksBiaya = `Rp ${biayaNgaji.toLocaleString()}`;
    }
  } else {
    teksBiaya = "Silakan lengkapi pilihan di atas.";
  }

  estimasi.textContent = "Estimasi biaya: " + teksBiaya;
}

const semuaLokasi = [
  { value: "0", text: "Online (Untuk metode belajar online)" },
  { value: "0", text: "Sumbersekar (0 km)" },
  { value: "3", text: "Landungsari (±3-4 km)" },
  { value: "3", text: "Mulyoagung (±3–4 km)" },
  { value: "3", text: "Sengkaling (±3-4 km)" },
  { value: "5", text: "Tlogomas (±5–6 km)" },
  { value: "5", text: "Dinoyo (±5–7 km)" },
  { value: "5", text: "Karangploso (±5–7 km)" },
  { value: "6", text: "Lowokwaru (±6–7 km)" },
];

function updateLokasiOptions() {
  const metodeVal = metode.value;
  lokasi.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Pilih Lokasi --";
  lokasi.appendChild(placeholder);
  const filtered = metodeVal === "online" ? semuaLokasi.filter((opt) => opt.text.toLowerCase().includes("online")) : semuaLokasi.filter((opt) => !opt.text.toLowerCase().includes("online"));
  filtered.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    lokasi.appendChild(option);
  });
  hitungBiaya();
}

metode.addEventListener("change", updateLokasiOptions);
program.addEventListener("change", hitungBiaya);
metode.addEventListener("change", hitungBiaya);
lokasi.addEventListener("change", hitungBiaya);

document.getElementById("daftarForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");

  // Fungsi bantu untuk menampilkan error
  function showError(pesan) {
    alert(pesan);
    spinner.classList.add("hidden");
    btn.disabled = false;
    return false;
  }

  // Validasi input lebih dulu
  const jenis = jenisPendaftar.value;
  const namaOrtu = document.getElementById("namaOrtu").value.trim();
  const namaAnak = document.getElementById("namaAnak").value.trim();
  const usia = parseInt(document.getElementById("usia").value);
  const gender = document.getElementById("gender").value;
  const lokasiText = lokasi.options[lokasi.selectedIndex]?.text;
  const p = program.options[program.selectedIndex]?.text;
  const m = metode.options[metode.selectedIndex]?.text;
  const estimasiText = estimasi.textContent;

  const noHpOrtu = document.getElementById("noHpOrtu").value.trim();

  if (!jenis) return showError("Pilih jenis pendaftar terlebih dahulu");
  if (jenis !== "dewasa" && namaOrtu.length < 3) return showError("Nama orangtua tidak boleh kosong");
  if (namaAnak.length < 3) return showError("Nama anak/lengkap tidak boleh kosong");

  if (jenis === "anak") {
    const cleaned = noHpOrtu.replace(/\D/g, "");
    if (!noHpOrtu.startsWith("08") && !noHpOrtu.startsWith("628")) return showError("Nomor HP ortu harus diawali 08 atau 628.");
    if (cleaned.length < 10 || cleaned.length > 12) return showError("Nomor HP ortu harus 10–12 digit.");
  }

  // Semua validasi aman → tampilkan spinner dan disable tombol
  btn.disabled = true;
  spinner.classList.remove("hidden");

  if (jenis === "anak") {
    const noHpOrtuTrimmed = noHpOrtu.trim();
    const cleanedNoHp = noHpOrtuTrimmed.replace(/\D/g, ""); // hapus karakter non-angka

    // Validasi awalan: harus diawali dengan 08 atau 628
    if (!noHpOrtuTrimmed.startsWith("08") && !noHpOrtuTrimmed.startsWith("628")) {
      return showError("Nomor HP orangtua harus diawali dengan 08 atau 628.");
    }

    // Validasi panjang: hanya 10–12 digit angka
    if (cleanedNoHp.length < 10 || cleanedNoHp.length > 15) {
      return showError("Nomor HP orangtua harus antara 10–15 digit angka.");
    }

    // Validasi hanya angka (tidak wajib jika cleanedNoHp sudah dipakai untuk logika utama)
    if (!/^\d+$/.test(cleanedNoHp)) {
      return showError("Nomor HP orangtua hanya boleh berisi angka.");
    }
  }

  if (!jenis) return showError("pilih jenis pendaftar terlebih dahulu");

  if (jenis !== "dewasa" && namaOrtu.length < 3) {
    return showError("Nama orangtua tidak boleh kosong");
  }

  if (namaAnak.length < 3) return showError("nama anak/lengkap tidak boleh kosong");
  if (jenis === "anak" || jenis === "ibu") {
    if (isNaN(usia) || usia < 5 || usia > 17) {
      return showError("Usia anak harus antara 5 sampai 17 tahun.");
    }
  }

  if (jenis === "dewasa") {
    if (isNaN(usia) || usia < 18 || usia > 75) {
      return showError("Usia untuk pendaftar dewasa harus antara 18 sampai 75 tahun.");
    }
  }

  if (jenis === "dewasa" && gender === "pria") {
    return showError("Pendaftar dewasa hanya diperbolehkan perempuan.");
  }

  if (!gender || !p || !m || !lokasiText) return showError("Mohon lengkapi semua data.");
  if (jenis !== "dewasa" && gender === "pria" && usia > 12) return showError("Anak laki-laki maksimal usia 12 tahun.");

  if (!lokasi.value) return showError("Mohon pilih lokasi rumah.");

  // Semua validasi lolos, susun pesan
  let pesan = `Assalamu'alaikum, saya ingin daftar ngaji privat.\n\nJenis Pendaftar: ${jenis}\n`;
  if (jenis !== "dewasa") pesan += `Nama Orangtua/Wali: ${namaOrtu}\n`;
  pesan += `Nama ${jenis === "dewasa" ? "Lengkap" : "Anak"}: ${namaAnak}\n`;
  if (jenis !== "dewasa") pesan += `Usia: ${usia} tahun\n`;
  if (jenis === "anak") pesan += `Nomor HP Ortu: ${noHpOrtu}\n`;
  pesan += `Jenis Kelamin: ${gender}\nProgram: ${p}\nMetode: ${m}\nLokasi: ${lokasiText}\n\n${estimasiText}`;
  pesan += `\n\nMohon info lebih lanjut terkait jadwal dan pembayaran. Terima kasih.`;

  const nomorWA = "628981641558"; // Ganti dengan nomor WA admin
  const waLink = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

  // Buka WhatsApp di tab baru
  window.open(waLink, "_blank");

  // Setelah 2 detik, tampilkan tombol lagi dan sembunyikan spinner
  setTimeout(() => {
    btn.disabled = false;
    spinner.classList.add("hidden");
    // Kalau mau reset form setelah kirim, bisa diaktifkan ini:
    document.getElementById("daftarForm").reset();
    hitungBiaya(); // kosongkan estimasi biaya
  }, 2000);
});

window.addEventListener("pageshow", function () {
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");

  // Aktifkan lagi tombol dan sembunyikan spinner
  btn.disabled = false;
  spinner.classList.add("hidden");
});
