import { useMutation } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { queryClient, vacancyKeys } from "@/api/query";

export const useCreateVacancyMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: vacanciesActions.createVacancy, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
      toast("Вакансия создана!")
      navigate("/vacancies");
    },
  });
};