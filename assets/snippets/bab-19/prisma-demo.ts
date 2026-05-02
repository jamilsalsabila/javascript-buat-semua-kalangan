import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Buat pengguna baru
  const pengguna = await prisma.pengguna.create({
    data: {
      email: "alice@example.com",
      nama: "Alice Wonderland",
    },
  });
  console.log("Pengguna dibuat:", pengguna);

  // Buat pesan terhubung dengan pengguna
  const pesan = await prisma.pesan.create({
    data: {
      isi: "Halo dari Prisma!",
      penggunaId: pengguna.id,
    },
  });

  // Cari semua pengguna beserta pesannya
  const semuaPengguna = await prisma.pengguna.findMany({
    include: { pesan: true },
  });

  console.log("\n=== Semua Pengguna ===");
  semuaPengguna.forEach(p => {
    console.log(`${p.nama} (${p.email}) — ${p.pesan.length} pesan`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());