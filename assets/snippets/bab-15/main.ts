// main.ts — mengimpor dari matematika.ts
import { tambah, kurang, kali, bagi, PI } from "./matematika";
import type { HasilOperasi } from "./matematika"; // import hanya tipe

console.log(tambah(5, 3));  // 8
console.log(PI);             // 3.14159...

// Import semua dengan alias
import * as Mat from "./matematika";
console.log(Mat.kali(4, 7)); // 28