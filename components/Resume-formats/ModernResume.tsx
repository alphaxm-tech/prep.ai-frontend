// components/resume-formats/ModernResume.tsx
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

export default function ModernResumeTemplate({
  data,
  showPlaceholders = true,
}: {
  data: ResumeData;
  showPlaceholders?: boolean;
}) {
  const name = data.fullName || (showPlaceholders ? "Your Full Name" : "");
  const title = data.title || (showPlaceholders ? "Your Title / Role" : "");
  const email = data.email || (showPlaceholders ? "your@email.com" : "");
  const phone = data.phone || (showPlaceholders ? "+91-0000000000" : "");
  const location = data.location || (showPlaceholders ? "Your City" : "");

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
        <p className="text-lg font-medium opacity-90 mt-1">{title}</p>

        <div className="flex flex-wrap gap-4 text-sm mt-4 opacity-90">
          <span>✉️ {email}</span>
          <span>📞 {phone}</span>
          <span>📍 {location}</span>
        </div>
      </header>

      <main className="p-8 space-y-8">
        {/* Objective */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.objective ||
              (showPlaceholders
                ? "Write a short professional summary describing your focus, strengths, and recent impact."
                : "")}
          </p>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Links
          </h2>
          <div className="flex flex-wrap gap-4 text-indigo-700 text-sm font-medium">
            {data.portfolioLink ? (
              <a href={data.portfolioLink} target="_blank" rel="noreferrer">
                🌐 Portfolio
              </a>
            ) : showPlaceholders ? (
              <span className="text-sm text-gray-400">Portfolio</span>
            ) : null}
            {data.githubLink ? (
              <a href={data.githubLink} target="_blank" rel="noreferrer">
                🧰 GitHub
              </a>
            ) : showPlaceholders ? (
              <span className="text-sm text-gray-400">GitHub</span>
            ) : null}
            {data.linkedinLink ? (
              <a href={data.linkedinLink} target="_blank" rel="noreferrer">
                💼 LinkedIn
              </a>
            ) : showPlaceholders ? (
              <span className="text-sm text-gray-400">LinkedIn</span>
            ) : null}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                Technical
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.technicalSkills && data.technicalSkills.length > 0 ? (
                  data.technicalSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full"
                    >
                      {s}
                    </span>
                  ))
                ) : showPlaceholders ? (
                  <>
                    <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                      React
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                      Go
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">
                    No technical skills
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                Soft
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.softSkills && data.softSkills.length > 0 ? (
                  data.softSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {s}
                    </span>
                  ))
                ) : showPlaceholders ? (
                  <>
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      Communication
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      Ownership
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">No soft skills</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {data.educations && data.educations.length > 0 ? (
              data.educations.map((ed, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {ed.level}
                      </div>
                      <div className="text-sm text-gray-700">
                        {ed.institute}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{ed.duration}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ed.location} • GPA: {ed.grade}
                  </div>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="font-semibold text-gray-900">B.Tech</div>
                <div className="text-sm text-gray-700">IIT Bombay</div>
                <div className="text-xs text-gray-500 mt-1">
                  2018–2022 • Mumbai • GPA: 8.5
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No education listed</span>
            )}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experiences && data.experiences.length > 0 ? (
              data.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {exp.role}
                      </div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500">{exp.duration}</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-5 border border-gray-100 rounded-xl shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      Fullstack Developer
                    </div>
                    <div className="text-sm text-gray-600">Acme Corp</div>
                  </div>
                  <div className="text-xs text-gray-500">2023 - Present</div>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Built high-throughput services and features; improved
                  observability and reduced incident MTTR.
                </p>
              </div>
            ) : (
              <span className="text-sm text-gray-400">
                No work experience added
              </span>
            )}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects && data.projects.length > 0 ? (
              data.projects.map((p, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-gray-100 rounded-lg"
                >
                  <div className="font-medium text-gray-900">🚀 {p.title}</div>
                  <p className="mt-2 text-sm text-gray-700">{p.description}</p>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-gray-100 rounded-lg">
                <div className="font-medium text-gray-900">
                  🚀 Example Project
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  A sample project description demonstrating impact and
                  technical scope.
                </p>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No projects added</span>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-6 mb-8 text-xs text-gray-500 text-center">
        Modern resume template
        <br />
        <span className="italic">Created by AI Prep Buddy</span>
      </footer>
    </div>
  );
}
