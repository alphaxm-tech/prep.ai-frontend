// AdminLanding.tsx
"use client";

import React, { useMemo, useState } from "react";

type College = {
  id: string;
  name: string;
  city: string;
  studentsCount: number;
  verifiedPercent: number; // 0-100
  lastActive: string; // human readable
};

type Student = {
  id: string;
  fullname: string;
  email: string;
  verified: boolean;
  lastSeen: string;
};

const MOCK_COLLEGES: College[] = [
  {
    id: "c1",
    name: "Vikram University",
    city: "Pune",
    studentsCount: 1240,
    verifiedPercent: 81,
    lastActive: "2 hours ago",
  },
  {
    id: "c2",
    name: "Nalanda College",
    city: "Bengaluru",
    studentsCount: 820,
    verifiedPercent: 76,
    lastActive: "1 day ago",
  },
  {
    id: "c3",
    name: "IIT Creative",
    city: "Mumbai",
    studentsCount: 430,
    verifiedPercent: 92,
    lastActive: "30 mins ago",
  },
  {
    id: "c4",
    name: "St. Mary's",
    city: "Chennai",
    studentsCount: 310,
    verifiedPercent: 68,
    lastActive: "3 days ago",
  },
  {
    id: "c5",
    name: "Modern Tech Institute",
    city: "Hyderabad",
    studentsCount: 520,
    verifiedPercent: 87,
    lastActive: "5 hours ago",
  },
];

const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    fullname: "Aisha Khan",
    email: "aisha.k@example.com",
    verified: true,
    lastSeen: "1h",
  },
  {
    id: "s2",
    fullname: "Rohit Sharma",
    email: "rohit.s@example.com",
    verified: false,
    lastSeen: "3d",
  },
  {
    id: "s3",
    fullname: "Neha Patel",
    email: "neha.p@example.com",
    verified: true,
    lastSeen: "12m",
  },
  {
    id: "s4",
    fullname: "Vikram Rao",
    email: "vikram.r@example.com",
    verified: true,
    lastSeen: "2d",
  },
  {
    id: "s5",
    fullname: "John Doe",
    email: "john.d@example.com",
    verified: false,
    lastSeen: "5h",
  },
];

