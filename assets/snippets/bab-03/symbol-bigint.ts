// Symbol: nilai unik yang tidak bisa diduplikasi
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false! Selalu berbeda

// BigInt: untuk angka sangat besar melebihi batas Number
const angkaBesar: bigint = 9007199254740991n; // tambahkan 'n' di akhir
const lebihBesar: bigint = BigInt("99999999999999999999999");
console.log(lebihBesar + 1n);