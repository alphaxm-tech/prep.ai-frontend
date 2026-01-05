import { ResumeData } from "@/utils/api/types/education.types";
import React from "react";

export default function MinimalResumeTemplate({
  data,
  showPlaceholders = true,
}: {
  data: ResumeData;
  showPlaceholders?: boolean;
}) {
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white print:bg-white text-slate-800 font-sans">
      <div className="h-1 w-24 bg-slate-800 mb-6 rounded-full mx-auto" />

      <header className="text-center pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {data.fullName || (showPlaceholders ? "Your Full Name" : "")}
        </h1>
        <div className="text-sm text-slate-600 mt-1">
          {data.title || (showPlaceholders ? "Your Title / Role" : "")}
        </div>

        <div className="mt-3 text-xs text-slate-500 flex flex-wrap justify-center gap-4">
          {data.email || (showPlaceholders ? "✉️ your@email.com" : "")}
          {data.phone || (showPlaceholders ? "📞 +91-0000000000" : "")}
          {data.location || (showPlaceholders ? "📍 Your Location" : "")}
        </div>
      </header>

      <main className="px-4 pb-6 space-y-6">
        {/* Objective */}
        <section>
          <h2 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Summary
          </h2>
          <p className="text-sm text-slate-700 leading-snug">
            {data.objective ||
              (showPlaceholders
                ? "Write a short professional summary here..."
                : "")}
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-4 items-center text-sm">
          {data.portfolioLink && (
            <a
              href={data.portfolioLink}
              className="text-slate-700 underline text-sm"
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          )}
          {data.githubLink && (
            <a
              href={data.githubLink}
              className="text-slate-700 underline text-sm"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {data.linkedinLink && (
            <a
              href={data.linkedinLink}
              className="text-slate-700 underline text-sm"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
          {!data.portfolioLink &&
            !data.githubLink &&
            !data.linkedinLink &&
            showPlaceholders && (
              <div className="text-xs text-slate-400">
                Add your portfolio / GitHub / LinkedIn
              </div>
            )}
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.technicalSkills?.map((s, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700"
              >
                {s}
              </span>
            ))}
            {data.softSkills?.map((s, i) => (
              <span
                key={`soft-${i}`}
                className="text-xs px-2 py-1 bg-slate-50 rounded text-slate-600"
              >
                {s}
              </span>
            ))}
            {!data.technicalSkills?.length &&
              !data.softSkills?.length &&
              showPlaceholders && (
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
            {data.educations?.map((ed, i) => (
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
                    {ed.startYear ||
                      ed.endYear ||
                      (showPlaceholders ? "YYYY-YYYY" : "")}
                  </div>
                  <div>
                    {ed.location || (showPlaceholders ? "City, Country" : "")}
                  </div>
                </div>
              </div>
            ))}
            {!data.educations?.length && showPlaceholders && (
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
            {data.experiences?.map((exp, i) => (
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
                    {exp.duration || (showPlaceholders ? "YYYY-YYYY" : "")}
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
            {!data.experiences?.length && showPlaceholders && (
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
            {data.projects?.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-medium">
                  {p.title || (showPlaceholders ? "Project Title" : "")}
                </div>
                <div className="text-sm text-slate-700 leading-snug">
                  {p.description ||
                    (showPlaceholders
                      ? "Describe your project briefly..."
                      : "")}
                </div>
              </div>
            ))}
            {!data.projects?.length && showPlaceholders && (
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
