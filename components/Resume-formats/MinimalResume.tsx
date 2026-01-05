import React from "react";
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/utils/api/types/resume.types";

export default function MinimalResumeTemplate({
  data,
  showPlaceholders = true,
  fullName,
  email,
}: {
  data: AddResumeRequest;
  showPlaceholders?: boolean;
  fullName: string;
  email: string;
}) {
  const { resume_details, user, experience, projects, education, softskills } =
    data;

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white print:bg-white text-slate-800 font-sans">
      <div className="h-1 w-24 bg-slate-800 mb-6 rounded-full mx-auto" />

      {/* Header */}
      <header className="text-center pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {fullName || (showPlaceholders ? "Your Resume Title" : "")}
        </h1>

        <div className="mt-3 text-xs text-slate-500 flex flex-wrap justify-center gap-4">
          {email || (showPlaceholders ? "example@gmail.com" : "")}
          {user.phone || (showPlaceholders ? "📞 +91-0000000000" : "")}
          {user.location || (showPlaceholders ? "📍 Your Location" : "")}
        </div>
      </header>

      <main className="px-4 pb-6 space-y-6">
        {/* Summary */}
        <section>
          <h2 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Summary
          </h2>
          <p className="text-sm text-slate-700 leading-snug">
            {user.objective ||
              (showPlaceholders
                ? "Write a short professional summary here..."
                : "")}
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-4 items-center text-sm">
          {user.portfolio_website_url && (
            <a
              href={user.portfolio_website_url}
              className="text-slate-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          )}
          {user.github_url && (
            <a
              href={user.github_url}
              className="text-slate-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {user.linkedin_url && (
            <a
              href={user.linkedin_url}
              className="text-slate-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
          {!user.portfolio_website_url &&
            !user.github_url &&
            !user.linkedin_url &&
            showPlaceholders && (
              <div className="text-xs text-slate-400">
                Add portfolio / GitHub / LinkedIn
              </div>
            )}
        </section>

        {/* Soft Skills */}
        <section>
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {softskills?.map((s, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700"
              >
                {s}
              </span>
            ))}
            {!softskills?.length && showPlaceholders && (
              <div className="text-xs text-slate-400">No skills added</div>
            )}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Education
          </h3>
          <div className="space-y-3">
            {education?.map((ed: Education, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">
                    {ed.degree || (showPlaceholders ? "Degree / Course" : "")}
                  </div>
                  <div className="text-xs text-slate-600">
                    {ed.institute || (showPlaceholders ? "Institute Name" : "")}
                  </div>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  <div>
                    {ed.start_year && ed.end_year
                      ? `${ed.start_year} - ${ed.end_year}`
                      : showPlaceholders
                      ? "YYYY-YYYY"
                      : ""}
                  </div>
                  <div>
                    {ed.location || (showPlaceholders ? "City, Country" : "")}
                  </div>
                </div>
              </div>
            ))}
            {!education?.length && showPlaceholders && (
              <div className="text-xs text-slate-400">No education listed</div>
            )}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Experience
          </h3>
          <div className="space-y-4">
            {experience?.map((exp: WorkExperience, i: number) => (
              <article key={i} className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium">
                      {exp.role || (showPlaceholders ? "Role / Position" : "")}
                    </div>
                    <div className="text-xs text-slate-600">
                      {exp.company || (showPlaceholders ? "Company Name" : "")}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {exp.start_year && exp.end_year
                      ? `${exp.start_year} - ${exp.end_year}`
                      : showPlaceholders
                      ? "YYYY-YYYY"
                      : ""}
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-snug">
                  {exp.description ||
                    (showPlaceholders
                      ? "Describe your responsibilities and achievements..."
                      : "")}
                </p>
              </article>
            ))}
            {!experience?.length && showPlaceholders && (
              <div className="text-xs text-slate-400">No experience listed</div>
            )}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Projects
          </h3>
          <div className="space-y-3">
            {projects?.map((p: Project, i: number) => (
              <div key={i}>
                <div className="text-sm font-medium">
                  {p.name || (showPlaceholders ? "Project Name" : "")}
                </div>
                <div className="text-sm text-slate-700 leading-snug">
                  {p.description ||
                    (showPlaceholders
                      ? "Describe your project briefly..."
                      : "")}
                </div>
              </div>
            ))}
            {!projects?.length && showPlaceholders && (
              <div className="text-xs text-slate-400">No projects listed</div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-6 text-xs text-gray-500 text-center">
        Minimal resume · Clean · Print friendly
        <br />
        <span className="italic">Created by AI Prep Buddy</span>
      </footer>
    </div>
  );
}
