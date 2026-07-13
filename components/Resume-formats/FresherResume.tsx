// components/resume-formats/FresherResume.tsx
import React from "react";
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/server-api/api/types/resume.types";

// A two-column "sidebar" layout, deliberately different from the other
// (single-column) templates. The sidebar holds Contact/Links/Skills/
// Education — every one of those is a *required* field in the resume form
// (only Work Experience and Projects are optional) — so this resume always
// looks dense and recruiter-friendly even for a fresher with no experience
// or projects yet, instead of trailing off into empty space.
export default function FresherResumeTemplate({
  data,
  showPlaceholders = true,
  fullName,
  email,
}: {
  data: AddResumeRequest;
  showPlaceholders: boolean;
  fullName?: string;
  email?: string;
}) {
  const {
    resume_details,
    user,
    skills,
    softskills,
    education,
    experience,
    projects,
  } = data;

  const ph = (val?: string, fallback = "") =>
    val && val.trim() ? val : showPlaceholders ? fallback : "";

  const allSkills =
    skills?.length || softskills?.length
      ? [...(skills ?? []), ...(softskills ?? [])]
      : [];

  const hasLinks =
    user?.portfolio_website_url || user?.github_url || user?.linkedin_url;

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-8">
        <h1 className="text-3xl font-bold">{ph(fullName, "Your Name")}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-teal-50">
          <span>📧 {ph(email, "example@gmail.com")}</span>
          <span>📞 {ph(user?.phone, "+91-0000000000")}</span>
          <span>📍 {ph(user?.location, "City, Country")}</span>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row">
        {/* SIDEBAR — always dense: links, skills, education */}
        <aside className="sm:w-[34%] bg-teal-50/70 border-b sm:border-b-0 sm:border-r border-teal-100 p-6 space-y-6">
          {(hasLinks || showPlaceholders) && (
            <div>
              <h3 className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-2">
                Links
              </h3>
              <div className="flex flex-col gap-1.5 text-sm text-teal-700">
                {user?.portfolio_website_url ? (
                  <a
                    href={user.portfolio_website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Portfolio
                  </a>
                ) : (
                  showPlaceholders && (
                    <span className="text-gray-400">Portfolio</span>
                  )
                )}
                {user?.github_url ? (
                  <a
                    href={user.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                ) : (
                  showPlaceholders && (
                    <span className="text-gray-400">GitHub</span>
                  )
                )}
                {user?.linkedin_url ? (
                  <a
                    href={user.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                ) : (
                  showPlaceholders && (
                    <span className="text-gray-400">LinkedIn</span>
                  )
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills?.length
                ? skills.map((s, i) => (
                    <span
                      key={`tech-${i}`}
                      className="text-xs px-2.5 py-1 bg-white border border-teal-200 text-teal-800 rounded-full shadow-sm"
                    >
                      {s}
                    </span>
                  ))
                : showPlaceholders && (
                    <span className="text-xs px-2.5 py-1 bg-white border border-teal-200 text-teal-800 rounded-full shadow-sm">
                      React
                    </span>
                  )}
              {softskills?.length
                ? softskills.map((s, i) => (
                    <span
                      key={`soft-${i}`}
                      className="text-xs px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-full"
                    >
                      {s}
                    </span>
                  ))
                : showPlaceholders && (
                    <span className="text-xs px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-full">
                      Communication
                    </span>
                  )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-2">
              Education
            </h3>
            {education?.length ? (
              <div className="space-y-3">
                {education.map((ed: Education, idx: number) => (
                  <div key={idx}>
                    <div className="text-sm font-semibold text-gray-900">
                      {ed.degree}
                    </div>
                    <div className="text-xs text-gray-700">
                      {ed.institute}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {ed.start_year} – {ed.end_year}
                    </div>
                    {ed.grade && (
                      <div className="text-xs text-gray-500">
                        GPA: {ed.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : showPlaceholders ? (
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  B.Tech
                </div>
                <div className="text-xs text-gray-700">Your University</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  2019–2023 • City
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        {/* MAIN — profile, projects (given generous space), experience last */}
        <main className="flex-1 p-6 space-y-6">
          <section className="bg-teal-50/70 border border-teal-100 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-1.5">
              Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {ph(
                user?.objective,
                "Motivated fresher eager to apply strong fundamentals and hands-on project experience to a growth-focused engineering role.",
              )}
            </p>
          </section>

          {(projects?.length || showPlaceholders) && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-teal-100 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-4">
                {projects?.length ? (
                  projects.map((p: Project, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm"
                    >
                      <div className="font-semibold text-gray-900">
                        🚀 {p.name}
                      </div>
                      <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className="font-semibold text-gray-900">
                      🚀 Example Project
                    </div>
                    <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                      A short example showing the problem, your approach, and
                      the technical stack used.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {(experience?.length || showPlaceholders) && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-teal-100 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience?.length ? (
                  experience.map((exp: WorkExperience, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {exp.role}
                          </div>
                          <div className="text-sm text-gray-700">
                            {exp.company}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {exp.start_year} – {exp.end_year}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 leading-snug">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          Intern — Software Engineering
                        </div>
                        <div className="text-sm text-gray-700">
                          Company Name
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Summer 2025
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 leading-snug">
                      Contributed to a real-world codebase and shipped a
                      small feature end-to-end.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="px-6 py-4 text-xs text-gray-500 text-center border-t border-gray-100">
        <span className="italic">
          PrepBuddy<sup className="text-[0.65em]">AI</sup>
        </span>
      </footer>
    </div>
  );
}
