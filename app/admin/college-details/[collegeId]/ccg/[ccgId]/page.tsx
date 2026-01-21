"use client";

import React from "react";
import { useParams } from "next/navigation";
import StudentsTable from "@/components/StudentsTable";
import { MOCK_CONTEXT, MOCK_STUDENTS } from "@/utils/dummy-data/mock-students";

export default function CCGStudentsPage() {
  // const params = useParams();
  // const { collegeId, ccgId } = params;

  const params = useParams<{
    collegeId: string;
    ccgId: string;
  }>();

  const { collegeId, ccgId } = params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Context Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {MOCK_CONTEXT.ccgName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {MOCK_CONTEXT.collegeName} · {MOCK_CONTEXT.branchName} · Academic
            Year {MOCK_CONTEXT.academicYear}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Total Students"
            value={MOCK_STUDENTS.length}
            variant="green"
          />
          <StatCard
            label="Active Students"
            value={
              MOCK_STUDENTS.filter((s: any) => s.status === "active").length
            }
            variant="yellow"
          />
          <StatCard
            label="Inactive Students"
            value={
              MOCK_STUDENTS.filter((s: any) => s.status === "inactive").length
            }
            variant="blue"
          />
        </div>

        {/* Table Container */}
        <StudentsTable></StudentsTable>
      </div>
    </div>
  );
}

/* ---------------- Small component ---------------- */

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "green" | "yellow" | "blue";
}) {
  const styles = {
    green: "bg-green-50 border-green-100 text-green-700",
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
  };

  return (
    <div className={`rounded-2xl border shadow-sm p-6 ${styles[variant]}`}>
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}
