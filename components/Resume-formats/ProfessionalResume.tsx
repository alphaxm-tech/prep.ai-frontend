// components/resume-formats/ProfessionalResume.tsx
import React from "react";

type Education = {
  level: string;
  institute: string;
  location: string;
  duration: string;
  grade: string;
};

type WorkExperience = {
  company: string;
  role: string;
  duration: string;
  description: string;
  logo?: string;
};

type Project = {
  title: string;
  description: string;
};

export type ResumeData = {
  fullName: string;
  title?: string;
  location?: string;
  email?: string;
  phone?: string;
  objective?: string;
  portfolioLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  technicalSkills?: string[];
  softSkills?: string[];
  educations?: Education[];
  experiences?: WorkExperience[];
  projects?: Project[];
};

export default function ProfessionalResumeTemplateVertical({
  data,
  showPlaceholders = true,
}: {
  data: ResumeData;
  showPlaceholders?: boolean;
}) {
  const name = data.fullName || (showPlaceholders ? "Your Full Name" : "");
  const title = data.title || (showPlaceholders ? "Your Title" : "");
  const email = data.email || (showPlaceholders ? "you@example.com" : "");
  const phone = data.phone || (showPlaceholders ? "+91-0000000000" : "");
  const location = data.location || (showPlaceholders ? "City, Country" : "");

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white print:bg-white shadow-md rounded-lg ring-1 ring-gray-100">
      <div className="h-2 w-full rounded-t-lg bg-gradient-to-r from-slate-700 to-indigo-600" />

      <div className="px-6 py-6 md:px-10 md:py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
            <div className="text-sm text-slate-600 mt-1">{title}</div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <a
              href={`mailto:${email}`}
              className="hover:underline text-slate-700"
            >
              ✉️ {email}
            </a>
            <span>📞 {phone}</span>
            <span>📍 {location}</span>
          </div>
        </header>

        {/* Summary */}
        <section className="bg-slate-50 border border-slate-100 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {data.objective ||
              (showPlaceholders
                ? "Short summary: what you build, the technologies you work in, and the impact you drive."
                : "")}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Links
            </h3>
            <div className="mt-2 text-sm text-indigo-700 flex flex-col gap-1">
              {data.portfolioLink ? (
                <a href={data.portfolioLink} target="_blank" rel="noreferrer">
                  Portfolio
                </a>
              ) : showPlaceholders ? (
                <span className="text-sm text-slate-400">Portfolio</span>
              ) : null}
              {data.githubLink ? (
                <a href={data.githubLink} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : showPlaceholders ? (
                <span className="text-sm text-slate-400">GitHub</span>
              ) : null}
              {data.linkedinLink ? (
                <a href={data.linkedinLink} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              ) : showPlaceholders ? (
                <span className="text-sm text-slate-400">LinkedIn</span>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Technical Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.technicalSkills && data.technicalSkills.length > 0 ? (
                data.technicalSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded"
                  >
                    {s}
                  </span>
                ))
              ) : showPlaceholders ? (
                <>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded">
                    Go
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded">
                    React
                  </span>
                </>
              ) : (
                <div className="text-xs text-slate-400">None listed</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Soft Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.softSkills && data.softSkills.length > 0 ? (
                data.softSkills.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-slate-50 text-slate-700 rounded"
                  >
                    {s}
                  </span>
                ))
              ) : showPlaceholders ? (
                <>
                  <span className="text-xs px-2 py-1 bg-slate-50 text-slate-700 rounded">
                    Communication
                  </span>
                </>
              ) : (
                <div className="text-xs text-slate-400">None listed</div>
              )}
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Education
          </h3>
          <div className="space-y-3">
            {data.educations && data.educations.length > 0 ? (
              data.educations.map((ed, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-slate-100 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {ed.level}
                      </div>
                      <div className="text-sm text-slate-700">
                        {ed.institute}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{ed.duration}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {ed.location} • GPA: {ed.grade}
                  </div>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-3 rounded border border-slate-100 bg-white shadow-sm">
                <div className="font-medium text-slate-900">B.Tech</div>
                <div className="text-sm text-slate-700">IIT Bombay</div>
                <div className="text-xs text-slate-500 mt-1">
                  2018–2022 • Mumbai • GPA: 8.5
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No education listed</div>
            )}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Experience
          </h3>
          <div className="space-y-4">
            {data.experiences && data.experiences.length > 0 ? (
              data.experiences.map((exp, i) => (
                <article
                  key={i}
                  className="p-4 rounded border border-slate-100 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-md font-semibold text-slate-900">
                        {exp.role}
                      </div>
                      <div className="text-sm text-slate-700">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{exp.duration}</div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 leading-normal">
                    {exp.description}
                  </p>
                </article>
              ))
            ) : showPlaceholders ? (
              <article className="p-4 rounded border border-slate-100 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-md font-semibold text-slate-900">
                      Fullstack Developer
                    </div>
                    <div className="text-sm text-slate-700">Google</div>
                  </div>
                  <div className="text-xs text-slate-500">2023 - Present</div>
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-normal">
                  Worked on microservices and front-end features, improving
                  performance and reliability.
                </p>
              </article>
            ) : (
              <div className="text-sm text-slate-400">No experience listed</div>
            )}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Projects
          </h3>
          <div className="space-y-3">
            {data.projects && data.projects.length > 0 ? (
              data.projects.map((p, i) => (
                <div
                  key={i}
                  className="p-3 rounded border border-slate-100 bg-white shadow-sm"
                >
                  <div className="font-medium text-slate-900">{p.title}</div>
                  <p className="mt-1 text-sm text-slate-700">{p.description}</p>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-3 rounded border border-slate-100 bg-white shadow-sm">
                <div className="font-medium text-slate-900">
                  Example Project
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  Short project description showing scope and impact.
                </p>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No projects listed</div>
            )}
          </div>
        </section>

        <footer className="mt-6 text-xs text-gray-500 text-center">
          Generated with a professional vertical · Print friendly
          <br />
          <span className="italic">Created by AI Prep Buddy</span>
        </footer>
      </div>
    </div>
  );
}
