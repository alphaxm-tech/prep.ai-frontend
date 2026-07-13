import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionBankAdminService } from "@/server-api/services/question-bank-admin.service";
import {
  AcceptUploadJobRequest,
  CreateQuestionRequest,
  QuestionType,
} from "@/server-api/api/types/question-bank-admin.types";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateQuestionRequest) =>
      questionBankAdminService.createQuestion(req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question-bank-admin", "questions"],
      });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      questionType,
      targetAssessmentId,
    }: {
      file: File;
      questionType: QuestionType;
      targetAssessmentId?: number;
    }) =>
      questionBankAdminService.uploadDocument(file, questionType, targetAssessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question-bank-admin", "uploads"],
      });
    },
  });
};

export const useAcceptUploadJob = (jobId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: AcceptUploadJobRequest) =>
      questionBankAdminService.acceptUploadJob(jobId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question-bank-admin", "uploads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["question-bank-admin", "upload", jobId],
      });
      queryClient.invalidateQueries({
        queryKey: ["question-bank-admin", "questions"],
      });
    },
  });
};
