// mutations/auth.mutations.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/utils/services/auth.service";

export const useVerifyUserEmail = () => {
  return useMutation({
    mutationFn: authService.verifyUserEmail,
  });
};
