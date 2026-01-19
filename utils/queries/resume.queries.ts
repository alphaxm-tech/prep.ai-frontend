import { useQuery } from "@tanstack/react-query";
import {
  GetResumeFormatsResponse,
  GetSkillsMasterResponse,
  ResumeResponse,
  UsersResumeResponse,
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

export const useGetUsersAllResumes = () => {
  return useQuery<UsersResumeResponse>({
    queryKey: ["resume", "get-users-all-resumes"],
    queryFn: resumeService.getUsersAllResumes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetCompleteResumeByID = (resumeId: string) => {
  return useQuery<ResumeResponse>({
    queryKey: ["resume", "get-complete-resume-by-id", resumeId],
    queryFn: () => resumeService.getCompleteResumeByID(resumeId),
    enabled: !!resumeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
