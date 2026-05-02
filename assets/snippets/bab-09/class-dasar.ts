class Mobil {
  // Properties (data yang dimiliki mobil)
  merk: string;
  model: string;
  tahun: number;
  warna: string;
  private kecepatanSaatIni: number = 0; // private: hanya bisa diakses di dalam class

  // Constructor: dijalankan saat objek dibuat
  constructor(merk: string, model: string, tahun: number, warna: string) {
    this.merk = merk;
    this.model = model;
    this.tahun = tahun;
    this.warna = warna;
  }

  // Methods (aksi yang bisa dilakukan mobil)
  gas(tambahKecepatan: number): void {
    this.kecepatanSaatIni += tambahKecepatan;
    console.log(`${this.merk} ${this.model} — Kecepatan: ${this.kecepatanSaatIni} km/h`);
  }

  rem(kurangKecepatan: number): void {
    this.kecepatanSaatIni = Math.max(0, this.kecepatanSaatIni - kurangKecepatan);
    console.log(`Mengerem — Kecepatan: ${this.kecepatanSaatIni} km/h`);
  }

  getKecepatan(): number {
    return this.kecepatanSaatIni;
  }

  // Getter: akses properti seperti variabel biasa
  get info(): string {
    return `${this.tahun} ${this.merk} ${this.model} (${this.warna})`;
  }
}

// Membuat instance (objek) dari class
const mobilku = new Mobil("Toyota", "Avanza", 2022, "Putih");
console.log(mobilku.info); // 2022 Toyota Avanza (Putih)

mobilku.gas(50);  // Toyota Avanza — Kecepatan: 50 km/h
mobilku.gas(30);  // Toyota Avanza — Kecepatan: 80 km/h
mobilku.rem(20);  // Mengerem — Kecepatan: 60 km/h

// mobilku.kecepatanSaatIni = 200; // ❌ Error! private