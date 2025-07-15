import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: { // server block only used in Development mode
    host: true,
    strictPort: true, // Ensure the server uses the specified port
    port: 5173,
    watch: {
      usePolling: true, // Use polling 'true' for file watching in Docker (while developing in container)
    },  
    allowedHosts: ['.brontechsolutions.ch']
  },
  preview: {
    port: 5173 // Pick your port here
  },
  plugins: [react()],
  base: "/", // Set base path for production
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
}));





