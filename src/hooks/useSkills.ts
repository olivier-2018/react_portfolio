import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export interface Skill {
  id: string;
  name: string;
  mastery_level: number;
  skill_category: string;
  icon?: string;
}

/**
 * Hook to fetch all skills from Supabase
 * Returns skills ordered by mastery level (highest first)
 * Can be filtered by category
 */
export function useSkills(category?: string) {
  return useQuery({
    queryKey: ['skills', category],
    queryFn: async () => {

      let query = supabase
        .from('skills')
        .select('*')
        .order('mastery_level', { ascending: false });
      
      // filter by category if provided
      if (category && category !== 'All') {
        query = query.eq('skill_category', category);        
        console.log('Fetching skills by category: ', category);
      }
      else {
        console.log('Fetching all skills.');
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Skills fetch error:', error);
        throw error;
      }
      
      console.log('Skills fetched successfully:', data);
      return data as Skill[];
    },
  });
}
