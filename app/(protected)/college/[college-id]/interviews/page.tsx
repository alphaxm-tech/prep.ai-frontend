"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Search,
  Bell,
  BarChart3,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  Star,
  Building2,
  UserCheck,
  Plus,
  Layers,
  Briefcase,
  Activity,
  ArrowUpRight,
  RefreshCw,
  DoorOpen,
  Zap,
} from "lucide-react";

/* ─────────────────────────── types ─────────────────────────── */
type Tab =
  | "Overview"
  | "Schedule"
  | "Calendar"
  | "Pipeline"
  | "Feedback"
  | "Results"
  | "Rooms"
  | "Analytics";

type InterviewMode = "On-campus" | "Virtual" | "Phone";
type RoundStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "No Show";
type InterviewResult =
  | "Passed"
  | "Failed"
  | "On Hold"
  | "Selected"
  | "Rejected"
  | "Pending";

interface Interview {
  id: string;
  student: string;
  studentBranch: string;
  company: string;
  round: string;
  roundNumber: number;
  interviewer: string;
  time: string;
  date: string;
  mode: InterviewMode;
  status: RoundStatus;
  result?: InterviewResult;
  room?: string;
  meetLink?: string;
}

interface FeedbackRecord {
  id: string;
  student: string;
  company: string;
  round: string;
  interviewer: string;
  date: string;
  comments: string;
  recommendation: "Hire" | "Advance" | "Hold" | "Reject";
  coding?: number;
  problemSolving?: number;
  systemDesign?: number;
  cultureFit?: number;
  confidence?: number;
  communication?: number;
}

/* ───────────────────────── mock data ────────────────────────── */
const kpis = [
  {
    title: "Interviews Today",
    value: "28",
    change: "8 in progress",
    icon: <Calendar className="w-5 h-5" />,
    accent: "text-yellow-600",
    iconBg: "bg-yellow-50 border border-yellow-100",
    bar: 70,
    barColor: "bg-yellow-400",
  },
  {
    title: "Upcoming",
    value: "46",
    change: "Next 7 days",
    icon: <Clock className="w-5 h-5" />,
    accent: "text-blue-600",
    iconBg: "bg-blue-50 border border-blue-100",
    bar: 46,
    barColor: "bg-blue-400",
  },
  {
    title: "Completed",
    value: "120",
    change: "+18 this week",
    icon: <CheckCircle2 className="w-5 h-5" />,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50 border border-emerald-100",
    bar: 80,
    barColor: "bg-emerald-400",
  },
  {
    title: "Offers Expected",
    value: "34",
    change: "based on pipeline",
    icon: <Briefcase className="w-5 h-5" />,
    accent: "text-violet-600",
    iconBg: "bg-violet-50 border border-violet-100",
    bar: 60,
    barColor: "bg-violet-400",
  },
  {
    title: "Conversion Rate",
    value: "24%",
    change: "+3% vs last year",
    icon: <TrendingUp className="w-5 h-5" />,
    accent: "text-rose-500",
    iconBg: "bg-rose-50 border border-rose-100",
    bar: 24,
    barColor: "bg-rose-400",
  },
];

