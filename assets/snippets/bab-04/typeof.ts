// typeof: cek tipe data
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (bug JS klasik!)
console.log(typeof {});          // "object"
console.log(typeof []);           // "object" (array juga "object"!)
console.log(typeof function(){}); // "function"

// instanceof: cek apakah objek merupakan instance dari class tertentu
const arr = [1, 2, 3];
console.log(arr instanceof Array);  // true
console.log(arr instanceof Object); // true