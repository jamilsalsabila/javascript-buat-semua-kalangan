export function wajibDiisi(nilai: string): boolean {
  return nilai.trim().length > 0;
}

export function minimumPanjang(nilai: string, panjangMinimum: number): boolean {
  return nilai.trim().length >= panjangMinimum;
}

export function adalahAngka(nilai: string): boolean {
  return !Number.isNaN(Number(nilai));
}

export function dalamRentang(nilai: number, minimum: number, maksimum: number): boolean {
  return nilai >= minimum && nilai <= maksimum;
}
