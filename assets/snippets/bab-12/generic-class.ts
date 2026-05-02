// Stack generic yang bisa menampung tipe apa saja
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get ukuran(): number {
    return this.items.length;
  }
}

const tumpukanAngka = new Stack<number>();
tumpukanAngka.push(1);
tumpukanAngka.push(2);
tumpukanAngka.push(3);
console.log(tumpukanAngka.pop());  // 3
console.log(tumpukanAngka.peek()); // 2

const tumpukanNama = new Stack<string>();
tumpukanNama.push("Budi");
tumpukanNama.push("Siti");
// tumpukanNama.push(42); // ❌ Error! bukan string

// Pasangan key-value generic
class Pasangan<K, V> {
  constructor(public kunci: K, public nilai: V) {}

  balik(): Pasangan<V, K> {
    return new Pasangan(this.nilai, this.kunci);
  }

  toString(): string {
    return `(${this.kunci}: ${this.nilai})`;
  }
}

const pasangan = new Pasangan("nama", "Budi");
console.log(pasangan.toString());          // (nama: Budi)
console.log(pasangan.balik().toString()); // (Budi: nama)