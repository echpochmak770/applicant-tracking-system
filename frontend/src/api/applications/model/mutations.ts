import { useMutation } from "@tanstack/react-query"
import { applicationActions } from "../action/application"

export const useCreateApplicationMutation = () => {
  return useMutation({
    mutationFn: applicationActions.createApplication,
  })
}