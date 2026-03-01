import { useQuery } from "@tanstack/react-query";
import { GetAttemptQuestion } from "../api/types/quiz.types";
import { quizService } from "../services/quiz.service";

export const useGetAttemptQuestion = (params: GetAttemptQuestion) => {
  return useQuery({
    queryKey: ["quiz", "getAttemptQuestion"],
    queryFn: () => quizService.getAttemptQuestion(params),
  });
};
