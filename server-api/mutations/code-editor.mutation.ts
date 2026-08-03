import { useMutation, useQueryClient } from "@tanstack/react-query";
import { codeEditorService } from "../services/code-editor.service";
import { RunCodePayload, SubmitCodePayload } from "../api/types/code-editor.types";

export const useRunCode = () => {
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: number; payload: RunCodePayload }) =>
      codeEditorService.runCode(questionId, payload),
  });
};

export const useSubmitCode = () => {
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: number; payload: SubmitCodePayload }) =>
      codeEditorService.submitCode(questionId, payload),
  });
};

// Mirrors quiz.mutation.ts's useSubmitAttempt/useAbandonAttempt: the main
// page's not-taken/taken lists and stats cards are cached (TanStack Query
// default staleTime), so without invalidating here they'd keep showing this
// test as untaken with stale stats after the student navigates back from
// the results page — this is what makes that update immediate instead of
// needing a manual refresh.
export const useFinalizeCodeAssessment = (assessmentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => codeEditorService.finalizeAssessment(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["code-editor", "stats"] });
      queryClient.invalidateQueries({
        queryKey: ["code-editor", "assessment-result", assessmentId],
      });
    },
  });
};

export const useAbandonCodeAssessment = (assessmentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => codeEditorService.abandonAssessment(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["code-editor", "stats"] });
      queryClient.invalidateQueries({
        queryKey: ["code-editor", "assessment-result", assessmentId],
      });
    },
  });
};
