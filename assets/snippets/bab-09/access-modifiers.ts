class RekeningBank {
  public namaPemilik: string;       // bisa diakses dari mana saja
  private saldo: number;             // hanya di dalam class ini
  protected nomorRekening: string;   // di dalam class & subclass

  constructor(nama: string, saldoAwal: number) {
    this.namaPemilik = nama;
    this.saldo = saldoAwal;
    this.nomorRekening = this.generateNomor();
  }

  private generateNomor(): string {
    return "REK" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  }

  deposit(jumlah: number): void {
    if (jumlah <= 0) throw new Error("Jumlah deposit harus positif");
    this.saldo += jumlah;
    console.log(`Deposit Rp ${jumlah.toLocaleString()}. Saldo: Rp ${this.saldo.toLocaleString()}`);
  }

  tarik(jumlah: number): void {
    if (jumlah > this.saldo) throw new Error("Saldo tidak mencukupi");
    this.saldo -= jumlah;
    console.log(`Tarik Rp ${jumlah.toLocaleString()}. Saldo: Rp ${this.saldo.toLocaleString()}`);
  }

  get infoSaldo(): string {
    return `${this.namaPemilik}: Rp ${this.saldo.toLocaleString()}`;
  }
}

const rekening = new RekeningBank("Andi Wijaya", 1000000);
rekening.deposit(500000);
rekening.tarik(200000);
console.log(rekening.infoSaldo);