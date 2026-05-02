// Server HTTP paling sederhana dengan Bun
const server = Bun.serve({
  port: 3000,
  fetch(request: Request): Response {
    const url = new URL(request.url);
    
    if (url.pathname === "/") {
      return new Response("Selamat datang di API saya! 🎉");
    }

    if (url.pathname === "/halo") {
      const nama = url.searchParams.get("nama") ?? "Dunia";
      return new Response(`Halo, ${nama}!`);
    }

    return new Response("404 — Halaman tidak ditemukan", { status: 404 });
  },
});

console.log(`🚀 Server berjalan di http://localhost:${server.port}`);