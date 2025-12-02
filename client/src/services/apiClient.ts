// Frontend API client configuration
// Environment variables are read from .env file at dev/build time via Vite
// IMPORTANT: After changing .env, you must RESTART the dev server (Ctrl+C and npm run dev)

// Read from import.meta.env (Vite exposes VITE_* variables from .env)
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1"
const BACKEND_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost"
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "3003"

// Construct the full API URL dynamically (consistent across all environments)
export const API_URL = `${BACKEND_URL_BASE}:${BACKEND_PORT}${API_PREFIX}`
export const API_PREFIX_EXPORT = API_PREFIX

// Debugging: Log configuration on app startup
if (typeof window !== "undefined") {
   console.log("🔧 Frontend API Configuration Loaded:")
   console.log(`   API_PREFIX: ${API_PREFIX}`)
   console.log(`   BACKEND_URL: ${BACKEND_URL_BASE}`)
   console.log(`   BACKEND_PORT: ${BACKEND_PORT}`)
   console.log(`   Full API_URL: ${API_URL}`)
   console.log(`   Environment: ${import.meta.env.MODE}`)
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
