import { api } from '@/api/client';
import { type RegisterDto, type RegisterResponse } from '../model/types';

export const authActions = {
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post('/api/Auth/register', data);
    return response.data
  }
};