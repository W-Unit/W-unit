import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true, // Prevents Vite from trying other ports if 5173 is busy
    host: true, // Allows external connections
    hmr: {
      port: 5173, // Ensure HMR also uses the same port
    },
    watch: {
      usePolling: false,
    },
    force: true, // Force the server to use the specified port
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  define: {
    __VITE_PORT__: JSON.stringify(5173),
  },
});
