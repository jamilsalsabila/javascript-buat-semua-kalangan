interface Orang {
  nama: string;
  umur: number;
}

interface Karyawan extends Orang {
  nip: string;
  jabatan: string;
  gaji: number;
}

interface Manajer extends Karyawan {
  departemen: string;
  bawahanLangsung: string[];
}

const manajer: Manajer = {
  nama: "Dewi Kartika",
  umur: 38,
  nip: "KRY-0042",
  jabatan: "Senior Manager",
  gaji: 25000000,
  departemen: "Teknologi Informasi",
  bawahanLangsung: ["Ali", "Budi", "Citra", "Dian"],
};

console.log(`${manajer.nama} — ${manajer.jabatan}, Dept: ${manajer.departemen}`);
console.log(`Tim: ${manajer.bawahanLangsung.join(", ")}`);
console.log(`Gaji: Rp ${manajer.gaji.toLocaleString()}`)