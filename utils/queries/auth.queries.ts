import { useQuery } from "@tanstack/react-query";
import { authService } from "@/utils/services/auth.service";

export const authQueryKeys = {
  all: ["auth"] as const,
  verifyEmail: (email: string) =>
    [...authQueryKeys.all, "verify-email", email] as const,
};

// export const useVerifyUserEmailQuery = (email?: string) => {
//   return useQuery({
//     queryKey: authQueryKeys.verifyEmail(email ?? ""),
//     queryFn: () => authService.verifyUserEmail({ email: email! }),

//     // 🔴 IMPORTANT production rules
//     enabled: !!email, // do NOT fire on empty email
//     retry: false, // email check shouldn't retry
//     staleTime: 5 * 60 * 1000, // cache for 5 mins
//   });
// };
