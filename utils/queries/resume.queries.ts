import { useQuery } from "@tanstack/react-query";
import {
  GetResumeFormatsResponse,
  GetSkillsMasterResponse,
} from "../api/types/resume.types";
import { resumeService } from "../services/resume.service";

export const useGetResumeFormats = () => {
  return useQuery<GetResumeFormatsResponse>({
    queryKey: ["resume", "get-resume-format"],
    queryFn: resumeService.getResumeFormats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetSkillsMaster = () => {
  return useQuery<GetSkillsMasterResponse>({
    queryKey: ["resume", "get-skills-master"],
    queryFn: resumeService.getSkillsMaster,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
