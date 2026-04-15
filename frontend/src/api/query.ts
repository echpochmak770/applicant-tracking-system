import { QueryClient } from "@tanstack/react-query";
import { type VacanciesSearchRequest } from "./vacancies/model/types";
import type {
  ApplicationsParamsDto,
  ApplicationHistoryDto,
} from "./applications/model/types";

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
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

export const vacancyKeys = {
  all: ["vacancies"] as const,
  list: (params: VacanciesSearchRequest) =>
    ["vacancies", "list", params] as const,
  vacancy: (id: string) => [...vacancyKeys.all, id, "detail"] as const,
};

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (vacancyId: string, params?: ApplicationsParamsDto) =>
    [...applicationKeys.lists(), vacancyId, params] as const,
  history: (data: ApplicationHistoryDto) =>
    [...applicationKeys.all, "history", data] as const,
  application: (id: string) => [...applicationKeys.all, id, "detail"] as const,
};
