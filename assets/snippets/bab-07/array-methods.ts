const produk = [
  { nama: "Laptop", harga: 12000000, stok: 5 },
  { nama: "Mouse", harga: 250000, stok: 20 },
  { nama: "Keyboard", harga: 500000, stok: 15 },
  { nama: "Monitor", harga: 3500000, stok: 8 },
  { nama: "Headset", harga: 750000, stok: 12 },
];

// map: transformasi setiap elemen, hasilkan array baru
const namaProduk = produk.map(p => p.nama);
console.log(namaProduk); // ["Laptop", "Mouse", ...]

// filter: pilih elemen yang memenuhi kondisi
const produkMahal = produk.filter(p => p.harga > 500000);
console.log("Produk mahal:", produkMahal.map(p => p.nama));

// find: cari elemen pertama yang cocok
const laptop = produk.find(p => p.nama === "Laptop");
console.log("Laptop:", laptop);

// reduce: akumulasi semua elemen menjadi satu nilai
const totalNilaiInventori = produk.reduce(
  (total, p) => total + (p.harga * p.stok),
  0
);
console.log(`Total inventori: Rp ${totalNilaiInventori.toLocaleString()}`);

// some: apakah ada minimal satu yang cocok?
const adaStokHabis = produk.some(p => p.stok === 0);
console.log("Ada stok habis:", adaStokHabis); // false

// every: apakah SEMUA elemen cocok?
const semuaAdaStok = produk.every(p => p.stok > 0);
console.log("Semua ada stok:", semuaAdaStok); // true

// sort: urutkan (PERHATIAN: sort mengubah array asli!)
const terurut = [...produk].sort((a, b) => a.harga - b.harga);
console.log("Termurah ke termahal:", terurut.map(p => `${p.nama} (Rp${p.harga})`));