// Promise: janji bahwa sebuah nilai akan tersedia di masa depan
// Status: pending → fulfilled (resolved) atau rejected

function ambilDataPengguna(id: number): Promise<{ nama: string; email: string }> {
  return new Promise((resolve, reject) => {
    // Simulasi operasi async (misal: query ke database)
    setTimeout(() => {
      if (id > 0) {
        resolve({ nama: "Budi Santoso", email: "budi@example.com" });
      } else {
        reject(new Error(`Pengguna dengan ID ${id} tidak ditemukan`));
      }
    }, 500);
  });
}

// Cara 1: .then() dan .catch()
ambilDataPengguna(1)
  .then(pengguna => {
    console.log("Pengguna:", pengguna.nama);
    return pengguna.email;
  })
  .then(email => console.log("Email:", email))
  .catch(error => console.error("Error:", error.message))
  .finally(() => console.log("Operasi selesai."));

// Promise.all: jalankan banyak promise secara paralel
async function ambilBanyakData() {
  const [p1, p2, p3] = await Promise.all([
    ambilDataPengguna(1),
    ambilDataPengguna(2),
    ambilDataPengguna(3),
  ]);
  console.log(p1.nama, p2.nama, p3.nama);
}

// Promise.allSettled: tunggu semua, catat yang gagal
async function ambilDenganToleransi() {
  const hasil = await Promise.allSettled([
    ambilDataPengguna(1),
    ambilDataPengguna(-1), // akan reject
    ambilDataPengguna(2),
  ]);

  hasil.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`✅ ${i}: ${result.value.nama}`);
    } else {
      console.error(`❌ ${i}: ${result.reason.message}`);
    }
  });
}