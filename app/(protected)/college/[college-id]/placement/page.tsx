"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  TrendingUp,
  BadgeDollarSign,
  ClipboardList,
  ChevronRight,
  BriefcaseBusiness,
  CheckCircle2,
  Bell,
  BarChart3,
  ShieldCheck,
  FileText,
  CalendarClock,
  Award,
  Zap,
  Search,
  ArrowUpRight,
  AlertCircle,
  CircleCheck,
} from "lucide-react";

/* ─────────────────────────── types ─────────────────────────── */
type Tab =
  | "Overview"
  | "Drives"
  | "Students"
  | "Assessments"
  | "Offers"
  | "Reports"
  | "Audit";

type DriveStatus = "Active" | "Completed" | "Upcoming" | "Closed";
type OfferStatus = "Accepted" | "Pending" | "Declined";

/* ───────────────────────── mock data ────────────────────────── */
const kpis = [
  {
    title: "Placement Rate",
    value: "68%",
    change: "+6%",
    sub: "vs last year",
    icon: <Award className="w-5 h-5" />,
    accent: "text-yellow-600",
    iconBg: "bg-yellow-50 border border-yellow-100",
    bar: 68,
    barColor: "bg-yellow-400",
  },
  {
    title: "Average CTC",
    value: "₹7.4L",
    change: "+12%",
    sub: "avg package",
    icon: <BadgeDollarSign className="w-5 h-5" />,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50 border border-emerald-100",
    bar: 74,
    barColor: "bg-emerald-400",
  },
  {
    title: "Active Drives",
    value: "14",
    change: "3 closing soon",
    sub: "this season",
    icon: <BriefcaseBusiness className="w-5 h-5" />,
    accent: "text-blue-600",
    iconBg: "bg-blue-50 border border-blue-100",
    bar: 55,
    barColor: "bg-blue-400",
  },
  {
    title: "Total Offers",
    value: "312",
    change: "+28 this week",
    sub: "confirmed",
    icon: <CheckCircle2 className="w-5 h-5" />,
    accent: "text-violet-600",
    iconBg: "bg-violet-50 border border-violet-100",
    bar: 80,
    barColor: "bg-violet-400",
  },
  {
    title: "Companies Visited",
    value: "48",
    change: "+8 new",
    sub: "this cycle",
    icon: <Building2 className="w-5 h-5" />,
    accent: "text-rose-500",
    iconBg: "bg-rose-50 border border-rose-100",
    bar: 62,
    barColor: "bg-rose-400",
  },
];

const drives: {
  id: string;
  company: string;
  role: string;
  ctc: string;
  deadline: string;
  status: DriveStatus;
  applicants: number;
  shortlisted: number;
  branch: string;
  minCGPA: number;
}[] = [
  {
    id: "d1",
    company: "TCS",
    role: "Software Engineer",
    ctc: "₹3.6L",
    deadline: "12 Mar 2026",
    status: "Active",
    applicants: 210,
    shortlisted: 48,
    branch: "CSE / IT",
    minCGPA: 6.5,
  },
  {
    id: "d2",
    company: "Infosys",
    role: "Systems Engineer",
    ctc: "₹4.0L",
    deadline: "15 Mar 2026",
    status: "Active",
    applicants: 185,
    shortlisted: 60,
    branch: "All",
    minCGPA: 6.0,
  },
  {
    id: "d3",
    company: "Google",
    role: "SWE Intern → FTE",
    ctc: "₹22L",
    deadline: "08 Mar 2026",
    status: "Upcoming",
    applicants: 94,
    shortlisted: 18,
    branch: "CSE",
    minCGPA: 8.0,
  },
  {
    id: "d4",
    company: "Wipro",
    role: "Project Engineer",
    ctc: "₹3.5L",
    deadline: "02 Mar 2026",
    status: "Completed",
    applicants: 308,
    shortlisted: 102,
    branch: "All",
    minCGPA: 6.0,
  },
  {
    id: "d5",
    company: "Deloitte",
    role: "Analyst",
    ctc: "₹7.0L",
    deadline: "20 Mar 2026",
    status: "Active",
    applicants: 72,
    shortlisted: 22,
    branch: "CSE / ECE / MBA",
    minCGPA: 7.0,
  },
  {
    id: "d6",
    company: "Amazon",
    role: "SDE-1",
    ctc: "₹18L",
    deadline: "25 Mar 2026",
    status: "Upcoming",
    applicants: 120,
    shortlisted: 30,
    branch: "CSE / IT",
    minCGPA: 7.5,
  },
];

