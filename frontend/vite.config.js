import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  worker: {
    format: "es",
  },
  build: {
    outDir: "../backend/public",
    emptyOutDir: true,
    manifest: true,
  },
  json: {
    namedExports: true,
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["share.werfree.fun"],
    proxy: {
      "/api": {
        target: "http://editor_backend:3001",
        changeOrigin: "true",
        secure: false,
      },
      "/socket.io": {
        target: "http://editor_backend:3001",
        secure: false,
        ws: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["share.werfree.fun"], // ✅ Add your domain here
  },
});
