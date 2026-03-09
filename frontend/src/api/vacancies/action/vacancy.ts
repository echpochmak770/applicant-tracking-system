import { api } from '@/api/client';
import type { VacanciesParamsDto, VacanciesResponse, CreateVacancyBody } from '../model/types';

export const vacanciesActions = {
  vacancies: async (params: VacanciesParamsDto): Promise<VacanciesResponse> => {
    const { data } = await api.get<VacanciesResponse>("/api/Vacancies", {
      params,
    });
    return data;
  },
  createVacancy: async (body: CreateVacancyBody) => await api.post<VacanciesResponse>("/api/Vacancies", body)
};