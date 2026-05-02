let a: number = 15;
let b: number = 4;

console.log(a + b);   // 19 — penjumlahan
console.log(a - b);   // 11 — pengurangan
console.log(a * b);   // 60 — perkalian
console.log(a / b);   // 3.75 — pembagian
console.log(a % b);   // 3  — modulus (sisa bagi)
console.log(a ** b);  // 50625 — pangkat

// Increment & Decrement
let x: number = 5;
x++;  // x = x + 1 = 6
x--;  // x = x - 1 = 5
++x;  // sama, tapi pre-increment
--x;  // sama, tapi pre-decrement

// Assignment operator
let n: number = 10;
n += 5;   // n = n + 5 = 15
n -= 3;   // n = n - 3 = 12
n *= 2;   // n = n * 2 = 24
n /= 4;   // n = n / 4 = 6
n %= 4;   // n = n % 4 = 2
n **= 3;  // n = n ** 3 = 8