"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import WorkInProgressBanner from "@/components/WorkInProgressBanner";
import Loader from "@/components/Loader";
import { resumeService } from "@/utils/services/resume.service";
import { SkillsPanel, Tag as SkillTag } from "@/components/resume/SkillsPanel";
import EducationForm from "@/components/resume/EducationForm";
import ResumeDropdown from "@/components/ResumeDropdown";
import BasicDetails from "@/components/resume/BasicDetails";
import WorkExperienceForm from "@/components/resume/WorkExperienceForm";
import CreativeResumeTemplate from "../../../../components/Resume-formats/CreativeResume";
import ProfessionalResumeTemplateVertical from "../../../../components/Resume-formats/ProfessionalResume";
import ModernResumeTemplate from "../../../../components/Resume-formats/ModernResume";
import MinimalResumeTemplate from "../../../../components/Resume-formats/MinimalResume";
import StandardResumeTemplate from "../../../../components/Resume-formats/StandardResume";
import {
  useGetCompleteResumeByID,
  useGetResumeFormats,
  useGetSkillsMaster,
  useGetUsersAllResumes,
} from "@/utils/queries/resume.queries";
import {
  AddResumeRequest,
  Education,
  Project,
  Resume,
  ResumeResponse,
  UsersResumeResponse,
  WorkExperience,
} from "@/utils/api/types/resume.types";
// import { Education } from "@/utils/api/types/education.types";
import { useSaveResume } from "@/utils/mutations/resume.mutations";
import ProjectsForm from "@/components/resume/ProjectForm";
import { useToast } from "@/components/toast/ToastContext";
import { VerticalAccordion } from "@/components/VerticalAccordian";
import { useUser } from "@/app/context/UserContext";
import { formatFullName } from "@/lib/format-fullname";
import { ResumeFormats, ResumeTitles } from "@/utils/enums/resume-enums";
import { DEFAULT_SAMPLE } from "@/utils/dummy-data/resume-default-data";
import { ToastStates } from "@/utils/enums/enums";
import {
  loadResumeDraft,
  saveResumeDraft,
  clearResumeDraft,
} from "@/utils/resume-draft-storage";

// type TemplateKey = "modern" | "classic" | "creative" | "minimal" | "standard";

// Backend expects RFC3339 timestamps for start_year/end_year, but the forms
// only collect a bare year (or "Present"). Convert before sending to the API.
const yearToISODate = (value?: string): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^present$/i.test(trimmed)) {
    return new Date().toISOString();
  }
  const year = Number(trimmed);
  if (Number.isInteger(year) && trimmed.length <= 4) {
    return new Date(Date.UTC(year, 0, 1)).toISOString();
  }
  return trimmed;
};

// Inverse of yearToISODate — the complete-resume-by-id endpoint returns
// full ISO timestamps for education/experience dates, but the templates
// only render a bare year (or "Present" for an open-ended end date).
const isoDateToYear = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return String(date.getUTCFullYear());
};

// Maps the raw GET /resume/get-complete-resume-by-id/:id response onto the
// AddResumeRequest shape the five resume templates already know how to
// render (same shape used while building/previewing a new resume).
// Note: `skills` here holds display names (strings) for rendering, even
// though AddResumeRequest types it as number[] for the save payload — the
// same pre-existing conflation `assembledDataWithDefaults` below relies on,
// so this is typed loosely rather than forced into AddResumeRequest.
const mapCompleteResumeToTemplateData = (resume: ResumeResponse): any => ({
  resume_details: {
    format_id: resume.format_id,
    title: resume.title ?? "",
    is_default: resume.is_default,
  },
  user: {
    location: resume.user?.location ?? "",
    phone: resume.user?.phone ?? "",
    objective: resume.user?.objective ?? "",
    portfolio_website_url: resume.user?.portfolio_link ?? "",
    github_url: resume.user?.github_link ?? "",
    linkedin_url: resume.user?.linkedin_link ?? "",
  },
  skills: (resume.skills ?? []).map(
    (skill) => skill.display_name || skill.skill_key,
  ),
  softskills: resume.soft_skills ?? [],
  education: (resume.education ?? []).map((ed) => ({
    degree: ed.degree,
    institute: ed.institute ?? "",
    location: ed.location ?? "",
    start_year: isoDateToYear(ed.start_date),
    end_year: isoDateToYear(ed.end_date) || "Present",
    grade: ed.grade ?? "",
  })),
  experience: (resume.work_experience ?? []).map((exp) => ({
    company: exp.company,
    role: exp.role,
    start_year: isoDateToYear(exp.start_date),
    end_year: isoDateToYear(exp.end_date) || "Present",
    description: exp.description ?? "",
  })),
  projects: (resume.projects ?? []).map((p) => ({
    name: p.title,
    description: p.description ?? "",
  })),
});

