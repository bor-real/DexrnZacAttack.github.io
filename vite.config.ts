import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        QMG: resolve(__dirname, "QMGBlog/index.html"),
        QMGHP: resolve(__dirname, "QMGInfo/index.html"),
        LCEE: resolve(__dirname, "LCEE/index.html"),
        403: resolve(__dirname, "403/index.html"),
        404: resolve(__dirname, "404/index.html"),
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