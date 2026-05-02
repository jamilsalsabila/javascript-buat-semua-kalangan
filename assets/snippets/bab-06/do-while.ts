// Do-while: lakukan DULU, baru cek kondisi
// Minimal 1 kali dieksekusi meski kondisi langsung false

let angka: number = 10;
do {
  console.log(`Nilai angka: ${angka}`);
  angka--;
} while (angka > 0 && angka % 3 !== 0);

// Output:
// Nilai angka: 10
// Nilai angka: 9 (berhenti karena 9 % 3 === 0)