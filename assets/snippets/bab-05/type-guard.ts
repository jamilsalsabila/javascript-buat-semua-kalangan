// Type guard: mempersempit tipe di dalam blok if
function proses(nilai: string | number): void {
  if (typeof nilai === "string") {
    // Di sini TypeScript TAHU nilai adalah string
    console.log("String uppercase:", nilai.toUpperCase());
    console.log("Panjang:", nilai.length);
  } else {
    // Di sini TypeScript TAHU nilai adalah number
    console.log("Angka kuadrat:", nilai ** 2);
    console.log("Adalah prima:", cekPrima(nilai));
  }
}

function cekPrima(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

proses("hello");  // String uppercase: HELLO, Panjang: 5
proses(17);       // Angka kuadrat: 289, Adalah prima: true