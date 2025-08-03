// Frontend API client configuration
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1"
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost"
export const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "3003"
export const API_URL = `${BACKEND_URL}:${BACKEND_PORT}${API_PREFIX}`

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
