// logger.ts

type Level = "info" | "warn" | "error" | "debug";

class Logger {
  private prefix: string;

  constructor(prefix: string = "APP") {
    this.prefix = prefix;
  }

  private format(level: Level, pesan: string): string {
    const waktu = new Date().toISOString();
    return `[${waktu}] [${this.prefix}] [${level.toUpperCase()}] ${pesan}`;
  }

  info(pesan: string): void { console.log(this.format("info", pesan)); }
  warn(pesan: string): void { console.warn(this.format("warn", pesan)); }
  error(pesan: string): void { console.error(this.format("error", pesan)); }
  debug(pesan: string): void { console.debug(this.format("debug", pesan)); }
}

export default Logger; // default export: hanya satu per file