// components/resume-formats/StandardResume.tsx
import React from "react";
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/utils/api/types/resume.types";

export default function StandardResumeTemplate({
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

  // console.log(projects);

  const allSkills =
    skills?.length || softskills?.length
      ? [...(skills ?? []), ...(softskills ?? [])]
      : [];

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-md rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <header className="border-b border-gray-300 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {ph(fullName, "Resume Title")}
        </h1>

        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span>📧 {ph(email, "example@gmail.com")}</span>
          <span>📞 {ph(user?.phone, "+91-0000000000")}</span>
          <span>📍 {ph(user?.location, "City, Country")}</span>
        </div>
      </header>

      <main className="space-y-6">
        {/* Summary */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {ph(
              user?.objective,
              "Brief summary about your focus, technologies, and impact."
            )}
          </p>
        </section>

        {(allSkills.length || showPlaceholders) && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {allSkills.length
                ? allSkills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {s}
                    </span>
                  ))
                : showPlaceholders && (
                    <>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        React
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        TypeScript
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        Communication
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        Ownership
                      </span>
                    </>
                  )}
            </div>
          </section>
        )}

        {/* Skills (soft only) */}
        {/* {(softskills?.length || showPlaceholders) && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {softskills?.length
                ? softskills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {s}
                    </span>
                  ))
                : showPlaceholders && (
                    <>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        Communication
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        Ownership
                      </span>
                    </>
                  )}
            </div>
          </section>
        )} */}

        {/* Education */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Education
          </h2>

          {education?.length ? (
            <div className="space-y-3">
              {education.map((ed: Education, idx: number) => (
                <div key={idx}>
                  <div className="font-medium text-gray-900">{ed.degree}</div>
                  <div className="text-sm text-gray-700">{ed.institute}</div>
                  <div className="text-xs text-gray-500">
                    {ed.start_year} – {ed.end_year} • {ed.location}
                    {ed.grade ? ` • GPA: ${ed.grade}` : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : showPlaceholders ? (
            <div>
              <div className="font-medium text-gray-900">B.Tech</div>
              <div className="text-sm text-gray-700">Your University</div>
              <div className="text-xs text-gray-500">2019–2023 • City</div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No education listed</p>
          )}
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Work Experience
          </h2>

          {experience?.length ? (
            <div className="space-y-4">
              {experience.map((exp: WorkExperience, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {exp.role}
                      </div>
                      <div className="text-sm text-gray-700">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {exp.start_year} – {exp.end_year}
                    </div>
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
                    Software Engineer
                  </div>
                  <div className="text-sm text-gray-700">Company Name</div>
                </div>
                <div className="text-xs text-gray-500">2023 – Present</div>
              </div>
              <p className="mt-1 text-sm text-gray-700 leading-snug">
                Built reliable backend services and user-facing features.
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

          {projects?.length ? (
            <div className="space-y-3">
              {projects.map((p: Project, idx: number) => (
                <div key={idx}>
                  <div className="font-medium text-gray-900">{p.name}</div>
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
