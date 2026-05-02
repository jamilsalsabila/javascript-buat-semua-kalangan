// AND (&&): true jika SEMUA kondisi true
console.log(true && true);   // true
console.log(true && false);  // false
console.log(false && true);  // false

// OR (||): true jika SALAH SATU kondisi true
console.log(true || false);  // true
console.log(false || false); // false

// NOT (!): membalik nilai boolean
console.log(!true);  // false
console.log(!false); // true

// Contoh praktis
const umur: number = 20;
const punyaSIM: boolean = true;

const bolehBerkendara: boolean = umur >= 17 && punyaSIM;
console.log("Boleh berkendara:", bolehBerkendara); // true

// Short-circuit evaluation
const user = null;
const nama = user && user.nama; // Jika user falsy, langsung return user
console.log(nama); // null

const nilai = null;
const nilaiAkhir = nilai || 0; // Jika nilai falsy, gunakan 0
console.log(nilaiAkhir); // 0

// Nullish coalescing (??) — lebih presisi dari ||
const score: number | null = 0;
console.log(score || 100);  // 100 (karena 0 dianggap falsy oleh ||)
console.log(score ?? 100);  // 0 (karena 0 bukan null/undefined)