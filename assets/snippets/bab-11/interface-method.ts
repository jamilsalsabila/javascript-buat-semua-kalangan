interface BisaMengeluarkanBunyi {
  suara(): string;
  volume: number;
}

interface BisaBergerak {
  kecepatan: number;
  gerak(arah: string): void;
}

// Class bisa mengimplementasikan banyak interface
class Robot implements BisaMengeluarkanBunyi, BisaBergerak {
  volume: number = 50;
  kecepatan: number = 5;
  nama: string;

  constructor(nama: string) {
    this.nama = nama;
  }

  suara(): string {
    return `${this.nama}: Beep boop! 🤖`;
  }

  gerak(arah: string): void {
    console.log(`${this.nama} bergerak ke ${arah} dengan kecepatan ${this.kecepatan} m/s`);
  }
}

const r2d2 = new Robot("R2D2");
console.log(r2d2.suara());
r2d2.gerak("utara");