import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
import { CustomerFeedback, CustomerFeedbackForm } from '@/services/types';

/**
 * Hook to fetch all customer feedbacks from Supabase
 * Returns feedbacks ordered by creation date (newest first)
 */
export function useCustomerFeedbacks() {
  return useQuery({
    queryKey: ['customer-feedbacks'],
    queryFn: async () => {
      console.log('Fetching customer feedbacks ...');
      const { data, error } = await supabase
        .from('customer_feedbacks')
        .select('*')
        .order('company_name', { ascending: false });
      
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
      queryClient.invalidateQueries({ queryKey: ['customer_feedbacks'] });
    },
  });
}
