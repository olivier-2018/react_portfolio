// Frontend API client configuration
// Environment variables are read from .env file at dev/build time via Vite
// IMPORTANT: After changing .env, you must RESTART the dev server (Ctrl+C and npm run dev)

// Read from import.meta.env (Vite exposes VITE_* variables from .env)
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1"

// Use relative URLs for API calls
// In production: Nginx Proxy Manager routes /api/* to backend via custom location
// In development: Vite dev server can proxy /api/* to backend (see vite.config.ts)
export const API_URL = API_PREFIX
export const API_PREFIX_EXPORT = API_PREFIX

// Debugging: Log configuration on app startup
if (typeof window !== "undefined") {
   console.info("🔧 Frontend API Configuration Loaded:")
   console.info(`   API_PREFIX: ${API_PREFIX}`)
   console.info(`   API_URL: ${API_URL}`)
   console.info(`   Routing: Nginx Proxy Manager routes /api/* to backend`)
   console.info(`   Environment: ${import.meta.env.MODE}`)
}

export const api = {
   async get<T>(endpoint: string): Promise<T> {
      const response = await fetch(`${API_URL}${endpoint}`)
      if (!response.ok) {
         throw new Error(`API error: ${response.statusText}`)
      }
      return response.json()
   },

   async post<T>(endpoint: string, data: any): Promise<T> {
      const response = await fetch(`${API_URL}${endpoint}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })
      if (!response.ok) {
         throw new Error(`API error: ${response.statusText}`)
      }
      return response.json()
   },

   // Add other methods as needed
}