export default function AdminLanding() {
  const [colleges] = useState<College[]>(MOCK_COLLEGES);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [students] = useState<Student[]>(MOCK_STUDENTS);

  const totals = useMemo(() => {
    const totalColleges = colleges.length;
    const totalStudents = colleges.reduce((s, c) => s + c.studentsCount, 0);
    const avgVerified = Math.round(
      colleges.reduce((s, c) => s + c.verifiedPercent, 0) /
        Math.max(1, totalColleges)
    );
    return { totalColleges, totalStudents, avgVerified };
  }, [colleges]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    colleges.forEach((c) => set.add(c.city));
    return Array.from(set);
  }, [colleges]);

  const filtered = useMemo(() => {
    return colleges.filter((c) => {
      if (cityFilter && c.city !== cityFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
      );
    });
  }, [colleges, cityFilter, query]);

  // Handlers (replace with API calls as needed)
  function handleAddCollege() {
    alert("Open create college modal (stub).");
  }
  function handleInviteAdmin() {
    alert("Open invite admin modal (stub).");
  }
  function handleOpenCollege(c: College) {
    setSelectedCollege(c);
  }
  function handleClosePreview() {
    setSelectedCollege(null);
  }
  function handleResendVerification(student: Student) {
    alert(`Resend verification to ${student.email} (stub).`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/60 via-white to-yellow-100/30">
      {/* Topbar */}
      <header className="border-b border-yellow-100/50 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-300 flex items-center justify-center shadow-md">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-2 0-3 1-4 2s-2 2-4 2 1 2 2 2 2-1 4-2 2-2 4-2 3 1 4 2 2 2 4 2-1-2-2-2-2 1-4 2-2 2-4 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Prep AI — Admin
              </h1>
              <p className="text-xs text-slate-500">
                Colleges & student management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleAddCollege}
                className="inline-flex items-center gap-2 rounded-md bg-yellow-400 px-3 py-2 text-sm font-medium text-yellow-900 shadow hover:brightness-95"
              >
                + Add college
              </button>
              <button
                onClick={handleInviteAdmin}
                className="rounded-md px-3 py-2 text-sm border border-yellow-200 text-yellow-900 bg-white"
              >
                Invite admin
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">
                <div className="font-medium">Admin</div>
                <div className="text-xs text-slate-500">you@prep.ai</div>
              </div>
              <img
                src="https://i.pravatar.cc/40"
                alt="me"
                className="h-9 w-9 rounded-full border"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Search & filters */}
        <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <label className="relative block">
              <span className="sr-only">Search colleges</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-600">
                🔎
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-yellow-100 bg-white/80 px-10 py-2 text-sm shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="Search colleges, cities..."
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={cityFilter ?? ""}
              onChange={(e) => setCityFilter(e.target.value || null)}
              className="rounded-lg border border-yellow-100 bg-white px-3 py-2 text-sm"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setQuery("");
                setCityFilter(null);
              }}
              className="rounded-lg px-3 py-2 text-sm border border-yellow-100 bg-white"
            >
              Reset
            </button>
          </div>
        </section>

        {/* KPIs */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="Colleges"
            value={totals.totalColleges.toString()}
            helper="Active partnerships"
          />
          <MetricCard
            title="Students"
            value={totals.totalStudents.toString()}
            helper="Total students"
          />
          <MetricCard
            title="Avg verified"
            value={`${totals.avgVerified}%`}
            helper="Email verification avg"
          />
        </section>

        {/* Colleges grid + preview */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Partner colleges
              </h2>
              <p className="text-sm text-slate-500">
                {filtered.length} results
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((col) => (
                <div
                  key={col.id}
                  className="rounded-xl border border-yellow-100/60 bg-gradient-to-br from-white to-yellow-50/40 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">{col.city}</div>
                      <div className="mt-1 text-lg font-medium text-slate-900">
                        {col.name}
                      </div>
                      <div className="mt-2 flex gap-2 text-xs text-slate-600">
                        <span>{col.studentsCount} students</span>
                        <span>•</span>
                        <span>{col.verifiedPercent}% verified</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-slate-500">
                        Active {col.lastActive}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenCollege(col)}
                          className="rounded-md px-3 py-1 text-sm bg-yellow-50 text-yellow-800 border border-yellow-100"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => alert("Open settings (stub)")}
                          className="rounded-md px-2 py-1 text-sm border text-slate-700"
                        >
                          ⋯
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right preview panel */}
          <aside className="rounded-xl border border-yellow-100/60 bg-gradient-to-br from-yellow-50/40 to-white/70 p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {selectedCollege ? selectedCollege.name : "Quick preview"}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCollege
                    ? selectedCollege.city
                    : "Select a college to preview students & stats"}
                </p>
              </div>
              {selectedCollege && (
                <button
                  onClick={handleClosePreview}
                  className="text-xs text-slate-500"
                >
                  Close
                </button>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {selectedCollege ? (
                <>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <div>{selectedCollege.studentsCount} students</div>
                    <div>{selectedCollege.verifiedPercent}% verified</div>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Recent students
                  </div>
                  <ul className="mt-2 space-y-2">
                    {students.slice(0, 5).map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">
                            {s.fullname}
                          </div>
                          <div className="text-xs text-slate-500">
                            {s.email}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${
                              s.verified ? "text-green-600" : "text-yellow-700"
                            }`}
                          >
                            {s.verified ? "Verified" : "Unverified"}
                          </span>
                          {!s.verified && (
                            <button
                              onClick={() => handleResendVerification(s)}
                              className="text-xs text-slate-600 underline"
                            >
                              Resend
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <button
                      onClick={() =>
                        alert("Go to full college dashboard (stub)")
                      }
                      className="w-full rounded-md bg-yellow-400 px-3 py-2 text-sm font-medium text-yellow-900"
                    >
                      Open college dashboard
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-600">
                  No college selected.
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

/* ---------- small subcomponents ----------- */

function MetricCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-yellow-100/60 bg-gradient-to-br from-yellow-50/40 to-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
          {helper && (
            <div className="mt-1 text-xs text-slate-500">{helper}</div>
          )}
        </div>
        <div className="rounded-md bg-yellow-50 px-3 py-2 text-yellow-800">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
