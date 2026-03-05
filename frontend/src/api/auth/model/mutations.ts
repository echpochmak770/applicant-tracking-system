import { useMutation } from "@tanstack/react-query";
import { authActions } from "../action/auth";
import { type RegisterDto } from "./types";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => authActions.register(data),
    onSuccess: (res) => {
      console.log('Регистрация успешна');
      if (res.accessToken) {
        localStorage.setItem('token', res.accessToken);
      }
      if (res.expiresAt) {
        localStorage.setItem('token_expires', res.expiresAt);
      }
    }
  });
};