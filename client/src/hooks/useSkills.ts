import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/apiClient"
import { Skill } from "@/services/types"

export function useSkills(category?: string) {
   return useQuery({
      queryKey: ["skills", category],
      queryFn: async () => {
         const endpoint =
            category && category !== "All" ? `/skills?category=${encodeURIComponent(category)}` : "/skills"

         console.log(`Fetching skills${category ? ` for category: ${category}` : ""}`)

         const data = await api.get<Skill[]>(endpoint)

         console.log("Skills fetched successfully:", data)
         return data
      },
   })
}
