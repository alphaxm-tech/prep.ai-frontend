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

// enabled only when assessmentId is set (e.g. a Review modal is open) —
// avoids firing a request per attempted-interview row on every list render.
export const useGetInterviewReview = (assessmentId: number | null) => {
  return useQuery({
    queryKey: ["ai-interview", "getReview", assessmentId],
    queryFn: () => aiInterviewService.getReview(assessmentId as number),
    enabled: !!assessmentId,
  });
};
