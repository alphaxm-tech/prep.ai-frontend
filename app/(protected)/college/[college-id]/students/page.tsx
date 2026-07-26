"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  Filter,
  ChevronDown,
  Users,
  AlertCircle,
  X,
  ArrowUpRight,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useListStudents, useStudentFilterOptions } from "@/server-api/queries/student.queries";
import { useGetAllGroups } from "@/server-api/queries/ccg.queries";
import { StudentListItem } from "@/server-api/api/types/student.types";

const PAGE_SIZE = 20;

/* ─────────────────────── Helpers ───────────────────────────── */
// Fields with no backend source yet (placement, readiness, CGPA, per-activity
// counts) render as a blurred placeholder instead of removing the UI slot.
// Note: pointer-events-none is intentionally NOT set here — it would stop the
// element from ever receiving hover, which silently kills the title tooltip.
function ComingSoon({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title="This will be live soon"
      className={`blur-[3px] select-none cursor-help ${className}`}
    >
      {children}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

/* ─────────────────────── Sub-components ────────────────────── */
function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        title={disabled ? "This will be live soon" : undefined}
        className={`flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm transition text-gray-700 whitespace-nowrap ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-400"}`}
      >
        <span
          className={value !== "All" ? "font-semibold text-yellow-700" : ""}
        >
          {value === "All" ? label : value}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
        {value !== "All" && !disabled && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("All");
              setOpen(false);
            }}
            className="ml-0.5 text-yellow-500 hover:text-yellow-700 transition"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>
      {open && !disabled && (
        <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
          <button
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === "All" ? "bg-yellow-50 text-yellow-800 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
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

/* ─── Student Row (table view) ─── */
function StudentRow({
  student,
  rank,
  collegeId,
}: {
  student: StudentListItem;
  rank: number;
  collegeId: string;
}) {
  const router = useRouter();
  return (
    <tr
      className="border-t border-gray-50 hover:bg-yellow-50/30 transition-colors cursor-pointer group"
      onClick={() =>
        router.push(`/college/${collegeId}/students/${student.user_id}`)
      }
    >
      <td className="py-3.5 px-5">
        <span className="text-xs font-bold text-gray-400 w-5 inline-block text-center">
          {rank}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            {(student.name || student.email)[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
              {student.name || student.email}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {student.roll_number || student.email}
            </p>
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
          {student.year}
        </span>
      </td>
      <td className="py-3.5 px-4 max-w-[180px]">
        <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-100 text-xs font-medium truncate block">
          {student.group || "—"}
        </span>
      </td>
      <td className="py-3.5 px-4 text-xs font-bold text-gray-700">
        <ComingSoon>8.4</ComingSoon>
      </td>
      <td className="py-3.5 px-4">
        <div className="w-32 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <ComingSoon className="block h-full w-full">
              <div className="h-full w-3/4 bg-emerald-400 rounded-full" />
            </ComingSoon>
          </div>
          <ComingSoon className="text-xs font-bold w-8 text-right">
            75%
          </ComingSoon>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLES[student.status] ?? STATUS_STYLES.active}`}
        >
          {student.status}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <ComingSoon className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            12
          </ComingSoon>
          <ComingSoon className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            3
          </ComingSoon>
          <ComingSoon className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            60
          </ComingSoon>
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
function StudentCard({
  student,
  collegeId,
}: {
  student: StudentListItem;
  collegeId: string;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(`/college/${collegeId}/students/${student.user_id}`)
      }
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-amber-300" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
              {(student.name || student.email)[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">
                {student.name || student.email}
              </p>
              <p className="text-xs text-gray-400">
                {student.roll_number || student.email}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0">
            <ComingSoon>Placed</ComingSoon>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-medium">
            {student.branch}
          </span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[11px] font-medium">
            {student.year}
          </span>
          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-[11px] font-medium truncate max-w-[130px]">
            {student.group || "—"}
          </span>
        </div>

        {/* Readiness */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400 font-medium">
              Readiness
            </span>
            <ComingSoon className="text-[11px] font-bold">75%</ComingSoon>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <ComingSoon className="block h-full w-full">
              <div className="h-full w-3/4 bg-emerald-400 rounded-full" />
            </ComingSoon>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="text-center">
            <ComingSoon className="block text-base font-bold text-amber-600">
              12
            </ComingSoon>
            <p className="text-[10px] text-gray-400">Quizzes</p>
          </div>
          <div className="text-center">
            <ComingSoon className="block text-base font-bold text-violet-600">
              3
            </ComingSoon>
            <p className="text-[10px] text-gray-400">Interviews</p>
          </div>
          <div className="text-center">
            <ComingSoon className="block text-base font-bold text-emerald-600">
              60
            </ComingSoon>
            <p className="text-[10px] text-gray-400">Coding</p>
          </div>
          <div className="text-center">
            <ComingSoon className="block text-base font-bold text-gray-700">
              8.4
            </ComingSoon>
            <p className="text-[10px] text-gray-400">CGPA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  pageNo,
  count,
  totalCount,
  onPageChange,
}: {
  pageNo: number;
  count: number;
  totalCount: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / count));
  const from = totalCount === 0 ? 0 : (pageNo - 1) * count + 1;
  const to = Math.min(pageNo * count, totalCount);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-500">
      <span>
        Showing <span className="font-semibold text-gray-800">{from}</span>–
        <span className="font-semibold text-gray-800">{to}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalCount}</span>{" "}
        students
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pageNo - 1))}
          disabled={pageNo <= 1}
          className="p-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-yellow-400 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-semibold text-gray-700">
          Page {pageNo} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, pageNo + 1))}
          disabled={pageNo >= totalPages}
          className="p-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-yellow-400 transition"
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function StudentsPage() {
  const params = useParams<{ "college-id": string }>();
  const collegeId = Number(params["college-id"]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All"); // group name; resolved to group_id below
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All"); // not wired — no backend data yet
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [pageNo, setPageNo] = useState(1);

  // Debounce free-text search so we don't refetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPageNo(1);
  }, [search, branchFilter, groupFilter, yearFilter, statusFilter]);

  const { data: filterOptions } = useStudentFilterOptions(collegeId);
  const { data: groups = [] } = useGetAllGroups(collegeId);

  const selectedGroup = groups.find((g) => g.name === groupFilter);

  const { data, isLoading, isError } = useListStudents({
    college_id: collegeId,
    search: search || undefined,
    branch: branchFilter !== "All" ? branchFilter : undefined,
    group_id: selectedGroup?.group_id,
    year: yearFilter !== "All" ? Number(yearFilter) : undefined,
    status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
    page_no: pageNo,
    count: PAGE_SIZE,
  });

  const students = data?.students ?? [];
  const totalCount = data?.total_count ?? 0;

  const branchOptions = filterOptions?.branches ?? [];
  const yearOptions = useMemo(
    () => (filterOptions?.years ?? []).map((y) => String(y)),
    [filterOptions],
  );
  const groupOptions = groups.map((g) => g.name);

  const activeFilters = [
    branchFilter,
    groupFilter,
    yearFilter,
    statusFilter,
  ].filter((f) => f !== "All").length;

  const clearAll = () => {
    setBranchFilter("All");
    setGroupFilter("All");
    setYearFilter("All");
    setStatusFilter("All");
    setPlacementFilter("All");
    setSearchInput("");
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Students
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              View, filter and manage all students across branches, years and
              groups
            </p>
          </div>

          {/* KPI chips */}
          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm bg-gray-50 border-gray-200 text-gray-700">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="font-bold">{totalCount}</span>
              <span className="text-xs opacity-70">Total</span>
            </div>
            {[
              {
                label: "Placed",
                color: "bg-emerald-50 border-emerald-200 text-emerald-700",
                dot: "bg-emerald-500",
              },
              {
                label: "Offered",
                color: "bg-blue-50 border-blue-200 text-blue-700",
                dot: "bg-blue-500",
              },
              {
                label: "Shortlisted",
                color: "bg-yellow-50 border-yellow-200 text-yellow-700",
                dot: "bg-yellow-500",
              },
              {
                label: "Avg Readiness",
                color: "bg-violet-50 border-violet-200 text-violet-700",
                dot: "bg-violet-500",
              },
            ].map((chip) => (
              <div
                key={chip.label}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm ${chip.color}`}
              >
                <span className={`w-2 h-2 rounded-full ${chip.dot}`} />
                <ComingSoon className="font-bold">
                  {chip.label === "Avg Readiness" ? "72%" : "18"}
                </ComingSoon>
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, roll no, email..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Branch"
                value={branchFilter}
                options={branchOptions}
                onChange={setBranchFilter}
              />
              <FilterSelect
                label="Group"
                value={groupFilter}
                options={groupOptions}
                onChange={setGroupFilter}
              />
              <FilterSelect
                label="Year"
                value={yearFilter}
                options={yearOptions}
                onChange={setYearFilter}
              />
              <FilterSelect
                label="Status"
                value={
                  statusFilter === "All"
                    ? "All"
                    : statusFilter[0].toUpperCase() + statusFilter.slice(1)
                }
                options={["Active", "Inactive"]}
                onChange={(v) => setStatusFilter(v === "All" ? "All" : v)}
              />
              <FilterSelect
                label="Placement"
                value={placementFilter}
                options={["Placed", "Offered", "Shortlisted", "Unplaced"]}
                onChange={setPlacementFilter}
                disabled
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
              <span className="font-bold text-gray-800">{totalCount}</span>
              <span>students</span>
              {branchFilter !== "All" && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                  {branchFilter}
                </span>
              )}
              {groupFilter !== "All" && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                  {groupFilter}
                </span>
              )}
              {yearFilter !== "All" && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                  {yearFilter}
                </span>
              )}
              {statusFilter !== "All" && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                  {statusFilter}
                </span>
              )}
            </div>
          )}
        </div>

        {isError && (
          <div className="py-10 flex flex-col items-center gap-2 text-red-400">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium">Failed to load students</p>
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {!isError && viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  All Students
                </h2>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                  {totalCount}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Click a row to open student profile
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      "#",
                      "Student",
                      "Branch",
                      "Year",
                      "Group",
                      "CGPA",
                      "Readiness",
                      "Status",
                      "Activity",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide first:px-5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    students.map((student, i) => (
                      <StudentRow
                        key={student.user_id}
                        student={student}
                        rank={(pageNo - 1) * PAGE_SIZE + i + 1}
                        collegeId={params["college-id"]}
                      />
                    ))}
                  {!isLoading && students.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <AlertCircle className="w-8 h-8 text-gray-200" />
                          <p className="text-sm font-medium">
                            No students match your filters
                          </p>
                          <button
                            onClick={clearAll}
                            className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold mt-1 transition"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-gray-400 text-sm">
                        Loading students…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              pageNo={pageNo}
              count={PAGE_SIZE}
              totalCount={totalCount}
              onPageChange={setPageNo}
            />

            {/* Legend */}
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center gap-5 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Quizzes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400" /> AI
                Interviews
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Coding
                Attempts
              </span>
            </div>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!isError && viewMode === "grid" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {totalCount}
                </span>{" "}
                students
              </p>
            </div>
            {isLoading ? (
              <div className="py-20 text-center text-gray-400 text-sm">
                Loading students…
              </div>
            ) : students.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-2 text-gray-400">
                <AlertCircle className="w-8 h-8 text-gray-200" />
                <p className="text-sm font-medium">
                  No students match your filters
                </p>
                <button
                  onClick={clearAll}
                  className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold mt-1 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {students.map((student) => (
                    <StudentCard
                      key={student.user_id}
                      student={student}
                      collegeId={params["college-id"]}
                    />
                  ))}
                </div>
                <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <Pagination
                    pageNo={pageNo}
                    count={PAGE_SIZE}
                    totalCount={totalCount}
                    onPageChange={setPageNo}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── BRANCH + GROUP SUMMARY (placement/readiness-derived — not yet live) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Branch breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Branch-wise Breakdown
              </h2>
            </div>
            <ComingSoon className="block">
              <div className="space-y-3">
                {(branchOptions.length ? branchOptions : ["CSE", "IT", "ECE"]).map(
                  (branch) => (
                    <div key={branch} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-semibold text-gray-700 flex-shrink-0 truncate">
                        {branch}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full"
                          style={{ width: "60%" }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-28 text-right flex-shrink-0">
                        <span className="font-bold text-gray-800">—</span>{" "}
                        placed
                      </span>
                      <span className="w-10 text-right text-xs font-bold text-yellow-600 flex-shrink-0">
                        60%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </ComingSoon>
          </div>

          {/* Group breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                <Users className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                Group-wise Avg Readiness
              </h2>
            </div>
            <ComingSoon className="block">
              <div className="space-y-3">
                {(groupOptions.length ? groupOptions : ["Group A", "Group B"]).map(
                  (group) => (
                    <div key={group} className="flex items-center gap-3">
                      <span className="w-36 text-xs font-semibold text-gray-700 truncate flex-shrink-0">
                        {group}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: "70%" }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 w-10 text-right">
                        — stu.
                      </span>
                      <span className="text-xs font-bold w-10 text-right flex-shrink-0 text-emerald-600">
                        70%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </ComingSoon>
          </div>
        </div>
      </div>
    </div>
  );
}
