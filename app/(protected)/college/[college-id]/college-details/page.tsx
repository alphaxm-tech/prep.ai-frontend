"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

type CCG = {
  id: string;
  name: string;
  year: string;
  students: number;
  active: boolean;
};

type Branch = {
  id: string;
  name: string;
  ccgs: CCG[];
};

const MOCK_COLLEGE_DETAILS = {
  id: "iitb",
  name: "IIT Bombay",
  totalStudents: 1240,
  branches: [
    {
      id: "cse",
      name: "Computer Science",
      ccgs: [
        {
          id: "cse-2025-a",
          name: "CSE 2025 - Group A",
          year: "2025",
          students: 120,
          active: true,
        },
        {
          id: "cse-2025-b",
          name: "CSE 2025 - Group B",
          year: "2025",
          students: 110,
          active: true,
        },
      ],
    },
    {
      id: "ece",
      name: "Electronics",
      ccgs: [
        {
          id: "ece-2025",
          name: "ECE 2025",
          year: "2025",
          students: 95,
          active: false,
        },
      ],
    },
  ],
};

export default function CollegeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const collegeId = params.collegeId as string;

  const college = MOCK_COLLEGE_DETAILS;

  const handleMain = () => {
    router.push(`/admin/college-details/iitb/ccg/cse-2025-a`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {college.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            College overview, branches and academic groups
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Total Students"
            value={college.totalStudents}
            variant="green"
          />
          <StatCard
            label="Branches"
            value={college.branches.length}
            variant="yellow"
          />
          <StatCard
            label="Total Groups"
            value={college.branches.reduce((s, b) => s + b.ccgs.length, 0)}
            variant="blue"
          />
        </div>

        {/* Branches */}
        <div className="space-y-8" onClick={handleMain}>
          {college.branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* Branch Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {branch.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {branch.ccgs.length} groups
                  </p>
                </div>

                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                  Branch
                </span>
              </div>

              {/* CCGs */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {branch.ccgs.map((ccg) => (
                  <button
                    key={ccg.id}
                    onClick={() =>
                      router.push(`/admin/college/${collegeId}/ccg/${ccg.id}`)
                    }
                    className="group text-left rounded-xl border border-gray-100 bg-gray-50 p-5 transition
                               hover:bg-white hover:shadow-md hover:border-amber-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-amber-700 transition">
                          {ccg.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Academic year {ccg.year}
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          ccg.active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {ccg.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>{ccg.students} students</span>
                      <span className="text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition">
                        View details →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------ */
/* Small components   */
/* ------------------ */

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
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </div>
  );
}
