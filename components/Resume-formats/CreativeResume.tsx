// components/resume-formats/CreativeResume.tsx
import React from "react";
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/utils/api/types/resume.types";

export default function CreativeResumeTemplate({
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

  const ph = (val?: string, fallback = "") =>
    val && val.trim() ? val : showPlaceholders ? fallback : "";

  console.log(data);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-lg border border-gray-100">
      {/* Decorative header */}
      <div className="relative -mx-6 -mt-6 mb-6">
        <div className="h-2 rounded-t-2xl bg-gradient-to-r from-indigo-400 via-teal-300 to-rose-300 opacity-90" />
      </div>

      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          {ph(fullName, "Resume Title")}
        </h1>

        <div className="mt-2 text-sm md:text-base text-slate-600 flex flex-wrap justify-center gap-4">
          <span>📧 {ph(email, "example@gmail.com")}</span>
          <span>📍 {ph(user.location, "Your location")}</span>
          <span>📞 {ph(user.phone, "0000000000")}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <aside className="space-y-4">
          {/* Objective */}
          {(user.objective || showPlaceholders) && (
            <div className="p-4 rounded-xl bg-white border shadow-sm">
              <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                🎯 Objective
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                {ph(user.objective, "Briefly describe your career objective")}
              </p>
            </div>
          )}

          {/* Links */}
          <div className="p-4 rounded-xl bg-white border shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {user.portfolio_website_url ? (
                <li>
                  <a
                    href={user.portfolio_website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-600"
                  >
                    Portfolio
                  </a>
                </li>
              ) : (
                showPlaceholders && (
                  <li className="text-slate-400">Portfolio</li>
                )
              )}

              {user.github_url ? (
                <li>
                  <a
                    href={user.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-600"
                  >
                    GitHub
                  </a>
                </li>
              ) : (
                showPlaceholders && <li className="text-slate-400">GitHub</li>
              )}

              {user.linkedin_url ? (
                <li>
                  <a
                    href={user.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-600"
                  >
                    LinkedIn
                  </a>
                </li>
              ) : (
                showPlaceholders && <li className="text-slate-400">LinkedIn</li>
              )}
            </ul>
          </div>

          {/* Skills (soft only — technical is ID based now) */}
          <div className="p-4 rounded-xl bg-white border shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {softskills?.length ? (
                softskills.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                  >
                    {s}
                  </span>
                ))
              ) : showPlaceholders ? (
                <span className="text-xs text-slate-400">No skills added</span>
              ) : null}
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="md:col-span-2 space-y-6">
          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-3">🎓 Education</h2>
            <div className="space-y-3">
              {education?.length ? (
                education.map((ed: Education, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-xl border shadow-sm"
                  >
                    <div className="font-semibold">{ed.degree}</div>
                    <div className="text-sm text-slate-600">{ed.institute}</div>
                    <div className="text-xs text-slate-500">
                      {ed.start_year} – {ed.end_year} · {ed.location}
                    </div>
                  </div>
                ))
              ) : showPlaceholders ? (
                <p className="text-sm text-slate-400">No education added</p>
              ) : null}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-3">💼 Experience</h2>
            <div className="space-y-4">
              {experience?.length ? (
                experience.map((exp: WorkExperience, i: number) => (
                  <article
                    key={i}
                    className="p-4 rounded-xl bg-white border shadow-sm"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{exp.role}</div>
                        <div className="text-sm text-slate-600">
                          {exp.company}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {exp.start_year} – {exp.end_year}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {exp.description}
                    </p>
                  </article>
                ))
              ) : showPlaceholders ? (
                <p className="text-sm text-slate-400">No experience added</p>
              ) : null}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-semibold mb-3">🚀 Projects</h2>
            <div className="space-y-3">
              {projects?.length ? (
                projects.map((p: Project, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-xl border shadow-sm"
                  >
                    <div className="font-semibold">{p.name}</div>
                    <p className="text-sm text-slate-700 mt-1">
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

      <footer className="mt-8 text-xs text-slate-500 text-center">
        Creative resume · Modern · Print friendly
        <br />
        <span className="italic">Created by AI Prep Buddy</span>
      </footer>
    </div>
  );
}
