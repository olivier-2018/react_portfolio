import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig(({ mode, command }) => {
   // Load environment variables from .env files in current directory (root of project)
   const rootDir = process.cwd()
   const env = loadEnv(mode, rootDir, "")

   // Read ports from environment with defaults
   const frontendPort = parseInt(env.VITE_FRONTEND_PORT || "5173")
   const backendPort = parseInt(env.VITE_BACKEND_PORT || "3003")
   const backendUrlBase = env.VITE_BACKEND_URL || "http://localhost"

   // Construct full backend URL with port
   const backendUrl = `${backendUrlBase}:${backendPort}`

   // Log for debugging
   if (command === "serve") {
      console.log("\n🔑 Vite Dev Server Configuration:")
      console.log(`   Frontend Port: ${frontendPort}`)
      console.log(`   Backend Port: ${backendPort}`)
      console.log(`   Backend URL Base: ${backendUrlBase}`)
      console.log(`   Full Backend URL: ${backendUrl}\n`)
   }

   return {
      base: "/",
      server: {
         host: true,
         strictPort: true,
         port: frontendPort,
         watch: {
            usePolling: true,
         },
         allowedHosts: [".brontechsolutions.ch"],
         proxy: {
            "/api": {
               target: backendUrl,
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
         port: frontendPort,
      },
      // Explicitly expose environment variables to import.meta.env
      define: {
         "import.meta.env.VITE_BACKEND_PORT": JSON.stringify(env.VITE_BACKEND_PORT || "3003"),
         "import.meta.env.VITE_BACKEND_URL": JSON.stringify(env.VITE_BACKEND_URL || "http://localhost"),
         "import.meta.env.VITE_API_PREFIX": JSON.stringify(env.VITE_API_PREFIX || "/api/v1"),
         "import.meta.env.VITE_FRONTEND_PORT": JSON.stringify(env.VITE_FRONTEND_PORT || "5173"),
      },
   }
})
