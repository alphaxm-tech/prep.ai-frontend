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
  return useMutation({
    mutationFn: () => quizService.submitAttempt(attemptId),
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
