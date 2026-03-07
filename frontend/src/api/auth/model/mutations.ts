import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authActions } from "../action/auth";
import { authKeys } from "@/api/query";
import { useNavigate } from "react-router";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authActions.register, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      navigate("/vacancies");
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authActions.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      navigate("/vacancies");
    },
  });
};