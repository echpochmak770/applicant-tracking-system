import { api } from "@/api/client";
import type {
  ApplicationsParamsDto,
  ApplicationsResponse,
  ApplicationHistoryDto,
} from "../model/types";

export const applicationActions = {
  getApplications: async (
    vacancyId: string,
    body: ApplicationsParamsDto,
  ): Promise<ApplicationsResponse> => {
    const response = await api.post(
      `/api/Vacancies/${vacancyId}/applications/search`,
      body,
    );
    return response.data;
  },
  getApplicationHistory: async (
    data: ApplicationHistoryDto,
  ): Promise<ApplicationsResponse> => {
    const response = await api.get(
      `/api/Applications/${data.vacancyId}/${data.applicationId}/history`,
      {
        params: data,
      },
    );
    return response.data;
  },
  createApplication: async (body: FormData) => {
    const { data } = await api.post("/Applications", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
