import { useQuery} from "@tanstack/react-query";
import { type ApplicationsParamsDto } from "./types";
import { applicationActions } from "../action/apps";

export const useApplicationsQuery = (
  data: ApplicationsParamsDto, 
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['applications', 'list', data], 
    queryFn: () => applicationActions.getApplications(data),
    retry: false,
    enabled: options?.enabled
  });
};