const interviews: Interview[] = [
  { id: "i1", student: "Rahul Sharma", studentBranch: "CSE", company: "Amazon", round: "Tech Round 1", roundNumber: 1, interviewer: "Priya Nair", time: "10:30 AM", date: "05 Mar 2026", mode: "On-campus", status: "Completed", result: "Passed", room: "Room 101" },
  { id: "i2", student: "Ananya Patel", studentBranch: "IT", company: "TCS", round: "HR Round", roundNumber: 3, interviewer: "Meera Iyer", time: "11:00 AM", date: "05 Mar 2026", mode: "Virtual", status: "In Progress", meetLink: "meet.google.com/abc-123" },
  { id: "i3", student: "Arjun Mehta", studentBranch: "CSE", company: "Infosys", round: "Tech Round 1", roundNumber: 1, interviewer: "Raj Kumar", time: "11:30 AM", date: "05 Mar 2026", mode: "On-campus", status: "Scheduled", room: "Room 102" },
  { id: "i4", student: "Pooja Singh", studentBranch: "ECE", company: "Wipro", round: "Managerial", roundNumber: 2, interviewer: "Sunita Reddy", time: "12:00 PM", date: "05 Mar 2026", mode: "On-campus", status: "Scheduled", room: "Room 103" },
  { id: "i5", student: "Karan Joshi", studentBranch: "CSE", company: "Amazon", round: "Tech Round 2", roundNumber: 2, interviewer: "Vikram Singh", time: "2:00 PM", date: "05 Mar 2026", mode: "Virtual", status: "Scheduled", meetLink: "zoom.us/j/456789" },
  { id: "i6", student: "Ishita Verma", studentBranch: "IT", company: "Deloitte", round: "Tech Round 1", roundNumber: 1, interviewer: "Neha Gupta", time: "3:00 PM", date: "05 Mar 2026", mode: "On-campus", status: "Scheduled", room: "Room 101" },
  { id: "i7", student: "Rohan Gupta", studentBranch: "CSE", company: "Google", round: "Technical Screen", roundNumber: 1, interviewer: "Arun Menon", time: "10:00 AM", date: "06 Mar 2026", mode: "Virtual", status: "Scheduled", meetLink: "meet.google.com/xyz-456" },
  { id: "i8", student: "Sneha Jain", studentBranch: "CSE", company: "Microsoft", round: "HR Round", roundNumber: 3, interviewer: "Priya Nair", time: "11:00 AM", date: "06 Mar 2026", mode: "Virtual", status: "Scheduled", meetLink: "teams.microsoft.com/meet/abc" },
  { id: "i9", student: "Amit Desai", studentBranch: "ECE", company: "Wipro", round: "HR Round", roundNumber: 3, interviewer: "Sunita Reddy", time: "2:30 PM", date: "04 Mar 2026", mode: "On-campus", status: "Completed", result: "Selected", room: "Room 102" },
  { id: "i10", student: "Priya Kapoor", studentBranch: "CSE", company: "TCS", round: "Tech Round 1", roundNumber: 1, interviewer: "Raj Kumar", time: "9:00 AM", date: "04 Mar 2026", mode: "On-campus", status: "Completed", result: "Passed", room: "Room 103" },
  { id: "i11", student: "Dev Malhotra", studentBranch: "IT", company: "Infosys", round: "Tech Round 2", roundNumber: 2, interviewer: "Meera Iyer", time: "10:00 AM", date: "04 Mar 2026", mode: "Virtual", status: "Completed", result: "Failed", meetLink: "meet.google.com/def-789" },
  { id: "i12", student: "Meena Pillai", studentBranch: "CSE", company: "Deloitte", round: "Managerial", roundNumber: 2, interviewer: "Neha Gupta", time: "3:30 PM", date: "03 Mar 2026", mode: "On-campus", status: "Completed", result: "Passed", room: "Room 101" },
];

const pipelines = [
  {
    company: "Amazon", logo: "A", color: "from-orange-400 to-orange-500",
    rounds: [
      { name: "Assessment", total: 120, passed: 85, failed: 35 },
      { name: "Tech Round 1", total: 85, passed: 42, failed: 43 },
      { name: "Tech Round 2", total: 42, passed: 18, failed: 24 },
      { name: "Managerial", total: 18, passed: 12, failed: 6 },
      { name: "HR Round", total: 12, passed: 10, failed: 2 },
    ],
  },
  {
    company: "TCS", logo: "T", color: "from-blue-400 to-blue-500",
    rounds: [
      { name: "Assessment", total: 210, passed: 180, failed: 30 },
      { name: "Tech Round 1", total: 180, passed: 120, failed: 60 },
      { name: "HR Round", total: 120, passed: 95, failed: 25 },
    ],
  },
  {
    company: "Google", logo: "G", color: "from-green-400 to-emerald-500",
    rounds: [
      { name: "Technical Screen", total: 30, passed: 18, failed: 12 },
      { name: "Tech Round 1", total: 18, passed: 10, failed: 8 },
      { name: "Tech Round 2", total: 10, passed: 6, failed: 4 },
      { name: "System Design", total: 6, passed: 4, failed: 2 },
      { name: "HR Round", total: 4, passed: 3, failed: 1 },
    ],
  },
  {
    company: "Infosys", logo: "I", color: "from-indigo-400 to-indigo-500",
    rounds: [
      { name: "Tech Round 1", total: 185, passed: 110, failed: 75 },
      { name: "Tech Round 2", total: 110, passed: 65, failed: 45 },
      { name: "HR Round", total: 65, passed: 55, failed: 10 },
    ],
  },
];

