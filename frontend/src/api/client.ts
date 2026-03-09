import axios from 'axios';
import { queryClient } from './query';

export const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      queryClient.clear();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);