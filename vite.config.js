import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      input: [
        "index.html",
        "QMG/index.html",
        "QMGHeaderParser/index.html",
        "SGExtractor/index.html",
        "403/index.html",
        "404/index.html",
      ]
    }
  },
  server: {
    port: 5500,
    strictPort: true
  },
  preview: {
    port: 5500,
    strictPort: true
  }
});