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
