import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authActions } from "../action/auth";
import { authKeys } from "@/api/query";
import { useNavigate } from "react-router";

// src/api/auth/model/queries.ts

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // Временно комментируем реальный запрос
    // mutationFn: authActions.register, 
    mutationFn: async (data: any) => {
      console.warn("DEBUG: Имитация регистрации", data);
      return new Promise((res) => setTimeout(res, 800)); // Имитируем задержку сети
    },
    onSuccess: () => {
      // Имитируем успешную авторизацию для ProtectedRoute
      localStorage.setItem("auth_token", "true"); 
      
      // Инвалидация пока не сработает (так как /me упадет с CORS), 
      // но для редиректа нам это сейчас не мешает
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      
      // Перенаправляем на вакансии
      navigate("/vacancies");
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // mutationFn: authActions.login,
    mutationFn: async (data: any) => {
      console.warn("DEBUG: Имитация логина", data);
      return new Promise((res) => setTimeout(res, 800));
    },
    onSuccess: () => {
      localStorage.setItem("auth_token", "true");
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      navigate("/vacancies");
    },
  });
};