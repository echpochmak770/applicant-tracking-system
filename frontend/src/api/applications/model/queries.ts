import { useQuery } from "@tanstack/react-query";
import type { ApplicationsParamsDto, ApplicationHistoryDto } from "./types";
import { applicationActions } from "../action/application";
import { applicationKeys } from "@/api/query";
import type { ApplicationsResponse } from "./types";

export const useApplicationsQuery = <TData = ApplicationsResponse>(
  vacancyId: string,
  data: ApplicationsParamsDto,
  options?: {
    enabled?: boolean;
    select?: (data: ApplicationsResponse) => TData;
  },
) => {
  return useQuery({
    queryKey: applicationKeys.list(vacancyId, data),
    queryFn: () => applicationActions.getApplications(vacancyId, data),
    retry: false,
    enabled: options?.enabled,
    select: options?.select,
  });
};

export const useApplicationHistoryQuery = (
  data: ApplicationHistoryDto,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: applicationKeys.history(data),
    queryFn: () => applicationActions.getApplicationHistory(data),
    retry: false,
    enabled: options?.enabled,
  });
};
