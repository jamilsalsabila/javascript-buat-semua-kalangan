import { Elysia, t } from "elysia";

// Tipe data
interface Todo {
  id: number;
  judul: string;
  selesai: boolean;
  dibuatPada: Date;
}

// "Database" sementara (in-memory)
let todos: Todo[] = [
  { id: 1, judul: "Belajar TypeScript", selesai: true, dibuatPada: new Date() },
  { id: 2, judul: "Belajar Bun.js", selesai: false, dibuatPada: new Date() },
];

let idBerikutnya = 3;

const app = new Elysia()
  // GET /todos — ambil semua todo
  .get("/todos", () => {
    return { data: todos, total: todos.length };
  })

  // GET /todos/:id — ambil satu todo
  .get("/todos/:id", ({ params }) => {
    const todo = todos.find(t => t.id === Number(params.id));
    if (!todo) return new Response("Todo tidak ditemukan", { status: 404 });
    return { data: todo };
  })

  // POST /todos — buat todo baru
  .post("/todos", ({ body }) => {
    const todoBaru: Todo = {
      id: idBerikutnya++,
      judul: (body as any).judul,
      selesai: false,
      dibuatPada: new Date(),
    };
    todos.push(todoBaru);
    return new Response(JSON.stringify({ data: todoBaru }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  })

  // PATCH /todos/:id — update todo
  .patch("/todos/:id", ({ params, body }) => {
    const index = todos.findIndex(t => t.id === Number(params.id));
    if (index === -1) return new Response("Todo tidak ditemukan", { status: 404 });
    
    todos[index] = { ...todos[index], ...(body as Partial<Todo>) };
    return { data: todos[index] };
  })

  // DELETE /todos/:id — hapus todo
  .delete("/todos/:id", ({ params }) => {
    const index = todos.findIndex(t => t.id === Number(params.id));
    if (index === -1) return new Response("Todo tidak ditemukan", { status: 404 });
    
    const dihapus = todos.splice(index, 1)[0];
    return { pesan: "Berhasil dihapus", data: dihapus };
  })

  .listen(3000);

console.log(`🚀 API Todo berjalan di http://localhost:${app.server?.port}`);
console.log("Endpoint tersedia:");
console.log("  GET    /todos");
console.log("  GET    /todos/:id");
console.log("  POST   /todos");
console.log("  PATCH  /todos/:id");
console.log("  DELETE /todos/:id");