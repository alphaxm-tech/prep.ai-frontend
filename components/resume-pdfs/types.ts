// Canonical shape every resume PDF template consumes. This mirrors the
// field names actually used by the resume-builder form state (degree /
// start_year / end_year / name), not the on-screen HTML templates' loosely
// typed AddResumeRequest — the PDF route builds this shape explicitly from
// the form state before handing it to react-pdf.
export type PDFEducation = {
  degree: string;
  institute?: string;
  location?: string;
  start_year?: string;
  end_year?: string;
  grade?: string;
};

export type PDFWorkExperience = {
  company: string;
  role: string;
  start_year?: string;
  end_year?: string;
  description?: string;
};

export type PDFProject = {
  name: string;
  description?: string;
};

export type ResumeData = {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  objective?: string;
  portfolioLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  educations?: PDFEducation[];
  experiences?: PDFWorkExperience[];
  projects?: PDFProject[];
};

export const formatDuration = (start?: string, end?: string) => {
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
};
