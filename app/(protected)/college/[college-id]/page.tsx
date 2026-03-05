"use client";

import React, { useState } from "react";
import {
  Users,
  ClipboardCheck,
  Code2,
  Brain,
  TrendingUp,
  AlertTriangle,
  Activity,
  ChevronRight,
  Zap,
  Award,
} from "lucide-react";

type KPI = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  changeBg: string;
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
    accent: "text-blue-600",
    iconBg: "bg-blue-50 border border-blue-100",
    changeBg: "bg-blue-50 text-blue-600",
  },
  {
    title: "Avg Quiz Score",
    value: "72%",
    change: "+2.1%",
    icon: <ClipboardCheck className="w-5 h-5" />,
    accent: "text-yellow-600",
    iconBg: "bg-yellow-50 border border-yellow-100",
    changeBg: "bg-yellow-50 text-yellow-700",
  },
  {
    title: "Coding Completion",
    value: "63%",
    change: "+5.8%",
    icon: <Code2 className="w-5 h-5" />,
    accent: "text-violet-600",
    iconBg: "bg-violet-50 border border-violet-100",
    changeBg: "bg-violet-50 text-violet-600",
  },
  {
    title: "AI Interview Avg",
    value: "7.4/10",
    change: "+1.3%",
    icon: <Brain className="w-5 h-5" />,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50 border border-emerald-100",
    changeBg: "bg-emerald-50 text-emerald-600",
  },
];

const topStudents: Student[] = [
  { id: "1", name: "Aarav Sharma", branch: "CSE", year: 4, readiness: 92 },
  { id: "2", name: "Ishita Rao", branch: "IT", year: 3, readiness: 89 },
  { id: "3", name: "Rohan Patel", branch: "CSE", year: 4, readiness: 87 },
  { id: "4", name: "Meera Iyer", branch: "ECE", year: 3, readiness: 85 },
];

const skills = [
  { name: "DSA", score: 74, color: "bg-blue-500" },
  { name: "Core CS", score: 68, color: "bg-violet-500" },
  { name: "Communication", score: 81, color: "bg-yellow-500" },
  { name: "System Design", score: 55, color: "bg-rose-400" },
  { name: "SQL / DBMS", score: 63, color: "bg-emerald-500" },
  { name: "Web Dev", score: 70, color: "bg-orange-400" },
];

const alerts = [
  {
    text: "42 students below coding threshold",
    severity: "high",
  },
  {
    text: "Resume completion below 60% in 3rd year",
    severity: "medium",
  },
  {
    text: "AI interview avg dropped in ECE branch",
    severity: "medium",
  },
  {
    text: "7 students have not logged in for 2+ weeks",
    severity: "low",
  },
];

const alertColors: Record<string, string> = {
  high: "bg-red-50 border-red-200 text-red-700",
  medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
  low: "bg-blue-50 border-blue-200 text-blue-700",
};

const alertDots: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
};

const activities = [
  { text: "120 students completed Coding Round 3", time: "2h ago", icon: "💻" },
  { text: "AI Interview campaign launched for 4th year", time: "5h ago", icon: "🤖" },
  { text: "Resume template updated by admin", time: "1d ago", icon: "📄" },
  { text: "New quiz set published — Advanced DSA", time: "2d ago", icon: "📝" },
];

function ReadinessBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [yearFilter, setYearFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              College Dashboard
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Placement Intelligence Overview
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Real-time performance & readiness data
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 outline-none transition"
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
              className="px-4 py-2.5 text-sm rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 outline-none transition"
            >
              <option>All Branches</option>
              <option>CSE</option>
              <option>IT</option>
              <option>ECE</option>
            </select>
          </div>
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:via-yellow-300 transition-all duration-500" />

              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <div className={`p-2 rounded-xl ${kpi.iconBg} ${kpi.accent}`}>
                  {kpi.icon}
                </div>
              </div>

              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {kpi.value}
              </p>

              <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-lg text-xs font-semibold ${kpi.changeBg}`}>
                <TrendingUp className="w-3 h-3" />
                {kpi.change} this month
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART + ALERTS ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Performance Trend */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Performance Trend
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
              </div>
              <span className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 font-medium rounded-full border border-yellow-100">
                Monthly
              </span>
            </div>
            <div className="h-56 flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-300 text-sm">
              Chart Placeholder
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Alerts</h2>
              <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {alerts.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {alerts.map((alert, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium ${alertColors[alert.severity]}`}
                >
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${alertDots[alert.severity]}`} />
                  {alert.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── PLACEMENT READINESS + SKILL HEATMAP ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Placement Readiness */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Placement Readiness
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-emerald-800">
                    Tier 1 Ready
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  132 Students
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-yellow-50 border border-yellow-100">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium text-yellow-800">
                    Tier 2 Ready
                  </span>
                </div>
                <span className="text-sm font-bold text-yellow-700">
                  318 Students
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-700">
                    At Risk
                  </span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  204 Students
                </span>
              </div>

              {/* Visual bar */}
              <div className="mt-4 h-3 rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-emerald-400 rounded-l-full" style={{ width: "20%" }} />
                <div className="bg-yellow-400" style={{ width: "49%" }} />
                <div className="bg-red-400 rounded-r-full" style={{ width: "31%" }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Tier 1 · 20%</span>
                <span>Tier 2 · 49%</span>
                <span>At Risk · 31%</span>
              </div>
            </div>
          </div>

          {/* Skill Heatmap */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-violet-50 rounded-lg border border-violet-100">
                <Zap className="w-4 h-4 text-violet-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Skill Coverage
              </h2>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-700 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {skill.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TOP STUDENTS TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Top Placement Ready Students
              </h2>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Student
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Branch
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Year
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Readiness
                </th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student, i) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {student.name[0]}
                      </div>
                      <span className="font-medium text-gray-900">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                      {student.branch}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{student.year}</td>
                  <td className="py-4 px-6 w-48">
                    <ReadinessBar
                      value={student.readiness}
                      color={
                        student.readiness >= 90
                          ? "bg-emerald-500"
                          : student.readiness >= 80
                          ? "bg-yellow-500"
                          : "bg-blue-400"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── ACTIVITY FEED ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <Activity className="w-4 h-4 text-gray-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>

          <ul className="space-y-0">
            {activities.map((item, i) => (
              <li key={item.text} className="flex items-start gap-4 group">
                {/* timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-base shadow-sm">
                    {item.icon}
                  </div>
                  {i !== activities.length - 1 && (
                    <div className="w-px h-6 bg-gray-100 mt-1" />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <p className="text-sm text-gray-700 font-medium leading-snug">
                    {item.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
