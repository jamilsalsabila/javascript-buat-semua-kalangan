import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

// Generate UUID v4 (random)
const id1 = uuidv4();
const id2 = uuidv4();
console.log("UUID 1:", id1); // contoh: 110e8400-e29b-41d4-a716-446655440000
console.log("UUID 2:", id2); // selalu berbeda

// UUID v5 (deterministik berdasarkan nama)
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const idUser = uuidv5("budi@example.com", NAMESPACE);
console.log("ID User:", idUser); // selalu sama untuk email yang sama

// Penggunaan praktis
interface Produk {
  id: string;
  nama: string;
  harga: number;
}

function buatProduk(nama: string, harga: number): Produk {
  return { id: uuidv4(), nama, harga };
}

const produk = buatProduk("Laptop Gaming", 15000000);
console.log(produk);