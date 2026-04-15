import { api } from "@/api/client";
import type {
  VacanciesResponse,
  CreateVacancyBody,
  VacanciesSearchRequest,
  VacancyItemDto,
  VacanciesUpdatePayload,
} from "../model/types";

export const vacanciesActions = {
  vacancies: async (
    body: VacanciesSearchRequest,
  ): Promise<VacanciesResponse> => {
    const { data } = await api.post<VacanciesResponse>(
      "/Vacancies/search",
      body,
    );
    return data;
  },

  getVacancy: async (id: string): Promise<VacancyItemDto> => {
    const { data } = await api.get(`/Vacancies/${id}`);
    return data;
  },

  updateVacancy: async (
    id: string,
    body: VacanciesUpdatePayload,
  ): Promise<void> => {
    const { data } = await api.put(`/Vacancies/${id}`, body);
    return data;
  },

  createVacancy: async (body: CreateVacancyBody) =>
    api.post("/Vacancies", body),
};
