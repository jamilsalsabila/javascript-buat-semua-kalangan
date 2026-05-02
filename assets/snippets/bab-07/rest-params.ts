// Menerima jumlah argumen yang tidak terbatas
function jumlahkan(...angka: number[]): number {
  return angka.reduce((total, n) => total + n, 0);
}

console.log(jumlahkan(1, 2, 3));           // 6
console.log(jumlahkan(10, 20, 30, 40));    // 100
console.log(jumlahkan(5, 5, 5, 5, 5, 5)); // 30

function gabungkan(pemisah: string, ...kata: string[]): string {
  return kata.join(pemisah);
}

console.log(gabungkan(", ", "apel", "mangga", "jeruk")); // "apel, mangga, jeruk"