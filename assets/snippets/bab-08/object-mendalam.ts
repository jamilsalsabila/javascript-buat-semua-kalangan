// Membuat object
const buku = {
  judul: "Clean Code",
  penulis: "Robert C. Martin",
  tahun: 2008,
  halaman: 431,
  tersedia: true,
  genre: ["Programming", "Software Engineering"],
};

// Mengakses properti
console.log(buku.judul);         // "Clean Code" — dot notation
console.log(buku["penulis"]);    // "Robert C. Martin" — bracket notation

// Menambah properti
buku.penerbit = "Prentice Hall";

// Menghapus properti
delete buku.tersedia;

// Spread dan copy object
const bukuCopy = { ...buku, tahun: 2024 };

// Destructuring object
const { judul, penulis, tahun } = buku;
console.log(`"${judul}" oleh ${penulis}, ${tahun}`);

// Rename saat destructuring
const { judul: judulBuku, penulis: namaPenulis } = buku;
console.log(judulBuku, namaPenulis);

// Default value saat destructuring
const { harga = 150000, stok = 0 } = buku as any;
console.log(harga, stok); // 150000 0

// Object.keys, values, entries
console.log(Object.keys(buku));    // semua nama properti
console.log(Object.values(buku));  // semua nilai
console.log(Object.entries(buku)); // array [kunci, nilai]

for (const [kunci, nilai] of Object.entries(buku)) {
  console.log(`  ${kunci}: ${JSON.stringify(nilai)}`);
}