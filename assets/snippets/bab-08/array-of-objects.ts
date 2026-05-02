interface Siswa {
  id: number;
  nama: string;
  nilai: number[];
}

const daftarSiswa: Siswa[] = [
  { id: 1, nama: "Alice", nilai: [90, 85, 92] },
  { id: 2, nama: "Bob", nilai: [72, 68, 75] },
  { id: 3, nama: "Charlie", nilai: [95, 98, 91] },
  { id: 4, nama: "Diana", nilai: [60, 55, 63] },
];

// Hitung rata-rata setiap siswa
const denganRata = daftarSiswa.map(siswa => {
  const rata = siswa.nilai.reduce((s, n) => s + n, 0) / siswa.nilai.length;
  return { ...siswa, rataRata: Math.round(rata) };
});

// Urutkan berdasarkan rata-rata (tertinggi ke terendah)
const terurut = denganRata.sort((a, b) => b.rataRata - a.rataRata);

console.log("=== Ranking Siswa ===");
terurut.forEach((siswa, index) => {
  console.log(`${index + 1}. ${siswa.nama} — Rata-rata: ${siswa.rataRata}`);
});