const offers: {
  id: string;
  name: string;
  branch: string;
  company: string;
  role: string;
  ctc: string;
  status: OfferStatus;
  date: string;
}[] = [
  {
    id: "o1",
    name: "Aarav Sharma",
    branch: "CSE",
    company: "Google",
    role: "SWE",
    ctc: "₹22L",
    status: "Accepted",
    date: "01 Mar",
  },
  {
    id: "o2",
    name: "Ishita Rao",
    branch: "IT",
    company: "Deloitte",
    role: "Analyst",
    ctc: "₹7L",
    status: "Pending",
    date: "02 Mar",
  },
  {
    id: "o3",
    name: "Rohan Patel",
    branch: "CSE",
    company: "TCS",
    role: "SDE",
    ctc: "₹3.6L",
    status: "Accepted",
    date: "28 Feb",
  },
  {
    id: "o4",
    name: "Meera Iyer",
    branch: "ECE",
    company: "Wipro",
    role: "Project Eng.",
    ctc: "₹3.5L",
    status: "Declined",
    date: "27 Feb",
  },
  {
    id: "o5",
    name: "Karan Mehta",
    branch: "CSE",
    company: "Amazon",
    role: "SDE-1",
    ctc: "₹18L",
    status: "Pending",
    date: "03 Mar",
  },
];

const auditLog = [
  {
    action: "Shortlist published",
    detail: "TCS Round 1 — 48 students",
    user: "Placement Officer",
    time: "Today, 10:42 AM",
    type: "success",
  },
  {
    action: "Eligibility rule updated",
    detail: "Google drive — min CGPA changed from 7.5 → 8.0",
    user: "Admin",
    time: "Today, 09:15 AM",
    type: "warning",
  },
  {
    action: "Offer letter uploaded",
    detail: "Aarav Sharma — Google SWE",
    user: "Recruiter",
    time: "Yesterday, 4:30 PM",
    type: "success",
  },
  {
    action: "Drive closed",
    detail: "Wipro — Project Engineer",
    user: "System",
    time: "Yesterday, 3:00 PM",
    type: "info",
  },
  {
    action: "Manual override",
    detail: "Rohan Patel added to Infosys shortlist",
    user: "Placement Officer",
    time: "02 Mar, 11:00 AM",
    type: "warning",
  },
];

const funnel = [
  { stage: "Applied", count: 1248, color: "bg-yellow-400", pct: 100 },
  { stage: "Shortlisted", count: 642, color: "bg-blue-400", pct: 51 },
  { stage: "Assessed", count: 410, color: "bg-violet-400", pct: 33 },
  { stage: "Interviewed", count: 295, color: "bg-emerald-400", pct: 24 },
  { stage: "Offered", count: 312, color: "bg-rose-400", pct: 25 },
];

const assessments = [
  {
    id: "a1",
    title: "Aptitude & Reasoning",
    company: "TCS",
    type: "MCQ",
    attempted: 198,
    avgScore: "71%",
    status: "Completed",
  },
  {
    id: "a2",
    title: "Coding Assessment Round 1",
    company: "Google",
    type: "Coding",
    attempted: 94,
    avgScore: "58%",
    status: "Active",
  },
  {
    id: "a3",
    title: "HR Behavioral Interview",
    company: "Deloitte",
    type: "AI Interview",
    attempted: 62,
    avgScore: "7.2/10",
    status: "Active",
  },
  {
    id: "a4",
    title: "Technical Screening",
    company: "Amazon",
    type: "MCQ + Coding",
    attempted: 0,
    avgScore: "—",
    status: "Upcoming",
  },
];

