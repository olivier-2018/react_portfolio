import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/apiClient"
import { CustomerFeedback, CustomerFeedbackForm } from "@/services/types"

// Hook to fetch customer feedbacks
export function useFetchCustomerFeedbacks() {
   return useQuery({
      queryKey: ["customer-feedbacks"],
      queryFn: async () => {
         console.log("Fetching customer feedbacks")
         const data = await api.get<CustomerFeedback[]>("/feedbacks")
         console.log("Customer feedbacks fetched successfully:", data)
         return data
      },
   })
}
// Hook to submit a new customer feedback
export function useSubmitCustomerFeedback() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: async (feedback: CustomerFeedbackForm) => {
         console.log("Submitting customer feedback:", feedback)
         const data = await api.post<CustomerFeedback>("/feedbacks", feedback)
         console.log("Customer feedback submitted successfully:", data)
         return data
      },
      onSuccess: (data) => {
         console.log("Invalidating customer feedbacks cache")
         queryClient.invalidateQueries({ queryKey: ["customer-feedbacks"] })
      },
      onError: (error: Error) => {
         console.error("Failed to submit customer feedback:", error)
         throw error
      },
   })
}
