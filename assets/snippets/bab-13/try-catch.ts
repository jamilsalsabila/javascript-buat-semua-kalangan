function bagiAngka(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Tidak bisa membagi dengan nol!");
  }
  return a / b;
}

// Tanpa try-catch: error akan crash program
// bagiAngka(10, 0); // ❌ Uncaught Error!

// Dengan try-catch: error ditangkap dengan aman
try {
  const hasil = bagiAngka(10, 0);
  console.log("Hasil:", hasil);
} catch (error) {
  if (error instanceof Error) {
    console.error("Terjadi kesalahan:", error.message);
  }
} finally {
  // Selalu dijalankan, baik ada error maupun tidak
  console.log("Operasi pembagian selesai.");
}

// Multiple catch (tangkap error berbeda)
try {
  const json = JSON.parse("ini bukan json valid");
  console.log(json);
} catch (e) {
  if (e instanceof SyntaxError) {
    console.error("JSON tidak valid:", e.message);
  } else if (e instanceof Error) {
    console.error("Error lain:", e.message);
  } else {
    console.error("Unknown error:", e);
  }
}