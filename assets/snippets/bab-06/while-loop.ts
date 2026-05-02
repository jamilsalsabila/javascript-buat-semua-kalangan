// While: jalankan selama kondisi true
let hitungan: number = 1;
while (hitungan <= 5) {
  console.log(`Hitungan: ${hitungan}`);
  hitungan++; // PENTING! Tanpa ini, loop tak terbatas!
}

// Contoh: tebak angka (simulasi)
let targetAngka: number = 42;
let tebakan: number = 0;
let percobaan: number = 0;

// Simulasi: kita cari dari 1 ke atas
while (tebakan !== targetAngka) {
  tebakan++;
  percobaan++;
}
console.log(`Angka ${targetAngka} ditemukan setelah ${percobaan} percobaan.`);