// components/resume-formats/ModernResume.tsx
import {
  AddResumeRequest,
  Education,
  WorkExperience,
  Project,
} from "@/utils/api/types/resume.types";

export default function ModernResumeTemplate({
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
  const { resume_details, user, softskills, experience, education, projects } =
    data;

  const ph = (val?: string, fallback = "") =>
    val && val.trim() ? val : showPlaceholders ? fallback : "";

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {ph(fullName, "Resume Title")}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm mt-4 opacity-90">
          <span> 📧 {ph(email, "example@gmail.com")}</span>
          <span>📞 {ph(user.phone, "+91-0000000000")}</span>
          <span>📍 {ph(user.location, "Your City")}</span>
        </div>
      </header>

      <main className="p-8 space-y-8">
        {/* Objective */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {ph(
              user.objective,
              "Write a short professional summary describing your focus and strengths."
            )}
          </p>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Links
          </h2>
          <div className="flex flex-wrap gap-4 text-indigo-700 text-sm font-medium">
            {user.portfolio_website_url ? (
              <a
                href={user.portfolio_website_url}
                target="_blank"
                rel="noreferrer"
              >
                🌐 Portfolio
              </a>
            ) : (
              showPlaceholders && (
                <span className="text-gray-400">Portfolio</span>
              )
            )}

            {user.github_url ? (
              <a href={user.github_url} target="_blank" rel="noreferrer">
                🧰 GitHub
              </a>
            ) : (
              showPlaceholders && <span className="text-gray-400">GitHub</span>
            )}

            {user.linkedin_url ? (
              <a href={user.linkedin_url} target="_blank" rel="noreferrer">
                💼 LinkedIn
              </a>
            ) : (
              showPlaceholders && (
                <span className="text-gray-400">LinkedIn</span>
              )
            )}
          </div>
        </section>

        {/* Skills (soft only for now) */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {softskills?.length ? (
              softskills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  {s}
                </span>
              ))
            ) : showPlaceholders ? (
              <>
                {/* <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  Communication
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  Ownership
                </span> */}
              </>
            ) : (
              <span className="text-sm text-gray-400">No skills added</span>
            )}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-indigo-100 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {education?.length ? (
              education.map((ed: Education, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {ed.degree}
                      </div>
                      <div className="text-sm text-gray-700">
                        {ed.institute}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {ed.start_year} – {ed.end_year}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ed.location}
                    {ed.grade ? ` • GPA: ${ed.grade}` : ""}
                  </div>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="font-semibold text-gray-900">B.Tech</div>
                <div className="text-sm text-gray-700">Your University</div>
                <div className="text-xs text-gray-500 mt-1">
                  2019–2023 • City
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
            {experience?.length ? (
              experience.map((exp: WorkExperience, i: number) => (
                <div
                  key={i}
                  className="p-5 border border-gray-100 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {exp.role}
                      </div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {exp.start_year} – {exp.end_year}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-5 border border-gray-100 rounded-xl shadow-sm">
                <div className="font-semibold text-gray-900">
                  Software Engineer
                </div>
                <div className="text-sm text-gray-600">Company Name</div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Worked on impactful features and scalable systems.
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
            {projects?.length ? (
              projects.map((p: Project, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-gray-100 rounded-lg"
                >
                  <div className="font-medium text-gray-900">🚀 {p.name}</div>
                  <p className="mt-2 text-sm text-gray-700">{p.description}</p>
                </div>
              ))
            ) : showPlaceholders ? (
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-gray-100 rounded-lg">
                <div className="font-medium text-gray-900">
                  🚀 Example Project
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  A sample project description demonstrating impact.
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
