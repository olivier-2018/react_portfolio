import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';

export interface CustomerFeedback {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  message: string;
  rating: number;
  created_at: string;
}

export interface CustomerFeedbackForm {
  first_name: string;
  last_name: string;
  company_name: string;
  message: string;
  rating: number;
}

/**
 * Hook to fetch all customer feedbacks from Supabase
 * Returns feedbacks ordered by creation date (newest first)
 */
export function useCustomerFeedbacks() {
  return useQuery({
    queryKey: ['customer-feedbacks'],
    queryFn: async () => {
      console.log('Fetching customer feedbacks from Supabase...');
      const { data, error } = await supabase
        .from('customer_feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Customer feedbacks fetch error:', error);
        throw error;
      }
      
      console.log('Customer feedbacks fetched successfully:', data);
      return data as CustomerFeedback[];
    },
  });
}

/**
 * Hook to submit customer feedback
 */
export function useSubmitCustomerFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedback: CustomerFeedbackForm) => {
      const { data, error } = await supabase
        .from('customer_feedbacks')
        .insert([feedback])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch customer feedbacks
      queryClient.invalidateQueries({ queryKey: ['customer-feedbacks'] });
    },
  });
}
