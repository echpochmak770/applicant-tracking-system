import { api } from "@/api/client";
import type {
  VacanciesResponse,
  CreateVacancyBody,
  VacanciesSearchRequest,
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

  createVacancy: async (body: CreateVacancyBody) =>
    api.post("/Vacancies", body),
};
