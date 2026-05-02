// undefined: variabel dideklarasikan tapi belum diberi nilai
let namaUser: string | undefined;
console.log(namaUser); // undefined

// null: secara sengaja menyatakan "tidak ada nilai"
let dataPengguna: object | null = null;

// Perbedaan penting:
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (ini bug bersejarah di JS!)

// Nullish coalescing operator (??)
const input: string | null = null;
const nilai = input ?? "Nilai default";
console.log(nilai); // "Nilai default"

// Optional chaining (?.)
const user = null;
console.log(user?.nama); // undefined (bukan error!)