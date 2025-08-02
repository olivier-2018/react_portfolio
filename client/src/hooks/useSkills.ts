import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/apiClient"
import { Skill, SkillCategory } from "@/services/types"

// Hook to fetch all skill categories
export function useFetchSkillCategories() {
   return useQuery({
      queryKey: ["category"],
      queryFn: async () => {
         console.log("Fetching skill categories...")
         const data = await api.get<SkillCategory[]>("/skill-categories")
         console.log("Skill categories fetched successfully:", data)
         return data
      },
   })
}
// Hook to fetch skills (optional: by category)
export function useFetchSkills(category?: string) {
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
