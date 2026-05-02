import chalk from "chalk";

console.log(chalk.green("✅ Berhasil!"));
console.log(chalk.red("❌ Gagal!"));
console.log(chalk.yellow("⚠️  Peringatan!"));
console.log(chalk.blue("ℹ️  Informasi"));

console.log(chalk.bold.white.bgBlue(" === HEADER === "));
console.log(chalk.gray("Teks abu-abu untuk info sekunder"));

// Custom style
const sukses = chalk.bold.green;
const gagal = chalk.bold.red;
const info = chalk.italic.cyan;

console.log(sukses("Server berjalan pada port 3000"));
console.log(gagal("Koneksi database gagal"));
console.log(info("Mode: development"));