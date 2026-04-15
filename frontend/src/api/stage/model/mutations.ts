import { useMutation } from "@tanstack/react-query";
import { stageActions } from "../action/stage";
import type { UpdateStagePayload, RejectPayload } from "./types";
import { queryClient } from "@/api/query";
import { applicationKeys } from "@/api/query";

export const useUpdateStageMutation = () => {
  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: UpdateStagePayload;
    }) => stageActions.updateStage(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
};

export const useRejectMutation = () => {
  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: RejectPayload;
    }) => stageActions.reject(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
};

export const useOfferMutation = () => {
  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: RejectPayload;
    }) => stageActions.offer(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
};
