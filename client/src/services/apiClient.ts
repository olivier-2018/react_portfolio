// Frontend API client configuration
const API_URL = import.meta.env.BACKEND_API_URL || "http://localhost:3003/api/v1"

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
