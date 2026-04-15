import { useMutation } from "@tanstack/react-query";
import { applicationActions } from "../action/application";
import { queryClient } from "@/api/query";
import { applicationKeys } from "@/api/query";

export const useCreateApplicationMutation = () => {
  return useMutation({
    mutationFn: applicationActions.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: ({ applicationId }: { applicationId: string }) =>
      applicationActions.downloadResume(applicationId),
  });
};

export const useUpdateApplicationMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData }) =>
      applicationActions.updateApplication(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
};