const feedbackRecords: FeedbackRecord[] = [
  {
    id: "f1", student: "Rahul Sharma", company: "Amazon", round: "Tech Round 1",
    interviewer: "Priya Nair", date: "05 Mar 2026",
    coding: 4, problemSolving: 3, communication: 4, systemDesign: 2,
    comments: "Strong coding ability but weak system design. Recommend for Tech Round 2.",
    recommendation: "Advance",
  },
  {
    id: "f2", student: "Amit Desai", company: "Wipro", round: "HR Round",
    interviewer: "Sunita Reddy", date: "04 Mar 2026",
    cultureFit: 4, communication: 5, confidence: 4,
    comments: "Excellent communication, very confident. Good cultural fit.",
    recommendation: "Hire",
  },
  {
    id: "f3", student: "Dev Malhotra", company: "Infosys", round: "Tech Round 2",
    interviewer: "Meera Iyer", date: "04 Mar 2026",
    coding: 2, problemSolving: 2, communication: 4, systemDesign: 1,
    comments: "Could not solve the given problems. Communication is good but technical skills are insufficient.",
    recommendation: "Reject",
  },
  {
    id: "f4", student: "Meena Pillai", company: "Deloitte", round: "Managerial",
    interviewer: "Neha Gupta", date: "03 Mar 2026",
    cultureFit: 5, communication: 4, problemSolving: 4, confidence: 4,
    comments: "Strong leadership qualities. Excellent problem-solving approach.",
    recommendation: "Advance",
  },
];

const rooms = [
  { id: "r1", name: "Room 101", capacity: 4, company: "Amazon", time: "10:00 AM – 1:00 PM", interviews: 3, status: "Occupied" },
  { id: "r2", name: "Room 102", capacity: 4, company: "TCS", time: "9:00 AM – 3:00 PM", interviews: 5, status: "Occupied" },
  { id: "r3", name: "Room 103", capacity: 4, company: "Wipro", time: "11:00 AM – 5:00 PM", interviews: 4, status: "Occupied" },
  { id: "r4", name: "Lab 1", capacity: 20, company: "Infosys", time: "10:00 AM – 4:00 PM", interviews: 12, status: "Occupied" },
  { id: "r5", name: "Seminar Hall", capacity: 50, company: "—", time: "—", interviews: 0, status: "Available" },
  { id: "r6", name: "Conference Room A", capacity: 8, company: "—", time: "—", interviews: 0, status: "Available" },
];

