import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "../services/quiz.service";
import {
  MarkForReviewRequest,
  SaveAnswerRequest,
} from "../api/types/quiz.types";

export const createQuizAssessment = () => {
  return useMutation({
    mutationFn: quizService.startQuiz,
  });
};

export const useSaveAttemptAnswer = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveAnswerRequest) =>
      quizService.saveAttemptAnswer(attemptId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", "getQuizSession", attemptId],
      });
    },
  });
};

export const useSubmitAttempt = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => quizService.submitAttempt(attemptId),
    onSuccess: () => {
      // The quiz hub page's not-taken/taken lists and best/avg stats are
      // cached with a 5min staleTime and no refetch-on-focus, so without
      // this they'd keep showing this quiz as untaken with stale stats
      // after the user navigates back from the results screen.
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["quiz", "getQuizStats"] });
      queryClient.invalidateQueries({
        queryKey: ["quiz", "getQuizSession", attemptId],
      });
    },
  });
};

export const useMarkForReview = (attemptId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: number;
      payload: MarkForReviewRequest;
    }) => quizService.markForReview(attemptId, questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", "getQuizSession", attemptId],
      });
    },
  });
};
