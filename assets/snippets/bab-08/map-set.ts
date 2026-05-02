// Map: seperti object, tapi key bisa berupa tipe apa saja
const poinPemain = new Map<string, number>();
poinPemain.set("Alice", 1200);
poinPemain.set("Bob", 850);
poinPemain.set("Charlie", 2100);

console.log(poinPemain.get("Alice"));    // 1200
console.log(poinPemain.has("Diana"));   // false
console.log(poinPemain.size);           // 3

for (const [pemain, poin] of poinPemain) {
  console.log(`${pemain}: ${poin} poin`);
}

// Set: koleksi nilai UNIK (tidak ada duplikat)
const angkaUnik = new Set<number>([1, 2, 3, 2, 1, 4, 3]);
console.log(angkaUnik); // Set(4) { 1, 2, 3, 4 }

angkaUnik.add(5);
angkaUnik.delete(1);
console.log(angkaUnik.has(3)); // true

// Cara mudah hapus duplikat dari array
const arrayDuplikat = [1, 2, 2, 3, 3, 3, 4];
const tanpaDuplikat = [...new Set(arrayDuplikat)];
console.log(tanpaDuplikat); // [1, 2, 3, 4]