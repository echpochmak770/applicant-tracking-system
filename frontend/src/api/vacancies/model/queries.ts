import { useQuery } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { keepPreviousData } from "@tanstack/react-query";
import { type VacanciesParamsDto } from "./types";
import { vacancyKeys } from "@/api/query";

export const useVacanciesQuery = (params: VacanciesParamsDto) => {
  return useQuery({
    queryKey: vacancyKeys.list(params),
    queryFn: () => vacanciesActions.vacancies(params),
    placeholderData: keepPreviousData,
  });
};