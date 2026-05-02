// Struktur: for (inisiasi; kondisi; update)
for (let i = 1; i <= 5; i++) {
  console.log(`Langkah ke-${i}`);
}
// Langkah ke-1, ke-2, ke-3, ke-4, ke-5

// Loop mundur
for (let i = 10; i >= 1; i--) {
  console.log(i);
}

// Loop dengan step berbeda
for (let i = 0; i <= 20; i += 5) {
  console.log(i); // 0, 5, 10, 15, 20
}

// Tabel perkalian 7
console.log("=== Tabel Perkalian 7 ===");
for (let i = 1; i <= 10; i++) {
  console.log(`7 × ${i} = ${7 * i}`);
}