import { useQuery } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { keepPreviousData } from "@tanstack/react-query";
import { type VacanciesSearchRequest } from "./types";
import { vacancyKeys } from "@/api/query";

export const useVacanciesQuery = (params: VacanciesSearchRequest) => {
  return useQuery({
    queryKey: vacancyKeys.list(params),
    queryFn: () => vacanciesActions.vacancies(params),
    placeholderData: keepPreviousData,
  })
}

export const useVacancyStagesQuery = (vacancyId: string) => {
  return useQuery({
    queryKey: ["vacancy-stages", vacancyId],
    queryFn: () => {
      return vacanciesActions.stage(vacancyId)
    },
    enabled: !!vacancyId
  })
}