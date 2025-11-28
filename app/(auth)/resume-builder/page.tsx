"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@/utils/services/resume.service";
import {
  VerticalAccordion,
  SkillsPanel,
  Tag as SkillTag,
} from "@/components/resume/SkillsPanel";
import EducationForm, { Education } from "@/components/resume/EducationForm";
import ResumeDropdown, { ResumeItem } from "@/components/ResumeDropdown";
import BasicDetails from "@/components/resume/BasicDetails";
import WorkExperienceForm, {
  WorkExperience,
} from "@/components/resume/WorkExperienceForm";
import ProjectsForm, { Project } from "@/components/resume/ProjectForm";

// resume templates (assumed paths - adjust if required)
import CreativeResumeTemplate from "../../../components/Resume-formats/CreativeResume";
import ProfessionalResumeTemplateVertical from "../../../components/Resume-formats/ProfessionalResume";
import ModernResumeTemplate from "../../../components/Resume-formats/ModernResume";
import MinimalResumeTemplate from "../../../components/Resume-formats/MinimalResume";
import StandardResumeTemplate from "../../../components/Resume-formats/StandardResume";

type TemplateKey = "modern" | "classic" | "creative" | "minimal" | "standard";

/**
 * Dummy defaults used to populate the inline preview when user hasn't entered data.
 */
const DEFAULT_SAMPLE = {
  fullName: "Your Full Name",
  title: "Your Job Title (e.g., Fullstack Blockchain Developer)",
  email: "your.email@example.com",
  phone: "0000000000",
  location: "Your City, Country",
  objective:
    "Write a short 2–3 line summary about your experience, strengths, and the type of work you're looking for.",
  portfolioLink: "https://your-portfolio-link.com",
  githubLink: "https://github.com/your-username",
  linkedinLink: "https://linkedin.com/in/your-profile",

  technicalSkills: [
    "Skill 1 (e.g., React)",
    "Skill 2 (e.g., TypeScript)",
    "Skill 3 (e.g., Solidity)",
  ],

  softSkills: [
    "Soft Skill 1 (e.g., Communication)",
    "Soft Skill 2 (e.g., Ownership)",
    "Soft Skill 3 (e.g., Curiosity)",
  ],

  educations: [
    {
      level: "Degree (e.g., B.Tech)",
      institute: "Your College Name",
      location: "City",
      duration: "Start–End (e.g., 2019–2023)",
      grade: "CGPA/Percentage (e.g., 8.0)",
    },
  ],

  experiences: [
    {
      company: "Company Name",
      role: "Your Role (e.g., Fullstack Developer)",
      duration: "2023 – Present",
      description:
        "Describe your impact. Example: Built features, improved performance, collaborated across teams, etc.",
      logo: "",
    },
  ],

  projects: [
    {
      title: "Project Title",
      description:
        "Describe what the project does, why you built it, and what tech you used.",
    },
  ],
};

const MAX_RESUMES = 5;

