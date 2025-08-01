import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/apiClient';
import { CustomerFeedback, CustomerFeedbackForm } from '@/services/types';

/**
 * Hook to fetch all customer feedbacks from the API
 * Returns feedbacks ordered by creation date (newest first)
 */
export function useCustomerFeedbacks() {
  return useQuery({
    queryKey: ['customer-feedbacks'],
    queryFn: async () => {
      console.log('Fetching customer feedbacks...');
      const data = await api.get<CustomerFeedback[]>('/feedbacks');
      console.log('Customer feedbacks fetched successfully:', data);
      return data;
    },
  });
}

/**
 * Hook to submit customer feedback
 */
export function useAddCustomerFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: CustomerFeedbackForm) => {
      const data = await api.post<CustomerFeedback>('/feedbacks', feedback);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-feedbacks'] });
    },
  });
