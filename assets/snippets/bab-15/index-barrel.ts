// utils/index.ts — barrel file: ekspor ulang semua dari folder utils
export { tambah, kurang, kali, bagi } from "./matematika";
export { default as Logger } from "./logger";
export * from "./validator";

// Sekarang pengguna bisa import dari satu tempat:
// import { tambah, Logger } from "./utils";