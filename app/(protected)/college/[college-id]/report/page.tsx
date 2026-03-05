"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Building2,
  Users,
  Target,
  BarChart3,
  Shield,
  Award,
  ChevronRight,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  FileText,
  GraduationCap,
  ArrowUp,
  Star,
  ClipboardCheck,
} from "lucide-react";

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */

const branchData = [
  { branch: "CSE", eligible: 240, placed: 210, rate: 87, avgCTC: 9.2, color: "bg-blue-500" },
  { branch: "IT", eligible: 180, placed: 150, rate: 83, avgCTC: 7.5, color: "bg-violet-500" },
  { branch: "ECE", eligible: 160, placed: 112, rate: 70, avgCTC: 5.8, color: "bg-yellow-500" },
  { branch: "EEE", eligible: 120, placed: 72, rate: 60, avgCTC: 5.2, color: "bg-orange-500" },
  { branch: "Mechanical", eligible: 200, placed: 90, rate: 45, avgCTC: 4.1, color: "bg-rose-400" },
  { branch: "Civil", eligible: 140, placed: 56, rate: 40, avgCTC: 3.8, color: "bg-gray-400" },
];

const salaryBuckets = [
  { range: "< 3 LPA", count: 20, color: "bg-rose-400" },
  { range: "3 – 5 LPA", count: 110, color: "bg-orange-400" },
  { range: "5 – 10 LPA", count: 150, color: "bg-yellow-400" },
  { range: "10 – 20 LPA", count: 25, color: "bg-emerald-400" },
  { range: "20+ LPA", count: 7, color: "bg-blue-400" },
];

const companiesData = [
  { name: "TCS", sector: "IT Services", drives: 4, hired: 85, avgCTC: "4.5 LPA", status: "Active" },
  { name: "Infosys", sector: "IT Services", drives: 3, hired: 62, avgCTC: "4.2 LPA", status: "Active" },
  { name: "Wipro", sector: "IT Services", drives: 3, hired: 48, avgCTC: "4.0 LPA", status: "Active" },
  { name: "Amazon", sector: "E-Commerce", drives: 1, hired: 5, avgCTC: "28.5 LPA", status: "Active" },
  { name: "Deloitte", sector: "Consulting", drives: 2, hired: 22, avgCTC: "7.8 LPA", status: "Active" },
  { name: "HDFC Bank", sector: "Banking", drives: 1, hired: 18, avgCTC: "5.2 LPA", status: "Completed" },
];

const yearlyCompanyTrend = [
  { year: "2021", count: 32 },
  { year: "2022", count: 45 },
  { year: "2023", count: 56 },
  { year: "2024", count: 68 },
  { year: "2025", count: 72 },
];

const assessments = [
  { name: "Aptitude", avg: 68, pass: 75, attempts: 1100, color: "bg-blue-500" },
  { name: "Coding", avg: 54, pass: 48, attempts: 980, color: "bg-violet-500" },
  { name: "Communication", avg: 72, pass: 82, attempts: 850, color: "bg-yellow-500" },
  { name: "System Design", avg: 48, pass: 38, attempts: 620, color: "bg-rose-400" },
  { name: "SQL / DBMS", avg: 63, pass: 62, attempts: 740, color: "bg-emerald-500" },
];

const skillGaps = [
  { skill: "DSA", weak: 120, color: "bg-rose-400" },
  { skill: "Cloud / AWS", weak: 110, color: "bg-orange-400" },
  { skill: "System Design", weak: 95, color: "bg-yellow-500" },
  { skill: "Communication", weak: 75, color: "bg-violet-400" },
  { skill: "SQL / DBMS", weak: 60, color: "bg-blue-400" },
  { skill: "Web Dev", weak: 48, color: "bg-emerald-400" },
];

