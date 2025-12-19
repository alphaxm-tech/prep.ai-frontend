// app/admin/home/page.tsx
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
      0
    );
    const avgVerified = Math.round(
      colleges.reduce((s, c) => s + (c.verifiedPercent || 0), 0) /
        Math.max(1, totalColleges) || 0
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
    router.push("/admin/add-colleg/college");
  }

  function handleInviteAdmin() {
    alert("Open invite admin modal (stub).");
  }

  function handleViewDetails(c: College) {
    alert(`Open details for ${c.name} (stub).`);
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
                  d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Prep AI Admin
              </h1>
              <p className="text-xs text-slate-500">
                College Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleAddCollege}
                className="inline-flex items-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900 shadow hover:brightness-95"
              >
                + Add College
              </button>
              <button
                onClick={handleInviteAdmin}
                className="rounded-md px-3 py-2 text-sm border border-yellow-200 text-yellow-900 bg-white"
              >
                Invite admin
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700 text-right hidden sm:block">
                <div className="font-medium">Admin User</div>
                <div className="text-xs text-slate-500">admin@prepai.com</div>
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
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Title row */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Colleges</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage all registered colleges and their configurations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-sm font-medium text-slate-900">
                {totals.totalColleges} colleges
              </div>
            </div>

            <button
              onClick={handleAddCollege}
              className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900 shadow hover:brightness-95"
            >
              + Add College
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <label className="relative block">
              <span className="sr-only">Search colleges</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-600">
                🔎
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-yellow-100 bg-white/80 px-10 py-3 text-sm shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="Search colleges, codes, cities..."
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
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
