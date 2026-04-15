import { api } from "@/api/client";
import type {
  ApplicationsParamsDto,
  ApplicationsResponse,
  ApplicationHistoryDto,
  ApplicationHistoryItemDto,
  ApplicationItemDto,
} from "../model/types";

export const applicationActions = {
  getApplications: async (
    vacancyId: string,
    body?: ApplicationsParamsDto,
  ): Promise<ApplicationsResponse> => {
    const response = await api.post(
      `/Vacancies/${vacancyId}/applications/search`,
      body,
    );
    return response.data;
  },
  getApplicationHistory: async (
    data: ApplicationHistoryDto,
  ): Promise<ApplicationHistoryItemDto[]> => {
    const response = await api.get(
      `/Applications/${data.vacancyId}/${data.applicationId}/history`,
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
  downloadResume: async (applicationId: string) => {
    const response = await api.get(`/Applications/${applicationId}/resume`, {
      responseType: "blob",
    });
    return response.data;
  },

  updateApplication: async (id: string, body: FormData): Promise<void> => {
    const { data } = await api.put(`/Applications/${id}`, body);
    return data;
  },

  getApplication: async (id: string): Promise<ApplicationItemDto> => {
    const { data } = await api.get(`/Applications/${id}`);
    return data;
  },
};