export default function ResumeBuilderPage() {
  // --- MAIN LIFTED STATE (single source of truth for basic details) ---
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [portfolioLink, setPortfolioLink] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [linkedinLink, setLinkedinLink] = useState<string>("");

  // Lists and arrays lifted
  const [technicalSkills, setTechnicalSkills] = useState<SkillTag[]>([]);
  const [softSkills, setSoftSkills] = useState<SkillTag[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // other page state
  const [resumeFormat, setResumeFormat] = useState<TemplateKey>("creative");
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const { data: apiData } = useQuery({
    queryKey: ["resume", "format"],
    queryFn: async () => {
      try {
        return await resumeService.getResumeFormats();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const localFormats: { key: TemplateKey; title: string }[] = [
    { key: "modern", title: "Modern" },
    { key: "classic", title: "Classic" },
    { key: "creative", title: "Creative" },
    { key: "minimal", title: "Minimal" },
    { key: "standard", title: "Standard" },
  ];

  // demo resumes list
  const [resumes, setResumes] = useState<ResumeItem[]>([
    {
      id: "r1",
      title: "Software Engineer Resume",
      createdAt: new Date().toISOString(),
    },
    {
      id: "r2",
      title: "Blockchain Developer Resume",
      createdAt: new Date().toISOString(),
    },
  ]);

  // quota derived values
  const usedResumes = resumes.length;
  const remainingResumes = Math.max(0, MAX_RESUMES - usedResumes);
  const canCreateMore = usedResumes < MAX_RESUMES;

  // small state for quota error display
  const [quotaError, setQuotaError] = useState<string | null>(null);

  // Validation state
  // keys represent logical sections/fields; true => invalid (missing)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});

  // assemble live data for templates (actual user-entered values)
  const assembledData = useMemo(
    () => ({
      fullName,
      title: undefined as string | undefined,
      email,
      phone,
      location,
      objective: summary,
      portfolioLink,
      githubLink,
      linkedinLink,
      technicalSkills: technicalSkills.map((s) => s.text),
      softSkills: softSkills.map((s) => s.text),
      educations,
      experiences,
      projects,
    }),
    [
      fullName,
      email,
      phone,
      location,
      summary,
      portfolioLink,
      githubLink,
      linkedinLink,
      technicalSkills,
      softSkills,
      educations,
      experiences,
      projects,
    ]
  );

  // Build data with defaults for inline preview
  const assembledDataWithDefaults = useMemo(() => {
    return {
      fullName:
        assembledData.fullName && assembledData.fullName.trim()
          ? assembledData.fullName
          : DEFAULT_SAMPLE.fullName,
      title: DEFAULT_SAMPLE.title,
      email:
        assembledData.email && assembledData.email.trim()
          ? assembledData.email
          : DEFAULT_SAMPLE.email,
      phone:
        assembledData.phone && assembledData.phone.trim()
          ? assembledData.phone
          : DEFAULT_SAMPLE.phone,
      location:
        assembledData.location && assembledData.location.trim()
          ? assembledData.location
          : DEFAULT_SAMPLE.location,
      objective:
        assembledData.objective && assembledData.objective.trim()
          ? assembledData.objective
          : DEFAULT_SAMPLE.objective,
      portfolioLink:
        assembledData.portfolioLink && assembledData.portfolioLink.trim()
          ? assembledData.portfolioLink
          : DEFAULT_SAMPLE.portfolioLink,
      githubLink:
        assembledData.githubLink && assembledData.githubLink.trim()
          ? assembledData.githubLink
          : DEFAULT_SAMPLE.githubLink,
      linkedinLink:
        assembledData.linkedinLink && assembledData.linkedinLink.trim()
          ? assembledData.linkedinLink
          : DEFAULT_SAMPLE.linkedinLink,
      technicalSkills:
        assembledData.technicalSkills && assembledData.technicalSkills.length
          ? assembledData.technicalSkills
          : DEFAULT_SAMPLE.technicalSkills,
      softSkills:
        assembledData.softSkills && assembledData.softSkills.length
          ? assembledData.softSkills
          : DEFAULT_SAMPLE.softSkills,
      educations:
        assembledData.educations && assembledData.educations.length
          ? assembledData.educations
          : DEFAULT_SAMPLE.educations,
      experiences:
        assembledData.experiences && assembledData.experiences.length
          ? assembledData.experiences
          : DEFAULT_SAMPLE.experiences,
      projects:
        assembledData.projects && assembledData.projects.length
          ? assembledData.projects
          : DEFAULT_SAMPLE.projects,
    };
  }, [assembledData]);

  const renderSelectedTemplate = (showPlaceholders = true) => {
    const data = showPlaceholders ? assembledDataWithDefaults : assembledData;
    const props = { data, showPlaceholders };

    switch (resumeFormat) {
      case "creative":
        return <CreativeResumeTemplate {...props} />;
      case "classic":
        return <ProfessionalResumeTemplateVertical {...props} />;
      case "modern":
        return <ModernResumeTemplate {...props} />;
      case "minimal":
        return <MinimalResumeTemplate {...props} />;
      case "standard":
      default:
        return <StandardResumeTemplate {...props} />;
    }
  };

  // Validation rules (you can adjust which fields are required)
  const validateAll = () => {
    const errors: Record<string, boolean> = {};

    // Required simple fields
    errors.fullName = !(fullName && fullName.trim().length > 0);
    errors.email = !(email && email.trim().length > 0);
    errors.phone = !(phone && phone.trim().length > 0);
    errors.location = !(location && location.trim().length > 0);
    errors.summary = !(summary && summary.trim().length > 0);

    // Collections: require at least one item
    errors.technicalSkills = !(technicalSkills && technicalSkills.length > 0);
    errors.educations = !(educations && educations.length > 0);
    errors.experiences = !(experiences && experiences.length > 0);
    errors.projects = !(projects && projects.length > 0);

    return errors;
  };

  const hasAnyErrors = (errors: Record<string, boolean>) =>
    Object.values(errors).some((v) => v === true);

  // Called when user clicks the top-level "Save Resume" button
  const handleSaveClick = () => {
    // reset quota error each time user attempts save
    setQuotaError(null);

    // check quota first
    if (!canCreateMore) {
      setQuotaError(
        `Resume limit reached (${usedResumes}/${MAX_RESUMES}). Delete an existing resume to create a new one.`
      );
      return;
    }

    const errors = validateAll();
    setValidationErrors(errors);

    if (hasAnyErrors(errors)) {
      // If invalid, DO NOT open preview modal; user must fix fields.
      // Optionally we could scroll to first invalid — omitted for brevity.
      return;
    }

    // All good: open modal for clean preview and final save
    setShowPreviewModal(true);
  };

  // Called from modal Save button (final commit)
  const handleFinalSave = async () => {
    // reset quota error
    setQuotaError(null);

    // final quota check (race-safety)
    if (!canCreateMore) {
      setQuotaError(
        `Unable to save — resume limit reached (${usedResumes}/${MAX_RESUMES}).`
      );
      return;
    }

    const errors = validateAll();
    setValidationErrors(errors);
    if (hasAnyErrors(errors)) {
      // Shouldn't happen because modal only opens when valid, but be safe
      return;
    }

    try {
      // Replace with your real save endpoint. Use resumeService.saveResume if available.
      if (typeof (resumeService as any).saveResume === "function") {
        await (resumeService as any).saveResume({
          format: resumeFormat,
          payload: assembledData,
        });
      } else {
        // fallback to fetch if service not present
        await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            format: resumeFormat,
            payload: assembledData,
          }),
        });
      }

      // Add the newly saved resume to local list (so UI shows updated counts)
      setResumes((prev) => [
        ...prev,
        {
          id: `r${Date.now()}`,
          title: assembledData.fullName
            ? `${assembledData.fullName} Resume`
            : "Untitled Resume",
          createdAt: new Date().toISOString(),
        },
      ]);

      // Optionally show success toast or update resumes list
      setShowPreviewModal(false);
    } catch (err) {
      console.error("Failed to save resume", err);
      // show error UI/toast as needed
    }
  };

  // helper to compute whether Save (final) should be disabled (real-time)
  const currentValidation = useMemo(
    () => validateAll(),
    [
      fullName,
      email,
      phone,
      location,
      summary,
      technicalSkills,
      educations,
      experiences,
      projects,
    ]
  );
  const canSaveNow = !hasAnyErrors(currentValidation);

  return (
    <div className="min-h-screen bg-white py-8">
      <main className="w-full">
        {/* Heading + Dropdown */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 max-w-[1550px] mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Smart resume builder with AI
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Live preview while you edit — placeholders shown inline, clean
              preview on modal
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ResumeDropdown
              resumes={resumes}
              onSelect={(r) => console.log("select", r)}
            />

            {/* Quota display */}
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="font-medium text-gray-800">
                  {usedResumes}/{MAX_RESUMES} resumes
                </div>
                <div className="text-xs text-gray-500">
                  ({remainingResumes} left)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 max-w-[1550px] mx-auto">
          {/* Left: forms */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="space-y-4">
              <VerticalAccordion isOpenProp={true} title="Personal details">
                <BasicDetails
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  location={location}
                  setLocation={setLocation}
                  portfolioLink={portfolioLink}
                  setPortfolioLink={setPortfolioLink}
                  githubLink={githubLink}
                  setGithubLink={setGithubLink}
                  linkedinLink={linkedinLink}
                  setLinkedinLink={setLinkedinLink}
                  summary={summary}
                  setSummary={setSummary}
                  validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Skills">
                <SkillsPanel
                  skills={technicalSkills}
                  setSkills={
                    setTechnicalSkills as React.Dispatch<
                      React.SetStateAction<SkillTag[]>
                    >
                  }
                  softSkills={softSkills}
                  setSoftSkills={
                    setSoftSkills as React.Dispatch<
                      React.SetStateAction<SkillTag[]>
                    >
                  }
                  validation={{
                    skillsMissing: !!validationErrors.technicalSkills,
                  }}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Education">
                <EducationForm
                  educations={educations}
                  setEducations={setEducations}
                  validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Work Experience">
                <WorkExperienceForm
                  experiences={experiences}
                  setExperiences={setExperiences}
                  validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Project Details">
                <ProjectsForm
                  projects={projects}
                  setProjects={setProjects}
                  validationErrors={validationErrors}
                />
              </VerticalAccordion>
            </div>
          </div>

          {/* Right: preview */}
          <div className="space-y-4">
            <div className="sticky top-20">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-700">
                    Template Preview
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={resumeFormat}
                      onChange={(e) =>
                        setResumeFormat(e.target.value as TemplateKey)
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                      {
                        (apiData?.resumeFormats && apiData.resumeFormats.length
                          ? apiData.resumeFormats.map((f: any) => (
                              <option key={f.format_id} value={f.format_key}>
                                {f.title}
                              </option>
                            ))
                          : localFormats.map((f) => (
                              <option key={f.key} value={f.key}>
                                {f.title}
                              </option>
                            ))) as any
                      }
                    </select>

                    <button
                      onClick={handleSaveClick}
                      className={`px-3 py-2 rounded-lg text-white font-bold text-sm ${
                        !canCreateMore || hasAnyErrors(validationErrors)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-yellow-400"
                      }`}
                      aria-disabled={
                        !canCreateMore || hasAnyErrors(validationErrors)
                      }
                      title={
                        !canCreateMore
                          ? `Resume limit reached (${usedResumes}/${MAX_RESUMES})`
                          : hasAnyErrors(validationErrors)
                          ? "Fill required fields to save"
                          : "Save Resume"
                      }
                    >
                      Save Resume
                    </button>
                  </div>
                </div>

                {/* Inline compact preview: showPlaceholders = true */}
                <div className="border border-gray-50 rounded-md overflow-hidden">
                  <div className="bg-white">{renderSelectedTemplate(true)}</div>
                </div>
              </div>
            </div>

            {/* Modal preview (clean): showPlaceholders = false */}
            {showPreviewModal && (
              <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setShowPreviewModal(false)}
                />
                <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl border border-gray-100 z-10">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="text-sm font-semibold text-gray-800">
                      Resume Preview
                    </div>

                    {/* Buttons grouped on the right */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFinalSave}
                        aria-label="Save resume"
                        title="Save resume"
                        disabled={!canSaveNow || !canCreateMore}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-sm font-semibold shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                          canSaveNow && canCreateMore
                            ? "bg-yellow-400 hover:bg-yellow-450 focus:bg-yellow-500"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save
                      </button>

                      <button
                        onClick={() => setShowPreviewModal(false)}
                        aria-label="Close preview"
                        title="Close preview"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="p-6">{renderSelectedTemplate(false)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Helpful inline validation & quota hints */}
      <div className="fixed bottom-6 right-6 space-y-2">
        {hasAnyErrors(validationErrors) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm shadow-sm">
            Please fill required fields highlighted in red before saving.
          </div>
        )}

        {quotaError && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-md text-sm shadow-sm">
            {quotaError}
          </div>
        )}

        {!quotaError && !hasAnyErrors(validationErrors) && !canCreateMore && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-md text-sm shadow-sm">
            You've reached the resume creation limit ({usedResumes}/
            {MAX_RESUMES}).
          </div>
        )}
      </div>
    </div>
  );
}
