import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        QMG: resolve(__dirname, "index.html"),
        QMGHP: resolve(__dirname, "index.html"),
        LCEE: resolve(__dirname, "index.html"),
        403: resolve(__dirname, "index.html"),
        404: resolve(__dirname, "index.html"),
      }
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