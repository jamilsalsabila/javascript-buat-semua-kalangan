// Abstract class: tidak bisa diinstansiasi langsung,
// hanya bisa dijadikan parent
abstract class Kendaraan {
  constructor(
    public merk: string,
    public tahun: number
  ) {}

  // Abstract method: HARUS diimplementasikan oleh subclass
  abstract suaraMesin(): string;
  abstract jenis(): string;

  // Regular method yang tersedia untuk semua
  info(): void {
    console.log(`${this.jenis()} ${this.merk} (${this.tahun}) — Mesin: ${this.suaraMesin()}`);
  }
}

class Sedan extends Kendaraan {
  suaraMesin(): string { return "Vroooom~"; }
  jenis(): string { return "Sedan"; }
}

class Motor extends Kendaraan {
  suaraMesin(): string { return "Ngeng ngeng!"; }
  jenis(): string { return "Motor"; }
}

class Truk extends Kendaraan {
  constructor(merk: string, tahun: number, public tonase: number) {
    super(merk, tahun);
  }
  suaraMesin(): string { return "BRUUUMM BRUUMM!"; }
  jenis(): string { return `Truk ${this.tonase} ton`; }
}

const kendaraan: Kendaraan[] = [
  new Sedan("Honda", 2023),
  new Motor("Yamaha", 2022),
  new Truk("Mitsubishi", 2020, 8),
];

kendaraan.forEach(k => k.info());