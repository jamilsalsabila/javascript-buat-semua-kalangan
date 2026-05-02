// Constraint: pastikan T punya properti tertentu
interface PunyaNama {
  nama: string;
}

function cetakNama<T extends PunyaNama>(item: T): void {
  console.log(`Nama: ${item.nama}`);
}

cetakNama({ nama: "Budi", umur: 25 });      // ✅
cetakNama({ nama: "Produk A", harga: 100 }); // ✅
// cetakNama({ judul: "Buku" });              // ❌ tidak punya 'nama'

// Generic dengan multiple constraints
function gabungkan<T extends string | number>(a: T, b: T): string {
  return `${a} + ${b} = ${
    (typeof a === 'number' && typeof b === 'number')
      ? a + b
      : `${a}${b}`
  }`;
}

console.log(gabungkan(5, 3));           // "5 + 3 = 8"
console.log(gabungkan("Halo", " Budi")); // "Halo +  Budi = Halo Budi"