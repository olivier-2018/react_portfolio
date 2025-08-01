import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig(({ mode }) => ({
   base: "/",
   server: {
      host: true,
      strictPort: true,
      port: 5173,
      watch: {
         usePolling: true,
      },
      allowedHosts: [".brontechsolutions.ch"],
      proxy: {
         "/api": {
            target: "http://localhost:3003",
            changeOrigin: true,
            secure: false,
         },
      },
   },
   plugins: [react()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   build: {
      outDir: "dist",
      sourcemap: true,
   },
   preview: {
      port: 5173,
   },
}))
