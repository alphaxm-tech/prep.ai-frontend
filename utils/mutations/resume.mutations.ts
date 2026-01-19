import { useMutation } from "@tanstack/react-query";
import { resumeService } from "../services/resume.service";

export const useSaveResume = () => {
  return useMutation({
    mutationFn: resumeService.saveResume,
  });
};
