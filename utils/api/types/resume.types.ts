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
}

type SkillsMaster = {
  SkillID: number;
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

export type ResumeResponse = {
  resume_details: ResumeDetails;
  user: UserTemp;
  skills?: number[];
  softskills?: string[];
  experience?: WorkExperience[];
  projects?: Project[];
  education?: Education[];
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
