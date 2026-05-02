// Sintaks: kondisi ? jika_true : jika_false
const umur: number = 20;
const status: string = umur >= 18 ? "Dewasa" : "Belum dewasa";
console.log(status); // "Dewasa"

// Ternary bersarang (gunakan dengan bijak)
const skor: number = 75;
const nilai: string = skor >= 90 ? "A"
                    : skor >= 80 ? "B"
                    : skor >= 70 ? "C"
                    : skor >= 60 ? "D"
                    : "E";
console.log("Nilai:", nilai); // "C"

// Penggunaan dalam template literal
const jumlahItem: number = 3;
console.log(`Anda memiliki ${jumlahItem} item${jumlahItem !== 1 ? "s" : ""}.`);
// "Anda memiliki 3 items."