import { describe, it, expect, beforeEach } from "bun:test";
import { tambah, kurang, kali, bagi } from "./matematika";

describe("Fungsi Matematika", () => {
  it("tambah: menjumlahkan dua angka dengan benar", () => {
    expect(tambah(2, 3)).toBe(5);
    expect(tambah(-1, 1)).toBe(0);
    expect(tambah(0, 0)).toBe(0);
  });

  it("kurang: mengurangi dua angka dengan benar", () => {
    expect(kurang(10, 3)).toBe(7);
    expect(kurang(0, 5)).toBe(-5);
  });

  it("bagi: melempar error saat dibagi nol", () => {
    expect(() => bagi(10, 0)).toThrow("Tidak bisa dibagi nol");
  });

  it("kali: hasil kali benar", () => {
    expect(kali(4, 5)).toBe(20);
    expect(kali(-2, 3)).toBe(-6);
  });
});