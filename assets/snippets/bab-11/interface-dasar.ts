// Interface: mendefinisikan "kontrak" untuk objek
interface Pengguna {
  id: number;
  nama: string;
  email: string;
  umur?: number; // optional (tidak wajib)
  readonly createdAt: Date; // readonly (tidak bisa diubah setelah dibuat)
}

// Objek HARUS memiliki semua properti wajib interface
const pengguna1: Pengguna = {
  id: 1,
  nama: "Budi Santoso",
  email: "budi@example.com",
  createdAt: new Date(),
};

const pengguna2: Pengguna = {
  id: 2,
  nama: "Siti Rahayu",
  email: "siti@example.com",
  umur: 28,
  createdAt: new Date(),
};

// pengguna1.createdAt = new Date(); // ❌ Error! readonly