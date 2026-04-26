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
  });
};
