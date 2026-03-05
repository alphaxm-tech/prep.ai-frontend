"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ChevronDown,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  X,
  ArrowUpRight,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  MOCK_STUDENTS,
  COLLEGE_GROUPS,
  BRANCHES,
  type Student,
} from "@/utils/dummy-data/mock-students";

/* ─────────────────────── Helpers ───────────────────────────── */
function readinessColor(v: number) {
  if (v >= 85) return { bar: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
  if (v >= 65) return { bar: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
  return { bar: "bg-red-400", text: "text-red-600", bg: "bg-red-50 border-red-200" };
}

const PLACEMENT_STATUS_STYLES: Record<Student["placementStatus"], string> = {
  Placed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Offered: "bg-blue-50 text-blue-700 border border-blue-200",
  Shortlisted: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Unplaced: "bg-gray-100 text-gray-500 border border-gray-200",
};

const YEAR_LABELS: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

/* ─────────────────────── Sub-components ────────────────────── */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm hover:border-yellow-400 transition text-gray-700 whitespace-nowrap"
      >
        <span className={value !== "All" ? "font-semibold text-yellow-700" : ""}>{value === "All" ? label : value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        {value !== "All" && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange("All"); setOpen(false); }}
            className="ml-0.5 text-yellow-500 hover:text-yellow-700 transition"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
          <button
            onClick={() => { onChange("All"); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === "All" ? "bg-yellow-50 text-yellow-800 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt ? "bg-yellow-50 text-yellow-800 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadinessBar({ value }: { value: number }) {
  const c = readinessColor(value);
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${c.text}`}>{value}%</span>
    </div>
  );
}

/* ─── Student Row (table view) ─── */
function StudentRow({ student, rank }: { student: Student; rank: number }) {
  const router = useRouter();
  const c = readinessColor(student.readiness);
  return (
    <tr
      className="border-t border-gray-50 hover:bg-yellow-50/30 transition-colors cursor-pointer group"
      onClick={() => router.push(`/placement/students/${student.id}`)}
    >
      <td className="py-3.5 px-5">
        <span className="text-xs font-bold text-gray-400 w-5 inline-block text-center">{rank}</span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            {student.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
              {student.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{student.rollNo}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap">
          {student.branch}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium whitespace-nowrap">
          {YEAR_LABELS[student.year]}
        </span>
      </td>
      <td className="py-3.5 px-4 max-w-[180px]">
        <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100 text-xs font-medium truncate block">
          {student.group}
        </span>
      </td>
      <td className="py-3.5 px-4 text-xs font-bold text-gray-700">{student.cgpa}</td>
      <td className="py-3.5 px-4">
        <div className="w-32">
          <ReadinessBar value={student.readiness} />
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${PLACEMENT_STATUS_STYLES[student.placementStatus]}`}>
          {student.placementStatus}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {student.quizzesTaken}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            {student.aiInterviews}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {student.codingAttempts}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <button className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 group-hover:text-yellow-600 group-hover:border-yellow-200 transition shadow-sm">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

/* ─── Student Card (grid view) ─── */
function StudentCard({ student }: { student: Student }) {
  const router = useRouter();
  const c = readinessColor(student.readiness);
  return (
    <div
      onClick={() => router.push(`/placement/students/${student.id}`)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-amber-300" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
              {student.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
                {student.name}
              </p>
              <p className="text-xs text-gray-400">{student.rollNo}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 ${PLACEMENT_STATUS_STYLES[student.placementStatus]}`}>
            {student.placementStatus}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-medium">{student.branch}</span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[11px] font-medium">{YEAR_LABELS[student.year]}</span>
          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-[11px] font-medium truncate max-w-[130px]">{student.group}</span>
        </div>

        {/* Readiness */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400 font-medium">Readiness</span>
            <span className={`text-[11px] font-bold ${c.text}`}>{student.readiness}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${student.readiness}%` }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="text-center">
            <p className="text-base font-bold text-amber-600">{student.quizzesTaken}</p>
            <p className="text-[10px] text-gray-400">Quizzes</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-violet-600">{student.aiInterviews}</p>
            <p className="text-[10px] text-gray-400">Interviews</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-emerald-600">{student.codingAttempts}</p>
            <p className="text-[10px] text-gray-400">Coding</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-700">{student.cgpa}</p>
            <p className="text-[10px] text-gray-400">CGPA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q);
      const matchBranch = branchFilter === "All" || s.branch === branchFilter;
      const matchGroup = groupFilter === "All" || s.group === groupFilter;
      const matchYear = yearFilter === "All" || s.year === Number(yearFilter);
      const matchStatus = statusFilter === "All" || s.status === statusFilter.toLowerCase();
      const matchPlacement = placementFilter === "All" || s.placementStatus === placementFilter;
      return matchSearch && matchBranch && matchGroup && matchYear && matchStatus && matchPlacement;
    });
  }, [search, branchFilter, groupFilter, yearFilter, statusFilter, placementFilter]);

  /* Summary stats */
  const totalPlaced = MOCK_STUDENTS.filter((s) => s.placementStatus === "Placed").length;
  const totalOffered = MOCK_STUDENTS.filter((s) => s.placementStatus === "Offered").length;
  const totalShortlisted = MOCK_STUDENTS.filter((s) => s.placementStatus === "Shortlisted").length;
  const avgReadiness = Math.round(
    MOCK_STUDENTS.reduce((sum, s) => sum + s.readiness, 0) / MOCK_STUDENTS.length
  );

  const activeFilters =
    [branchFilter, groupFilter, yearFilter, statusFilter, placementFilter].filter((f) => f !== "All").length;

  const clearAll = () => {
    setBranchFilter("All");
    setGroupFilter("All");
    setYearFilter("All");
    setStatusFilter("All");
    setPlacementFilter("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Student Management
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              View, filter and manage all students across branches, years and groups
            </p>
          </div>

          {/* KPI chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "Total", value: MOCK_STUDENTS.length, color: "bg-gray-50 border-gray-200 text-gray-700", dot: "bg-gray-400" },
              { label: "Placed", value: totalPlaced, color: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
              { label: "Offered", value: totalOffered, color: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500" },
              { label: "Shortlisted", value: totalShortlisted, color: "bg-yellow-50 border-yellow-200 text-yellow-700", dot: "bg-yellow-500" },
              { label: "Avg Readiness", value: `${avgReadiness}%`, color: "bg-violet-50 border-violet-200 text-violet-700", dot: "bg-violet-500" },
            ].map((chip) => (
              <div key={chip.label} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm ${chip.color}`}>
                <span className={`w-2 h-2 rounded-full ${chip.dot}`} />
                <span className="font-bold">{chip.value}</span>
                <span className="text-xs opacity-70">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTERS BAR ── */}
        <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, roll no, email..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Branch"
                value={branchFilter}
                options={BRANCHES}
                onChange={setBranchFilter}
              />
              <FilterSelect
                label="Group"
                value={groupFilter}
                options={COLLEGE_GROUPS}
                onChange={setGroupFilter}
              />
              <FilterSelect
                label="Year"
                value={yearFilter === "All" ? "All" : YEAR_LABELS[Number(yearFilter)] ?? "All"}
                options={["1", "2", "3", "4"].map((y) => YEAR_LABELS[Number(y)])}
                onChange={(v) => {
                  if (v === "All") { setYearFilter("All"); return; }
                  const num = Object.entries(YEAR_LABELS).find(([, label]) => label === v)?.[0];
                  setYearFilter(num ?? "All");
                }}
              />
              <FilterSelect
                label="Status"
                value={statusFilter}
                options={["Active", "Inactive"]}
                onChange={setStatusFilter}
              />
              <FilterSelect
                label="Placement"
                value={placementFilter}
                options={["Placed", "Offered", "Shortlisted", "Unplaced"]}
                onChange={setPlacementFilter}
              />

              {activeFilters > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all ({activeFilters})
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${viewMode === "table" ? "bg-white shadow-sm text-yellow-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-white shadow-sm text-yellow-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filter summary */}
          {activeFilters > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap text-xs text-gray-500">
              <Filter className="w-3.5 h-3.5 text-yellow-500" />
              <span>Showing</span>
              <span className="font-bold text-gray-800">{filtered.length}</span>
              <span>of</span>
              <span className="font-bold text-gray-800">{MOCK_STUDENTS.length}</span>
              <span>students</span>
              {branchFilter !== "All" && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">{branchFilter}</span>}
              {groupFilter !== "All" && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">{groupFilter}</span>}
              {yearFilter !== "All" && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg font-semibold">{YEAR_LABELS[Number(yearFilter)]}</span>}
              {statusFilter !== "All" && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">{statusFilter}</span>}
              {placementFilter !== "All" && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">{placementFilter}</span>}
            </div>
          )}
        </div>

        {/* ── TABLE VIEW ── */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">All Students</h2>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                  {filtered.length}
                </span>
              </div>
              <p className="text-xs text-gray-400">Click a row to open student profile</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#", "Student", "Branch", "Year", "Group", "CGPA", "Readiness", "Status", "Activity", ""].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide first:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, i) => (
                    <StudentRow key={student.id} student={student} rank={i + 1} />
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <AlertCircle className="w-8 h-8 text-gray-200" />
                          <p className="text-sm font-medium">No students match your filters</p>
                          <button onClick={clearAll} className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold mt-1 transition">
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center gap-5 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Quizzes</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" /> AI Interviews</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Coding Attempts</span>
            </div>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {viewMode === "grid" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-800">{filtered.length}</span> students
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-2 text-gray-400">
                <AlertCircle className="w-8 h-8 text-gray-200" />
                <p className="text-sm font-medium">No students match your filters</p>
                <button onClick={clearAll} className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold mt-1 transition">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BRANCH + GROUP SUMMARY ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Branch breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Branch-wise Breakdown</h2>
            </div>
            <div className="space-y-3">
              {BRANCHES.map((branch) => {
                const branchStudents = MOCK_STUDENTS.filter((s) => s.branch === branch);
                const placed = branchStudents.filter((s) => s.placementStatus === "Placed" || s.placementStatus === "Offered").length;
                const pct = branchStudents.length > 0 ? Math.round((placed / branchStudents.length) * 100) : 0;
                if (branchStudents.length === 0) return null;
                return (
                  <div key={branch} className="flex items-center gap-3">
                    <span className="w-20 text-xs font-semibold text-gray-700 flex-shrink-0">{branch}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-28 text-right flex-shrink-0">
                      <span className="font-bold text-gray-800">{placed}</span>/{branchStudents.length} placed
                    </span>
                    <span className="w-10 text-right text-xs font-bold text-yellow-600 flex-shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Group-wise Avg Readiness</h2>
            </div>
            <div className="space-y-3">
              {COLLEGE_GROUPS.map((group) => {
                const gs = MOCK_STUDENTS.filter((s) => s.group === group);
                if (gs.length === 0) return null;
                const avg = Math.round(gs.reduce((sum, s) => sum + s.readiness, 0) / gs.length);
                const c = readinessColor(avg);
                return (
                  <div key={group} className="flex items-center gap-3">
                    <span className="w-36 text-xs font-semibold text-gray-700 truncate flex-shrink-0">{group}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${avg}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 w-10 text-right">{gs.length} stu.</span>
                    <span className={`text-xs font-bold w-10 text-right flex-shrink-0 ${c.text}`}>{avg}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
