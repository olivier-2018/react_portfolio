import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/apiClient"
import { Project, ProjectCategory } from "@/services/types"

// fetch all project categories from the API
export function useFetchProjectCategories() {
   return useQuery({
      queryKey: ["project-categories"],
      queryFn: async () => {
         console.log("Fetching project categories...")
         const data = await api.get<ProjectCategory[]>("/project-categories")
         console.log("Project categories fetched successfully:", data)
         return data
      },
   })
}
// Hook to fetch projects (optional: by category)
export function useFetchProjects(category?: string) {
   return useQuery({
      queryKey: ["projects", category],
      queryFn: async () => {
         const endpoint =
            category && category !== "All" ? `/projects?category=${encodeURIComponent(category)}` : "/projects"
         console.log(`Fetching projects${category ? ` for category: ${category}` : ""}`)
         const data = await api.get<Project[]>(endpoint)
         console.log("Projects fetched successfully:", data)
         return data
      },
   })
}
// Hook to fetch likes count for a project
export function useFetchProjectLikes(projectName: string) {
   return useQuery({
      queryKey: ["project-likes", projectName],
      queryFn: async () => {
         const data = await api.get<{ likes_count: number }>(
            `/projects/likes?projectName=${encodeURIComponent(projectName)}`
         )
         return data.likes_count
      },
   })
}
// Hook to increment likes for a project
export function usePushProjectLikes() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (projectName: string) => {
         const data = await api.post<{ likes_count: number }>(
            `/projects/likes?projectName=${encodeURIComponent(projectName)}`,
            {}
         )
         return data.likes_count
      },
      onSuccess: (_data, projectName) => {
         queryClient.invalidateQueries({ queryKey: ["project-likes", projectName] })
         queryClient.invalidateQueries({ queryKey: ["project-categories"] })
         queryClient.invalidateQueries({ queryKey: ["projects"] })
      },
   })
}
