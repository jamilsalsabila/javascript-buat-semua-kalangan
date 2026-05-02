// Anotasi tipe dasar
let nama: string = "Alice";
let umur: number = 30;
let aktif: boolean = true;

// Array
let buah: string[] = ["apel", "mangga", "jeruk"];
let angka: number[] = [1, 2, 3, 4, 5];
let campur: (string | number)[] = ["satu", 2, "tiga", 4];

// Tuple: array dengan tipe yang sudah ditentukan per posisi
let koordinat: [number, number] = [10.5, 106.8];
let profil: [string, number, boolean] = ["Budi", 25, true];

// Any: menonaktifkan type checking (hindari jika bisa)
let apa_saja: any = "bisa apa saja";
apa_saja = 42;
apa_saja = true;

// Unknown: lebih aman dari any
let input: unknown = "entah apa";
if (typeof input === "string") {
  console.log(input.toUpperCase()); // OK, sudah dicek
}

// Void: untuk fungsi yang tidak mengembalikan nilai
function cetakPesan(pesan: string): void {
  console.log(pesan);
  // tidak ada return
}

// Never: untuk fungsi yang tidak pernah selesai/selalu throw
function lemparError(msg: string): never {
  throw new Error(msg);
}

// Union type: bisa berupa beberapa tipe
let id: string | number = "abc123";
id = 456; // juga valid

// Literal type: hanya boleh nilai tertentu
let arah: "utara" | "selatan" | "timur" | "barat";
arah = "utara"; // ✅
// arah = "atas"; // ❌ Error!

// Optional (?)
function sapa(nama: string, sapaan?: string): string {
  return `${sapaan ?? "Halo"}, ${nama}!`;
}
console.log(sapa("Budi"));          // "Halo, Budi!"
console.log(sapa("Ani", "Selamat pagi")); // "Selamat pagi, Ani!"