const notifications = [
  {
    text: "Google drive shortlist released",
    time: "10m ago",
    icon: "📢",
    color: "bg-blue-50 border-blue-100",
  },
  {
    text: "TCS assessment results published",
    time: "1h ago",
    icon: "✅",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    text: "Amazon JD sent to 120 students",
    time: "3h ago",
    icon: "📧",
    color: "bg-yellow-50 border-yellow-100",
  },
  {
    text: "2 students declined Wipro offer",
    time: "Yesterday",
    icon: "⚠️",
    color: "bg-red-50 border-red-100",
  },
];

/* ──────────────────────── helpers ──────────────────────────── */
const statusStyles: Record<DriveStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  Completed: "bg-gray-100 text-gray-500 border border-gray-200",
  Closed: "bg-red-50 text-red-600 border border-red-200",
};

const offerBadge: Record<OfferStatus, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Declined: "bg-red-50 text-red-600 border border-red-200",
};

const auditColors: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-yellow-500",
  info: "bg-blue-400",
};

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "Overview", icon: <BarChart3 className="w-4 h-4" />, label: "Overview" },
  { id: "Drives", icon: <BriefcaseBusiness className="w-4 h-4" />, label: "Drives" },
  { id: "Students", icon: <Users className="w-4 h-4" />, label: "Students" },
  { id: "Assessments", icon: <ClipboardList className="w-4 h-4" />, label: "Assessments" },
  { id: "Offers", icon: <FileText className="w-4 h-4" />, label: "Offers" },
  { id: "Reports", icon: <TrendingUp className="w-4 h-4" />, label: "Reports" },
  { id: "Audit", icon: <ShieldCheck className="w-4 h-4" />, label: "Audit Log" },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function PlacementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [driveSearch, setDriveSearch] = useState("");
  const [driveStatusFilter, setDriveStatusFilter] = useState<string>("All");

  const filteredDrives = drives.filter((d) => {
    const matchSearch =
      driveSearch === "" ||
      d.company.toLowerCase().includes(driveSearch.toLowerCase()) ||
      d.role.toLowerCase().includes(driveSearch.toLowerCase());
    const matchStatus =
      driveStatusFilter === "All" || d.status === driveStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Placement Automation
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Placement Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              End-to-end campus placement operations & intelligence
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition">
              <Bell className="w-4 h-4 text-yellow-500" />
              Notifications
              <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                4
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-300 transition">
              <BriefcaseBusiness className="w-4 h-4" />
              New Drive
            </button>
          </div>
        </div>

        {/* ── TAB NAV ── */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-2xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={activeTab === tab.id ? "text-yellow-600" : ""}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === "Overview" && (
          <div className="space-y-6">

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.title}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:via-yellow-300 transition-all duration-500" />
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-gray-500 font-medium">{kpi.title}</p>
                    <div className={`p-1.5 rounded-lg ${kpi.iconBg} ${kpi.accent}`}>
                      {kpi.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${kpi.barColor} rounded-full`}
                      style={{ width: `${kpi.bar}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{kpi.change}</p>
                </div>
              ))}
            </div>

            {/* STUDENT FUNNEL + NOTIFICATIONS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Funnel */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Student Pipeline Funnel
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Aggregate across all active drives
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 font-medium rounded-full border border-yellow-100">
                    This Season
                  </span>
                </div>

                <div className="space-y-4">
                  {funnel.map((f) => (
                    <div key={f.stage} className="flex items-center gap-4">
                      <div className="w-28 text-sm font-medium text-gray-700 flex-shrink-0">
                        {f.stage}
                      </div>
                      <div className="flex-1 h-8 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                        <div
                          className={`h-full ${f.color} rounded-xl flex items-center px-3 transition-all duration-700`}
                          style={{ width: `${f.pct}%` }}
                        >
                          <span className="text-white text-xs font-bold whitespace-nowrap">
                            {f.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="w-10 text-right text-xs font-semibold text-gray-400">
                        {f.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Bell className="w-4 h-4 text-yellow-500" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Notifications
                  </h2>
                </div>
                <ul className="space-y-3">
                  {notifications.map((n, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 px-3 py-3 rounded-xl border text-sm ${n.color}`}
                    >
                      <span className="text-base flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 text-xs font-medium leading-snug">
                          {n.text}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RECENT DRIVES PREVIEW */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                    <BriefcaseBusiness className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Active Drives
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab("Drives")}
                  className="flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {["Company", "Role", "CTC", "Deadline", "Applicants", "Status"].map((h) => (
                      <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drives.filter((d) => d.status !== "Completed").slice(0, 4).map((d) => (
                    <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {d.company[0]}
                          </div>
                          <span className="font-semibold text-gray-900">{d.company}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-600">{d.role}</td>
                      <td className="py-4 px-5 font-semibold text-gray-800">{d.ctc}</td>
                      <td className="py-4 px-5 text-gray-500">{d.deadline}</td>
                      <td className="py-4 px-5">
                        <span className="text-gray-700 font-medium">{d.applicants}</span>
                        <span className="text-gray-400 text-xs"> / {d.shortlisted} shortlisted</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[d.status]}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ DRIVES TAB ══════════════ */}
        {activeTab === "Drives" && (
          <div className="space-y-5">
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  placeholder="Search company or role..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Active", "Upcoming", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDriveStatusFilter(s)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      driveStatusFilter === s
                        ? "bg-yellow-400 text-yellow-900 shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Drive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDrives.map((d) => (
                <div
                  key={d.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* top bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-yellow-200" />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold shadow-sm">
                          {d.company[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{d.company}</p>
                          <p className="text-xs text-gray-500">{d.role}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[d.status]}`}>
                        {d.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-1">CTC</p>
                        <p className="text-sm font-bold text-gray-900">{d.ctc}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-1">Applicants</p>
                        <p className="text-sm font-bold text-gray-900">{d.applicants}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-1">Shortlisted</p>
                        <p className="text-sm font-bold text-emerald-600">{d.shortlisted}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-medium">
                        {d.branch}
                      </span>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                        Min CGPA {d.minCGPA}
                      </span>
                      <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg font-medium ml-auto flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        {d.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-4 flex gap-2">
                    <button className="flex-1 py-2 rounded-xl bg-yellow-400 text-yellow-900 text-xs font-semibold hover:bg-yellow-300 transition">
                      View Drive
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">
                      Shortlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ STUDENTS TAB ══════════════ */}
        {activeTab === "Students" && (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Eligible", val: "948", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                { label: "Applied", val: "1,248", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
                { label: "Shortlisted", val: "642", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                { label: "Placed", val: "312", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
              ].map((s) => (
                <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.bg} shadow-sm`}>
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>

            {/* Branch-wise breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">
                Branch-wise Placement Breakdown
              </h2>
              <div className="space-y-4">
                {[
                  { branch: "CSE", placed: 145, total: 200, pct: 72 },
                  { branch: "IT", placed: 88, total: 130, pct: 68 },
                  { branch: "ECE", placed: 52, total: 100, pct: 52 },
                  { branch: "Mechanical", placed: 27, total: 80, pct: 34 },
                ].map((row) => (
                  <div key={row.branch} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-gray-700">{row.branch}</div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 w-32 text-right">
                      <span className="font-bold text-gray-800">{row.placed}</span> / {row.total} placed
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-sm font-bold text-yellow-600">{row.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* At-risk students */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">
                  At-Risk Students
                </h2>
                <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  204 students
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { issue: "Below minimum CGPA for any active drive", count: 98 },
                  { issue: "Has not applied to any drive", count: 67 },
                  { issue: "Resume not updated in 60+ days", count: 39 },
                ].map((r) => (
                  <div
                    key={r.issue}
                    className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm"
                  >
                    <span className="text-red-700 font-medium">{r.issue}</span>
                    <span className="font-bold text-red-600 ml-4">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ASSESSMENTS TAB ══════════════ */}
        {activeTab === "Assessments" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        {a.company}
                      </p>
                      <h3 className="text-base font-semibold text-gray-900">{a.title}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        a.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : a.status === "Upcoming"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="text-sm font-semibold text-violet-600 mt-0.5">{a.type}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                      <p className="text-xs text-gray-400">Attempted</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{a.attempted}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                      <p className="text-xs text-gray-400">Avg Score</p>
                      <p className="text-sm font-semibold text-yellow-600 mt-0.5">{a.avgScore}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2 rounded-xl bg-yellow-400 text-yellow-900 text-xs font-semibold hover:bg-yellow-300 transition">
                      View Results
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ OFFERS TAB ══════════════ */}
        {activeTab === "Offers" && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Accepted", count: 264, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                { label: "Pending", count: 32, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
                { label: "Declined", count: 16, color: "text-red-500", bg: "bg-red-50 border-red-100" },
              ].map((s) => (
                <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.bg} shadow-sm text-center`}>
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className={`text-4xl font-bold ${s.color}`}>{s.count}</p>
                </div>
              ))}
            </div>

            {/* Offers Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Offer Tracker</h2>
                <button className="flex items-center gap-1.5 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {["Student", "Branch", "Company", "Role", "CTC", "Date", "Status"].map((h) => (
                      <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {o.name[0]}
                          </div>
                          <span className="font-medium text-gray-900">{o.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                          {o.branch}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-gray-800">{o.company}</td>
                      <td className="py-4 px-5 text-gray-600">{o.role}</td>
                      <td className="py-4 px-5 font-semibold text-gray-800">{o.ctc}</td>
                      <td className="py-4 px-5 text-gray-500 text-xs">{o.date}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${offerBadge[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════ REPORTS TAB ══════════════ */}
        {activeTab === "Reports" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Placement % by Year",
                  desc: "Year-over-year placement rate trends across all branches.",
                  icon: <TrendingUp className="w-5 h-5 text-yellow-600" />,
                  bg: "bg-yellow-50 border-yellow-100",
                },
                {
                  title: "Company-wise Offers",
                  desc: "Number of offers extended per company this season.",
                  icon: <Building2 className="w-5 h-5 text-blue-600" />,
                  bg: "bg-blue-50 border-blue-100",
                },
                {
                  title: "Branch-wise CTC",
                  desc: "Average and highest CTC across branches.",
                  icon: <BadgeDollarSign className="w-5 h-5 text-emerald-600" />,
                  bg: "bg-emerald-50 border-emerald-100",
                },
                {
                  title: "Student Funnel Report",
                  desc: "Applied → Shortlisted → Interviewed → Offered conversion.",
                  icon: <Users className="w-5 h-5 text-violet-600" />,
                  bg: "bg-violet-50 border-violet-100",
                },
                {
                  title: "Assessment Performance",
                  desc: "Score distribution across all assessments and companies.",
                  icon: <ClipboardList className="w-5 h-5 text-rose-500" />,
                  bg: "bg-rose-50 border-rose-100",
                },
                {
                  title: "Recruiter Engagement",
                  desc: "Recruiter activity: JDs posted, interviews scheduled, offers made.",
                  icon: <Zap className="w-5 h-5 text-orange-500" />,
                  bg: "bg-orange-50 border-orange-100",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl ${r.bg} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {r.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{r.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{r.desc}</p>
                  <div className="mt-4 h-24 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-300">
                    Chart Preview
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ AUDIT LOG TAB ══════════════ */}
        {activeTab === "Audit" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Compliance & Audit Log</h2>
                </div>
                <span className="text-xs text-gray-400">
                  Immutable — all critical actions logged
                </span>
              </div>

              <div className="p-6 space-y-0">
                {auditLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${auditColors[entry.type]}`} />
                      {i < auditLog.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 min-h-[2.5rem] mt-1" />
                      )}
                    </div>
                    <div className="pb-6 flex-1 border-b border-gray-50 last:border-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{entry.detail}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-gray-500">{entry.user}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{entry.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance note */}
            <div className="flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <CircleCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Audit logs are tamper-proof
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  All critical actions — shortlist changes, eligibility overrides, offer updates — are immutably recorded with user, timestamp, and justification for compliance and transparency.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
