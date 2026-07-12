import { useQuery } from "@tanstack/react-query";
import { aiInterviewService } from "../services/ai-interview.service";

export const useGetInterviewQuestion = (attemptId: number, index: number) => {
  return useQuery({
    queryKey: ["ai-interview", "getQuestion", attemptId, index],
    queryFn: () => aiInterviewService.getQuestion(attemptId, index),
    enabled: !!attemptId && !!index && index > 0,
  });
};

export const useGetInterviewSession = (attemptId: number) => {
  return useQuery({
    queryKey: ["ai-interview", "getSession", attemptId],
    queryFn: () => aiInterviewService.getSession(attemptId),
    enabled: !!attemptId,
  });
};

export const useGetInterviewStats = () => {
  return useQuery({
    queryKey: ["ai-interview", "getInterviewStats"],
    queryFn: () => aiInterviewService.getInterviewStats(),
  });
};
