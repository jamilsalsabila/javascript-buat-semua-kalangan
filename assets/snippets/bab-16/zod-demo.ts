import { z } from "zod";

// Definisikan schema validasi
const SchemaPengguna = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(50),
  email: z.string().email("Email tidak valid"),
  umur: z.number().int().min(0).max(120).optional(),
  peran: z.enum(["admin", "user", "moderator"]).default("user"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[0-9]/, "Harus ada angka"),
});

// Buat TypeScript type otomatis dari schema!
type Pengguna = z.infer<typeof SchemaPengguna>;

// Validasi data
const dataMasukan = {
  nama: "Budi Santoso",
  email: "budi@example.com",
  umur: 28,
  password: "SecurePass123",
};

const hasil = SchemaPengguna.safeParse(dataMasukan);

if (hasil.success) {
  const pengguna: Pengguna = hasil.data;
  console.log("✅ Valid:", pengguna);
} else {
  console.error("❌ Error validasi:");
  hasil.error.errors.forEach(err => {
    console.error(`  - ${err.path.join(".")}: ${err.message}`);
  });
}