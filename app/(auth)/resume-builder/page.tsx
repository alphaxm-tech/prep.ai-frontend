// app/(your-route)/resume-builder/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
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

import CreativeResumeTemplate from "@/components/resume-formats/CreativeResume";
import ProfessionalResumeTemplateVertical from "@/components/resume-formats/ProfessionalResume";
import ModernResumeTemplate from "@/components/resume-formats/ModernResume";
import MinimalResumeTemplate from "@/components/resume-formats/MinimalResume";
import StandardResumeTemplate from "@/components/resume-formats/StandardResume";

type TemplateKey = "modern" | "classic" | "creative" | "minimal" | "standard";

/**
 * Dummy defaults used to populate the inline preview when user hasn't entered data.
 */
const DEFAULT_SAMPLE = {
  fullName: "Sanket N.",
  title: "Fullstack Blockchain Developer",
  email: "sanket@example.com",
  phone: "9130859725",
  location: "New York, USA",
  objective:
    "Fullstack blockchain developer focused on building reliable systems. Experience with TypeScript, Go, and Solidity. Passionate about developer experience and high-quality production software.",
  portfolioLink: "https://yourportfolio.com",
  githubLink: "https://github.com/username",
  linkedinLink: "https://linkedin.com/in/username",
  technicalSkills: ["React", "TypeScript", "Go", "Solidity"],
  softSkills: ["Communication", "Ownership", "Curiosity"],
  educations: [
    {
      level: "B.Tech",
      institute: "IIT Bombay",
      location: "Mumbai",
      duration: "2018–2022",
      grade: "8.5",
    },
  ],
  experiences: [
    {
      company: "Acme Corp",
      role: "Fullstack Developer",
      duration: "2023 - Present",
      description:
        "Built high-throughput services and front-end features. Improved observability and reduced incident MTTR.",
      logo: "",
    },
  ],
  projects: [
    {
      title: "Resume Builder",
      description:
        "A resume builder with live preview and clean printable templates. Focused on UX and developer productivity.",
    },
  ],
};

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

          <ResumeDropdown
            resumes={resumes}
            onSelect={(r) => console.log("select", r)}
          />
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
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Education">
                <EducationForm
                  educations={educations}
                  setEducations={setEducations}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Work Experience">
                <WorkExperienceForm
                  experiences={experiences}
                  setExperiences={setExperiences}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Project Details">
                <ProjectsForm projects={projects} setProjects={setProjects} />
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
                      onClick={() => setShowPreviewModal(true)}
                      className="px-3 py-2 rounded-lg bg-yellow-400 text-white font-bold text-sm"
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
                        onClick={() => {
                          /* call your save handler here */
                        }}
                        aria-label="Save resume"
                        title="Save resume"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-400 hover:bg-yellow-450 focus:bg-yellow-500 text-white text-sm font-semibold shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      >
                        {/* optional icon (SVG) */}
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
    </div>
  );
}
