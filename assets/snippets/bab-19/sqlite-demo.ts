import { Database } from "bun:sqlite";

// Buat database SQLite (file lokal)
const db = new Database("toko.db");

// Aktifkan WAL mode untuk performa lebih baik
db.exec("PRAGMA journal_mode = WAL;");

// Buat tabel
db.exec(`
  CREATE TABLE IF NOT EXISTS produk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    harga REAL NOT NULL,
    stok INTEGER DEFAULT 0,
    kategori TEXT,
    dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert data
const insertProduk = db.prepare(`
  INSERT INTO produk (nama, harga, stok, kategori)
  VALUES ($nama, $harga, $stok, $kategori)
`);

insertProduk.run({
  $nama: "Laptop Gaming ROG",
  $harga: 22000000,
  $stok: 5,
  $kategori: "Elektronik",
});

insertProduk.run({
  $nama: "Mechanical Keyboard",
  $harga: 750000,
  $stok: 20,
  $kategori: "Aksesoris",
});

insertProduk.run({
  $nama: "Monitor 4K",
  $harga: 8500000,
  $stok: 8,
  $kategori: "Elektronik",
});

// Select semua produk
interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
}

const semuaProduk = db.query("SELECT * FROM produk").all() as Produk[];
console.log("\n=== Semua Produk ===");
semuaProduk.forEach(p => {
  console.log(`[${p.id}] ${p.nama} — Rp ${p.harga.toLocaleString()} (stok: ${p.stok})`);
});

// Select dengan filter
const elektronik = db
  .query("SELECT * FROM produk WHERE kategori = $kat AND stok > 0")
  .all({ $kat: "Elektronik" }) as Produk[];

console.log("\n=== Elektronik Tersedia ===");
elektronik.forEach(p => console.log(`- ${p.nama}`));

// Update
db.prepare("UPDATE produk SET stok = stok - 1 WHERE id = $id")
  .run({ $id: 1 });

// Delete
// db.prepare("DELETE FROM produk WHERE id = $id").run({ $id: 3 });

db.close();
console.log("\n✅ Operasi database selesai.");