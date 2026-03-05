import { useQuery } from "@tanstack/react-query";
import {
  GetAttemptQuestion,
  GetAttemptStatusResposne,
  GetLeaderboardResponse,
} from "../api/types/quiz.types";
import { quizService } from "../services/quiz.service";

export const useGetAttemptQuestion = (params: GetAttemptQuestion) => {
  return useQuery({
    queryKey: ["quiz", "getAttemptQuestion"],
    queryFn: () => quizService.getAttemptQuestion(params),
  });
};

export const useGetAttemptStatus = (attemptId: number) => {
  return useQuery<GetAttemptStatusResposne>({
    queryKey: ["quiz", "getAttemptStatus"],
    queryFn: () => quizService.getAttemptStatus(attemptId),
  });
};

export const useGetLeaderboard = (assessmentId: number) => {
  return useQuery<GetLeaderboardResponse>({
    queryKey: ["quiz", "getLeaderboard"],
    queryFn: () => quizService.getLeaderboard(assessmentId),
  });
};

export const useGetQuizSession = (attemptId: number) => {
  return useQuery({
    queryKey: ["quiz", "getQuizSession"],
  });
};
