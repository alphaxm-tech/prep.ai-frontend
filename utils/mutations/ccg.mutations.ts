import { useMutation } from "@tanstack/react-query";
import { ccgService } from "../services/ccg.service";

export const addCollege = () => {
  return useMutation({
    mutationFn: ccgService.addCollege,
  });
};
