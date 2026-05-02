class Bentuk {
  warna: string;

  constructor(warna: string = "hitam") {
    this.warna = warna;
  }

  // Ini akan di-override oleh setiap bentuk
  hitungLuas(): number {
    return 0;
  }

  tampilkan(): void {
    console.log(`${this.constructor.name} (${this.warna}): luas = ${this.hitungLuas().toFixed(2)}`);
  }
}

class Lingkaran extends Bentuk {
  constructor(public radius: number, warna?: string) {
    super(warna);
  }

  override hitungLuas(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Persegi extends Bentuk {
  constructor(public sisi: number, warna?: string) {
    super(warna);
  }

  override hitungLuas(): number {
    return this.sisi ** 2;
  }
}

class SegitigaSikuSiku extends Bentuk {
  constructor(public alas: number, public tinggi: number, warna?: string) {
    super(warna);
  }

  override hitungLuas(): number {
    return 0.5 * this.alas * this.tinggi;
  }
}

// Polymorphism: semua objek diperlakukan sama lewat parent type
const bentukBentuk: Bentuk[] = [
  new Lingkaran(5, "merah"),
  new Persegi(4, "biru"),
  new SegitigaSikuSiku(3, 6, "hijau"),
  new Lingkaran(2),
];

bentukBentuk.forEach(b => b.tampilkan());
// Lingkaran (merah): luas = 78.54
// Persegi (biru): luas = 16.00
// SegitigaSikuSiku (hijau): luas = 9.00
// Lingkaran (hitam): luas = 12.57

const totalLuas = bentukBentuk.reduce((sum, b) => sum + b.hitungLuas(), 0);
console.log(`Total luas: ${totalLuas.toFixed(2)}`);