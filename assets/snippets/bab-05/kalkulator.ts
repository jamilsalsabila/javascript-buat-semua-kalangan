function hitung(a: number, operator: string, b: number): number | string {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        return "Error: Tidak bisa dibagi nol!";
      }
      return a / b;
    case "%":
      return a % b;
    default:
      return `Operator "${operator}" tidak dikenal.`;
  }
}

console.log(hitung(10, "+", 5));  // 15
console.log(hitung(10, "-", 3));  // 7
console.log(hitung(10, "*", 4));  // 40
console.log(hitung(10, "/", 0));  // "Error: Tidak bisa dibagi nol!"
console.log(hitung(10, "/", 4));  // 2.5
console.log(hitung(10, "^", 2));  // 'Operator "^" tidak dikenal.'