// For...in: iterasi KEY dari objek
const mahasiswa = {
  nama: "Siti",
  nim: "2024001",
  jurusan: "Informatika",
  ipk: 3.85
};

for (const kunci in mahasiswa) {
  console.log(`${kunci}: ${mahasiswa[kunci as keyof typeof mahasiswa]}`);
}
// nama: Siti
// nim: 2024001
// jurusan: Informatika
// ipk: 3.85