const saldo: number = 150000;
const hargaBelanja: number = 200000;

if (saldo >= hargaBelanja) {
  console.log("Transaksi berhasil!");
  console.log(`Sisa saldo: Rp ${saldo - hargaBelanja}`);
} else {
  console.log("Saldo tidak mencukupi.");
  console.log(`Kekurangan: Rp ${hargaBelanja - saldo}`);
}

// Output:
// Saldo tidak mencukupi.
// Kekurangan: Rp 50000