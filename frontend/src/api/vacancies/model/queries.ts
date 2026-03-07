import { useQuery } from "@tanstack/react-query";
import { vacanciesActions } from "../action/vacancy";
import { keepPreviousData } from "@tanstack/react-query";
import { type VacanciesParamsDto } from "./types";

export const useVacanciesQuery = (params: VacanciesParamsDto) => {
  return useQuery({
    queryKey: ["vacancies", params],
    queryFn: () => vacanciesActions.vacancies(params),
    placeholderData: keepPreviousData,
  });
};