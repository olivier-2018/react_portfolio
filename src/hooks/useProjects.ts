import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { Project, ProjectCategory } from '@/services/types';


/**
 * Hook to fetch all project categories from Supabase
 */
export function useProjectCategories() {
  return useQuery({
    queryKey: ['project-categories'],
    queryFn: async () => {
      console.log('Fetching project-categories from Supabase...');
      
      let query = supabase
        .from('project_categories')
        .select('*')
        .order('name');

      const { data, error } = await query;
      
      if (error) {
        console.error('project_categories fetch error:', error);
        throw error;
      }

      console.log('project_categories fetched successfully:', data);
      return data as ProjectCategory[];
    },
  });
}

/**
 * Hook to fetch projects by category from Supabase
 * @param categoryId - The category ID to filter by
 */
export function useProjectsByCategory(categoryId?: string) {
  return useQuery({
    queryKey: ['projects', categoryId],
    queryFn: async () => {
      console.log('Fetching projects by categoryID...', {categoryId});

      let query = supabase
        .from('projects')
        .select('*')
        .order('likes_count', { ascending: true });

      if (categoryId) {
        query = query.eq('category', categoryId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('project_categories by ID fetch error:', error);
        throw error;
      }
      
      console.log('project_categories by ID fetched successfully:', data);
      return data as Project[];
    },
    enabled: !!categoryId,
  });
}

/**
 * Hook to like a project and update the likes count
 */
export function useLikeProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectName: string) => {
      // First get current likes count
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('likes_count')
        .eq('name', projectName)
        .single();

      if (fetchError) {
        console.error('Project Likes fetch error:', fetchError);
        throw fetchError;
      }
      
      console.log('Project Likes fetched successfully. Number of Likes:', project.likes_count);

      // Second, Increment likes count
      const { data, error } = await supabase
        .from('projects')
        .update({ likes_count: project.likes_count + 1 })
        .eq('name', projectName)
        .select()
        .single();

      if (error) {
        console.error('Error updating Project Likes:', error);
        throw error;
      }

      console.log(`Project Likes updated successfully. Project: ${data.title}, Number of Likes: ${data.likes_count}`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}