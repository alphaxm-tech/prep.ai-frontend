import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "../services/resume.service";

export const useSaveResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeService.saveResume,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resume", "get-users-all-resumes"],
      });
    },
  });
};
