import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { join, dirname, resolve } from "path";

const BACKEND_URL = "http://localhost:3001";
const PORT = 4173;
const app = express();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Proxy API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/api": "/api", // Keeps the /api prefix when forwarding the request
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying API request: ${req.url} -> ${BACKEND_URL}${req.url}`
      );
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.status(500).send("Proxy error occurred.");
    },
  })
);

app.use(
  "/socket.io",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/socket.io": "/socket.io", // Keeps the /api prefix when forwarding the request
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying API request: ${req.url} -> ${BACKEND_URL}${req.url}`
      );
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.status(500).send("Proxy error occurred.");
    },
  })
);

// Serve static files from the 'dist' directory
app.use(express.static(join(__dirname, "dist")));

// Handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
