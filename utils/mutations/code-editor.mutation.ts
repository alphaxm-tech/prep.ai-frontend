import { useMutation } from "@tanstack/react-query";
import { codeEditorService } from "../services/code-editor.service";

export const useSubmitCode = () => {
  return useMutation({
    mutationFn: codeEditorService.submitCode,
  });
};
