// components/resume-formats/StandardResume.tsx
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

export default function StandardResumeTemplate({
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
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-md rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <header className="border-b border-gray-300 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        <p className="text-lg text-gray-700 mt-1">{title}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span>✉️ {email}</span>
          <span>📞 {phone}</span>
          <span>📍 {location}</span>
        </div>
      </header>

      <main className="space-y-6">
        {/* Objective */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.objective ||
              (showPlaceholders
                ? "Brief summary about your focus, technologies and notable impacts."
                : "")}
          </p>
        </section>

        {/* Skills */}
        <section>
          {(data.technicalSkills?.length ||
            data.softSkills?.length ||
            showPlaceholders) && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.technicalSkills && data.technicalSkills.length > 0 ? (
                  data.technicalSkills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {s}
                    </span>
                  ))
                ) : showPlaceholders ? (
                  <>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      React
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      Go
                    </span>
                  </>
                ) : null}

                {data.softSkills && data.softSkills.length > 0 ? (
                  data.softSkills.map((s, i) => (
                    <span
                      key={`soft-${i}`}
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded"
                    >
                      {s}
                    </span>
                  ))
                ) : showPlaceholders ? (
                  <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                    Communication
                  </span>
                ) : null}
              </div>
            </>
          )}
        </section>

        {/* Education */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Education
          </h2>
          {data.educations && data.educations.length > 0 ? (
            <div className="space-y-3">
              {data.educations.map((ed, idx) => (
                <div key={idx}>
                  <div className="font-medium text-gray-900">{ed.level}</div>
                  <div className="text-sm text-gray-700">{ed.institute}</div>
                  <div className="text-xs text-gray-500">
                    {ed.duration} • {ed.location} • GPA: {ed.grade}
                  </div>
                </div>
              ))}
            </div>
          ) : showPlaceholders ? (
            <div>
              <div className="font-medium text-gray-900">B.Tech</div>
              <div className="text-sm text-gray-700">IIT Bombay</div>
              <div className="text-xs text-gray-500">
                2018–2022 • Mumbai • GPA: 8.5
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No education listed</p>
          )}
        </section>

        {/* Work Experience */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Work Experience
          </h2>
          {data.experiences && data.experiences.length > 0 ? (
            <div className="space-y-4">
              {data.experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {exp.role}
                      </div>
                      <div className="text-sm text-gray-700">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500">{exp.duration}</div>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 leading-snug">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          ) : showPlaceholders ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    Fullstack Developer
                  </div>
                  <div className="text-sm text-gray-700">Acme Corp</div>
                </div>
                <div className="text-xs text-gray-500">2023 - Present</div>
              </div>
              <p className="mt-1 text-sm text-gray-700 leading-snug">
                Built reliable services and polished frontend features with
                observable improvements in production.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No experience listed</p>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Projects
          </h2>
          {data.projects && data.projects.length > 0 ? (
            <div className="space-y-3">
              {data.projects.map((p, idx) => (
                <div key={idx}>
                  <div className="font-medium text-gray-900">{p.title}</div>
                  <p className="text-sm text-gray-700 leading-snug">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          ) : showPlaceholders ? (
            <div>
              <div className="font-medium text-gray-900">Example Project</div>
              <p className="text-sm text-gray-700 leading-snug">
                A short example showing scope and technical stack.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No projects listed</p>
          )}
        </section>
      </main>

      <footer className="mt-6 text-xs text-gray-500 text-center">
        Standard resume template · Clean & professional
        <br />
        <span className="italic">Created by AI Prep Buddy</span>
      </footer>
    </div>
  );
}
