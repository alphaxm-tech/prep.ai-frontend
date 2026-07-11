import { Tag as SkillTag } from "@/components/resume/SkillsPanel";
import {
  Education,
  Project,
  WorkExperience,
} from "@/server-api/api/types/resume.types";
import { ResumeFormats } from "@/enums/resume-enums";

// Everything the resume builder form needs to fully restore an in-progress
// (not-yet-saved) resume after a refresh or accidental tab close.
export interface ResumeDraft {
  resumeTitle: string;
  phone: string;
  location: string;
  summary: string;
  portfolioLink: string;
  githubLink: string;
  linkedinLink: string;
  isDefault: boolean;
  technicalSkills: SkillTag[];
  softSkills: SkillTag[];
  educations: Education[];
  experiences: WorkExperience[];
  projects: Project[];
  resumeFormat: ResumeFormats;
  savedAt: string;
}

const DRAFT_KEY_PREFIX = "prepai:resume-builder-draft";

// Scoped per-user (by email) so a shared browser doesn't leak one
// student's unsaved resume draft into another student's session.
const getDraftKey = (email?: string | null) =>
  `${DRAFT_KEY_PREFIX}:${email ? email.toLowerCase() : "guest"}`;

export function loadResumeDraft(
  email?: string | null,
): Partial<ResumeDraft> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getDraftKey(email));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveResumeDraft(
  email: string | null | undefined,
  draft: Omit<ResumeDraft, "savedAt">,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getDraftKey(email),
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
    );
  } catch {
    // localStorage can throw in private-browsing mode or when the quota
    // is exceeded; persistence is a nice-to-have, so fail silently.
  }
}

export function clearResumeDraft(email?: string | null) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getDraftKey(email));
  } catch {
    // ignore
  }
}
