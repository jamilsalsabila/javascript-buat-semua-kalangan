// Buat custom error dengan informasi tambahan
class ErrorValidasi extends Error {
  public kode: string;
  public field?: string;

  constructor(pesan: string, kode: string, field?: string) {
    super(pesan);
    this.name = "ErrorValidasi";
    this.kode = kode;
    this.field = field;
  }
}

class ErrorDatabase extends Error {
  public query?: string;

  constructor(pesan: string, query?: string) {
    super(pesan);
    this.name = "ErrorDatabase";
    this.query = query;
  }
}

function validasiEmail(email: string): void {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new ErrorValidasi(
      `"${email}" bukan alamat email yang valid`,
      "EMAIL_INVALID",
      "email"
    );
  }
}

function simpanKePengguna(email: string, nama: string): void {
  validasiEmail(email);
  // simulasi error database
  if (nama.length < 2) {
    throw new ErrorDatabase("Nama terlalu pendek untuk disimpan", "INSERT INTO pengguna...");
  }
  console.log(`Pengguna ${nama} (${email}) berhasil disimpan!`);
}

// Tangkap error dengan tipe spesifik
const dataMasukan = [
  { email: "budi@gmail.com", nama: "Budi Santoso" },
  { email: "emailtidakvalid", nama: "Alice" },
  { email: "carol@gmail.com", nama: "C" },
];

for (const data of dataMasukan) {
  try {
    simpanKePengguna(data.email, data.nama);
  } catch (e) {
    if (e instanceof ErrorValidasi) {
      console.error(`[VALIDASI] Field ${e.field}: ${e.message} (kode: ${e.kode})`);
    } else if (e instanceof ErrorDatabase) {
      console.error(`[DATABASE] ${e.message}`);
    } else {
      console.error("[ERROR TIDAK DIKENAL]", e);
    }
  }
}