// Rekursi: fungsi yang memanggil dirinya sendiri
function faktorial(n: number): number {
  if (n <= 1) return 1; // base case: kondisi berhenti
  return n * faktorial(n - 1); // recursive case
}

console.log(faktorial(5)); // 5! = 5×4×3×2×1 = 120
console.log(faktorial(10)); // 3628800

// Fibonacci
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i <= 10; i++) {
  process.stdout.write(fibonacci(i) + " ");
}
// 0 1 1 2 3 5 8 13 21 34 55