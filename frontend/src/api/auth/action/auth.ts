import { api } from '@/api/client';
import type { RegisterDto, RegisterResponse, LoginDto, LoginResponse, UserDto } from '../model/types';

export const authActions = {
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post('/api/Auth/register', data);
    return response.data
  },
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await api.post('/api/Auth/login', data);
    return response.data
  },
  getMe: async ():Promise<UserDto> => {
    const response = await api.get('/api/Auth/me');
    return response.data
  }
};