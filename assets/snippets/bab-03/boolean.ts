// Boolean hanya punya dua nilai: true atau false
const sudahLogin: boolean = true;
const emailTerverifikasi: boolean = false;

// Nilai "truthy" dan "falsy" di JavaScript
// Falsy values (dianggap false):
console.log(Boolean(0));          // false
console.log(Boolean(""));         // false
console.log(Boolean(null));       // false
console.log(Boolean(undefined));  // false
console.log(Boolean(NaN));        // false

// Semua nilai lain dianggap truthy:
console.log(Boolean(1));          // true
console.log(Boolean("hello"));    // true
console.log(Boolean([]));         // true (array kosong = truthy!)
console.log(Boolean({}));         // true (object kosong = truthy!)