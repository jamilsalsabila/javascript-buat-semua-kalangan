import _ from "lodash";

const angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(_.chunk(angka, 3));    // [[1,2,3],[4,5,6],[7,8,9],[10]]
console.log(_.sum(angka));         // 55
console.log(_.mean(angka));        // 5.5
console.log(_.shuffle(angka));     // array teracak
console.log(_.sample(angka));      // elemen acak

const pengguna = [
  { nama: "Budi", kota: "Jakarta" },
  { nama: "Siti", kota: "Bandung" },
  { nama: "Andi", kota: "Jakarta" },
  { nama: "Dina", kota: "Surabaya" },
];

const perKota = _.groupBy(pengguna, "kota");
console.log(perKota);

// Deep clone objek
const original = { a: 1, b: { c: 3 } };
const klon = _.cloneDeep(original);
klon.b.c = 99;
console.log(original.b.c); // masih 3!

// Debounce: fungsi tidak dipanggil berkali-kali dalam waktu singkat
const cariDebounced = _.debounce((query: string) => {
  console.log("Mencari:", query);
}, 300);