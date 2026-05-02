// matematika.ts — mengekspor beberapa hal

export const PI = 3.14159265358979;
export const E = 2.71828182845905;

export function tambah(a: number, b: number): number {
  return a + b;
}

export function kurang(a: number, b: number): number {
  return a - b;
}

export function kali(a: number, b: number): number {
  return a * b;
}

export function bagi(a: number, b: number): number {
  if (b === 0) throw new Error("Tidak bisa dibagi nol");
  return a / b;
}

export interface HasilOperasi {
  operasi: string;
  a: number;
  b: number;
  hasil: number;
}