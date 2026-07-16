import { useQuery } from "@tanstack/react-query";
import {
  CollegeLeaderboardEntry,
  GetAttemptQuestion,
  GetAttemptStatusResposne,
  GetLeaderboardResponse,
  QuizResultsResponse,
  QuizSessionResponse,
  QuizStatsResponse,
} from "../api/types/quiz.types";
import { quizService } from "../services/quiz.service";

export const useGetAttemptQuestion = (params: GetAttemptQuestion) => {
  return useQuery({
    queryKey: ["quiz", "getAttemptQuestion", params.AttemptID, params.Index],
    queryFn: () => quizService.getAttemptQuestion(params),
    enabled: !!params.AttemptID && !!params.Index && params.Index > 0,
  });
};

export const useGetAttemptStatus = (attemptId: number) => {
  return useQuery<GetAttemptStatusResposne>({
    queryKey: ["quiz", "getAttemptStatus", attemptId],
    queryFn: () => quizService.getAttemptStatus(attemptId),
    enabled: !!attemptId,
  });
};

export const useGetLeaderboard = (assessmentId: number) => {
  return useQuery<GetLeaderboardResponse>({
    queryKey: ["quiz", "getLeaderboard", assessmentId],
    queryFn: () => quizService.getLeaderboard(assessmentId),
    enabled: !!assessmentId,
  });
};

export const useGetQuizSession = (attemptId: number) => {
  return useQuery<QuizSessionResponse>({
    queryKey: ["quiz", "getQuizSession", attemptId],
    queryFn: () => quizService.getQuizSession(attemptId),
    enabled: !!attemptId,
  });
};

export const useGetQuizStats = () => {
  return useQuery<QuizStatsResponse>({
    queryKey: ["quiz", "getQuizStats"],
    queryFn: () => quizService.getQuizStats(),
  });
};

export const useGetQuizResults = (assessmentId: number | null) => {
  return useQuery<QuizResultsResponse>({
    queryKey: ["quiz", "getQuizResults", assessmentId],
    queryFn: () => quizService.getQuizResults(assessmentId as number),
    enabled: assessmentId !== null && assessmentId > 0,
  });
};

export const useGetCollegeLeaderboard = () => {
  return useQuery<CollegeLeaderboardEntry[]>({
    queryKey: ["quiz", "getCollegeLeaderboard"],
    queryFn: () => quizService.getCollegeLeaderboard(),
  });
};
