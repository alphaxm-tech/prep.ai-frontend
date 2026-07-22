import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiInterviewService } from "../services/ai-interview.service";

export const useStartInterview = () => {
  return useMutation({
    mutationFn: (assessmentId: number) =>
      aiInterviewService.startInterview(assessmentId),
  });
};

export const useSubmitInterviewAnswer = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      audio,
      durationSec,
    }: {
      questionId: number;
      audio: Blob;
      durationSec: number;
    }) =>
      aiInterviewService.submitAnswer(attemptId, questionId, audio, durationSec),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ai-interview", "getSession", attemptId],
      });
    },
  });
};

export const useFinishInterview = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aiInterviewService.finishInterview(attemptId),
    onSuccess: () => {
      // The hub page's assessment lists (not-taken/taken) and performance
      // stats are cached with a 5min staleTime and no refetch-on-focus, so
      // without this they'd keep showing this interview as "not taken" and
      // stale stats after the user navigates back from the results screen.
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-interview", "getInterviewStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ai-interview", "getSession", attemptId],
      });
    },
  });
};

export const useAbandonInterview = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => aiInterviewService.abandonInterview(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-interview", "getInterviewStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ai-interview", "getSession", attemptId],
      });
    },
  });
};
