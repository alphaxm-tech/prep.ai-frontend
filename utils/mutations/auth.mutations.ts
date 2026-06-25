// mutations/auth.mutations.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/utils/services/auth.service";

export const useVerifyUserEmail = () => {
  return useMutation({
    mutationFn: authService.verifyUserEmail,
  });
};

export const addUserDetails = () => {
  return useMutation({
    mutationFn: authService.addUserDetails,
  });
};

export const loginWithPassword = () => {
  return useMutation({
    mutationFn: authService.loginWithPassword,
  });
};

export const logout = () => {
  return useMutation({
    mutationFn: authService.logout,
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: authService.setPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};
