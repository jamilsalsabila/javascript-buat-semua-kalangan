import Logger from "./logger"; // nama bebas untuk default export
import { tambah } from "./matematika";

const log = new Logger("KALKULATOR");
log.info("Aplikasi dimulai");

const hasil = tambah(10, 20);
log.info(`Hasil: ${hasil}`);
log.warn("Ini peringatan contoh");
log.error("Ini error contoh");