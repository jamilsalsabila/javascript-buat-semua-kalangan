// Tiga cara membuat string
const s1: string = "Menggunakan double quotes";
const s2: string = 'Menggunakan single quotes';
const s3: string = `Menggunakan backtick (template literal)`;

// Template literal: sisipkan variabel ke dalam string
const nama: string = "Budi";
const umur: number = 25;
const perkenalan: string = `Halo, nama saya ${nama} dan saya berumur ${umur} tahun.`;
console.log(perkenalan);
// Output: Halo, nama saya Budi dan saya berumur 25 tahun.

// String multi-baris dengan template literal
const puisi: string = `
  Roses are red,
  Violets are blue,
  JavaScript is awesome,
  And TypeScript too!
`;

// Method (fungsi bawaan) string yang berguna
const kalimat: string = "  Hello, World!  ";
console.log(kalimat.trim());          // "Hello, World!" — hapus spasi
console.log(kalimat.toUpperCase());   // "  HELLO, WORLD!  "
console.log(kalimat.toLowerCase());   // "  hello, world!  "
console.log(kalimat.includes("World")); // true
console.log(kalimat.replace("World", "Indonesia")); // "  Hello, Indonesia!  "
console.log(kalimat.split(","));      // ["  Hello", " World!  "]
console.log("panjang:".length + " " + kalimat.trim().length); // panjang: 13