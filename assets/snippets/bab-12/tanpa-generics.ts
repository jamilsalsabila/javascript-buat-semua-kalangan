// Tanpa generics: harus buat fungsi terpisah untuk tiap tipe
function ambilPertamaString(arr: string[]): string {
  return arr[0];
}

function ambilPertamaNumber(arr: number[]): number {
  return arr[0];
}

// Dengan generics: SATU fungsi untuk semua tipe!
function ambilPertama<T>(arr: T[]): T {
  return arr[0];
}

const str = ambilPertama(["apel", "mangga", "jeruk"]); // type: string
const num = ambilPertama([10, 20, 30]);                  // type: number
const bool = ambilPertama([true, false, true]);           // type: boolean

console.log(str.toUpperCase()); // "APEL" — TypeScript tahu ini string!
console.log(num.toFixed(2));    // "10.00" — TypeScript tahu ini number!