const hariIni: string = "Senin";

switch (hariIni) {
  case "Senin":
    console.log("Semangat memulai pekan baru!");
    break; // WAJIB! Tanpa break, akan "jatuh" ke case berikutnya
  case "Selasa":
  case "Rabu":
  case "Kamis":
    console.log("Tetap semangat!");
    break;
  case "Jumat":
    console.log("Hampir weekend!");
    break;
  case "Sabtu":
  case "Minggu":
    console.log("Selamat berlibur!");
    break;
  default:
    console.log("Hari tidak dikenal.");
}

// Output: Semangat memulai pekan baru!