// Selalu gunakan === (strict equality), bukan == (loose equality)
console.log(5 === 5);    // true  — sama nilai DAN tipe
console.log(5 === "5");  // false — berbeda tipe!
console.log(5 == "5");   // true  — loose: JS konversi tipe dulu (HINDARI!)

console.log(5 !== 3);    // true  — tidak sama (strict)
console.log(5 > 3);      // true  — lebih besar
console.log(5 < 3);      // false — lebih kecil
console.log(5 >= 5);     // true  — lebih besar atau sama
console.log(5 <= 4);     // false — lebih kecil atau sama