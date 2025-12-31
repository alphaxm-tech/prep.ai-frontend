"use client";

import React, { useState, useMemo, useRef } from "react";
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

// type TemplateKey = "modern" | "classic" | "creative" | "minimal" | "standard";
type TemplateKey = "standard";

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
  const [resumeFormat, setResumeFormat] = useState<TemplateKey>("standard");
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const RESULT_PDF_URL = "/pdfs/Resume.pdf";

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
    // { key: "modern", title: "Modern" },
    // { key: "classic", title: "Classic" },
    // { key: "creative", title: "Creative" },
    // { key: "minimal", title: "Minimal" },
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
      // case "creative":
      //   return <CreativeResumeTemplate {...props} />;
      // case "classic":
      //   return <ProfessionalResumeTemplateVertical {...props} />;
      // case "modern":
      //   return <ModernResumeTemplate {...props} />;
      // case "minimal":
      //   return <MinimalResumeTemplate {...props} />;
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

    // NOTE: experiences and projects are intentionally NOT required,
    // so we do NOT set errors.experiences or errors.projects here.

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
      // experiences,
      // projects,
    ]
  );
  const canSaveNow = !hasAnyErrors(currentValidation);

  // ---------------------- Download logic additions (iframe print) ----------------------
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Frontend-only print -> PDF via hidden iframe.
   * This function:
   *  - clones the modal preview
   *  - inlines conservative styles
   *  - removes sticky/fixed positioning and transforms that break print
   *  - forces a pdf-root width equal to A4 width in px (794px @96dpi)
   *  - writes to a hidden iframe and triggers print()
   */
  const onDownloadPrint = async () => {
    if (!modalRef.current) return;
    setIsDownloading(true);

    try {
      // Wait for fonts to be ready to get stable layout
      if ((document as any).fonts && (document as any).fonts.ready) {
        await (document as any).fonts.ready;
      }

      const orig = modalRef.current;

      // 1) Clone node
      const cloneRoot = orig.cloneNode(true) as HTMLElement;

      // 2) Sanitize + inline computed styles. We also neutralize problematic properties:
      //    - remove position: sticky/fixed/absolute -> set static
      //    - remove transform
      //    - remove large box-shadow & extreme border-radius for print (keep layout)
      // We inline a conservative set of properties to preserve typography and spacing.
      const sanitizeRecursively = (origEl: Element, cloneEl: Element) => {
        try {
          const cs = window.getComputedStyle(origEl as Element);

          // Conservative properties to inline
          const propsToInline = [
            "display",
            "position",
            "top",
            "left",
            "right",
            "bottom",
            "width",
            "height",
            "max-width",
            "min-width",
            "padding",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "margin",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "font-size",
            "font-family",
            "font-weight",
            "line-height",
            "letter-spacing",
            "color",
            "text-align",
            "background-color",
            "border",
            "border-radius",
            "box-shadow",
            "overflow",
            "white-space",
          ];

          let inlineStyle = "";
          for (const p of propsToInline) {
            try {
              const v = (cs as any).getPropertyValue
                ? cs.getPropertyValue(p)
                : (cs as any)[p];
              if (v && v !== "initial" && v !== "none") {
                inlineStyle += `${p}: ${v}; `;
              }
            } catch {
              // ignore property read errors
            }
          }

          // If element uses sticky/fixed/absolute, force static for print layout
          const pos = cs.getPropertyValue("position");
          if (pos === "sticky" || pos === "fixed" || pos === "absolute") {
            inlineStyle +=
              "position: static !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; ";
          }

          // Remove transforms which often misplace elements in print
          inlineStyle +=
            "transform: none !important; -webkit-transform: none !important; ";

          // Remove background-images / gradients for print fallback but preserve background-color
          inlineStyle += "background-image: none !important; ";

          // Remove filter/backdrop-filter and mask images
          inlineStyle +=
            "filter: none !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; mask-image: none !important;";

          // Remove heavy shadows and large radii that cause overflow artifacts on print
          inlineStyle +=
            "box-shadow: none !important; border-radius: 6px !important;";

          // Bind inline style
          (cloneEl as HTMLElement).setAttribute("style", inlineStyle);
        } catch {
          // ignore
        }

        // Recurse children pairs (assume same order)
        const origChildren = Array.from(origEl.children);
        const cloneChildren = Array.from(cloneEl.children);
        for (let i = 0; i < cloneChildren.length; i++) {
          if (origChildren[i] && cloneChildren[i]) {
            sanitizeRecursively(origChildren[i], cloneChildren[i]);
          }
        }
      };

      sanitizeRecursively(orig, cloneRoot);

      // 3) Build print CSS tuned to A4 and to fit content width to A4 width (794px @96dpi).
      //    We center the content and allow page breaks.
      const printCss = `
        @page { size: A4; margin: 12mm; }
        html, body { height: 100%; margin: 0; padding: 0; background: #ffffff; -webkit-print-color-adjust: exact; }
        .pdf-root { width: 794px; margin: 0 auto; box-sizing: border-box; background: #ffffff; }
        /* Remove shadows and strong rounded corners in print to avoid artifacts */
        .pdf-root * { box-shadow: none !important; }
        /* Helpful page-break helpers — you can mark large cards with 'avoid-break' */
        .avoid-break { page-break-inside: avoid; -webkit-region-break-inside: avoid; }
        .page-break { display: block; page-break-after: always; }
        /* Ensure fonts render crisply */
        body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
      `;

      // 4) Wrap clone in pdf-root container
      const wrappedHtml = `<div class="pdf-root">${cloneRoot.outerHTML}</div>`;

      // 5) Create hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.style.overflow = "hidden";
      iframe.style.opacity = "0";
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);

      // 6) Write content into iframe
      const filenameSafe = (assembledData.fullName || "resume")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "");
      const doc =
        iframe.contentDocument ||
        (iframe.contentWindow && iframe.contentWindow.document);
      if (!doc) throw new Error("Cannot access iframe document");

      doc.open();
      doc.write(`<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=794" />
            <title>${filenameSafe}</title>
            <style>${printCss}</style>
          </head>
          <body>
            ${wrappedHtml}
          </body>
        </html>`);
      doc.close();

      // 7) Wait for fonts/images inside iframe to be ready
      const waitForIframeReady = () =>
        new Promise<void>((resolve) => {
          const win = iframe.contentWindow!;
          if (!win) return resolve();
          const tryResolve = () => setTimeout(resolve, 200); // small delay to settle
          if (
            (win as any).document &&
            (win as any).document.fonts &&
            (win as any).document.fonts.ready
          ) {
            (win as any).document.fonts.ready
              .then(tryResolve)
              .catch(tryResolve);
          } else {
            setTimeout(tryResolve, 200);
          }
        });

      await waitForIframeReady();

      // 8) Trigger print on iframe
      const printWin = iframe.contentWindow!;
      printWin.focus();
      printWin.print();

      // 9) Cleanup iframe after a delay (give print dialog time to open)
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {
          /* ignore */
        }
      }, 2000);
    } catch (err) {
      console.error("Print / front-end PDF generation failed:", err);
      alert(
        "Failed to print resume. Try allowing print/popups in your browser or use the server-side PDF route for perfect fidelity."
      );
    } finally {
      setIsDownloading(false);
    }
  };
  // ---------------------------------------------------------------------

  // const handleDownloadPdf = () => {
  //   const link = document.createElement("a");
  //   link.href = RESULT_PDF_URL;
  //   link.download = "Interview-Results.pdf"; // filename user sees
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownloadPdf = async () => {
    const res = await fetch("/api/resume/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assembledData),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${assembledData.fullName || "resume"}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
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
                  // validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion isOpenProp={false} title="Project Details">
                <ProjectsForm
                  projects={projects}
                  setProjects={setProjects}
                  // validationErrors={validationErrors}
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
                        // onClick={onDownloadPrint}
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        aria-label="Download resume"
                        title="Download resume"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-sm font-semibold shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          isDownloading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                            Preparing PDF...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                              />
                            </svg>
                            Download
                          </>
                        )}
                      </button>

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

                  {/* IMPORTANT: wrap the actual preview with modalRef for capture */}
                  <div className="p-6">
                    <div ref={modalRef}>{renderSelectedTemplate(false)}</div>
                  </div>
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
