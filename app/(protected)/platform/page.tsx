"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/app/provider";

/* ─── Static dummy data ──────────────────────────────────────────────── */

const COLLEGES = [
  { id: 1, name: "IIT Bombay", code: "IITB", city: "Mumbai", students: 1200, verified: 94, status: "Active", tier: "Tier 1" },
  { id: 2, name: "NIT Surat", code: "NITS", city: "Surat", students: 850, verified: 87, status: "Active", tier: "Tier 2" },
  { id: 3, name: "SVNIT", code: "SVNIT", city: "Surat", students: 620, verified: 72, status: "Pending", tier: "Tier 2" },
  { id: 4, name: "MIT Pune", code: "MITP", city: "Pune", students: 430, verified: 65, status: "Active", tier: "Tier 3" },
  { id: 5, name: "GEC Rajkot", code: "GECR", city: "Rajkot", students: 310, verified: 45, status: "Inactive", tier: "Tier 3" },
];

const ACTIVITY = [
  { icon: "🏫", action: "New college onboarded", detail: "RAIT Mumbai added", time: "2 hrs ago" },
  { icon: "👤", action: "Admin invited", detail: "admin@nits.ac.in", time: "4 hrs ago" },
  { icon: "🤖", action: "AI model updated", detail: "Interview scoring v2.1", time: "1 day ago" },
  { icon: "👥", action: "Bulk import completed", detail: "320 students · SVNIT", time: "1 day ago" },
  { icon: "💼", action: "Placement drive closed", detail: "TCS · IIT Bombay", time: "2 days ago" },
  { icon: "📊", action: "Report generated", detail: "Q1 Platform Analytics", time: "3 days ago" },
];

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function PlatformDashboard() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const firstName =
    auth?.user?.full_name?.split(/[, ]+/)?.filter(Boolean)[0] ?? "Super Admin";

  const kpis: { label: string; value: string; delta: string; color: KpiColor }[] = [
    { label: "Total Colleges", value: "128", delta: "+4 this month", color: "amber" },
    { label: "Active Students", value: "18,420", delta: "+1.2k this month", color: "blue" },
    { label: "Platform Admins", value: "312", delta: "+12 this month", color: "purple" },
    { label: "AI Interviews", value: "45,890", delta: "+3.2k this week", color: "green" },
    { label: "Placements", value: "9,870", delta: "+890 this quarter", color: "rose" },
    { label: "Resume Scans", value: "32,100", delta: "+2.1k this week", color: "teal" },
  ];

  const actions = [
    { title: "College Management", desc: "Onboard and configure institutions", icon: "🏫", bar: "from-amber-400 to-amber-500", href: "/admin" },
    { title: "User & Role Control", desc: "Manage admins and placement officers", icon: "👥", bar: "from-blue-500 to-sky-500", href: "/platform/users" },
    { title: "Global Analytics", desc: "Platform-wide performance reports", icon: "📊", bar: "from-purple-500 to-violet-500", href: "/platform/analytics" },
    { title: "AI Configuration", desc: "Tune models, scoring & automation", icon: "🤖", bar: "from-green-500 to-emerald-500", href: "/platform/ai-config" },
    { title: "Platform Settings", desc: "System config, integrations, billing", icon: "⚙️", bar: "from-slate-500 to-gray-600", href: "/platform/settings" },
    { title: "Audit & Compliance", desc: "Review access logs and history", icon: "🔒", bar: "from-rose-500 to-pink-500", href: "/platform/audit" },
  ];

  const intelligence = [
    { label: "Offer Ratio", value: "78%", sub: "across all colleges" },
    { label: "Resume Quality Score", value: "8.4/10", sub: "platform average" },
    { label: "AI Shortlist Accuracy", value: "92%", sub: "vs manual review" },
    { label: "Interview Completion", value: "84%", sub: "of scheduled sessions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">

        {/* ── Welcome ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              ⚡ Super Admin · Platform Control
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Admin Panel
            </button>
            <button
              onClick={() => router.push("/admin/add-college/college")}
              className="rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:from-amber-600 hover:to-amber-700"
            >
              + Onboard College
            </button>
          </div>
        </div>

        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {kpis.map((k, i) => (
            <KpiCard key={i} {...k} />
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {actions.map((a, i) => (
              <ActionCard key={i} {...a} onClick={() => router.push(a.href)} />
            ))}
          </div>
        </div>

        {/* ── Colleges + Activity ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h3 className="font-semibold text-gray-900">College Overview</h3>
              <button
                onClick={() => router.push("/admin")}
                className="text-xs text-amber-600 hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {COLLEGES.map((col) => (
                <CollegeRow
                  key={col.id}
                  college={col}
                  onClick={() => router.push("/admin/college-details")}
                />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-xs text-amber-600 hover:underline">
                View log →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {ACTIVITY.map((item, i) => (
                <ActivityRow key={i} item={item} />
              ))}
            </div>
          </div>

        </div>

        {/* ── Platform Intelligence ── */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Platform Intelligence</h2>
            <span className="text-xs text-gray-500">Updated today · All colleges</span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {intelligence.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-2xl font-extrabold text-amber-600">{m.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{m.label}</div>
                <div className="mt-0.5 text-xs text-gray-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

type KpiColor = "amber" | "blue" | "purple" | "green" | "rose" | "teal";

function KpiCard({ label, value, delta, color }: { label: string; value: string; delta: string; color: KpiColor }) {
  const bars: Record<KpiColor, string> = {
    amber: "from-amber-400 to-amber-500",
    blue: "from-blue-500 to-sky-500",
    purple: "from-purple-500 to-violet-500",
    green: "from-green-500 to-emerald-500",
    rose: "from-rose-500 to-pink-500",
    teal: "from-teal-500 to-cyan-500",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${bars[color]}`} />
      <div className="truncate text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="mt-1 text-xs font-medium text-green-600">{delta}</div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  icon,
  bar,
  onClick,
}: {
  title: string;
  desc: string;
  icon: string;
  bar: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
    >
      <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${bar}`} />
      <div className="mb-3 text-3xl">{icon}</div>
      <div className="text-sm font-semibold leading-tight text-gray-900">{title}</div>
      <div className="mt-1 text-xs leading-snug text-gray-500">{desc}</div>
    </button>
  );
}

function CollegeRow({ college, onClick }: { college: (typeof COLLEGES)[number]; onClick: () => void }) {
  const badge =
    college.status === "Active"
      ? "bg-green-100 text-green-700"
      : college.status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-gray-100 text-gray-500";

  return (
    <div
      className="flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700">
        {college.code.slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900">{college.name}</div>
        <div className="text-xs text-gray-500">{college.city} · {college.students.toLocaleString()} students</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
          {college.status}
        </span>
        <span className="text-xs text-gray-400">{college.tier}</span>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: (typeof ACTIVITY)[number] }) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <span className="mt-0.5 text-xl">{item.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">{item.action}</div>
        <div className="truncate text-xs text-gray-500">{item.detail}</div>
      </div>
      <div className="whitespace-nowrap text-xs text-gray-400">{item.time}</div>
    </div>
  );
}
