// break: keluar dari loop
console.log("=== Break ===");
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    console.log("Ditemukan angka 5, berhenti!");
    break;
  }
  console.log(i);
}
// Output: 1, 2, 3, 4, Ditemukan angka 5, berhenti!

// continue: lewati iterasi saat ini, lanjut ke berikutnya
console.log("\n=== Continue (skip bilangan genap) ===");
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);
}
// Output: 1, 3, 5, 7, 9