const readinessTop = [
  { name: "Aarav Sharma", branch: "CSE", year: 4, score: 92, trend: "up" },
  { name: "Ishita Rao", branch: "IT", year: 3, score: 88, trend: "up" },
  { name: "Rohan Patel", branch: "CSE", year: 4, score: 85, trend: "stable" },
  { name: "Meera Iyer", branch: "ECE", year: 3, score: 76, trend: "up" },
  { name: "Arjun Singh", branch: "Mechanical", year: 4, score: 45, trend: "down" },
];

const aiPredictions = [
  { name: "Aarav Sharma", prob: 92, tier: "Tier 1" },
  { name: "Ishita Rao", prob: 88, tier: "Tier 1" },
  { name: "Meera Iyer", prob: 71, tier: "Tier 2" },
  { name: "Rohan Patel", prob: 65, tier: "Tier 2" },
  { name: "Arjun Singh", prob: 38, tier: "At Risk" },
];

const driveFunnel = [
  { stage: "Applied", count: 1248, pct: 100, color: "bg-blue-500", textColor: "text-blue-600", barW: "100%" },
  { stage: "Shortlisted", count: 642, pct: 51, color: "bg-violet-500", textColor: "text-violet-600", barW: "51%" },
  { stage: "Assessment", count: 410, pct: 33, color: "bg-yellow-500", textColor: "text-yellow-600", barW: "33%" },
  { stage: "Interview", count: 295, pct: 24, color: "bg-orange-500", textColor: "text-orange-600", barW: "24%" },
  { stage: "Offered", count: 312, pct: 25, color: "bg-emerald-500", textColor: "text-emerald-600", barW: "25%" },
];

const conversionRates = [
  { company: "TCS", interviews: 120, offers: 80, rate: 66 },
  { company: "Infosys", interviews: 90, offers: 62, rate: 69 },
  { company: "Wipro", interviews: 75, offers: 48, rate: 64 },
  { company: "Deloitte", interviews: 40, offers: 22, rate: 55 },
  { company: "Amazon", interviews: 30, offers: 5, rate: 16 },
];

const yearlyPlacementTrend = [
  { year: "2021", rate: 62 },
  { year: "2022", rate: 69 },
  { year: "2023", rate: 74 },
  { year: "2024", rate: 79 },
  { year: "2025", rate: 83 },
];

const offerAcceptance = [
  { student: "Aarav Sharma", company: "Amazon", ctc: "28.5 LPA", status: "Accepted", date: "Jan 15" },
  { student: "Ishita Rao", company: "Infosys", ctc: "4.2 LPA", status: "Accepted", date: "Jan 18" },
  { student: "Rohan Patel", company: "TCS", ctc: "4.5 LPA", status: "Declined", date: "Jan 20" },
  { student: "Meera Iyer", company: "Deloitte", ctc: "7.8 LPA", status: "Pending", date: "Feb 2" },
  { student: "Arjun Singh", company: "Wipro", ctc: "4.0 LPA", status: "Accepted", date: "Feb 5" },
  { student: "Karan Mehta", company: "Cognizant", ctc: "3.8 LPA", status: "Pending", date: "Feb 8" },
];

const violations = [
  { student: "Karan Mehta", offers: 3, companies: "TCS, Infosys, Cognizant", status: "Under Review" },
  { student: "Priya Nair", offers: 2, companies: "Wipro, Capgemini", status: "Resolved" },
  { student: "Aditya Joshi", offers: 2, companies: "HCL, TCS", status: "Under Review" },
];

