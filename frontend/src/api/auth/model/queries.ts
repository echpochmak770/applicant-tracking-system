import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/api/query";
import { authActions } from "../action/auth";

export const useMeQuery = () => {
  return useQuery({
    queryKey: authKeys.me, 
    queryFn: authActions.getMe,
    retry: false,
  });
};