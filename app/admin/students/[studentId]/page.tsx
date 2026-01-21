"use client";

import { useParams, useRouter } from "next/navigation";

/* ---------------- Types ---------------- */

type Quiz = {
  id: string;
  title: string;
  score: number;
  date: string;
};

type Interview = {
  id: string;
  type: "HR" | "Technical";
  rating: number;
  date: string;
};

type CodingAttempt = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Solved" | "Unsolved";
};

type StudentProfile = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  status: "active" | "inactive";
  joinedAt: string;
  resumesMade: number;
  quizzes: Quiz[];
  interviews: Interview[];
  coding: CodingAttempt[];
};

/* ---------------- Mock Data ---------------- */

const MOCK_PROFILE: StudentProfile = {
  id: "stu-002",
  name: "Ananya Iyer",
  email: "ananya.iyer@iitb.ac.in",
  rollNo: "CSE25A002",
  status: "active",
  joinedAt: "2024-07-13",
  resumesMade: 5,
  quizzes: [
    { id: "q1", title: "TCS Aptitude Test", score: 82, date: "2024-08-01" },
    {
      id: "q2",
      title: "Infosys Technical Assessment",
      score: 79,
      date: "2024-08-12",
    },
  ],
  interviews: [
    { id: "i1", type: "HR", rating: 4.5, date: "2024-08-20" },
    { id: "i2", type: "Technical", rating: 4.2, date: "2024-09-01" },
  ],
  coding: [
    { id: "c1", title: "Two Sum", difficulty: "Easy", status: "Solved" },
    { id: "c2", title: "LRU Cache", difficulty: "Medium", status: "Solved" },
    { id: "c3", title: "Word Ladder", difficulty: "Hard", status: "Unsolved" },
  ],
};

export default function StudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const { studentId } = params;

  const router = useRouter();
  const student = MOCK_PROFILE; // later fetch using studentId

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header / Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {student.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {student.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {student.rollNo} · {student.email}
              </p>

              <span
                className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${
                  student.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    student.status === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {student.status === "active"
                  ? "Active Student"
                  : "Inactive Student"}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
          >
            ← Back
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <StatCard
            label="Quizzes Taken"
            value={student.quizzes.length}
            color="amber"
          />
          <StatCard
            label="AI Interviews"
            value={student.interviews.length}
            color="purple"
          />
          <StatCard
            label="Resumes Made"
            value={student.resumesMade}
            color="blue"
          />
          <StatCard
            label="Coding Attempts"
            value={student.coding.length}
            color="green"
          />
        </div>

        {/* Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ActivitySection title="Quizzes" accent="amber">
            {student.quizzes.map((q) => (
              <ActivityItem
                key={q.id}
                title={q.title}
                meta={`${q.score}% • ${formatDate(q.date)}`}
              />
            ))}
          </ActivitySection>

          <ActivitySection title="AI Interviews" accent="purple">
            {student.interviews.map((i) => (
              <ActivityItem
                key={i.id}
                title={`${i.type} Interview`}
                meta={`Rating ${i.rating} ★ • ${formatDate(i.date)}`}
              />
            ))}
          </ActivitySection>

          <ActivitySection title="Coding Practice" accent="green">
            {student.coding.map((c) => (
              <ActivityItem
                key={c.id}
                title={c.title}
                meta={`${c.difficulty} • ${c.status}`}
                badge={c.difficulty}
              />
            ))}
          </ActivitySection>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "purple" | "blue" | "green";
}) {
  const colors = {
    amber: "from-amber-400 to-amber-500",
    purple: "from-purple-500 to-indigo-500",
    blue: "from-blue-500 to-sky-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-md p-6">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors[color]}`}
      />
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

function ActivitySection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: "amber" | "purple" | "green";
  children: React.ReactNode;
}) {
  const accents = {
    amber: "border-amber-400",
    purple: "border-purple-400",
    green: "border-green-400",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border-t-4 ${accents[accent]}`}
    >
      <div className="px-6 py-4 font-semibold text-gray-900 border-b border-gray-100">
        {title}
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function ActivityItem({
  title,
  meta,
  badge,
}: {
  title: string;
  meta: string;
  badge?: string;
}) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{meta}</div>
        </div>

        {badge && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
