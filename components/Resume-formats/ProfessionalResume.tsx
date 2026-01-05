// components/resume-formats/ProfessionalResume.tsx
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/utils/api/types/resume.types";

export default function ProfessionalResumeTemplateVertical({
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
  const { resume_details, user, softskills, education, experience, projects } =
    data;

  const ph = (val?: string, fallback = "") =>
    val && val.trim() ? val : showPlaceholders ? fallback : "";

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white print:bg-white shadow-md rounded-lg ring-1 ring-gray-100">
      <div className="h-2 w-full rounded-t-lg bg-gradient-to-r from-slate-700 to-indigo-600" />

      <div className="px-6 py-6 md:px-10 md:py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {ph(fullName, "Resume Title")}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>📧 {ph(email, "example@gmail.com")}</span>
            <span>📞 {ph(user.phone, "+91-0000000000")}</span>
            <span>📍 {ph(user.location, "City, Country")}</span>
          </div>
        </header>

        {/* Summary */}
        <section className="bg-slate-50 border border-slate-100 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {ph(
              user.objective,
              "Short summary describing your role, strengths, and impact."
            )}
          </p>
        </section>

        {/* Links + Skills */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Links
            </h3>
            <div className="mt-2 text-sm text-indigo-700 flex flex-col gap-1">
              {user.portfolio_website_url ? (
                <a
                  href={user.portfolio_website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Portfolio
                </a>
              ) : (
                showPlaceholders && (
                  <span className="text-slate-400">Portfolio</span>
                )
              )}

              {user.github_url ? (
                <a href={user.github_url} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : (
                showPlaceholders && (
                  <span className="text-slate-400">GitHub</span>
                )
              )}

              {user.linkedin_url ? (
                <a href={user.linkedin_url} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              ) : (
                showPlaceholders && (
                  <span className="text-slate-400">LinkedIn</span>
                )
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
              Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {softskills?.length ? (
                softskills.map((s, i) => (
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
                    Communication
                  </span>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded">
                    Ownership
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
            {education?.length ? (
              education.map((ed: Education, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-slate-100 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {ed.degree}
                      </div>
                      <div className="text-sm text-slate-700">
                        {ed.institute}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {ed.start_year} • {ed.end_year}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {ed.location}
                    {ed.grade ? ` • GPA: ${ed.grade}` : ""}
                  </div>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-3 rounded border border-slate-100 bg-white shadow-sm">
                <div className="font-medium text-slate-900">B.Tech</div>
                <div className="text-sm text-slate-700">Your University</div>
                <div className="text-xs text-slate-500 mt-1">
                  2019–2023 • City
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
            {experience?.length ? (
              experience.map((exp: WorkExperience, i: number) => (
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
                    <div className="text-xs text-slate-500">
                      {exp.start_year} – {exp.end_year}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 leading-normal">
                    {exp.description}
                  </p>
                </article>
              ))
            ) : showPlaceholders ? (
              <article className="p-4 rounded border border-slate-100 bg-white shadow-sm">
                <div className="text-md font-semibold text-slate-900">
                  Software Engineer
                </div>
                <div className="text-sm text-slate-700">Company Name</div>
                <p className="mt-2 text-sm text-slate-700 leading-normal">
                  Worked on scalable systems and business-critical features.
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
            {projects?.length ? (
              projects.map((p: Project, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded border border-slate-100 bg-white shadow-sm"
                >
                  <div className="font-medium text-slate-900">{p.name}</div>
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