const calendarDays = [
  {
    date: "Mon, 3 Mar", slots: [
      { time: "10:00", company: "Wipro", round: "HR", count: 4, color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
      { time: "2:00", company: "Infosys", round: "Tech 2", count: 3, color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
    ],
  },
  {
    date: "Tue, 4 Mar", slots: [
      { time: "9:00", company: "TCS", round: "Tech 1", count: 8, color: "bg-blue-50 border-blue-200 text-blue-800" },
      { time: "10:00", company: "Infosys", round: "Tech 2", count: 5, color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
      { time: "2:30", company: "Wipro", round: "HR", count: 3, color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    ],
  },
  {
    date: "Wed, 5 Mar", slots: [
      { time: "10:30", company: "Amazon", round: "Tech 1", count: 6, color: "bg-orange-50 border-orange-200 text-orange-800" },
      { time: "11:00", company: "TCS", round: "HR", count: 4, color: "bg-blue-50 border-blue-200 text-blue-800" },
      { time: "2:00", company: "Amazon", round: "Tech 2", count: 3, color: "bg-orange-50 border-orange-200 text-orange-800" },
      { time: "3:00", company: "Deloitte", round: "Tech 1", count: 2, color: "bg-violet-50 border-violet-200 text-violet-800" },
    ],
  },
  {
    date: "Thu, 6 Mar", slots: [
      { time: "10:00", company: "Google", round: "Tech Screen", count: 5, color: "bg-green-50 border-green-200 text-green-800" },
      { time: "11:00", company: "Microsoft", round: "HR", count: 4, color: "bg-sky-50 border-sky-200 text-sky-800" },
      { time: "3:00", company: "Amazon", round: "Managerial", count: 3, color: "bg-orange-50 border-orange-200 text-orange-800" },
    ],
  },
  {
    date: "Fri, 7 Mar", slots: [
      { time: "9:30", company: "Deloitte", round: "Managerial", count: 4, color: "bg-violet-50 border-violet-200 text-violet-800" },
      { time: "2:00", company: "Google", round: "Tech Round 1", count: 3, color: "bg-green-50 border-green-200 text-green-800" },
    ],
  },
];

const roundDropoff = [
  { round: "Tech Round 1", attempted: 450, passed: 245, failed: 205, dropRate: "45%" },
  { round: "Tech Round 2", attempted: 245, passed: 140, failed: 105, dropRate: "43%" },
  { round: "Managerial", attempted: 140, passed: 98, failed: 42, dropRate: "30%" },
  { round: "HR Round", attempted: 98, passed: 80, failed: 18, dropRate: "18%" },
];

const companySuccess = [
  { company: "TCS", interviews: 210, offers: 95, rate: 45 },
  { company: "Wipro", interviews: 120, offers: 60, rate: 50 },
  { company: "Infosys", interviews: 185, offers: 55, rate: 30 },
  { company: "Deloitte", interviews: 65, offers: 22, rate: 34 },
  { company: "Amazon", interviews: 85, offers: 10, rate: 12 },
  { company: "Google", interviews: 30, offers: 3, rate: 10 },
];

const topStudents = [
  { name: "Rahul Sharma", branch: "CSE", interviews: 4, offers: 2 },
  { name: "Pooja Singh", branch: "ECE", interviews: 3, offers: 2 },
  { name: "Karan Joshi", branch: "CSE", interviews: 5, offers: 1 },
  { name: "Ishita Verma", branch: "IT", interviews: 3, offers: 1 },
  { name: "Ananya Patel", branch: "IT", interviews: 4, offers: 0 },
];

const pipelineStudents = [
  { student: "Rahul Sharma", branch: "CSE", company: "Amazon", currentRound: "Tech Round 2", cleared: 1, total: 5, status: "Scheduled" as RoundStatus },
  { student: "Ananya Patel", branch: "IT", company: "TCS", currentRound: "HR Round", cleared: 2, total: 3, status: "In Progress" as RoundStatus },
  { student: "Arjun Mehta", branch: "CSE", company: "Infosys", currentRound: "Tech Round 1", cleared: 0, total: 3, status: "Scheduled" as RoundStatus },
  { student: "Pooja Singh", branch: "ECE", company: "Wipro", currentRound: "Managerial", cleared: 1, total: 3, status: "Scheduled" as RoundStatus },
  { student: "Dev Malhotra", branch: "IT", company: "Infosys", currentRound: "Tech Round 2", cleared: 1, total: 3, status: "Cancelled" as RoundStatus },
  { student: "Meena Pillai", branch: "CSE", company: "Deloitte", currentRound: "HR Round", cleared: 2, total: 3, status: "Scheduled" as RoundStatus },
];

/* ──────────────────────── style maps ──────────────────────── */
const statusStyles: Record<RoundStatus, string> = {
  Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
  "In Progress": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Completed: "bg-gray-100 text-gray-500 border border-gray-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
  "No Show": "bg-orange-50 text-orange-600 border border-orange-200",
};

const resultStyles: Record<InterviewResult, string> = {
  Passed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Failed: "bg-red-50 text-red-600 border border-red-200",
  "On Hold": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Selected: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Rejected: "bg-red-50 text-red-600 border border-red-200",
  Pending: "bg-gray-100 text-gray-500 border border-gray-200",
};

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "Overview", icon: <BarChart3 className="w-4 h-4" />, label: "Overview" },
  { id: "Schedule", icon: <Clock className="w-4 h-4" />, label: "Schedule" },
  { id: "Calendar", icon: <Calendar className="w-4 h-4" />, label: "Calendar" },
  { id: "Pipeline", icon: <Layers className="w-4 h-4" />, label: "Pipeline" },
  { id: "Feedback", icon: <MessageSquare className="w-4 h-4" />, label: "Feedback" },
  { id: "Results", icon: <CheckCircle2 className="w-4 h-4" />, label: "Results" },
  { id: "Rooms", icon: <DoorOpen className="w-4 h-4" />, label: "Rooms" },
  { id: "Analytics", icon: <Activity className="w-4 h-4" />, label: "Analytics" },
];

/* ──────────────────────── sub-components ──────────────────── */
function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

function ModeChip({ mode }: { mode: InterviewMode }) {
  const styles: Record<InterviewMode, string> = {
    "On-campus": "bg-gray-50 text-gray-700 border-gray-200",
    Virtual: "bg-blue-50 text-blue-700 border-blue-200",
    Phone: "bg-violet-50 text-violet-700 border-violet-200",
  };
  const icons: Record<InterviewMode, React.ReactNode> = {
    "On-campus": <MapPin className="w-3 h-3" />,
    Virtual: <Video className="w-3 h-3" />,
    Phone: <span className="text-[10px]">📞</span>,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[mode]}`}>
      {icons[mode]} {mode}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInterviews = interviews.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch =
      search === "" ||
      i.student.toLowerCase().includes(q) ||
      i.company.toLowerCase().includes(q) ||
      i.round.toLowerCase().includes(q) ||
      i.interviewer.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Interview Orchestration
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Interviews
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Schedule, coordinate, and evaluate all campus interviews in one place
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition">
              <Bell className="w-4 h-4 text-yellow-500" />
              Alerts
              <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-300 transition">
              <Plus className="w-4 h-4" />
              Schedule Interview
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

        {/* ══════════════════════ OVERVIEW TAB ══════════════════════ */}
        {activeTab === "Overview" && (
          <div className="space-y-6">

            {/* KPI Cards */}
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
                    <div className={`h-full ${kpi.barColor} rounded-full`} style={{ width: `${kpi.bar}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{kpi.change}</p>
                </div>
              ))}
            </div>

            {/* Today's Schedule + Right Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Today's Interviews */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Today's Interviews</h2>
                      <p className="text-xs text-gray-400">5 Mar 2026</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("Schedule")}
                    className="flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {interviews
                    .filter((i) => i.date === "05 Mar 2026")
                    .slice(0, 6)
                    .map((i) => (
                      <div key={i.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                        <div className="w-16 text-center flex-shrink-0">
                          <p className="text-xs font-semibold text-gray-900">{i.time}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                          {i.company[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{i.student}</p>
                          <p className="text-xs text-gray-400 truncate">{i.company} · {i.round}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                          {i.mode === "Virtual" ? (
                            <Video className="w-3.5 h-3.5" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5" />
                          )}
                          <span>{i.room ?? "Virtual"}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[i.status]}`}>
                          {i.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {/* Interview Modes */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Today by Mode</h3>
                  {[
                    { label: "On-campus", count: 16, color: "bg-yellow-400", pct: 57 },
                    { label: "Virtual", count: 10, color: "bg-blue-400", pct: 36 },
                    { label: "Phone", count: 2, color: "bg-violet-400", pct: 7 },
                  ].map((m) => (
                    <div key={m.label} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>{m.label}</span>
                        <span>{m.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-red-50 rounded-lg border border-red-100">
                      <Bell className="w-4 h-4 text-red-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Alerts</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      { text: "3 interviews start in 30 mins", color: "bg-yellow-50 border-yellow-100 text-yellow-700", icon: "⏰" },
                      { text: "Interviewer Raj Kumar not confirmed", color: "bg-red-50 border-red-100 text-red-700", icon: "⚠️" },
                      { text: "Room 101 has a conflict at 3 PM", color: "bg-orange-50 border-orange-100 text-orange-700", icon: "🏠" },
                    ].map((a, idx) => (
                      <li key={idx} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium ${a.color}`}>
                        <span className="flex-shrink-0">{a.icon}</span>
                        {a.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interview → Offer Funnel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Interview → Offer Funnel</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Aggregate conversion across all active drives</p>
                </div>
                <span className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-700 font-medium rounded-full border border-yellow-100">
                  This Season
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { stage: "Shortlisted", count: 642, color: "bg-yellow-400", pct: 100 },
                  { stage: "Tech Round 1", count: 450, color: "bg-blue-400", pct: 70 },
                  { stage: "Tech Round 2", count: 245, color: "bg-violet-400", pct: 38 },
                  { stage: "HR Round", count: 164, color: "bg-emerald-400", pct: 26 },
                  { stage: "Offered", count: 120, color: "bg-rose-400", pct: 19 },
                ].map((f) => (
                  <div key={f.stage} className="flex items-center gap-4">
                    <div className="w-28 text-sm font-medium text-gray-700 flex-shrink-0">{f.stage}</div>
                    <div className="flex-1 h-8 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <div
                        className={`h-full ${f.color} rounded-xl flex items-center px-3 transition-all duration-700`}
                        style={{ width: `${f.pct}%` }}
                      >
                        <span className="text-white text-xs font-bold whitespace-nowrap">
                          {f.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-gray-400">{f.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ SCHEDULE TAB ══════════════════════ */}
        {activeTab === "Schedule" && (
          <div className="space-y-5">
            {/* Filters row */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student, company, round…"
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-72"
                  />
                </div>
                <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                  {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        statusFilter === s
                          ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-300 transition">
                <Plus className="w-4 h-4" />
                Schedule New
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Student", "Company", "Round", "Interviewer", "Date & Time", "Mode", "Location", "Status", "Action"].map((h) => (
                        <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map((i) => (
                      <tr key={i.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                              {i.student[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-xs">{i.student}</p>
                              <p className="text-[10px] text-gray-400">{i.studentBranch}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-[10px]">
                              {i.company[0]}
                            </div>
                            <span className="font-medium text-gray-800 text-xs">{i.company}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs font-medium text-gray-800">{i.round}</p>
                          <p className="text-[10px] text-gray-400">Round {i.roundNumber}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-700">{i.interviewer}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs font-medium text-gray-800">{i.time}</p>
                          <p className="text-[10px] text-gray-400">{i.date}</p>
                        </td>
                        <td className="py-4 px-4">
                          <ModeChip mode={i.mode} />
                        </td>
                        <td className="py-4 px-4">
                          {i.room ? (
                            <span className="text-xs text-gray-600">{i.room}</span>
                          ) : i.meetLink ? (
                            <span className="text-xs text-blue-600 truncate block max-w-[100px]">{i.meetLink}</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[i.status]}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1.5">
                            <button className="px-2.5 py-1 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                              Edit
                            </button>
                            <button
                              onClick={() => setActiveTab("Feedback")}
                              className="px-2.5 py-1 text-[10px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
                            >
                              Feedback
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredInterviews.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-gray-400 text-sm">No interviews match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ CALENDAR TAB ══════════════════════ */}
        {activeTab === "Calendar" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-900">Week of 3 – 7 Mar 2026</h2>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <ChevronRight className="w-3.5 h-3.5 rotate-180 text-gray-500" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
                {["Week", "Day"].map((v) => (
                  <button
                    key={v}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      v === "Week" ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-500"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {calendarDays.map((day) => {
                const isToday = day.date.includes("5 Mar");
                return (
                  <div
                    key={day.date}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                      isToday ? "border-yellow-300 ring-1 ring-yellow-300/40" : "border-gray-100"
                    }`}
                  >
                    <div className={`px-4 py-3 border-b ${isToday ? "bg-yellow-50 border-yellow-100" : "bg-gray-50 border-gray-100"}`}>
                      <p className={`text-xs font-semibold ${isToday ? "text-yellow-700" : "text-gray-700"}`}>
                        {day.date}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {day.slots.length} session{day.slots.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="p-3 space-y-2">
                      {day.slots.map((slot, si) => (
                        <div
                          key={si}
                          className={`px-3 py-2 rounded-xl border text-[11px] font-medium ${slot.color} cursor-pointer hover:opacity-80 transition`}
                        >
                          <p className="font-semibold">{slot.time}</p>
                          <p className="truncate">{slot.company}</p>
                          <p className="text-[10px] opacity-70">{slot.round} · {slot.count} students</p>
                        </div>
                      ))}
                      {day.slots.length === 0 && (
                        <p className="text-xs text-gray-300 text-center py-4">No interviews</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Company Legend</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { company: "Amazon", color: "bg-orange-400" },
                  { company: "TCS", color: "bg-blue-400" },
                  { company: "Google", color: "bg-green-400" },
                  { company: "Infosys", color: "bg-indigo-400" },
                  { company: "Deloitte", color: "bg-violet-400" },
                  { company: "Microsoft", color: "bg-sky-400" },
                  { company: "Wipro", color: "bg-emerald-400" },
                ].map((c) => (
                  <div key={c.company} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                    <span className="text-xs text-gray-600">{c.company}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ PIPELINE TAB ══════════════════════ */}
        {activeTab === "Pipeline" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Multi-Round Interview Pipeline</h2>
              <p className="text-xs text-gray-400 mt-0.5">Track student progression across all interview rounds by company</p>
            </div>

            {/* Per-company pipelines */}
            <div className="space-y-4">
              {pipelines.map((p) => {
                const overallRate = Math.round((p.rounds[p.rounds.length - 1].passed / p.rounds[0].total) * 100);
                return (
                  <div key={p.company} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                        {p.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.company}</p>
                        <p className="text-[10px] text-gray-400">
                          {p.rounds.length} rounds · {p.rounds[0].total} students entered
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xs font-semibold text-gray-900">
                          {p.rounds[p.rounds.length - 1].passed}{" "}
                          <span className="text-gray-400 font-normal">final pass</span>
                        </p>
                        <p className="text-[10px] text-gray-400">{overallRate}% overall conversion</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-2 overflow-x-auto pb-2">
                        {p.rounds.map((round, idx) => (
                          <React.Fragment key={round.name}>
                            <div className="flex-shrink-0 w-36 rounded-xl border border-gray-100 p-3 bg-white shadow-sm">
                              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                {round.name}
                              </p>
                              <p className="text-lg font-bold text-gray-900">{round.total}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">entered</p>
                              <div className="flex gap-1 mt-2">
                                <div className="flex-1 text-center py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                                  <p className="text-[10px] font-semibold text-emerald-700">{round.passed} ✓</p>
                                </div>
                                <div className="flex-1 text-center py-1 rounded-lg bg-red-50 border border-red-100">
                                  <p className="text-[10px] font-semibold text-red-600">{round.failed} ✗</p>
                                </div>
                              </div>
                            </div>
                            {idx < p.rounds.length - 1 && (
                              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-7" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student-level tracking */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Student Round Tracker</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    placeholder="Search student…"
                    className="pl-8 pr-4 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-52"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Student", "Company", "Current Round", "Progress", "Status"].map((h) => (
                        <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pipelineStudents.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-semibold text-xs">
                              {row.student[0]}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{row.student}</p>
                              <p className="text-[10px] text-gray-400">{row.branch}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-[9px]">
                              {row.company[0]}
                            </div>
                            <span className="text-xs text-gray-700">{row.company}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-xs font-medium text-gray-700">{row.currentRound}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: row.total }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-1.5 rounded-full ${i < row.cleared ? "bg-emerald-400" : "bg-gray-200"}`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500">{row.cleared}/{row.total}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ FEEDBACK TAB ══════════════════════ */}
        {activeTab === "Feedback" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Interview Feedback</h2>
                <p className="text-xs text-gray-400 mt-0.5">Detailed evaluations submitted by interviewers</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-300 transition">
                <Plus className="w-4 h-4" />
                Add Feedback
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {feedbackRecords.map((fb) => {
                const techParams = [
                  { label: "Coding", val: fb.coding },
                  { label: "Problem Solving", val: fb.problemSolving },
                  { label: "System Design", val: fb.systemDesign },
                  { label: "Communication", val: fb.communication },
                ].filter((p): p is { label: string; val: number } => p.val !== undefined);

                const hrParams = [
                  { label: "Culture Fit", val: fb.cultureFit },
                  { label: "Communication", val: fb.communication },
                  { label: "Confidence", val: fb.confidence },
                ].filter((p): p is { label: string; val: number } => p.val !== undefined);

                const isTech = (fb.coding ?? fb.systemDesign) !== undefined;
                const params = isTech ? techParams : hrParams;

                const recColors: Record<typeof fb.recommendation, string> = {
                  Hire: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  Advance: "bg-blue-50 text-blue-700 border-blue-200",
                  Hold: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  Reject: "bg-red-50 text-red-600 border-red-200",
                };

                return (
                  <div key={fb.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-semibold text-sm">
                          {fb.student[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{fb.student}</p>
                          <p className="text-[10px] text-gray-400">{fb.company} · {fb.round}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${recColors[fb.recommendation]}`}>
                          {fb.recommendation}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">by {fb.interviewer}</p>
                      </div>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                        {params.map((param) => (
                          <div key={param.label} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 flex-shrink-0">{param.label}</span>
                            <StarRating value={param.val} />
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-50">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Comments
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">{fb.comments}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-gray-400">{fb.date}</span>
                        <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium transition">
                          View Full →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════ RESULTS TAB ═══════════════════���══ */}
        {activeTab === "Results" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Interview Results</h2>
                <p className="text-xs text-gray-400 mt-0.5">Outcomes of all completed interview rounds</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Completed", value: "120", color: "text-gray-900", bg: "bg-gray-50 border-gray-200" },
                { label: "Passed / Advanced", value: "72", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                { label: "Rejected", value: "38", color: "text-red-600", bg: "bg-red-50 border-red-200" },
                { label: "On Hold", value: "10", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
              ].map((card) => (
                <div key={card.label} className={`rounded-2xl border p-4 shadow-sm ${card.bg}`}>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Student", "Company", "Round", "Interviewer", "Date", "Result", "Next Step"].map((h) => (
                        <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {interviews
                      .filter((i) => i.status === "Completed")
                      .map((i) => (
                        <tr key={i.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-semibold text-xs">
                                {i.student[0]}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">{i.student}</p>
                                <p className="text-[10px] text-gray-400">{i.studentBranch}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-[9px]">
                                {i.company[0]}
                              </div>
                              <span className="text-xs text-gray-700">{i.company}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-700">{i.round}</td>
                          <td className="py-4 px-5 text-xs text-gray-600">{i.interviewer}</td>
                          <td className="py-4 px-5 text-xs text-gray-600">{i.date}</td>
                          <td className="py-4 px-5">
                            {i.result ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${resultStyles[i.result]}`}>
                                {i.result === "Passed" || i.result === "Selected" ? "✓ " : "✗ "}{i.result}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            {i.result === "Passed" ? (
                              <button className="text-xs text-blue-600 font-medium hover:text-blue-700 transition">
                                Schedule Round {i.roundNumber + 1}
                              </button>
                            ) : i.result === "Selected" ? (
                              <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition">
                                Generate Offer
                              </button>
                            ) : i.result === "Failed" || i.result === "Rejected" ? (
                              <span className="text-xs text-gray-400">Eliminated</span>
                            ) : (
                              <span className="text-xs text-gray-400">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ ROOMS TAB ══════════════════════ */}
        {activeTab === "Rooms" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Interview Rooms & Logistics</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage room allocation and scheduling for on-campus drives</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-300 transition">
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            </div>

            {/* Room summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Rooms", value: "6", color: "text-gray-900", bg: "bg-gray-50 border-gray-200" },
                { label: "Occupied", value: "4", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
                { label: "Available", value: "2", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                { label: "Interviews Today", value: "24", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
              ].map((c) => (
                <div key={c.label} className={`rounded-2xl border p-4 shadow-sm ${c.bg}`}>
                  <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const isOccupied = room.status === "Occupied";
                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition ${
                      isOccupied ? "border-gray-100" : "border-emerald-100"
                    }`}
                  >
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${isOccupied ? "bg-gray-50 border-gray-100" : "bg-emerald-50 border-emerald-100"}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${isOccupied ? "bg-orange-50 border border-orange-100" : "bg-emerald-50 border border-emerald-200"}`}>
                          <Building2 className={`w-4 h-4 ${isOccupied ? "text-orange-500" : "text-emerald-600"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{room.name}</p>
                          <p className="text-[10px] text-gray-400">Capacity: {room.capacity}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        isOccupied
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="px-5 py-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Assigned to</span>
                        <span className="font-semibold text-gray-900">{room.company}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Time Slot</span>
                        <span className="font-medium text-gray-700">{room.time}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Interviews Today</span>
                        <span className="font-semibold text-gray-900">{room.interviews}</span>
                      </div>
                    </div>
                    <div className="px-5 pb-4 flex gap-2">
                      <button className="flex-1 py-2 text-xs font-medium bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                        Edit
                      </button>
                      <button className="flex-1 py-2 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition">
                        View Schedule
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════ ANALYTICS TAB ══════════════════════ */}
        {activeTab === "Analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Interview Analytics</h2>
                <p className="text-xs text-gray-400 mt-0.5">Data-driven insights into performance and outcomes</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition">
                <ArrowUpRight className="w-3.5 h-3.5" /> Export Report
              </button>
            </div>

            {/* Round drop-off */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Round-wise Drop-off Analysis</h3>
              <p className="text-xs text-gray-400 mb-5">Pass vs fail split at each interview stage</p>
              <div className="space-y-4">
                {roundDropoff.map((r) => {
                  const passRate = Math.round((r.passed / r.attempted) * 100);
                  return (
                    <div key={r.round} className="flex items-center gap-4">
                      <div className="w-32 text-xs font-medium text-gray-700 flex-shrink-0">{r.round}</div>
                      <div className="flex-1 h-8 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex">
                        <div
                          className="h-full bg-emerald-400 flex items-center px-3 transition-all duration-700"
                          style={{ width: `${passRate}%` }}
                        >
                          <span className="text-white text-xs font-bold whitespace-nowrap">{r.passed} passed</span>
                        </div>
                        <div
                          className="h-full bg-red-300 flex items-center px-3"
                          style={{ width: `${100 - passRate}%` }}
                        >
                          <span className="text-white text-xs font-bold whitespace-nowrap">{r.failed} failed</span>
                        </div>
                      </div>
                      <span className="w-14 text-right text-xs font-semibold text-red-500">-{r.dropRate}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Company success + Top students */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
                  <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Briefcase className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Interview Success by Company</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Company", "Interviews", "Offers", "Rate"].map((h) => (
                        <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companySuccess.map((c) => (
                      <tr key={c.company} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-[10px]">
                              {c.company[0]}
                            </div>
                            <span className="text-xs font-medium text-gray-800">{c.company}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-xs text-gray-600">{c.interviews}</td>
                        <td className="py-3 px-5 text-xs font-medium text-emerald-700">{c.offers}</td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${c.rate}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{c.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
                  <div className="p-1.5 bg-violet-50 rounded-lg border border-violet-100">
                    <Users className="w-4 h-4 text-violet-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Student Interview Performance</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Student", "Branch", "Interviews", "Offers"].map((h) => (
                        <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((s, idx) => (
                      <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center font-semibold text-xs">
                              {s.name[0]}
                            </div>
                            <span className="text-xs font-semibold text-gray-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                            {s.branch}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-700">{s.interviews}</td>
                        <td className="py-3.5 px-5">
                          <span className={`text-xs font-semibold ${s.offers > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                            {s.offers}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">AI Interview Insights</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                  PrepAI
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "📉",
                    title: "Biggest Drop-off",
                    value: "Tech Round 1",
                    desc: "45% of students are eliminated here. Focus on DSA preparation workshops.",
                    color: "bg-red-50 border-red-100",
                  },
                  {
                    icon: "📊",
                    title: "Top Weak Area",
                    value: "System Design",
                    desc: "72% of students rated < 3 stars in System Design. Targeted sessions recommended.",
                    color: "bg-orange-50 border-orange-100",
                  },
                  {
                    icon: "🏆",
                    title: "Best Performing Branch",
                    value: "CSE",
                    desc: "CSE students convert 40% better than ECE and IT in technical rounds.",
                    color: "bg-emerald-50 border-emerald-100",
                  },
                ].map((insight) => (
                  <div key={insight.title} className={`rounded-2xl border p-4 ${insight.color}`}>
                    <div className="text-xl mb-2">{insight.icon}</div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{insight.title}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{insight.value}</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
