"use client";

import React, { useState } from "react";
import {
  Users,
  ClipboardCheck,
  Code2,
  Brain,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

type KPI = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
};

type Student = {
  id: string;
  name: string;
  branch: string;
  year: number;
  readiness: number;
};

const kpis: KPI[] = [
  {
    title: "Total Students",
    value: "1,248",
    change: "+4.2%",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Avg Quiz Score",
    value: "72%",
    change: "+2.1%",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    title: "Coding Completion",
    value: "63%",
    change: "+5.8%",
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    title: "AI Interview Avg",
    value: "7.4/10",
    change: "+1.3%",
    icon: <Brain className="w-5 h-5" />,
  },
];

const topStudents: Student[] = [
  { id: "1", name: "Aarav Sharma", branch: "CSE", year: 4, readiness: 92 },
  { id: "2", name: "Ishita Rao", branch: "IT", year: 3, readiness: 89 },
  { id: "3", name: "Rohan Patel", branch: "CSE", year: 4, readiness: 87 },
  { id: "4", name: "Meera Iyer", branch: "ECE", year: 3, readiness: 85 },
];

export default function DashboardPage() {
  const [yearFilter, setYearFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-white p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            College Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Placement intelligence & performance overview
          </p>
        </div>

        <div className="flex gap-4">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="
              px-4 py-2 rounded-xl
              bg-white/70 backdrop-blur-lg
              border border-white/50
              shadow-sm
              focus:ring-2 focus:ring-yellow-400/50
              outline-none
            "
          >
            <option>All Years</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="
              px-4 py-2 rounded-xl
              bg-white/70 backdrop-blur-lg
              border border-white/50
              shadow-sm
              focus:ring-2 focus:ring-yellow-400/50
              outline-none
            "
          >
            <option>All Branches</option>
            <option>CSE</option>
            <option>IT</option>
            <option>ECE</option>
          </select>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="
              p-6 rounded-2xl
              bg-white/60 backdrop-blur-xl
              border border-white/40
              shadow-[0_10px_30px_rgba(0,0,0,0.05)]
              hover:shadow-[0_12px_40px_rgba(250,204,21,0.15)]
              transition-all duration-300
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{kpi.title}</span>
              <span className="text-yellow-500">{kpi.icon}</span>
            </div>
            <div className="mt-4 text-2xl font-semibold text-gray-900">
              {kpi.value}
            </div>
            <div className="text-green-500 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
        <div
          className="
            xl:col-span-2 p-6 rounded-2xl
            bg-white/60 backdrop-blur-xl
            border border-white/40
            shadow-sm
          "
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Trend
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-yellow-200 rounded-xl">
            Chart Placeholder
          </div>
        </div>

        <div
          className="
            p-6 rounded-2xl
            bg-white/60 backdrop-blur-xl
            border border-white/40
            shadow-sm
          "
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Alerts
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>42 students below coding threshold</li>
            <li>Resume completion below 60% in 3rd year</li>
            <li>AI interview avg dropped in ECE branch</li>
          </ul>
        </div>
      </div>

      {/* PLACEMENT + SKILLS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
        <div
          className="
            p-6 rounded-2xl
            bg-white/60 backdrop-blur-xl
            border border-white/40
            shadow-sm
          "
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Placement Readiness
          </h2>
          <div className="space-y-3">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg">
              Tier 1 Ready – 132 Students
            </div>
            <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg">
              Tier 2 Ready – 318 Students
            </div>
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg">
              At Risk – 204 Students
            </div>
          </div>
        </div>

        <div
          className="
            p-6 rounded-2xl
            bg-white/60 backdrop-blur-xl
            border border-white/40
            shadow-sm
          "
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Skill Heatmap
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            {["DSA", "Core", "Communication", "System Design"].map((skill) => (
              <div
                key={skill}
                className="bg-yellow-100 text-yellow-700 py-4 rounded-lg"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP STUDENTS */}
      <div
        className="
          p-6 rounded-2xl
          bg-white/60 backdrop-blur-xl
          border border-white/40
          shadow-sm
          mb-12
        "
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Placement Ready Students
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-yellow-200">
              <th className="py-3 text-left">Name</th>
              <th className="text-left">Branch</th>
              <th className="text-left">Year</th>
              <th className="text-left">Readiness</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-yellow-100 hover:bg-yellow-50 transition"
              >
                <td className="py-3 text-gray-900">{student.name}</td>
                <td>{student.branch}</td>
                <td>{student.year}</td>
                <td className="text-yellow-600 font-semibold">
                  {student.readiness}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIVITY FEED */}
      <div
        className="
          p-6 rounded-2xl
          bg-white/60 backdrop-blur-xl
          border border-white/40
          shadow-sm
        "
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>120 students completed Coding Round 3</li>
          <li>AI Interview campaign launched for 4th year</li>
          <li>Resume template updated</li>
        </ul>
      </div>
    </div>
  );
}
