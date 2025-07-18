import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

/**
 * Hook to fetch unique skill categories 
 * Returns categories for filtering skills
 */
export function useSkillCategories() {
  return useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      console.log('Fetching skill categories...');

      let query = supabase
        .from('skills')
        .select('category')
        .order('name', { ascending: true });

      const { data, error } = await query;
      
      if (error) {
        console.error('Skill categories fetch error:', error);
        throw error;
      }
      
      // Get unique categories (although should be set as unique in database)
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      console.log('Skill categories fetched successfully:', uniqueCategories);
      return uniqueCategories;
    },
  });
}
