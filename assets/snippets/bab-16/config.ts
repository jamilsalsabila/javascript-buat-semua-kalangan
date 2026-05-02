// Bun.js sudah built-in support .env!
// Tidak perlu import apapun

const config = {
  dbUrl: process.env.DATABASE_URL ?? "postgresql://localhost:5432/default",
  apiKey: process.env.API_KEY ?? "",
  port: parseInt(process.env.PORT ?? "3000"),
  isDev: process.env.NODE_ENV === "development",
};

export default config;