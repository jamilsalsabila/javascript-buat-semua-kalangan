// Type alias: beri nama pada tipe yang kompleks
type ID = string | number;
type KoordinatTuple = [number, number];
type StatusPesanan = "menunggu" | "diproses" | "dikirim" | "selesai" | "dibatalkan";
type Callback = (error: Error | null, hasil: string) => void;

// Type alias untuk object
type Produk = {
  id: ID;
  nama: string;
  harga: number;
  kategori: string;
  status: "aktif" | "nonaktif";
};

// Intersection type: gabungkan beberapa type
type PegawaiDanProduk = Karyawan & Produk; // jarang dipakai, tapi bisa

// Utility Types bawaan TypeScript
interface KonfigurasiApp {
  host: string;
  port: number;
  debug: boolean;
  database: string;
}

// Partial: semua properti menjadi optional
type KonfigParasial = Partial<KonfigurasiApp>;

// Required: semua properti menjadi wajib
type KonfigWajib = Required<KonfigurasiApp>;

// Pick: ambil hanya beberapa properti
type KonfigJaringan = Pick<KonfigurasiApp, "host" | "port">;

// Omit: hapus beberapa properti
type KonfigTanpaDebug = Omit<KonfigurasiApp, "debug">;

// Readonly: semua properti jadi readonly
type KonfigTetap = Readonly<KonfigurasiApp>;

// Record: buat object type dari key dan value
type KataKunci = Record<string, number>; // { [key: string]: number }
const frekuensiKata: KataKunci = {
  "halo": 5,
  "dunia": 3,
  "javascript": 12,
};

interface KonfigBD {
  host: string;
  port: number;
  debug: boolean;
  database: string;
}

const konfigParsial: Partial<KonfigBD> = { host: "localhost" };
const koneksi: Pick<KonfigBD, "host" | "port"> = { host: "localhost", port: 5432 };