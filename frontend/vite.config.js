import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  worker: {
    format: "es",
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["share.werfree.fun"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: "true",
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:3000",
        secure: false,
        ws: true,
      },
    },
  },
  build:{
    manifest:true
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["share.werfree.fun"] // ✅ Add your domain here
  }
});
