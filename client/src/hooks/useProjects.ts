import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/apiClient"
import { Project, ProjectCategory } from "@/services/types"

/**
 * Hook to fetch all project categories from the API
 */
export function useProjectCategories() {
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

/**
 * Hook to fetch projects by category from Supabase
 * @param categoryId - The category ID to filter by
 */
export function useProjectsByCategory(category?: string) {
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

/**
 * Hook to fetch likes count for a project
 */
export function useProjectLikes(projectName: string) {
   return useQuery({
      queryKey: ["project-likes", projectName],
      queryFn: async () => {
         const data = await api.get<{ likes_count: number }>(`/projects/${projectName}/likes`)
         return data.likes_count
      },
   })
}

/**
 * Hook to increment likes for a project
 */
export function useLikeProject() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (projectName: string) => {
         const data = await api.post<{ likes_count: number }>(`/projects/${projectName}/likes`, {})
         return data.likes_count
      },
      onSuccess: (_data, projectName) => {
         queryClient.invalidateQueries({ queryKey: ["project-likes", projectName] })
         queryClient.invalidateQueries({ queryKey: ["projects"] })
      },
   })
}

/**
 * Hook to fetch a single project by ID
 * @param id - The ID of the project to fetch
 */
export function useProject(projectName: string) {
   return useQuery({
      queryKey: ["project", projectName],
      queryFn: async () => {
         const data = await api.get<Project>(`/projects/${projectName}`)
         return data
      },
   })
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (project: Project) => {
         const data = await api.post<Project>(`/projects/${project.name}`, project)
         return data
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["projects"] })
      },
   })
}
