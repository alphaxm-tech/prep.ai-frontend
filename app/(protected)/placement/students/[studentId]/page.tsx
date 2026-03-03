"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  Brain,
  Code2,
  FileText,
  ClipboardList,
  Briefcase,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import {
  MOCK_STUDENTS,
  MOCK_STUDENT_DETAIL,
  type Student,
  type CodingRecord,
  type ApplicationRecord,
} from "@/utils/dummy-data/mock-students";

/* ─────────────────────── Types ─────────────────────────────── */
type ProfileTab =
  | "Overview"
  | "Quizzes"
  | "Interviews"
  | "Resumes"
  | "Coding"
  | "Assessments"
  | "Applications";

/* ─────────────────────── Helpers ───────────────────────────── */
function readinessColor(v: number) {
  if (v >= 85) return { bar: "bg-emerald-400", text: "text-emerald-700", badge: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  if (v >= 65) return { bar: "bg-yellow-400", text: "text-yellow-700", badge: "bg-yellow-50 border-yellow-200 text-yellow-700" };
  return { bar: "bg-red-400", text: "text-red-600", badge: "bg-red-50 border-red-200 text-red-600" };
}

const YEAR_LABELS: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

const PLACEMENT_BADGE: Record<Student["placementStatus"], string> = {
  Placed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Offered: "bg-blue-50 text-blue-700 border border-blue-200",
  Shortlisted: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Unplaced: "bg-gray-100 text-gray-500 border border-gray-200",
};

const APP_STATUS_BADGE: Record<ApplicationRecord["status"], string> = {
  Applied: "bg-gray-100 text-gray-600 border border-gray-200",
  Shortlisted: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Offered: "bg-violet-50 text-violet-700 border border-violet-200",
  Rejected: "bg-red-50 text-red-600 border border-red-200",
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const DIFFICULTY_BADGE: Record<CodingRecord["difficulty"], string> = {
  Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Hard: "bg-red-50 text-red-600 border border-red-200",
};



function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating / 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-gray-700">{rating}/10</span>
    </div>
  );
}

/* ─────────────────────── Tab Content Components ────────────── */

