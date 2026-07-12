import { useMutation } from "@tanstack/react-query";
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
