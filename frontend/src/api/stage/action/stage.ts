import { api } from "@/api/client";
import type {
  StageType,
  UpdateStagePayload,
  RejectPayload,
} from "../model/types";

export const stageActions = {
  allStages: async (vacancyId: string): Promise<StageType[]> => {
    const response = await api.get(`/Vacancies/${vacancyId}/stages`);
    return response.data;
  },
  updateStage: async (
    applicationId: string,
    body: UpdateStagePayload,
  ): Promise<void> => {
    const response = await api.put(
      `/Applications/${applicationId}/stage`,
      body,
    );
    return response.data;
  },
  reject: async (applicationId: string, body: RejectPayload): Promise<void> => {
    const response = await api.put(
      `/Applications/${applicationId}/reject`,
      body,
    );
    return response.data;
  },
  offer: async (applicationId: string, body: RejectPayload): Promise<void> => {
    const response = await api.put(
      `/Applications/${applicationId}/offer`,
      body,
    );
    return response.data;
  },
};
