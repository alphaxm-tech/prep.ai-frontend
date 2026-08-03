import { useQuery } from "@tanstack/react-query";
import { codeEditorService } from "../services/code-editor.service";

export const useGetCodingQuestions = () => {
  return useQuery({
    queryKey: ["code-editor", "get-all-questions"],
    queryFn: () => codeEditorService.getCodingQuestions(),
  });
};

export const useGetCodingQuestionDetails = (questionId: number) => {
  return useQuery({
    queryKey: ["code-editor", "get-question-detail", questionId],
    queryFn: () => codeEditorService.getCodingQuestionDetails(questionId),
    enabled: questionId > 0,
  });
};

export const useGetAssessmentResult = (assessmentId: number) => {
  return useQuery({
    queryKey: ["code-editor", "assessment-result", assessmentId],
    queryFn: () => codeEditorService.getAssessmentResult(assessmentId),
    enabled: assessmentId > 0,
  });
};

// Backs the stats cards on the Code Editor main page. Invalidated (see
// mutations/code-editor.mutation.ts's useFinalizeCodeAssessment) after a
// test is submitted so the cards update immediately without a manual
// refresh.
export const useGetCodeEditorStats = () => {
  return useQuery({
    queryKey: ["code-editor", "stats"],
    queryFn: () => codeEditorService.getStats(),
  });
};
