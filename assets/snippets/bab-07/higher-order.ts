// Fungsi sebagai argumen
function terapkan(angka: number, operasi: (n: number) => number): number {
  return operasi(angka);
}

const kuadrat = (n: number) => n * n;
const kubik = (n: number) => n * n * n;

console.log(terapkan(5, kuadrat));  // 25
console.log(terapkan(3, kubik));    // 27

// Fungsi mengembalikan fungsi (closure)
function buatPenghitung(mulaiDari: number = 0) {
  let hitung = mulaiDari;
  return {
    tambah: () => ++hitung,
    kurang: () => --hitung,
    reset: () => (hitung = mulaiDari),
    nilai: () => hitung,
  };
}

const counter = buatPenghitung(10);
console.log(counter.tambah()); // 11
console.log(counter.tambah()); // 12
console.log(counter.kurang()); // 11
console.log(counter.reset());  // 10