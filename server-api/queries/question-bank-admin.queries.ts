import { useQuery } from "@tanstack/react-query";
import { questionBankAdminService } from "@/server-api/services/question-bank-admin.service";
import { GetQuestionsParams } from "@/server-api/api/types/question-bank-admin.types";

export const useListQuestions = (params: GetQuestionsParams) => {
  return useQuery({
    queryKey: ["question-bank-admin", "questions", params],
    queryFn: () => questionBankAdminService.listQuestions(params),
  });
};

export const useListTags = () => {
  return useQuery({
    queryKey: ["question-bank-admin", "tags"],
    queryFn: questionBankAdminService.listTags,
  });
};

export const useListUploadJobs = () => {
  return useQuery({
    queryKey: ["question-bank-admin", "uploads"],
    queryFn: questionBankAdminService.listUploadJobs,
    // Extraction runs in the background — keep the Recent Uploads list fresh
    // without the user having to manually refresh.
    refetchInterval: 4000,
  });
};

export const useGetUploadJob = (jobId: number | null) => {
  return useQuery({
    queryKey: ["question-bank-admin", "upload", jobId],
    queryFn: () => questionBankAdminService.getUploadJob(jobId as number),
    enabled: !!jobId,
    // Poll while the job is still processing; stop once it's completed/failed.
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 2000 : false,
  });
};
