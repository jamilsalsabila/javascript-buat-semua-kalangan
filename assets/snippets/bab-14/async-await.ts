interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Fetch data dari API nyata (Bun mendukung fetch natively!)
async function ambilPost(id: number): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function tampilkanPost(id: number): Promise<void> {
  try {
    console.log(`Mengambil post #${id}...`);
    const post = await ambilPost(id);
    console.log(`\nJudul: ${post.title}`);
    console.log(`Isi: ${post.body.substring(0, 100)}...`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Gagal mengambil post:", error.message);
    }
  }
}

// Ambil multiple posts secara paralel
async function tampilkanBanyakPost(): Promise<void> {
  const ids = [1, 2, 3];
  const posts = await Promise.all(ids.map(id => ambilPost(id)));
  
  posts.forEach(post => {
    console.log(`\n[${post.id}] ${post.title.toUpperCase()}`);
    console.log(`${post.body.split("\n")[0]}`);
  });
}

// Top-level await di Bun.js!
await tampilkanPost(1);
await tampilkanBanyakPost();