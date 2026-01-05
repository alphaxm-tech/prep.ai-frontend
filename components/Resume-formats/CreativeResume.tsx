// components/resume-formats/CreativeResume.tsx
import { ResumeData } from "@/utils/api/types/education.types";
import React from "react";

export default function CreativeResumeTemplate({
  data,
  showPlaceholders = true,
}: {
  data: ResumeData;
  showPlaceholders?: boolean;
}) {
  // helper to return either value or placeholder (for inline preview)
  const ph = (val?: string, fallback = "") => {
    if (val && val.trim() !== "") return val;
    if (showPlaceholders) return fallback;
    return "";
  };

  const renderListOrPlaceholder = (arr?: string[], placeholder?: string) => {
    if (arr && arr.length) return arr;
    if (showPlaceholders) return [placeholder ?? "—"];
    return [];
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg border border-gray-100">
      {/* Decorative header strip */}
      <div className="relative -mx-6 -mt-6 mb-6">
        <div className="h-2 rounded-t-2xl bg-gradient-to-r from-indigo-400 via-teal-300 to-rose-300 opacity-90" />
      </div>

      {/* HEADER */}
      <header className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          {ph(data.fullName, "Your Name")}
        </h1>
        <div className="mt-2 text-sm md:text-base text-slate-600 flex flex-col md:flex-row items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 text-slate-500">
            <span className="text-indigo-400">📍</span>
            <span>{ph(data.location, "Your location")}</span>
          </span>

          <span className="inline-flex items-center gap-2 text-slate-500">
            <span className="text-teal-400">✉️</span>
            <span className="truncate">
              {ph(data.email, "you@example.com")}
            </span>
          </span>

          <span className="inline-flex items-center gap-2 text-slate-500">
            <span className="text-rose-400">📞</span>
            <span>{ph(data.phone, "0000000000")}</span>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT column: compact info */}
        <aside className="md:col-span-1 space-y-4">
          {/* Objective card */}
          {(data.objective || showPlaceholders) && (
            <div className="p-4 rounded-xl bg-white/80 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                <span className="text-lg">🎯</span> Objective
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {ph(
                  data.objective,
                  "Add your objective — what do you want to do?"
                )}
              </p>
            </div>
          )}

          {/* Links */}
          <div className="p-4 rounded-xl bg-white/90 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Links</h3>
            <ul className="mt-2 text-sm space-y-2">
              {data.portfolioLink ? (
                <li>
                  <a
                    href={data.portfolioLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-indigo-600"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-300" />
                    Portfolio
                  </a>
                </li>
              ) : showPlaceholders ? (
                <li className="text-slate-400">Portfolio (add link)</li>
              ) : null}

              {data.githubLink ? (
                <li>
                  <a
                    href={data.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-indigo-600"
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-300" />
                    GitHub
                  </a>
                </li>
              ) : showPlaceholders ? (
                <li className="text-slate-400">GitHub (add link)</li>
              ) : null}

              {data.linkedinLink ? (
                <li>
                  <a
                    href={data.linkedinLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-indigo-600"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-300" />
                    LinkedIn
                  </a>
                </li>
              ) : showPlaceholders ? (
                <li className="text-slate-400">LinkedIn (add link)</li>
              ) : null}
            </ul>
          </div>

          {/* Skills */}
          <div className="p-4 rounded-xl bg-white/90 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Skills</h3>

            <div className="mt-3">
              <div className="text-xs font-medium text-indigo-600 mb-2">
                Technical
              </div>
              <div className="flex flex-wrap gap-2">
                {renderListOrPlaceholder(
                  data.technicalSkills,
                  "No technical skills"
                ).map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-gradient-to-r from-indigo-50 to-teal-50 text-indigo-700 rounded-full border border-indigo-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs font-medium text-rose-600 mb-2">Soft</div>
              <div className="flex flex-wrap gap-2">
                {renderListOrPlaceholder(data.softSkills, "No soft skills").map(
                  (s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-white text-slate-700 rounded-full border border-gray-100"
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT column: main content */}
        <main className="md:col-span-2 space-y-4">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              🎓 Education
            </h2>
            <div className="p-4 rounded-xl bg-white/90 border border-gray-100 shadow-sm">
              <div className="mt-3 space-y-3 text-sm">
                {data.educations && data.educations.length ? (
                  data.educations.map((ed, idx) => (
                    <div key={idx}>
                      <div className="font-semibold text-slate-900">
                        {ed.degree}
                      </div>
                      <div className="text-xs text-slate-600">
                        {ed.institute}
                      </div>
                      <div className="text-xs text-slate-500">
                        {ed.startYear} • {ed.endYear} • {ed.location}
                      </div>
                    </div>
                  ))
                ) : showPlaceholders ? (
                  <div className="text-xs text-slate-400">
                    No education added
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              💼 Experience
            </h2>
            <div className="space-y-4">
              {data.experiences && data.experiences.length ? (
                data.experiences.map((exp, i) => (
                  <article
                    key={i}
                    className="p-4 rounded-2xl bg-gradient-to-r from-white/80 to-indigo-50 border border-gray-100 shadow-sm transform hover:-translate-y-0.5 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="w-14 h-14 object-contain rounded-md border"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-500 font-semibold">
                            {exp.company?.slice(0, 1) || "🏢"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-md font-semibold text-slate-900">
                              {exp.role}
                            </div>
                            <div className="text-sm text-slate-600">
                              {exp.company}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            {exp.duration}
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : showPlaceholders ? (
                <p className="text-sm text-slate-400">No experience added</p>
              ) : null}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              🚀 Projects
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {data.projects && data.projects.length ? (
                data.projects.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/90 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-md font-semibold text-slate-900">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-500">Project</div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {p.description}
                    </p>
                  </div>
                ))
              ) : showPlaceholders ? (
                <p className="text-sm text-slate-400">No projects added</p>
              ) : null}
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-6 text-xs text-slate-500 text-center">
        Generated with a creative vertical resume · Clean & modern
        <br />
        <span className="italic">Created by AI Prep Buddy</span>
      </footer>
    </div>
  );
}
