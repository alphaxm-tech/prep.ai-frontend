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
  user: User;
  skills?: string[];
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
  duration: string;
  description?: string;
};

export type Project = {
  title: string;
  description?: string;
  // tech?: string[];
};

export type Education = {
  degree: string;
  institute?: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
};
