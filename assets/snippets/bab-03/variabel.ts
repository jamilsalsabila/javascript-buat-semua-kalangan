// const — nilai tidak bisa diubah setelah dideklarasikan
const namaApp: string = "BelajarJS";
const versi: number = 1.0;
const aktif: boolean = true;

// let — nilai bisa diubah
let skorPemain: number = 0;
skorPemain = 100; // ✅ Boleh
skorPemain = 250; // ✅ Boleh

// namaApp = "LainApp"; // ❌ Error! const tidak bisa diubah

console.log(namaApp, versi, aktif, skorPemain);