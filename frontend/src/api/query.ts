import { QueryClient } from "@tanstack/react-query";
import { type VacanciesParamsDto } from "./vacancies/model/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export const invalidate = (key: readonly unknown[]) =>
  queryClient.invalidateQueries({ queryKey: key });

export const removeQueries = (key: readonly unknown[]) =>
  queryClient.removeQueries({ queryKey: key });

export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export const vacancyKeys = {
  all: ['vacancies'] as const,
  list: (params: VacanciesParamsDto) => ['vacancies', 'list', params] as const,
};