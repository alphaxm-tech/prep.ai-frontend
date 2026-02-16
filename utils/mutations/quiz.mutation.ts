import { useMutation } from "@tanstack/react-query";
import { quizService } from "../services/quiz.service";

export const createQuizAssessment = () => {
  return useMutation({
    mutationFn: quizService.startQuiz,
  });
};
