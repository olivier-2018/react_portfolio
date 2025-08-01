import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/apiClient"

/**
 * Hook to fetch skill categories
 * Returns categories for filtering skills
 */
export function useSkillCategories() {
   return useQuery({
      queryKey: ["category"],
      queryFn: async () => {
         console.log("Fetching skill categories...")
         const data = await api.get<string[]>("/skill-categories")
         console.log("Skill categories fetched successfully:", data)
         return data
      },
   })
}
