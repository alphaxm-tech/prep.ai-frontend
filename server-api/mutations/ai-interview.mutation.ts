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
  return useMutation({
    mutationFn: () => aiInterviewService.finishInterview(attemptId),
  });
};
