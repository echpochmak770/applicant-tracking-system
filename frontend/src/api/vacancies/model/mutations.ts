import { useMutation } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { queryClient, vacancyKeys } from "@/api/query";

export const useCreateVacancyMutation = () => {
  return useMutation({
    mutationFn: vacanciesActions.createVacancy, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
};