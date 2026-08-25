export interface ResumeFormat {
  format_id: number;
  format_key: string;
  title: string;
  description: string;
}

export interface GetResumeFormatsResponse {
  resumeFormats: ResumeFormat[];
}

export interface GetSkillsMasterResponse {
  skills: SkillsMaster[];
  softskills: SoftSkillsMaster[];
}

export type SkillStatus = "pending" | "approved" | "rejected";

export type SkillsMaster = {
  SkillID: number;
  SkillKey: string;
  DisplayName: string;
  Category: string;
  Status: SkillStatus;
};

export interface RequestSkillResponse {
  skill: SkillsMaster;
}

export interface PendingSkillsResponse {
  skills: SkillsMaster[];
}

type SoftSkillsMaster = {
  SoftSkillID: number;
  SkillKey: string;
  DisplayName: string;
  Category: string;
};

export type AddResumeRequest = {
  resume_details: ResumeDetails;
  user: UserTemp;
  skills?: number[];
  softskills?: string[];
  experience?: WorkExperience[];
  projects?: Project[];
  education?: Education[];
};

export type ResumeDetails = {
  format_id: number; // int8 in Go → number in TS
  title: string;
  is_default: boolean;
};

export type User = {
  location: string;
  phone?: string;
  objective: string;
  portfolio_website_url?: string;
  linkedin_url?: string;
  github_url?: string;
};

export type WorkExperience = {
  company: string;
  role: string;
  start_year: string;
  end_year: string;
  description: string;
};

export type Project = {
  name: string;
  description: string;
  // tech?: string[];
};

export type Education = {
  degree: string;
  institute?: string;
  location: string;
  start_year: string;
  end_year: string;
  grade?: string;
};

export type resumes = {
  ResumeID: string;
  FormatID: number;
  UserID: number;
  Title: string;
  IsPublic: boolean;
  IsDefault: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export type UsersResumeResponse = {
  resumes: resumes[];
};

// Shape returned by GET /resume/get-complete-resume-by-id/:resume_id
export type CompleteResumeUser = {
  location?: string;
  phone?: string;
  objective?: string;
  portfolio_link?: string;
  github_link?: string;
  linkedin_link?: string;
};

export type CompleteResumeSkill = {
  skill_id: number;
  skill_key: string;
  display_name: string;
  category?: string;
  proficiency?: string;
  summary_text?: string;
};

export type CompleteResumeEducation = {
  education_id: number;
  degree: string;
  institute?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  sort_order: number;
};

export type CompleteResumeWorkExperience = {
  work_id: number;
  company: string;
  role: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  sort_order: number;
};

export type CompleteResumeProject = {
  project_id: number;
  title: string;
  description?: string;
  project_url?: string;
  repo_url?: string;
  sort_order: number;
};

export type ResumeResponse = {
  resume_id: string;
  format_id: number;
  title?: string;
  is_default: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: CompleteResumeUser | null;
  skills: CompleteResumeSkill[];
  soft_skills: string[];
  education: CompleteResumeEducation[];
  work_experience: CompleteResumeWorkExperience[];
  projects: CompleteResumeProject[];
};

type UserTemp = {
  full_name?: string;
  email?: string;
  location: string;
  phone?: string;
  objective: string;
  portfolio_website_url?: string;
  linkedin_url?: string;
  github_url?: string;
};

export interface Resume {
  ResumeID: string; // UUID
  FormatID: number;
  UserID: number;
  Title: string;
  IsPublic: boolean;
  IsDefault: boolean;
  CreatedAt: string; // ISO timestamp
  UpdatedAt: string; // ISO timestamp
}
