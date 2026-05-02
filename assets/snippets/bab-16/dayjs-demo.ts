import dayjs from "dayjs";
import "dayjs/locale/id"; // Bahasa Indonesia

dayjs.locale("id"); // Set default locale

const sekarang = dayjs();
console.log("Sekarang:", sekarang.format("dddd, D MMMM YYYY HH:mm:ss"));

const tanggalLahir = dayjs("1998-05-17");
const umur = sekarang.diff(tanggalLahir, "year");
console.log(`Umur: ${umur} tahun`);

// Manipulasi tanggal
const besok = sekarang.add(1, "day");
const mingguLalu = sekarang.subtract(1, "week");
const awalBulan = sekarang.startOf("month");
const akhirBulan = sekarang.endOf("month");

console.log("Besok:", besok.format("D MMM YYYY"));
console.log("Minggu lalu:", mingguLalu.format("D MMM YYYY"));
console.log("Awal bulan ini:", awalBulan.format("D MMM YYYY"));
console.log("Akhir bulan ini:", akhirBulan.format("D MMM YYYY"));