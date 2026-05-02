// Synchronous: baris kode dijalankan berurutan, harus tunggu satu selesai
function tunggul2Detik(): void {
  const mulai = Date.now();
  while (Date.now() - mulai < 2000) {} // blokir 2 detik!
  console.log("Selesai (synchronous)");
}

// console.log("Mulai");
// tunggul2Detik(); // Program TERHENTI 2 detik di sini
// console.log("Lanjut"); // Baru jalan setelah 2 detik

// Asynchronous: tidak memblokir, lanjut ke baris berikutnya
function tunda(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function contohAsync() {
  console.log("Mulai");
  await tunda(1000); // tunggu tapi TIDAK memblokir thread
  console.log("Selesai setelah 1 detik");
}

contohAsync();