// For...of: iterasi langsung nilai dari array/iterable
const buah: string[] = ["apel", "mangga", "jeruk", "pisang"];

for (const item of buah) {
  console.log(`Buah: ${item}`);
}

// Dengan string
for (const huruf of "HELLO") {
  console.log(huruf); // H, E, L, L, O
}

// Dengan Map
const kamus = new Map<string, string>([
  ["kucing", "cat"],
  ["anjing", "dog"],
  ["ikan", "fish"]
]);

for (const [indonesia, inggris] of kamus) {
  console.log(`${indonesia} = ${inggris}`);
}