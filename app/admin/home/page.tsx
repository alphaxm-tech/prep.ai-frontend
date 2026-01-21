"use client";

import AdminCollegeCard from "@/components/AdminCollegeCard";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_COLLEGES, type College } from "@/lib/college";

export default function AdminLanding() {
  const router = useRouter();
  const [colleges] = useState<College[]>(MOCK_COLLEGES);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const totals = useMemo(() => {
    const totalColleges = colleges.length;
    const totalStudents = colleges.reduce(
      (s, c) => s + (c.studentsCount || 0),
      0,
    );
    const avgVerified = Math.round(
      colleges.reduce((s, c) => s + (c.verifiedPercent || 0), 0) /
        Math.max(1, totalColleges) || 0,
    );
    return { totalColleges, totalStudents, avgVerified };
  }, [colleges]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    colleges.forEach((c) => c.city && set.add(c.city));
    return Array.from(set);
  }, [colleges]);

  const filtered = useMemo(() => {
    return colleges.filter((c) => {
      if (cityFilter && c.city !== cityFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q))
      );
    });
  }, [colleges, cityFilter, query]);

  function handleAddCollege() {
    router.push("/admin/add-college/college");
  }

  function handleInviteAdmin() {
    alert("Open invite admin modal (stub).");
  }

  function handleViewDetails(c: College) {
    router.push("/admin/college-details");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md">
              PA
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Prep AI Admin
              </h1>
              <p className="text-xs text-gray-500">College Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddCollege}
              className="hidden sm:inline-flex rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:from-amber-600 hover:to-amber-700 transition"
            >
              + Add College
            </button>

            <button
              onClick={handleInviteAdmin}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Invite Admin
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  Admin User
                </div>
                <div className="text-xs text-gray-500">admin@prepai.com</div>
              </div>
              <img
                src="https://i.pravatar.cc/40"
                alt="Admin"
                className="h-9 w-9 rounded-full border border-gray-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* Title + Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Colleges
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage registered colleges and configurations
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Colleges"
              value={totals.totalColleges}
              color="amber"
            />
            <StatCard
              label="Students"
              value={totals.totalStudents}
              color="blue"
            />
            <StatCard
              label="Verified %"
              value={`${totals.avgVerified}%`}
              color="green"
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl bg-white px-10 py-3 text-sm shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Search colleges, codes, cities..."
            />
          </div>

          <select
            value={cityFilter ?? ""}
            onChange={(e) => setCityFilter(e.target.value || null)}
            className="rounded-2xl bg-white px-4 py-3 text-sm border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
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
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((col) => (
            <AdminCollegeCard
              key={col.id}
              college={col}
              onView={() => handleViewDetails(col)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: "amber" | "blue" | "green";
}) {
  const colors = {
    amber: "from-amber-400 to-amber-500",
    blue: "from-blue-500 to-sky-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-md p-5">
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${colors[color]}`}
      />
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}
