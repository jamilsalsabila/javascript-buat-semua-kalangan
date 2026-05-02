function buatKopi(
  jenis: string = "americano",
  ukuran: string = "medium",
  gula: number = 1
): string {
  return `Memesan ${ukuran} ${jenis} dengan ${gula} sendok gula.`;
}

console.log(buatKopi());                       // medium americano, 1 sendok
console.log(buatKopi("latte"));               // medium latte, 1 sendok
console.log(buatKopi("espresso", "small", 0)); // small espresso, 0 sendok