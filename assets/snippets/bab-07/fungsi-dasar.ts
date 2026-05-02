// Cara 1: Function Declaration (bisa dipanggil sebelum dideklarasikan)
function sapa(nama: string): string {
  return `Halo, ${nama}!`;
}

// Cara 2: Function Expression (disimpan dalam variabel)
const hitung = function(a: number, b: number): number {
  return a + b;
};

// Cara 3: Arrow Function (modern, ringkas)
const kali = (a: number, b: number): number => a * b;

// Cara 4: Arrow Function multi-baris
const hitungDiskon = (harga: number, persen: number): number => {
  const diskon = harga * (persen / 100);
  return harga - diskon;
};

console.log(sapa("Indonesia"));        // "Halo, Indonesia!"
console.log(hitung(10, 20));           // 30
console.log(kali(5, 7));               // 35
console.log(hitungDiskon(100000, 25)); // 75000