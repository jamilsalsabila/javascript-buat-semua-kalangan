// Class induk (parent/base class)
class Hewan {
  nama: string;
  umur: number;

  constructor(nama: string, umur: number) {
    this.nama = nama;
    this.umur = umur;
  }

  makan(): void {
    console.log(`${this.nama} sedang makan.`);
  }

  tidur(): void {
    console.log(`${this.nama} sedang tidur.`);
  }

  get info(): string {
    return `${this.nama} (umur ${this.umur} tahun)`;
  }
}

// Class anak (child/derived class)
class Anjing extends Hewan {
  ras: string;

  constructor(nama: string, umur: number, ras: string) {
    super(nama, umur); // WAJIB panggil constructor parent!
    this.ras = ras;
  }

  // Method baru khusus Anjing
  menggonggong(): void {
    console.log(`${this.nama} (Anjing): Guk guk!`);
  }

  // Override method dari parent
  override makan(): void {
    super.makan(); // panggil method parent
    console.log(`${this.nama} makan dengan lahap dari mangkuknya.`);
  }
}

class Kucing extends Hewan {
  indoor: boolean;

  constructor(nama: string, umur: number, indoor: boolean = true) {
    super(nama, umur);
    this.indoor = indoor;
  }

  mengeong(): void {
    console.log(`${this.nama} (Kucing): Meong~`);
  }

  override makan(): void {
    console.log(`${this.nama} makan dengan anggun.`);
  }
}

const anjingku = new Anjing("Rex", 3, "Golden Retriever");
const kucingku = new Kucing("Luna", 2);

console.log(anjingku.info);   // Rex (umur 3 tahun)
anjingku.makan();             // warisan + override
anjingku.menggonggong();
anjingku.tidur();             // dari parent

kucingku.mengeong();
console.log("Indoor:", kucingku.indoor);