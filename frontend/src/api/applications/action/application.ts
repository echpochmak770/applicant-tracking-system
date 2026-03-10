import { api } from '@/api/client';
import type { ApplicationsParamsDto, ApplicationsResponse, ApplicationHistoryDto } from '../model/types';

export const applicationActions = {
  getApplications: async (data: ApplicationsParamsDto): Promise<ApplicationsResponse> => {
    const response = await api.get(`/api/Vacancies/${data.vacancyId}/applications`, { 
      params: data 
    });
    return response.data
  },
  getApplicationHistory: async (data: ApplicationHistoryDto): Promise<ApplicationsResponse> => {
    const response = await api.get(`/api/Applications/${data.vacancyId}/${data.applicationId}/history`, { 
      params: data 
    });
    return response.data
  },
};