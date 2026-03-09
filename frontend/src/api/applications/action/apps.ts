import { api } from '@/api/client';
import type { ApplicationsParamsDto, ApplicationsResponse } from '../model/types';

export const applicationActions = {
  getApplications: async (data: ApplicationsParamsDto): Promise<ApplicationsResponse> => {
    const response = await api.get(`/api/Vacancies/${data.vacancyId}/applications`, { 
      params: data 
    });
    return response.data
  },
};