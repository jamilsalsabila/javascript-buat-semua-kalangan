// Fungsi hanya bisa return satu nilai
// Tapi bisa mengemas banyak nilai dalam objek atau tuple

function hitungStatistik(data: number[]): {
  min: number;
  max: number;
  rata: number;
  total: number;
} {
  const total = data.reduce((s, n) => s + n, 0);
  return {
    min: Math.min(...data),
    max: Math.max(...data),
    rata: total / data.length,
    total
  };
}

const nilai = [85, 92, 78, 95, 88, 72];
const { min, max, rata, total } = hitungStatistik(nilai);
console.log(`Min: ${min}, Max: ${max}, Rata: ${rata.toFixed(2)}, Total: ${total}`);