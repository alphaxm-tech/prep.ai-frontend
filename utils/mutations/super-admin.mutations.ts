import { useMutation } from "@tanstack/react-query";
import { superAdminService } from "../services/super-admin.service";

export const addCollege = () => {
  return useMutation({
    mutationFn: superAdminService.addCollege,
  });
};
