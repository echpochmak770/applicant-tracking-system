import { useMutation } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { queryClient, vacancyKeys } from "@/api/query";
import type { VacanciesUpdatePayload } from "./types";

export const useCreateVacancyMutation = () => {
  return useMutation({
    mutationFn: vacanciesActions.createVacancy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
};

export const useUpdateVacancyMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: VacanciesUpdatePayload }) =>
      vacanciesActions.updateVacancy(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
};
