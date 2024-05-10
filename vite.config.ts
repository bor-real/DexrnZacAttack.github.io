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
    host: '127.0.0.1',
    port: 80,
    strictPort: true
  },
  preview: {
    host: '127.0.0.1',
    port: 80,
    strictPort: true
  }
});
