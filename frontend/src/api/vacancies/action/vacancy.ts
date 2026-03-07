import { api } from '@/api/client';
import { type VacanciesParamsDto, type VacanciesResponse } from '../model/types';

export const vacanciesActions = {
  vacancies: async (params: VacanciesParamsDto): Promise<VacanciesResponse> => {
  const { data } = await api.get<VacanciesResponse>("/api/Vacancies", {
    params,
  });
  return data;
}
};