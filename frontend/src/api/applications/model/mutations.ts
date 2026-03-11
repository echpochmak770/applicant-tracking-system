import { useMutation } from "@tanstack/react-query"
import { applicationActions } from "../action/application"
import { queryClient } from "@/api/query"
import { applicationKeys } from "@/api/query"

export const useCreateApplicationMutation = () => {
  return useMutation({
    mutationFn: applicationActions.createApplication, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  });
}