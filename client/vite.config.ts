import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig(({ mode, command }) => {
   // Load environment variables from .env files in the ROOT directory (parent of client/)
   const rootDir = path.resolve(__dirname, "..")
   const env = loadEnv(mode, rootDir, "")

   // Read ports from environment with defaults
   const frontendPort = parseInt(env.VITE_FRONTEND_PORT || "5173")
   const backendPort = parseInt(env.VITE_BACKEND_PORT || "3003")

   // Enforce localhost for development mode, use env value for production
   const isDevMode = process.env.NODE_ENV === "development"
   const backendUrlBase = isDevMode ? "http://localhost" : env.VITE_BACKEND_URL || "http://localhost"

   // Construct full backend URL with port
   const backendUrl = `${backendUrlBase}:${backendPort}`

   // Determine reCAPTCHA status
   const useRecaptcha = env.VITE_USE_RECAPTCHA === "true"
   const recaptchaEnabled = !isDevMode && useRecaptcha

   // Log for debugging
   console.info("\n🔑 Vite Configuration:")
   console.info(`   Mode: ${isDevMode ? "DEVELOPMENT" : "PRODUCTION"}`)
   console.info(`   reCAPTCHA: ${recaptchaEnabled ? "✅ ENABLED" : "❌ DISABLED"}\n`)
   console.info(`   Frontend Port: ${frontendPort}`)
   console.info(`   Backend Port: ${backendPort}`)
   console.info(`   Backend URL: ${backendUrl}${isDevMode ? " (enforced for dev mode)" : ""}`)
   // console.info(`   Full Backend URL: ${backendUrl}`)

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
         "import.meta.env.VITE_EMAILJS_SERVICE_ID": JSON.stringify(env.VITE_EMAILJS_SERVICE_ID || ""),
         "import.meta.env.VITE_EMAILJS_TEMPLATE_ID": JSON.stringify(env.VITE_EMAILJS_TEMPLATE_ID || ""),
         "import.meta.env.VITE_EMAILJS_PUBLIC_KEY": JSON.stringify(env.VITE_EMAILJS_PUBLIC_KEY || ""),
         "import.meta.env.VITE_RECAPTCHA_SITE_KEY": JSON.stringify(env.VITE_RECAPTCHA_SITE_KEY || ""),
         "import.meta.env.VITE_USE_RECAPTCHA": JSON.stringify(env.VITE_USE_RECAPTCHA || "false"),
         "import.meta.env.VITE_GIT_COMMIT_DATE": JSON.stringify(env.VITE_GIT_COMMIT_DATE || ""),
         "import.meta.env.VITE_COPILOT_DIRECTLINE_SECRET": JSON.stringify(env.VITE_COPILOT_DIRECTLINE_SECRET || ""),
      },
   }
})
