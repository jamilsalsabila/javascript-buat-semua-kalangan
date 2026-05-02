class Matematika {
  // Static: milik class, bukan instance
  static readonly PI: number = 3.14159265358979;

  static luasLingkaran(r: number): number {
    return Matematika.PI * r * r;
  }

  static kelilingLingkaran(r: number): number {
    return 2 * Matematika.PI * r;
  }

  static luasSegitiga(alas: number, tinggi: number): number {
    return 0.5 * alas * tinggi;
  }
}

// Dipanggil langsung dari class, bukan instance
console.log(Matematika.luasLingkaran(5).toFixed(2));  // 78.54
console.log(Matematika.kelilingLingkaran(7).toFixed(2)); // 43.98

// Counter dengan static
class IDGenerator {
  private static hitungan: number = 0;

  static generate(prefix: string = "ID"): string {
    return `${prefix}-${++IDGenerator.hitungan}`;
  }
}

console.log(IDGenerator.generate("USER")); // USER-1
console.log(IDGenerator.generate("USER")); // USER-2
console.log(IDGenerator.generate("PROD")); // PROD-3