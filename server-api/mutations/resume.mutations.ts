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

// "Can't find X? Add it" — creates (or links to) a pending skill by name.
// The caller handles the optimistic tag; no dropdown invalidation is needed
// since pending skills are excluded from the shared dropdown anyway.
export const useRequestSkill = () => {
  return useMutation({
    mutationFn: resumeService.requestSkill,
  });
};

export const useReviewSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeService.reviewSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resume", "pending-skills"],
      });
      // Approved skills enter the shared dropdown.
      queryClient.invalidateQueries({
        queryKey: ["resume", "get-skills-master"],
      });
    },
  });
};