function OverviewTab({ student }: { student: Student }) {
  const c = readinessColor(student.readiness);
  const { quizzes, interviews, coding, assessments, applications, resumes } = MOCK_STUDENT_DETAIL;

  const solvedCoding = coding.filter((c) => c.status === "Solved").length;
const avgQuizScore = Math.round(quizzes.reduce((s, q) => s + q.score, 0) / quizzes.length);
  const avgInterviewRating = (interviews.reduce((s, i) => s + i.rating, 0) / interviews.length).toFixed(1);
  const clearedAssessments = assessments.filter((a) => a.result === "Cleared").length;

  return (
    <div className="space-y-6">
      {/* Readiness Gauge */}
      <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Big readiness score */}
          <div className="flex-shrink-0 text-center">
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={student.readiness >= 85 ? "#34d399" : student.readiness >= 65 ? "#fbbf24" : "#f87171"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(student.readiness / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black ${c.text}`}>{student.readiness}%</span>
                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">Readiness</span>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg Quiz Score", value: `${avgQuizScore}%`, color: "bg-amber-400", icon: <ClipboardList className="w-4 h-4 text-amber-500" /> },
              { label: "Interview Avg", value: `${avgInterviewRating}/10`, color: "bg-violet-400", icon: <Brain className="w-4 h-4 text-violet-500" /> },
              { label: "Coding Solved", value: `${solvedCoding}/${coding.length}`, color: "bg-emerald-400", icon: <Code2 className="w-4 h-4 text-emerald-500" /> },
              { label: "Assessments Cleared", value: `${clearedAssessments}/${assessments.length}`, color: "bg-blue-400", icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-yellow-50 border border-yellow-100 rounded-xl">
              <Target className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Skill Areas</h3>
          </div>
          <div className="space-y-3.5">
            {[
              { skill: "Aptitude & Reasoning", score: 82, color: "bg-yellow-400" },
              { skill: "DSA & Algorithms", score: 76, color: "bg-blue-400" },
              { skill: "Core CS (OS/DBMS/CN)", score: 68, color: "bg-violet-400" },
              { skill: "Communication Skills", score: 90, color: "bg-emerald-400" },
              { skill: "System Design", score: 55, color: "bg-rose-400" },
            ].map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">{item.skill}</span>
                  <span className="text-xs font-bold text-gray-500">{item.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-xl">
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-0">
            {[
              { icon: "📝", text: `Completed "${quizzes[0].title}"`, sub: `Score: ${quizzes[0].score}%`, time: quizzes[0].date },
              { icon: "🤖", text: `AI Interview — ${interviews[0].company}`, sub: `Rating: ${interviews[0].rating}/10`, time: interviews[0].date },
              { icon: "💻", text: `Solved "${coding[0].problem}"`, sub: coding[0].language, time: coding[0].date },
              { icon: "📄", text: `Updated Resume ${resumes[0].version}`, sub: resumes[0].template + " template", time: resumes[0].updatedAt },
              { icon: "🏢", text: `Applied to ${applications[0].company}`, sub: applications[0].role, time: applications[0].appliedOn },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm shadow-sm">{item.icon}</div>
                  {i < arr.length - 1 && <div className="w-px h-5 bg-gray-100 mt-1" />}
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.text}</p>
                  <p className="text-[11px] text-gray-400">{item.sub} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Placement Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Placement Journey</h3>
        </div>
        <div className="flex items-center gap-0">
          {(["Applied", "Shortlisted", "In Progress", "Offered", "Accepted"] as const).map((stage, i) => {
            const count = MOCK_STUDENT_DETAIL.applications.filter((a) => a.status === stage).length;
            const isDone = count > 0;
            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${isDone ? "bg-yellow-400 border-yellow-400 text-yellow-900" : "bg-gray-50 border-gray-200 text-gray-300"}`}>
                    {isDone ? count : "—"}
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 text-center whitespace-nowrap">{stage}</span>
                </div>
                {i < 4 && <div className={`flex-shrink-0 w-6 h-0.5 -mt-4 ${isDone ? "bg-yellow-400" : "bg-gray-200"}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function QuizzesTab() {
  const { quizzes } = MOCK_STUDENT_DETAIL;
  const passed = quizzes.filter((q) => q.result === "Passed").length;
  const avg = Math.round(quizzes.reduce((s, q) => s + q.score, 0) / quizzes.length);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Quizzes", value: quizzes.length, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Passed", value: passed, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Avg Score", value: `${avg}%`, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Quiz Title", "Category", "Score", "Time", "Date", "Result"].map((h) => (
                <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-gray-900">{q.title}</td>
                <td className="py-3.5 px-5"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{q.category}</span></td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${q.score >= 75 ? "bg-emerald-400" : q.score >= 60 ? "bg-yellow-400" : "bg-red-400"} rounded-full`} style={{ width: `${q.score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{q.score}/{q.totalMarks}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-xs text-gray-500">{q.timeTaken}</td>
                <td className="py-3.5 px-5 text-xs text-gray-500">{q.date}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${q.result === "Passed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    {q.result === "Passed" ? <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{q.result}</span> : <span className="flex items-center gap-1"><XCircle className="w-3 h-3" />{q.result}</span>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InterviewsTab() {
  const { interviews } = MOCK_STUDENT_DETAIL;
  const avg = (interviews.reduce((s, i) => s + i.rating, 0) / interviews.length).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Interviews", value: interviews.length, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
          { label: "Avg Rating", value: `${avg}/10`, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Companies", value: new Set(interviews.map((i) => i.company)).size, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((iv) => (
          <div key={iv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {iv.company[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{iv.company}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                    iv.type === "Technical" ? "bg-blue-50 text-blue-700" :
                    iv.type === "HR" ? "bg-emerald-50 text-emerald-700" :
                    iv.type === "Behavioral" ? "bg-violet-50 text-violet-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{iv.type}</span>
                </div>
              </div>
              <RatingStars rating={iv.rating} />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-3 italic">"{iv.feedback}"</p>

            <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-3 border-t border-gray-50">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{iv.duration}</span>
              <span>{iv.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumesTab() {
  const { resumes } = MOCK_STUDENT_DETAIL;
  const templateColors: Record<string, string> = {
    Modern: "bg-blue-50 text-blue-700 border-blue-200",
    Professional: "bg-violet-50 text-violet-700 border-violet-200",
    Creative: "bg-rose-50 text-rose-700 border-rose-200",
    Minimal: "bg-gray-100 text-gray-600 border-gray-200",
    Standard: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Versions", value: resumes.length, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          { label: "Latest Version", value: resumes[0].version, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resumes.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 border border-yellow-200 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Resume {r.version}</p>
                  <span className={`inline-block mt-0.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${templateColors[r.template] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {r.template}
                  </span>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-100 transition opacity-0 group-hover:opacity-100">
                Preview
              </button>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Created: <span className="font-medium text-gray-600">{r.createdAt}</span></span>
              <span>Updated: <span className="font-medium text-gray-600">{r.updatedAt}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodingTab() {
  const { coding } = MOCK_STUDENT_DETAIL;
  const solved = coding.filter((c) => c.status === "Solved").length;
  const byDiff = {
    Easy: coding.filter((c) => c.difficulty === "Easy"),
    Medium: coding.filter((c) => c.difficulty === "Medium"),
    Hard: coding.filter((c) => c.difficulty === "Hard"),
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Attempted", value: coding.length, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
          { label: "Solved", value: solved, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Easy ✓", value: `${byDiff.Easy.filter((c) => c.status === "Solved").length}/${byDiff.Easy.length}`, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Medium ✓", value: `${byDiff.Medium.filter((c) => c.status === "Solved").length}/${byDiff.Medium.length}`, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Problem", "Category", "Difficulty", "Language", "Status", "Date"].map((h) => (
                <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coding.map((c) => (
              <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-gray-900">{c.problem}</td>
                <td className="py-3.5 px-5"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{c.category}</span></td>
                <td className="py-3.5 px-5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${DIFFICULTY_BADGE[c.difficulty]}`}>{c.difficulty}</span></td>
                <td className="py-3.5 px-5 text-xs text-gray-600 font-medium">{c.language}</td>
                <td className="py-3.5 px-5">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-lg ${c.status === "Solved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
                    {c.status === "Solved" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {c.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-xs text-gray-500">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssessmentsTab() {
  const { assessments } = MOCK_STUDENT_DETAIL;
  const cleared = assessments.filter((a) => a.result === "Cleared").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: assessments.length, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
          { label: "Cleared", value: cleared, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Pass Rate", value: `${Math.round((cleared / assessments.length) * 100)}%`, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {a.company[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{a.company}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${a.type === "Coding" ? "bg-blue-50 text-blue-700" : a.type === "MCQ" ? "bg-amber-50 text-amber-700" : "bg-violet-50 text-violet-700"}`}>
                    {a.type}
                  </span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                a.result === "Cleared" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                a.result === "Not Cleared" ? "bg-red-50 text-red-600 border-red-200" :
                "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
                {a.result}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2 font-medium">{a.title}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-3 border-t border-gray-50">
              <span>Score: <span className="font-bold text-gray-700">{a.score}</span></span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const { applications } = MOCK_STUDENT_DETAIL;
  const accepted = applications.filter((a) => a.status === "Accepted" || a.status === "Offered").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Applied", value: applications.length, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
          { label: "Offers Received", value: accepted, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "In Progress", value: applications.filter((a) => a.status === "In Progress" || a.status === "Shortlisted").length, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Company", "Role", "CTC", "Applied On", "Status"].map((h) => (
                <th key={h} className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((ap) => (
              <tr key={ap.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {ap.company[0]}
                    </div>
                    <span className="font-semibold text-gray-900">{ap.company}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-gray-600">{ap.role}</td>
                <td className="py-3.5 px-5 font-semibold text-gray-800">{ap.ctc}</td>
                <td className="py-3.5 px-5 text-xs text-gray-500">{ap.appliedOn}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${APP_STATUS_BADGE[ap.status]}`}>
                    {ap.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function StudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");

  // Find student, fallback to first if not found
  const student = MOCK_STUDENTS.find((s) => s.id === params.studentId) ?? MOCK_STUDENTS[0];

  const c = readinessColor(student.readiness);

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "Overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "Quizzes", label: "Quizzes", icon: <ClipboardList className="w-4 h-4" />, count: student.quizzesTaken },
    { id: "Interviews", label: "AI Interviews", icon: <Brain className="w-4 h-4" />, count: student.aiInterviews },
    { id: "Resumes", label: "Resumes", icon: <FileText className="w-4 h-4" />, count: student.resumesMade },
    { id: "Coding", label: "Coding", icon: <Code2 className="w-4 h-4" />, count: student.codingAttempts },
    { id: "Assessments", label: "Assessments", icon: <Award className="w-4 h-4" /> },
    { id: "Applications", label: "Applications", icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-7">

        {/* ── BACK BUTTON ── */}
        <button
          onClick={() => router.push("/placement/students")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-yellow-700 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Students
        </button>

        {/* ── PROFILE HEADER ── */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl overflow-hidden shadow-sm">
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                  {student.name[0]}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{student.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{student.rollNo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${PLACEMENT_BADGE[student.placementStatus]}`}>
                      {student.placementStatus}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${c.badge}`}>
                      {student.readiness}% Readiness
                    </span>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{student.email}</span>
                  {student.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{student.phone}</span>}
                  {student.city && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" />{student.city}</span>}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold">{student.branch}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-semibold">{YEAR_LABELS[student.year]}</span>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-xl text-xs font-semibold">{student.group}</span>
                  <span className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-xl text-xs font-semibold">CGPA {student.cgpa}</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${student.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-500"}`}>
                    {student.status === "active" ? "● Active" : "● Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Quizzes", value: student.quizzesTaken, icon: <ClipboardList className="w-4 h-4 text-amber-500" />, bg: "bg-amber-50 border-amber-100" },
                { label: "AI Interviews", value: student.aiInterviews, icon: <Brain className="w-4 h-4 text-violet-500" />, bg: "bg-violet-50 border-violet-100" },
                { label: "Resumes", value: student.resumesMade, icon: <FileText className="w-4 h-4 text-blue-500" />, bg: "bg-blue-50 border-blue-100" },
                { label: "Coding", value: student.codingAttempts, icon: <Code2 className="w-4 h-4 text-emerald-500" />, bg: "bg-emerald-50 border-emerald-100" },
              ].map((kpi) => (
                <div key={kpi.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${kpi.bg}`}>
                  <div className="flex-shrink-0">{kpi.icon}</div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-[11px] text-gray-500">{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-2xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={activeTab === tab.id ? "text-yellow-600" : ""}>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div>
          {activeTab === "Overview" && <OverviewTab student={student} />}
          {activeTab === "Quizzes" && <QuizzesTab />}
          {activeTab === "Interviews" && <InterviewsTab />}
          {activeTab === "Resumes" && <ResumesTab />}
          {activeTab === "Coding" && <CodingTab />}
          {activeTab === "Assessments" && <AssessmentsTab />}
          {activeTab === "Applications" && <ApplicationsTab />}
        </div>

      </div>
    </div>
  );
}
