import { describe, it, expect, mock, spyOn } from "bun:test";

// Fungsi yang ingin kita test
async function ambilHargaSaham(simbol: string): Promise<number> {
  const res = await fetch(`https://api.saham.com/${simbol}`);
  const data = await res.json();
  return data.harga;
}

// Mock: ganti fetch dengan implementasi palsu untuk testing
describe("ambilHargaSaham", () => {
  it("mengembalikan harga dari API", async () => {
    // Mock global fetch
    global.fetch = mock(() =>
      Promise.resolve({
        json: () => Promise.resolve({ harga: 15000 }),
      } as any)
    );

    const harga = await ambilHargaSaham("BBCA");
    expect(harga).toBe(15000);
    expect(fetch).toHaveBeenCalledWith("https://api.saham.com/BBCA");
  });
});