export default function ResumeBuilderPage() {
  // --- MAIN LIFTED STATE (single source of truth for basic details) ---
  const [resumeTitle, setResumeTitle] = useState("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [portfolioLink, setPortfolioLink] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [linkedinLink, setLinkedinLink] = useState<string>("");
  const [isDefault, setIsDefault] = useState(false);
  const [totalResumes, setTotalResumes] = useState(5);

  // Lists and arrays liftedx
  const [technicalSkills, setTechnicalSkills] = useState<SkillTag[]>([]);
  const [softSkills, setSoftSkills] = useState<SkillTag[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // other page state
  const [resumeFormat, setResumeFormat] = useState<ResumeFormats>(
    ResumeFormats.STANDARD,
  );
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const saveResumeMutation = useSaveResume();

  const RESULT_PDF_URL = "/pdfs/Resume.pdf";

  const user = useUser();

  // --- Local draft persistence (unsaved-resume data survives refresh/tab close) ---
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);

  // Restore any in-progress draft once on mount, before the profile-hydration
  // effect below runs, so typed/restored values aren't lost.
  useEffect(() => {
    const draft = loadResumeDraft(user?.user?.email);
    if (draft) {
      if (draft.resumeTitle !== undefined) setResumeTitle(draft.resumeTitle);
      if (draft.phone !== undefined) setPhone(draft.phone);
      if (draft.location !== undefined) setLocation(draft.location);
      if (draft.summary !== undefined) setSummary(draft.summary);
      if (draft.portfolioLink !== undefined)
        setPortfolioLink(draft.portfolioLink);
      if (draft.githubLink !== undefined) setGithubLink(draft.githubLink);
      if (draft.linkedinLink !== undefined) setLinkedinLink(draft.linkedinLink);
      if (draft.isDefault !== undefined) setIsDefault(draft.isDefault);
      if (draft.technicalSkills) setTechnicalSkills(draft.technicalSkills);
      if (draft.softSkills) setSoftSkills(draft.softSkills);
      if (draft.educations) setEducations(draft.educations);
      if (draft.experiences) setExperiences(draft.experiences);
      if (draft.projects) setProjects(draft.projects);
      if (draft.resumeFormat) setResumeFormat(draft.resumeFormat);
    }
    setIsDraftHydrated(true);
    // Only ever restore once, right after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let fullname = formatFullName(user?.user?.full_name);
    setFullName(fullname);
    setEmail(user?.user?.email);
    // Never clobber a value the user already typed (or that was just
    // restored from a local draft) with the profile default.
    setLocation((prev) => prev || user?.user?.location || "");
    setPhone((prev) => prev || user?.user?.phone_number || "");
    setTotalResumes(user?.services?.[0]?.service_config?.max_resumes_per_user);
  }, [user]);

  // Autosave the in-progress form into localStorage on every change. Skipped
  // until the draft-restore effect above has run, so we never overwrite a
  // saved draft with the form's blank initial state. Written synchronously
  // (no debounce) — a debounced timer can be cancelled by an unmount before
  // it fires, which loses the last edit whenever the page is refreshed
  // shortly after typing. localStorage writes for a form this size are
  // sub-millisecond, so writing on every change has no perceptible cost.
  useEffect(() => {
    if (!isDraftHydrated) return;

    saveResumeDraft(user?.user?.email, {
      resumeTitle,
      phone,
      location,
      summary,
      portfolioLink,
      githubLink,
      linkedinLink,
      isDefault,
      technicalSkills,
      softSkills,
      educations,
      experiences,
      projects,
      resumeFormat,
    });
  }, [
    isDraftHydrated,
    user?.user?.email,
    resumeTitle,
    phone,
    location,
    summary,
    portfolioLink,
    githubLink,
    linkedinLink,
    isDefault,
    technicalSkills,
    softSkills,
    educations,
    experiences,
    projects,
    resumeFormat,
  ]);

  // const rawName = getUserDetailsAllRes?.user?.full_name ?? "";
  // const fullName = formatFullName(rawName);

  // const email = getUserDetailsAllRes?.user?.email ?? "";

  // const service = getUserDetailsAllRes?.userServices?.find(
  //   (s) => s.service_id === 1,
  // );
  // console.log(service?.services_config?.max_resumes_per_student);
  // const totalResumes = service?.services_config
  //   ?.max_resumes_per_student as number;

  const { data: resumeData, isLoading: resumeFormatLoading } =
    useGetResumeFormats();
  const { data: skillsMasterData } = useGetSkillsMaster();
  const { data: usersAllResumes } = useGetUsersAllResumes();
  const usersAllResumesLength = usersAllResumes?.resumes?.length;

  const localFormats: { key: ResumeFormats; title: string }[] = [
    { key: ResumeFormats.MODERN, title: ResumeTitles.Modern },
    { key: ResumeFormats.CLASSIC, title: ResumeTitles.Classic },
    { key: ResumeFormats.CREATIVE, title: ResumeTitles.Creative },
    { key: ResumeFormats.MINIMAL, title: ResumeTitles.Minimal },
    { key: ResumeFormats.STANDARD, title: ResumeTitles.Standard },
  ];

  // demo resumes list
  const [resumes, setResumes] = useState<UsersResumeResponse[]>([]);

  // let MAX_RESUMES = 20;
  // quota derived values
  const usedResumes = resumes.length;
  const remainingResumes = Math.max(0, totalResumes - usersAllResumesLength!);
  const canCreateMore = usedResumes < totalResumes;

  // small state for quota error display
  const [quotaError, setQuotaError] = useState<string | null>(null);

  // Validation state
  // keys represent logical sections/fields; true => invalid (missing)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});

  const { showToast } = useToast();

  const selectedResumeFormat = useMemo(() => {
    if (!resumeData?.resumeFormats) return null;

    return resumeData.resumeFormats.find(
      (f: any) => f.format_key === resumeFormat,
    );
  }, [resumeData?.resumeFormats, resumeFormat]);

  const skillNames = useMemo(
    () => technicalSkills.map((skill) => skill.text),
    [technicalSkills],
  );
  const technicalSkillIds = useMemo(
    () => technicalSkills.map((s) => s.skillId),
    [technicalSkills],
  );
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showResumeViewModal, setShowResumeViewModal] = useState(false);

  const assembledData = useMemo(
    () => ({
      fullName,
      title: resumeTitle,

      email,
      phone,
      location,
      objective: summary,
      portfolioLink,
      githubLink,
      linkedinLink,

      // UI-friendly
      technicalSkills: technicalSkills.map((s) => s.text),
      softSkills: softSkills.map((s) => s.text),

      // keep UI versions (camelCase tolerated here)
      educations,
      experiences,
      projects,

      // lets the PDF route pick the matching template
      resumeFormat,
    }),
    [
      fullName,
      resumeTitle,
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
      resumeFormat,
    ],
  );

  const assembledDataWithDefaults = useMemo<any>(() => {
    return {
      resume_details: {
        format_id: selectedResumeFormat?.format_id, // REQUIRED, comes from format selection
        title: resumeTitle?.trim() || DEFAULT_SAMPLE.title,
        is_default: false,
      },

      user: {
        location: assembledData.location?.trim() || DEFAULT_SAMPLE.location,
        phone: assembledData.phone?.trim() || DEFAULT_SAMPLE.phone,
        objective: assembledData.objective?.trim() || DEFAULT_SAMPLE.objective,
        portfolio_website_url:
          assembledData.portfolioLink?.trim() || DEFAULT_SAMPLE.portfolioLink,
        github_url:
          assembledData.githubLink?.trim() || DEFAULT_SAMPLE.githubLink,
        linkedin_url:
          assembledData.linkedinLink?.trim() || DEFAULT_SAMPLE.linkedinLink,
      },

      // MUST be number[]
      skills:
        technicalSkillIds.length > 0
          ? skillNames
          : DEFAULT_SAMPLE.technicalSkills,

      softskills:
        assembledData.softSkills.length > 0
          ? assembledData.softSkills
          : DEFAULT_SAMPLE.softSkills,

      education:
        assembledData.educations.length > 0
          ? assembledData.educations.map((e: any) => ({
              degree: e.degree,
              institute: e.institute,
              location: e.location,
              start_year: e.start_year ?? e.startYear,
              end_year: e.end_year ?? e.endYear,
              grade: e.grade,
            }))
          : DEFAULT_SAMPLE.educations,

      experience:
        assembledData.experiences.length > 0
          ? assembledData.experiences.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              start_year: exp.start_year ?? exp.startYear,
              end_year: exp.end_year ?? exp.endYear,
              description: exp.description,
            }))
          : DEFAULT_SAMPLE.experiences,

      projects:
        assembledData.projects.length > 0
          ? assembledData.projects.map((p: any) => ({
              name: p.name ?? p.title,
              description: p.description,
            }))
          : DEFAULT_SAMPLE.projects,
    };
  }, [
    assembledData,
    selectedResumeFormat?.format_id,
    resumeTitle,
    technicalSkills,
  ]);

  // Flat shape (matches components/resume-pdfs/types.ts `ResumeData`) sent to
  // the PDF download route. Applies the exact same "real value or
  // DEFAULT_SAMPLE fallback" rules as assembledDataWithDefaults above, so the
  // downloaded PDF always matches what's already on screen in the Template
  // Preview / post-save Resume Preview modal — including placeholder content
  // for sections the user left empty.
  const assembledDataForPdf = useMemo<any>(() => {
    return {
      fullName: fullName ? fullName : DEFAULT_SAMPLE.fullName,
      title: resumeTitle?.trim() || DEFAULT_SAMPLE.title,
      email: email ? email : DEFAULT_SAMPLE.email,
      phone: assembledData.phone?.trim() || DEFAULT_SAMPLE.phone,
      location: assembledData.location?.trim() || DEFAULT_SAMPLE.location,
      objective: assembledData.objective?.trim() || DEFAULT_SAMPLE.objective,
      // Links have no meaningful placeholder — only include what the user
      // actually entered so templates correctly omit unset links instead of
      // rendering sample URLs in the real, downloaded PDF.
      portfolioLink: assembledData.portfolioLink?.trim() || "",
      githubLink: assembledData.githubLink?.trim() || "",
      linkedinLink: assembledData.linkedinLink?.trim() || "",

      technicalSkills:
        assembledData.technicalSkills.length > 0
          ? assembledData.technicalSkills
          : DEFAULT_SAMPLE.technicalSkills,

      softSkills:
        assembledData.softSkills.length > 0
          ? assembledData.softSkills
          : DEFAULT_SAMPLE.softSkills,

      educations:
        assembledData.educations.length > 0
          ? assembledData.educations
          : DEFAULT_SAMPLE.educations,

      experiences:
        assembledData.experiences.length > 0
          ? assembledData.experiences
          : DEFAULT_SAMPLE.experiences,

      projects:
        assembledData.projects.length > 0
          ? assembledData.projects
          : DEFAULT_SAMPLE.projects,

      resumeFormat,
    };
  }, [assembledData, fullName, email, resumeTitle, resumeFormat]);

  const renderSelectedTemplate = (showPlaceholders = true) => {
    // const data = showPlaceholders ? assembledDataWithDefaults : assembledData;
    const data = assembledDataWithDefaults;
    const props = {
      data,
      showPlaceholders,
      fullName: fullName ? fullName : DEFAULT_SAMPLE.fullName,
      email: email ? email : DEFAULT_SAMPLE.email,
    };

    switch (resumeFormat) {
      case ResumeFormats.CREATIVE:
        return <CreativeResumeTemplate {...props} />;
      case ResumeFormats.CLASSIC:
        return <ProfessionalResumeTemplateVertical {...props} />;
      case ResumeFormats.MODERN:
        return <ModernResumeTemplate {...props} />;
      case ResumeFormats.MINIMAL:
        return <MinimalResumeTemplate {...props} />;
      case ResumeFormats.STANDARD:
      default:
        return <StandardResumeTemplate {...props} />;
    }
  };

  const payload: AddResumeRequest = {
    resume_details: {
      format_id: selectedResumeFormat?.format_id ?? 0,
      title: resumeTitle,
      is_default: true,
    },
    user: {
      location: location,
      phone: phone,
      objective: summary,
      portfolio_website_url: portfolioLink,
      linkedin_url: linkedinLink,
      github_url: githubLink,
    },
    skills: technicalSkillIds,
    softskills: softSkills.map((s) => s.text),
    education: educations.map((e) => ({
      ...e,
      start_year: yearToISODate(e.start_year),
      end_year: yearToISODate(e.end_year),
    })),
    experience: experiences.map((exp) => ({
      ...exp,
      start_year: yearToISODate(exp.start_year),
      end_year: yearToISODate(exp.end_year),
    })),
    projects: projects,
  };

  // Validation rules (you can adjust which fields are required)
  const validateAll = () => {
    const errors: Record<string, boolean> = {};

    // Required simple fields
    errors.resumeTitle = !(resumeTitle && resumeTitle.trim().length > 0);
    errors.fullName = !(fullName && fullName.trim().length > 0);
    errors.email = !(email && email.trim().length > 0);
    errors.phone = !(phone && phone.trim().length > 9);
    errors.location = !(location && location.trim().length > 0);
    errors.summary = !(summary && summary.trim().length > 0);

    // Collections: require at least one item
    errors.technicalSkills = !(technicalSkills && technicalSkills.length > 0);
    errors.softSkills = !(softSkills && softSkills.length > 0);
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
        `Resume limit reached (${usedResumes}/${totalResumes}). Delete an existing resume to create a new one.`,
      );
      return;
    }

    const errors = validateAll();
    setValidationErrors(errors);

    console.log(errors);

    if (hasAnyErrors(errors)) {
      showToast(ToastStates.ERROR, "Please fill all the details");
      // If invalid, DO NOT open preview modal; user must fix fields.
      // Optionally we could scroll to first invalid — omitted for brevity.
      return;
    }

    // All good: open modal for clean preview and final save
    setLoading(true);

    saveResumeMutation.mutate(payload, {
      onSuccess: (data: any) => {
        // console.log("Verification successful", data);
        // setLoading(false);
        setLoading(false);
        setShowPreviewModal(true);
        // Resume is now committed to the DB — the local draft has served
        // its purpose, so drop it to avoid resurrecting stale data next time.
        clearResumeDraft(user?.user?.email);
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const data = err?.response?.data;
        setLoading(false);

        if (
          data?.error?.message ==
          "resume title already exists, please choose a different title"
        ) {
          showToast(
            "error",
            "Resume title already exists, please provide unique one",
          );
        } else {
          showToast("error", "Internal error please contact the coordinator");
        }

        setLoading(false);
      },
    });
  };

  // Called from modal Save button (final commit)
  const handleFinalSave = async () => {
    // reset quota error
    setQuotaError(null);

    // final quota check (race-safety)
    if (!canCreateMore) {
      setQuotaError(
        `Unable to save — resume limit reached (${usedResumes}/${totalResumes}).`,
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
      // setResumes((prev) => [
      //   ...prev,
      //   {
      //     id: `r${Date.now()}`,
      //     title: assembledData.fullName
      //       ? `${assembledData.fullName} Resume`
      //       : "Untitled Resume",
      //     createdAt: new Date().toISOString(),
      //   },
      // ]);

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
      resumeTitle,
      fullName,
      email,
      phone,
      location,
      summary,
      technicalSkills,
      softSkills,
      educations,
      // experiences,
      // projects,
    ],
  );
  const canSaveNow = !hasAnyErrors(currentValidation);

  // Real-time "is this accordion section complete" flags, driving the
  // red/green status dot on each VerticalAccordion.
  const isPersonalDetailsComplete = useMemo(
    () =>
      !!(resumeTitle && resumeTitle.trim().length > 0) &&
      !!(fullName && fullName.trim().length > 0) &&
      !!(email && email.trim().length > 0) &&
      !!(phone && phone.trim().length > 9) &&
      !!(location && location.trim().length > 0) &&
      !!(summary && summary.trim().length > 0),
    [resumeTitle, fullName, email, phone, location, summary],
  );

  const isSkillsComplete = useMemo(
    () => technicalSkills.length > 0 && softSkills.length > 0,
    [technicalSkills, softSkills],
  );

  const isEducationComplete = useMemo(
    () => educations.length > 0,
    [educations],
  );

  // ---------------------- Download logic additions (iframe print) ----------------------
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingSavedResume, setIsDownloadingSavedResume] =
    useState(false);

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
      const filenameSafe = (fullName || resumeTitle || "resume")
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
        "Failed to print resume. Try allowing print/popups in your browser or use the server-side PDF route for perfect fidelity.",
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
      body: JSON.stringify(assembledDataForPdf),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullName || resumeTitle || "resume"}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // useEffect(() => {
  //   console.log(technicalSkillIds);
  // }, [technicalSkillIds]);

  const disableSave = remainingResumes === 0 || hasAnyErrors(validationErrors);

  // Once the user has attempted a save (validationErrors is populated), keep
  // the displayed red borders in sync with real-time validity: as soon as a
  // previously-invalid field becomes valid, its red border should clear
  // immediately rather than waiting for the next Save click.
  useEffect(() => {
    setValidationErrors((prev) =>
      Object.keys(prev).length === 0 ? prev : currentValidation,
    );

    if (!hasAnyErrors(currentValidation)) {
      setQuotaError(null);
    }
  }, [currentValidation]);

  // Fallback used only until useGetResumeFormats() has loaded; the dynamic
  // format_id -> format_key map derived from that response (below) is the
  // source of truth since format IDs are assigned by the backend.
  const FALLBACK_FORMAT_ID_TO_KEY: Record<number, ResumeFormats> = {
    1: ResumeFormats.CREATIVE,
    2: ResumeFormats.MODERN,
    3: ResumeFormats.CLASSIC,
    4: ResumeFormats.STANDARD,
    5: ResumeFormats.MINIMAL,
  };

  const formatIdToFormatKey = useMemo(() => {
    const map: Record<number, string> = {};
    resumeData?.resumeFormats?.forEach((f: any) => {
      map[f.format_id] = f.format_key;
    });
    return map;
  }, [resumeData?.resumeFormats]);

  const renderTemplateByFormatKey = (
    formatKey: string | undefined,
    props: {
      data: any;
      showPlaceholders: boolean;
      fullName?: string;
      email?: string;
    },
  ) => {
    switch (formatKey) {
      case ResumeFormats.CREATIVE:
        return <CreativeResumeTemplate {...props} />;
      case ResumeFormats.CLASSIC:
        return <ProfessionalResumeTemplateVertical {...props} />;
      case ResumeFormats.MODERN:
        return <ModernResumeTemplate {...props} />;
      case ResumeFormats.MINIMAL:
        return <MinimalResumeTemplate {...props} />;
      case ResumeFormats.STANDARD:
      default:
        return <StandardResumeTemplate {...props} />;
    }
  };

  const renderResumeByFormat = (completeResume: ResumeResponse) => {
    const formatKey =
      formatIdToFormatKey[completeResume.format_id] ??
      FALLBACK_FORMAT_ID_TO_KEY[completeResume.format_id];

    const data = mapCompleteResumeToTemplateData(completeResume);

    return renderTemplateByFormatKey(formatKey, {
      data,
      showPlaceholders: false,
      fullName: fullName || user?.user?.full_name,
      email: email || user?.user?.email,
    });
  };

  const resumeId = selectedResume?.ResumeID ?? "";
  const {
    data: userResumeByIDData,
    isLoading: isCompleteResumeLoading,
    error: completeResumeError,
  } = useGetCompleteResumeByID(resumeId);

  // PDF-shape equivalent of mapCompleteResumeToTemplateData above — same
  // source data, but flattened into the ResumeData shape the /api/resume/pdf
  // route + react-pdf templates expect (mirrors assembledDataForPdf).
  const mapCompleteResumeToPdfData = (
    resume: ResumeResponse,
    formatKey: string,
  ) => ({
    fullName: fullName || user?.user?.full_name || "",
    title: resume.title ?? "",
    email: email || user?.user?.email || "",
    phone: resume.user?.phone ?? "",
    location: resume.user?.location ?? "",
    objective: resume.user?.objective ?? "",
    portfolioLink: resume.user?.portfolio_link ?? "",
    githubLink: resume.user?.github_link ?? "",
    linkedinLink: resume.user?.linkedin_link ?? "",
    technicalSkills: (resume.skills ?? []).map(
      (skill) => skill.display_name || skill.skill_key,
    ),
    softSkills: resume.soft_skills ?? [],
    educations: (resume.education ?? []).map((ed) => ({
      degree: ed.degree,
      institute: ed.institute ?? "",
      location: ed.location ?? "",
      start_year: isoDateToYear(ed.start_date),
      end_year: isoDateToYear(ed.end_date) || "Present",
      grade: ed.grade ?? "",
    })),
    experiences: (resume.work_experience ?? []).map((exp) => ({
      company: exp.company,
      role: exp.role,
      start_year: isoDateToYear(exp.start_date),
      end_year: isoDateToYear(exp.end_date) || "Present",
      description: exp.description ?? "",
    })),
    projects: (resume.projects ?? []).map((p) => ({
      name: p.title,
      description: p.description ?? "",
    })),
    resumeFormat: formatKey,
  });

  const handleDownloadSavedResumePdf = async () => {
    if (!userResumeByIDData) return;

    const formatKey =
      formatIdToFormatKey[userResumeByIDData.format_id] ??
      FALLBACK_FORMAT_ID_TO_KEY[userResumeByIDData.format_id] ??
      ResumeFormats.STANDARD;

    setIsDownloadingSavedResume(true);
    try {
      const res = await fetch("/api/resume/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mapCompleteResumeToPdfData(userResumeByIDData, formatKey),
        ),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${userResumeByIDData.title || selectedResume?.Title || "resume"}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingSavedResume(false);
    }
  };

  if (!user?.services?.[0]?.service_config?.max_resumes_per_user) {
    return <Loader show message="Loading your profile..." />;
  }

  return (
    <>
      <Loader
        show={resumeFormatLoading}
        message="Loading your profile..."
      ></Loader>
      <div className="min-h-screen bg-white py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* <WorkInProgressBanner /> */}
        <main className="w-full">
          {/* Heading + Dropdown */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 max-w-[1550px] mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                AI-Powered Resume Builder
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Build your resume in real time with instant live preview and
                AI-powered enhancements
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Resume Selector */}
              <div className="relative">
                <ResumeDropdown
                  resumes={usersAllResumes!?.resumes}
                  onSelect={(resume) => {
                    setSelectedResume(resume);
                    setShowResumeViewModal(true);
                  }}
                  // onClick={handleDropdownClick}
                />
              </div>

              {/* Quota Status */}
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border ${
                  remainingResumes === 0
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                {/* Icon */}
                <span
                  className={`text-base ${
                    remainingResumes === 0 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  📄
                </span>

                {/* Text */}
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold">
                    {usersAllResumesLength}/{totalResumes ? totalResumes : ""}
                  </span>
                  <span className="text-xs opacity-80">resumes</span>
                </div>

                {/* Divider */}
                <span className="mx-1 h-3 w-px bg-gray-300 opacity-50" />

                {/* Remaining */}
                <span
                  className={`text-xs font-semibold ${
                    remainingResumes === 0 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {remainingResumes ? remainingResumes : ""}
                  {remainingResumes ? " left" : ""}
                </span>
              </div>
            </div>
          </div>

          {remainingResumes === 0 && (
            <div className="max-w-[1550px] mx-auto mb-6">
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0"
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
                    d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>

                <p className="text-sm font-medium text-red-700">
                  You’ve reached your resume limit.
                  <span className="font-semibold">
                    {" "}
                    Please delete an existing resume to create a new one.
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 max-w-[1550px] mx-auto">
            {/* Left: forms */}

            <div className="space-y-4">
              <VerticalAccordion
                isOpenProp={true}
                title="Personal details"
                isComplete={isPersonalDetailsComplete}
              >
                <BasicDetails
                  isDefault={isDefault}
                  setIsDefault={setIsDefault}
                  resumeTitle={resumeTitle}
                  setResumeTitle={setResumeTitle}
                  fullName={fullName}
                  email={email}
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

              <VerticalAccordion
                isOpenProp={false}
                title="Skills"
                isComplete={isSkillsComplete}
              >
                <SkillsPanel
                  skillsMaster={skillsMasterData}
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
                    softSkillsMissing: !!validationErrors.softSkills,
                  }}
                />
              </VerticalAccordion>

              <VerticalAccordion
                isOpenProp={false}
                title="Education"
                isComplete={isEducationComplete}
              >
                <EducationForm
                  educations={educations}
                  setEducations={setEducations}
                  validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion
                isOpenProp={false}
                title="Work Experience"
                isComplete={true}
              >
                <WorkExperienceForm
                  experiences={experiences}
                  setExperiences={setExperiences}
                  // validationErrors={validationErrors}
                />
              </VerticalAccordion>

              <VerticalAccordion
                isOpenProp={false}
                title="Project Details"
                isComplete={true}
              >
                <ProjectsForm
                  projects={projects}
                  setProjects={setProjects}
                  // validationErrors={validationErrors}
                />
              </VerticalAccordion>
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
                        onChange={(e) => {
                          setResumeFormat(e.target.value as ResumeFormats);
                        }}
                        className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      >
                        {
                          (resumeData?.resumeFormats &&
                          resumeData?.resumeFormats.length
                            ? resumeData?.resumeFormats?.map((f: any) => (
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
                        onClick={disableSave ? undefined : handleSaveClick}
                        disabled={disableSave}
                        className={`px-3 py-2 rounded-lg text-white font-bold text-sm transition
                                    ${
                                      disableSave
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-yellow-400 hover:bg-yellow-500"
                                    }
                              `}
                        title={
                          remainingResumes === 0
                            ? `Resume limit reached (${usedResumes}/${totalResumes})`
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
                  <div className="rounded-md overflow-hidden">
                    <div className="bg-white">
                      {renderSelectedTemplate(true)}
                    </div>
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

                        {/* <button
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
                      </button> */}

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
              {totalResumes}).
            </div>
          )}
        </div>

        {showResumeViewModal && selectedResume && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowResumeViewModal(false)}
            />

            {/* Modal */}
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-xl border border-gray-100 z-10">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {selectedResume.Title}
                  </div>
                  <div className="text-xs text-gray-500">
                    Format:{" "}
                    {resumeData?.resumeFormats?.find(
                      (f) => f.format_id === selectedResume.FormatID,
                    )?.title ?? selectedResume.FormatID}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSavedResumePdf}
                    disabled={
                      isDownloadingSavedResume ||
                      isCompleteResumeLoading ||
                      !userResumeByIDData
                    }
                    aria-label="Download resume"
                    title="Download resume"
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-sm font-semibold shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      isDownloadingSavedResume ||
                      isCompleteResumeLoading ||
                      !userResumeByIDData
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
                    }`}
                  >
                    {isDownloadingSavedResume ? (
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
                    onClick={() => setShowResumeViewModal(false)}
                    className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isCompleteResumeLoading && (
                  <Loader show message="Loading resume..." />
                )}

                {!isCompleteResumeLoading && completeResumeError && (
                  <p className="text-sm text-red-600 text-center py-8">
                    Failed to load this resume. Please try again.
                  </p>
                )}

                {!isCompleteResumeLoading &&
                  !completeResumeError &&
                  userResumeByIDData &&
                  renderResumeByFormat(userResumeByIDData)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
