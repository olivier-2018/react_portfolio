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
 * Hook to like a project and update the likes count
 */
export function useLikeProject() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (projectName: string) => {
         // First get current likes count
         const { data: project, error: fetchError } = await supabase
            .from("projects")
            .select("likes_count")
            .eq("name", projectName)
            .single()

         if (fetchError) {
            console.error("Project Likes fetch error:", fetchError)
            throw fetchError
         }

         console.log("Project Likes fetched successfully. Number of Likes:", project.likes_count)

         // Second, Increment likes count
         const { data, error } = await supabase
            .from("projects")
            .update({ likes_count: project.likes_count + 1 })
            .eq("name", projectName)
            .select()
            .single()

         if (error) {
            console.error("Error updating Project Likes:", error)
            throw error
         }

         console.log(`Project Likes updated successfully. Project: ${data.title}, Number of Likes: ${data.likes_count}`)
         return data
      },
      onSuccess: () => {
         // Invalidate and refetch projects
         queryClient.invalidateQueries({ queryKey: ["projects"] })
      },
   })
}

/**
 * Hook to fetch a single project by ID
 * @param id - The ID of the project to fetch
 */
export function useProject(id: string) {
   return useQuery({
      queryKey: ["project", id],
      queryFn: async () => {
         const data = await api.get<Project>(`/projects/${id}`)
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
         const data = await api.post<Project>(`/projects/${project.id}`, project)
         return data
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["projects"] })
      },
   })
}
