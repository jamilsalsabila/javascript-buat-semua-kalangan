// Tabel perkalian lengkap
console.log("=== Tabel Perkalian ===");
for (let i = 1; i <= 5; i++) {
  let baris: string = "";
  for (let j = 1; j <= 5; j++) {
    const hasil = (i * j).toString().padStart(3);
    baris += hasil;
  }
  console.log(baris);
}

// Pola bintang segitiga
for (let i = 1; i <= 5; i++) {
  console.log("*".repeat(i));
}
// *
// **
// ***
// ****
// *****