const auditLogs = [
  { action: "Offer status updated for Aarav Sharma → Amazon", user: "Admin Sharma", role: "TPO", time: "2h ago", icon: "📋", bg: "bg-blue-50 border-blue-100", text: "text-blue-700" },
  { action: "Drive Created — Amazon SDE Technical Drive 2025", user: "Admin Verma", role: "Admin", time: "5h ago", icon: "🚀", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
  { action: "Violation Detected — Karan Mehta (3 offers accepted)", user: "System Auto", role: "Auto", time: "1d ago", icon: "⚠️", bg: "bg-red-50 border-red-100", text: "text-red-700" },
  { action: "Bulk Resume Review Completed (148 reviewed)", user: "Admin Rao", role: "Admin", time: "1d ago", icon: "📄", bg: "bg-yellow-50 border-yellow-100", text: "text-yellow-700" },
  { action: "Assessment Published — Advanced DSA (650 questions)", user: "Admin Sharma", role: "TPO", time: "2d ago", icon: "📝", bg: "bg-violet-50 border-violet-100", text: "text-violet-700" },
  { action: "Offer Revoked — HCL offer cancelled for Aditya Joshi", user: "Admin Verma", role: "Admin", time: "3d ago", icon: "🚫", bg: "bg-rose-50 border-rose-100", text: "text-rose-700" },
];

/* ─────────────────────────────────────
   UTILITY COMPONENTS
───────────────��───────────────────── */

function Bar({ value, color = "bg-yellow-400", max = 100 }: { value: number; color?: string; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{value}%</span>
    </div>
  );
}

function Badge({ label, variant }: { label: string; variant: "success" | "danger" | "warning" | "info" | "neutral" }) {
  const s: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    danger: "bg-red-50 text-red-600 border-red-100",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    neutral: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${s[variant]}`}>{label}</span>;
}

function SecHead({
  icon,
  title,
  sub,
  iconBg = "bg-yellow-50 border-yellow-100",
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className={`p-1.5 rounded-lg border ${iconBg}`}>{icon}</div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function KpiCard({
  title,
  value,
  change,
  icon,
  accent,
  iconBg,
  changeBg,
  hoverLine = "via-yellow-300",
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  changeBg: string;
  hoverLine?: string;
}) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:${hoverLine} transition-all duration-500`}
      />
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`p-2 rounded-xl ${iconBg} ${accent}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-lg text-xs font-semibold ${changeBg}`}>
        <TrendingUp className="w-3 h-3" />
        {change}
      </div>
    </div>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-gray-50">
        {cols.map((h) => (
          <th
            key={h}
            className="py-2.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* ─────────────────────────────────────
   SECTION 1 — PLACEMENT REPORTS
───────────────────────────────────── */

function PlacementSection() {
  const totalPlaced = branchData.reduce((a, b) => a + b.placed, 0);
  const totalEligible = branchData.reduce((a, b) => a + b.eligible, 0);
  const maxSalary = Math.max(...salaryBuckets.map((s) => s.count));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard title="Overall Placement Rate" value={`${Math.round((totalPlaced / totalEligible) * 100)}%`} change="+4% vs last year" icon={<TrendingUp className="w-5 h-5" />} accent="text-yellow-600" iconBg="bg-yellow-50 border border-yellow-100" changeBg="bg-yellow-50 text-yellow-700" hoverLine="via-yellow-300" />
        <KpiCard title="Average CTC" value="6.4 LPA" change="+0.8 LPA vs last year" icon={<Award className="w-5 h-5" />} accent="text-emerald-600" iconBg="bg-emerald-50 border border-emerald-100" changeBg="bg-emerald-50 text-emerald-700" hoverLine="via-emerald-300" />
        <KpiCard title="Highest Package" value="28.5 LPA" change="Amazon India · SDE" icon={<Star className="w-5 h-5" />} accent="text-blue-600" iconBg="bg-blue-50 border border-blue-100" changeBg="bg-blue-50 text-blue-600" hoverLine="via-blue-300" />
        <KpiCard title="Total Placed" value={String(totalPlaced)} change={`of ${totalEligible} eligible`} icon={<Users className="w-5 h-5" />} accent="text-violet-600" iconBg="bg-violet-50 border border-violet-100" changeBg="bg-violet-50 text-violet-600" hoverLine="via-violet-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Branch Placement Table */}
        <Card>
          <SecHead icon={<BarChart3 className="w-4 h-4 text-yellow-600" />} title="Branch-wise Placement Rate" iconBg="bg-yellow-50 border-yellow-100" />
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <TableHead cols={["Branch", "Eligible", "Placed", "Rate", "Avg CTC"]} />
              <tbody>
                {branchData.map((row) => (
                  <tr key={row.branch} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.branch}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{row.eligible}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-800">{row.placed}</td>
                    <td className="py-3 px-4 w-40">
                      <Bar value={row.rate} color={row.color} />
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600 text-xs">{row.avgCTC} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Salary Distribution */}
        <Card>
          <SecHead icon={<BarChart3 className="w-4 h-4 text-emerald-600" />} title="Salary Distribution" sub="Students by CTC range" iconBg="bg-emerald-50 border-emerald-100" />
          <div className="space-y-4">
            {salaryBuckets.map((bucket) => {
              const pct = Math.round((bucket.count / maxSalary) * 100);
              const sharePct = Math.round((bucket.count / totalPlaced) * 100);
              return (
                <div key={bucket.range}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-medium">{bucket.range}</span>
                    <span className="font-semibold text-gray-700">{bucket.count} students</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${bucket.color} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`}
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 20 && (
                        <span className="text-white text-[10px] font-bold">{sharePct}%</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4">
            {[
              { label: "Highest", value: "28.5 LPA", color: "text-emerald-600" },
              { label: "Median", value: "6.8 LPA", color: "text-blue-600" },
              { label: "Average", value: "6.4 LPA", color: "text-yellow-600" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className={`text-base font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SECTION 2 — COMPANY REPORTS
───────────────────────────────────── */

function CompanySection() {
  const maxCount = Math.max(...yearlyCompanyTrend.map((d) => d.count));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard title="Companies Visited" value="72" change="+4 vs last year" icon={<Building2 className="w-5 h-5" />} accent="text-blue-600" iconBg="bg-blue-50 border border-blue-100" changeBg="bg-blue-50 text-blue-600" hoverLine="via-blue-300" />
        <KpiCard title="Drives Conducted" value="14" change="Across all companies" icon={<Target className="w-5 h-5" />} accent="text-emerald-600" iconBg="bg-emerald-50 border border-emerald-100" changeBg="bg-emerald-50 text-emerald-700" hoverLine="via-emerald-300" />
        <KpiCard title="Total Hired" value="690" change="Across all drives" icon={<Users className="w-5 h-5" />} accent="text-violet-600" iconBg="bg-violet-50 border border-violet-100" changeBg="bg-violet-50 text-violet-600" hoverLine="via-violet-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card>
            <SecHead icon={<Building2 className="w-4 h-4 text-blue-600" />} title="Company Participation Report" iconBg="bg-blue-50 border-blue-100" />
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <TableHead cols={["Company", "Sector", "Drives", "Hired", "Avg CTC", "Status"]} />
                <tbody>
                  {companiesData.map((row) => (
                    <tr key={row.name} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{row.sector}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{row.drives}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600">{row.hired}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 text-xs">{row.avgCTC}</td>
                      <td className="py-3 px-4">
                        <Badge label={row.status} variant={row.status === "Active" ? "success" : "neutral"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <SecHead icon={<TrendingUp className="w-4 h-4 text-blue-600" />} title="Recruiter Trend" sub="Companies per year" iconBg="bg-blue-50 border-blue-100" />
          <div className="space-y-3">
            {yearlyCompanyTrend.map((d) => (
              <div key={d.year}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold">{d.year}</span>
                  <span className="font-bold text-gray-700">{d.count}</span>
                </div>
                <div className="h-5 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-lg transition-all duration-700"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">📈 125% growth in recruiter count since 2021</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SECTION 3 — STUDENT REPORTS
───────────────────────────────────── */

function StudentSection() {
  const maxWeak = Math.max(...skillGaps.map((s) => s.weak));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard title="Avg Readiness Score" value="74/100" change="+6 pts this month" icon={<Award className="w-5 h-5" />} accent="text-violet-600" iconBg="bg-violet-50 border border-violet-100" changeBg="bg-violet-50 text-violet-600" hoverLine="via-violet-300" />
        <KpiCard title="Students Assessed" value="1,180" change="94.5% participation" icon={<Users className="w-5 h-5" />} accent="text-blue-600" iconBg="bg-blue-50 border border-blue-100" changeBg="bg-blue-50 text-blue-600" hoverLine="via-blue-300" />
        <KpiCard title="Skill Gap Alerts" value="6" change="Skills below threshold" icon={<AlertTriangle className="w-5 h-5" />} accent="text-yellow-600" iconBg="bg-yellow-50 border border-yellow-100" changeBg="bg-yellow-50 text-yellow-700" hoverLine="via-yellow-300" />
        <KpiCard title="At-Risk Students" value="204" change="Readiness score < 50" icon={<Zap className="w-5 h-5" />} accent="text-rose-600" iconBg="bg-rose-50 border border-rose-100" changeBg="bg-rose-50 text-rose-600" hoverLine="via-rose-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card>
            <SecHead icon={<ClipboardCheck className="w-4 h-4 text-violet-600" />} title="Assessment Performance Report" iconBg="bg-violet-50 border-violet-100" />
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <TableHead cols={["Assessment", "Avg Score", "Pass Rate", "Attempts", "Status"]} />
                <tbody>
                  {assessments.map((row) => (
                    <tr key={row.name} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
                      <td className="py-3 px-4 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.avg}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-7 shrink-0">{row.avg}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge label={`${row.pass}%`} variant={row.pass >= 70 ? "success" : row.pass >= 50 ? "warning" : "danger"} />
                      </td>
                      <td className="py-3 px-4 text-gray-500">{row.attempts.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge label={row.avg >= 65 ? "Good" : row.avg >= 50 ? "Fair" : "Needs Work"} variant={row.avg >= 65 ? "success" : row.avg >= 50 ? "warning" : "danger"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <SecHead icon={<Zap className="w-4 h-4 text-violet-600" />} title="Skill Gap Analysis" sub="Students below threshold" iconBg="bg-violet-50 border-violet-100" />
          <div className="space-y-4">
            {skillGaps.map((skill) => (
              <div key={skill.skill}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-gray-700 font-medium">{skill.skill}</span>
                  <span className="text-xs font-bold text-rose-500">{skill.weak} weak</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(skill.weak / maxWeak) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs text-rose-700 font-medium">⚡ DSA & Cloud are top gaps — targeted workshops recommended</p>
          </div>
        </Card>
      </div>

      {/* Student Readiness + AI Prediction */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <SecHead icon={<Users className="w-4 h-4 text-violet-600" />} title="Student Readiness Report" iconBg="bg-violet-50 border-violet-100" />
            <button className="flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition mb-5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <table className="w-full text-sm">
            <TableHead cols={["Student", "Branch", "Year", "Readiness", "Trend"]} />
            <tbody>
              {readinessTop.map((s) => (
                <tr key={s.name} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {s.name[0]}
                      </div>
                      <span className="font-medium text-gray-900 text-xs">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">{s.branch}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{s.year}</td>
                  <td className="py-3 px-4 w-36">
                    <Bar value={s.score} color={s.score >= 80 ? "bg-emerald-500" : s.score >= 60 ? "bg-yellow-500" : "bg-rose-400"} />
                  </td>
                  <td className="py-3 px-4">
                    {s.trend === "up" && <ArrowUp className="w-4 h-4 text-emerald-500" />}
                    {s.trend === "down" && <ArrowUp className="w-4 h-4 text-rose-500 rotate-180" />}
                    {s.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400 rounded" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Placement Prediction */}
        <Card>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">AI Placement Prediction</h2>
              <p className="text-xs text-gray-400">Powered by PrepAI Intelligence</p>
            </div>
            <span className="ml-auto px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold rounded-full shadow-sm">
              AI POWERED
            </span>
          </div>
          <div className="space-y-3">
            {aiPredictions.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/30 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${s.prob >= 80 ? "bg-emerald-500" : s.prob >= 60 ? "bg-yellow-500" : "bg-rose-400"}`}
                      style={{ width: `${s.prob}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${s.prob >= 80 ? "text-emerald-600" : s.prob >= 60 ? "text-yellow-600" : "text-rose-500"}`}>
                    {s.prob}%
                  </p>
                  <Badge label={s.tier} variant={s.tier === "Tier 1" ? "success" : s.tier === "Tier 2" ? "warning" : "danger"} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
            <p className="text-xs text-yellow-800 font-medium">✨ Scores based on quizzes, AI interviews & resume analysis</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SECTION 4 — DRIVE REPORTS
───────────────────────────────────── */

function DriveSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard title="Total Drives" value="14" change="+3 vs last batch" icon={<Target className="w-5 h-5" />} accent="text-emerald-600" iconBg="bg-emerald-50 border border-emerald-100" changeBg="bg-emerald-50 text-emerald-700" hoverLine="via-emerald-300" />
        <KpiCard title="Total Applications" value="1,248" change="Across all drives" icon={<FileText className="w-5 h-5" />} accent="text-blue-600" iconBg="bg-blue-50 border border-blue-100" changeBg="bg-blue-50 text-blue-600" hoverLine="via-blue-300" />
        <KpiCard title="Overall Offer Rate" value="25%" change="Offered / Applied" icon={<CheckCircle className="w-5 h-5" />} accent="text-yellow-600" iconBg="bg-yellow-50 border border-yellow-100" changeBg="bg-yellow-50 text-yellow-700" hoverLine="via-yellow-300" />
        <KpiCard title="Avg Conversion" value="54%" change="Offers / Interviews" icon={<TrendingUp className="w-5 h-5" />} accent="text-violet-600" iconBg="bg-violet-50 border border-violet-100" changeBg="bg-violet-50 text-violet-600" hoverLine="via-violet-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Drive Funnel */}
        <Card>
          <SecHead icon={<Target className="w-4 h-4 text-emerald-600" />} title="Drive Pipeline Funnel" sub="All drives combined" iconBg="bg-emerald-50 border-emerald-100" />
          <div className="space-y-3">
            {driveFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{stage.pct}%</span>
                    <span className={`text-sm font-bold ${stage.textColor}`}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded-xl overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-xl transition-all duration-700 flex items-center px-3`}
                    style={{ width: stage.barW }}
                  >
                    <span className="text-white text-xs font-semibold">{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                {i < driveFunnel.length - 1 && (
                  <p className="text-right text-xs text-gray-300 mt-0.5 pr-1">
                    ▼ {Math.round((driveFunnel[i + 1].count / stage.count) * 100)}% progressed
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <SecHead icon={<CheckCircle className="w-4 h-4 text-emerald-600" />} title="Offer Conversion Rate" sub="By company" iconBg="bg-emerald-50 border-emerald-100" />
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <TableHead cols={["Company", "Interviews", "Offers", "Conversion"]} />
              <tbody>
                {conversionRates.map((row) => (
                  <tr key={row.company} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.company}</td>
                    <td className="py-3 px-4 text-gray-500">{row.interviews}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{row.offers}</td>
                    <td className="py-3 px-4 w-40">
                      <Bar value={row.rate} color={row.rate >= 60 ? "bg-emerald-500" : row.rate >= 40 ? "bg-yellow-500" : "bg-rose-400"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SECTION 5 — MANAGEMENT REPORTS
───────────────────────────────────── */

function ManagementSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard title="Top Branch (CTC)" value="CSE" change="Avg 9.2 LPA" icon={<Award className="w-5 h-5" />} accent="text-orange-600" iconBg="bg-orange-50 border border-orange-100" changeBg="bg-orange-50 text-orange-600" hoverLine="via-orange-300" />
        <KpiCard title="Best Placement Year" value="2025" change="83% placement rate" icon={<Star className="w-5 h-5" />} accent="text-yellow-600" iconBg="bg-yellow-50 border border-yellow-100" changeBg="bg-yellow-50 text-yellow-700" hoverLine="via-yellow-300" />
        <KpiCard title="College Avg CTC" value="6.4 LPA" change="+0.8L vs 2024" icon={<TrendingUp className="w-5 h-5" />} accent="text-emerald-600" iconBg="bg-emerald-50 border border-emerald-100" changeBg="bg-emerald-50 text-emerald-700" hoverLine="via-emerald-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Branch Comparison */}
        <Card>
          <SecHead icon={<BarChart3 className="w-4 h-4 text-orange-600" />} title="Branch Performance Comparison" iconBg="bg-orange-50 border-orange-100" />
          <div className="space-y-4">
            {branchData.map((b) => (
              <div key={b.branch} className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 w-24 shrink-0">{b.branch}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{b.rate}% placed</span>
                    <span>{b.avgCTC} LPA avg</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${b.color} rounded-full transition-all duration-700`}
                      style={{ width: `${b.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Yearly Placement Trend */}
        <Card>
          <SecHead icon={<TrendingUp className="w-4 h-4 text-orange-600" />} title="Yearly Placement Trend" sub="Placement % over 5 years" iconBg="bg-orange-50 border-orange-100" />
          <div className="space-y-3">
            {yearlyPlacementTrend.map((d) => (
              <div key={d.year}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold">{d.year}</span>
                  <span className="font-bold text-gray-700">{d.rate}%</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${d.rate}%` }}
                  >
                    <span className="text-white text-[10px] font-bold">{d.rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs text-orange-700 font-medium">📈 Consistent improvement — +21% placement rate since 2021</p>
          </div>
        </Card>
      </div>

      {/* Department CTC Comparison */}
      <Card>
        <SecHead icon={<BarChart3 className="w-4 h-4 text-orange-600" />} title="Department CTC Comparison" sub="Average package by branch" iconBg="bg-orange-50 border-orange-100" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {branchData.map((b) => {
            const maxCTC = Math.max(...branchData.map((x) => x.avgCTC));
            const heightPct = Math.round((b.avgCTC / maxCTC) * 100);
            return (
              <div key={b.branch} className="flex flex-col items-center gap-2">
                <div className="w-full h-24 bg-gray-100 rounded-xl overflow-hidden flex items-end">
                  <div
                    className={`w-full ${b.color} rounded-xl transition-all duration-700 flex items-start justify-center pt-1`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <span className="text-white text-[10px] font-bold">{b.avgCTC}L</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600">{b.branch}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────
   SECTION 6 — COMPLIANCE & AUDIT
───────────────────────────────────── */

function ComplianceSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard title="Offers Accepted" value="3" change="of 6 tracked" icon={<CheckCircle className="w-5 h-5" />} accent="text-emerald-600" iconBg="bg-emerald-50 border border-emerald-100" changeBg="bg-emerald-50 text-emerald-700" hoverLine="via-emerald-300" />
        <KpiCard title="Offers Declined" value="1" change="Declined by student" icon={<AlertTriangle className="w-5 h-5" />} accent="text-rose-600" iconBg="bg-rose-50 border border-rose-100" changeBg="bg-rose-50 text-rose-600" hoverLine="via-rose-300" />
        <KpiCard title="Pending Review" value="2" change="Awaiting acceptance" icon={<Clock className="w-5 h-5" />} accent="text-yellow-600" iconBg="bg-yellow-50 border border-yellow-100" changeBg="bg-yellow-50 text-yellow-700" hoverLine="via-yellow-300" />
        <KpiCard title="Policy Violations" value="3" change="Multiple offer cases" icon={<Shield className="w-5 h-5" />} accent="text-rose-600" iconBg="bg-rose-50 border border-rose-100" changeBg="bg-rose-50 text-rose-600" hoverLine="via-rose-300" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card>
            <SecHead icon={<FileText className="w-4 h-4 text-rose-600" />} title="Offer Acceptance Report" iconBg="bg-rose-50 border-rose-100" />
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <TableHead cols={["Student", "Company", "CTC", "Date", "Status"]} />
                <tbody>
                  {offerAcceptance.map((row) => (
                    <tr key={row.student} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {row.student[0]}
                          </div>
                          <span className="font-medium text-gray-900 text-xs">{row.student}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700 text-xs">{row.company}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 text-xs">{row.ctc}</td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{row.date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          label={row.status}
                          variant={row.status === "Accepted" ? "success" : row.status === "Declined" ? "danger" : "warning"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <SecHead icon={<AlertTriangle className="w-4 h-4 text-rose-600" />} title="Multiple Offer Violations" sub="Policy breach alerts" iconBg="bg-rose-50 border-rose-100" />
          <div className="space-y-3">
            {violations.map((v) => (
              <div key={v.student} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{v.student}</span>
                  <Badge label={v.status} variant={v.status === "Resolved" ? "success" : "danger"} />
                </div>
                <p className="text-xs text-gray-500">{v.offers} offers accepted</p>
                <p className="text-xs text-rose-600 mt-1 font-medium">{v.companies}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs text-rose-700 font-medium">⚠️ 2 cases under active review — resolution pending</p>
          </div>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <SecHead icon={<Activity className="w-4 h-4 text-rose-600" />} title="Audit Log" sub="All system actions, sorted by recency" iconBg="bg-rose-50 border-rose-100" />
        <ul className="space-y-0">
          {auditLogs.map((log, i) => (
            <li key={`${log.action}-${i}`} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl ${log.bg} flex items-center justify-center text-base border`}>
                  {log.icon}
                </div>
                {i !== auditLogs.length - 1 && <div className="w-px h-5 bg-gray-100 mt-1" />}
              </div>
              <div className="pb-5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 font-medium leading-snug">{log.action}</p>
                  <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.user} ·{" "}
                  <span className={`font-semibold ${log.text}`}>{log.role}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────
   TAB CONFIG
───────────────────────────────────── */

const TABS = [
  { id: "placement", label: "Placement", icon: TrendingUp, active: "bg-yellow-400 text-yellow-900" },
  { id: "company", label: "Company", icon: Building2, active: "bg-blue-500 text-white" },
  { id: "student", label: "Student", icon: GraduationCap, active: "bg-violet-500 text-white" },
  { id: "drive", label: "Drive", icon: Target, active: "bg-emerald-500 text-white" },
  { id: "management", label: "Management", icon: BarChart3, active: "bg-orange-500 text-white" },
  { id: "compliance", label: "Compliance", icon: Shield, active: "bg-rose-500 text-white" },
];

/* ─────────────────────────────────────
   PAGE
───────────────────────────────────── */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("placement");

  const sections: Record<string, React.ReactNode> = {
    placement: <PlacementSection />,
    company: <CompanySection />,
    student: <StudentSection />,
    drive: <DriveSection />,
    management: <ManagementSection />,
    compliance: <ComplianceSection />,
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Analytics & Reporting
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Placement Reports
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Strategic insights for data-driven placement decisions
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-yellow-900 font-semibold text-sm rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-sm self-start md:self-auto">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive ? `${tab.active} shadow-sm` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE SECTION ── */}
        <div className="animate-slide-in">
          {sections[activeTab]}
        </div>

      </div>
    </div>
  );
}
