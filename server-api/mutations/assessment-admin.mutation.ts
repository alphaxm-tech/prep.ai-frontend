import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentAdminService } from "@/server-api/services/assessment-admin.service";
import {
  AttachQuestionsToAssessmentRequest,
  CreateAssessmentAdminRequest,
  UpdateAssessmentStatusRequest,
} from "@/server-api/api/types/assessment-admin.types";

const invalidateAdminList = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["assessment-admin", "list"] });
};

export const useCreateAssessmentAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateAssessmentAdminRequest) =>
      assessmentAdminService.createAssessment(req),
    onSuccess: () => invalidateAdminList(queryClient),
  });
};

export const useAttachQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: AttachQuestionsToAssessmentRequest) =>
      assessmentAdminService.attachQuestions(req),
    onSuccess: () => invalidateAdminList(queryClient),
  });
};

export const useUpdateAssessmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assessmentId,
      req,
    }: {
      assessmentId: number;
      req: UpdateAssessmentStatusRequest;
    }) => assessmentAdminService.updateStatus(assessmentId, req),
    onSuccess: () => invalidateAdminList(queryClient),
  });
};

export const useDeleteAssessmentAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: number) =>
      assessmentAdminService.deleteAssessment(assessmentId),
    onSuccess: () => invalidateAdminList(queryClient),
  });
};
