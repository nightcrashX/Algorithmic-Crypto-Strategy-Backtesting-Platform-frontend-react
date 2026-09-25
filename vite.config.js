// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/user': {
        // target: 'http://localhost:8000',
        target: 'https://algorithmic-crypto-strategy-backtesting.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      // Correct WebSocket proxy configuration
      '/live': {
        // target: 'http://localhost:8000',
        target: 'https://algorithmic-crypto-strategy-backtesting.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true,
        // Don't rewrite the path
        rewrite: (path) => path,
        // Configure WebSocket upgrade
        configure: (proxy, options) => {
          proxy.on('upgrade', (req, socket, head) => {
            console.log('WebSocket upgrade request:', req.url);
          });
        }
      }
    }
  }
});
