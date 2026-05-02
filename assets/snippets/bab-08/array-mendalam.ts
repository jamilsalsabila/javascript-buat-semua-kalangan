// Membuat array
const kosong: number[] = [];
const angka = [1, 2, 3, 4, 5];
const campuran: (string | number | boolean)[] = ["satu", 2, true];

// Mengakses elemen
console.log(angka[0]);     // 1 (indeks dimulai dari 0)
console.log(angka.at(-1)); // 5 (elemen terakhir)

// Menambah/menghapus elemen
angka.push(6);      // tambah di akhir: [1,2,3,4,5,6]
angka.unshift(0);   // tambah di awal: [0,1,2,3,4,5,6]
angka.pop();        // hapus dari akhir: [0,1,2,3,4,5]
angka.shift();      // hapus dari awal: [1,2,3,4,5]

// splice: hapus/ganti di posisi tertentu
const buah = ["apel", "mangga", "jeruk", "pisang"];
buah.splice(1, 2);          // hapus 2 elemen mulai index 1
console.log(buah);           // ["apel", "pisang"]

const sayur = ["wortel", "bayam", "kangkung"];
sayur.splice(1, 0, "brokoli", "kol"); // insert di index 1
console.log(sayur);          // ["wortel", "brokoli", "kol", "bayam", "kangkung"]

// slice: ambil bagian array (tidak mengubah asli)
const angka2 = [10, 20, 30, 40, 50];
console.log(angka2.slice(1, 3));  // [20, 30]
console.log(angka2.slice(-2));    // [40, 50]

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const gabungan = [...arr1, ...arr2]; // [1,2,3,4,5,6]

// Destructuring array
const [pertama, kedua, , keempat] = [10, 20, 30, 40, 50];
console.log(pertama, kedua, keempat); // 10 20 40

const [kepala, ...ekor] = [1, 2, 3, 4, 5];
console.log(kepala, ekor); // 1 [2,3,4,5]