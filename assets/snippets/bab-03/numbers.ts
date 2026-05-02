// JavaScript hanya punya satu tipe angka: number
const bilBulat: number = 42;
const bilDesimal: number = 3.14;
const bilNegatif: number = -100;
const bilBesar: number = 1_000_000; // underscore sebagai pemisah ribuan

// Operasi matematika dasar
console.log(10 + 3);   // 13 — penjumlahan
console.log(10 - 3);   // 7  — pengurangan
console.log(10 * 3);   // 30 — perkalian
console.log(10 / 3);   // 3.3333... — pembagian
console.log(10 % 3);   // 1  — modulus (sisa bagi)
console.log(10 ** 3);  // 1000 — eksponen (pangkat)

// Math object: fungsi matematika lanjutan
console.log(Math.round(3.7));   // 4 — bulatkan ke terdekat
console.log(Math.floor(3.9));   // 3 — bulatkan ke bawah
console.log(Math.ceil(3.1));    // 4 — bulatkan ke atas
console.log(Math.abs(-42));     // 42 — nilai absolut
console.log(Math.sqrt(16));     // 4 — akar kuadrat
console.log(Math.max(1, 5, 3)); // 5 — nilai terbesar
console.log(Math.min(1, 5, 3)); // 1 — nilai terkecil
console.log(Math.random());     // angka acak 0-1

// Nilai spesial
console.log(Infinity);    // tak hingga
console.log(-Infinity);   // tak hingga negatif
console.log(NaN);         // Not a Number (hasil operasi invalid)
console.log(isNaN("abc" as any)); // true