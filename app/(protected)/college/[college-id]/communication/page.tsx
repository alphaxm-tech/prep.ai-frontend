"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  ChevronDown,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Bold,
  Italic,
  List,
  AlignLeft,
  Link2,
  History,
  Filter,
  Users,
  Zap,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
type CommTab = "Email" | "SMS";
type AudienceType =
  | "all_students"
  | "eligible_students"
  | "specific_branch"
  | "specific_year"
  | "specific_drive";

type CommStatus = "Sent" | "Scheduled" | "Failed";

interface CommHistory {
  id: string;
  type: "Email" | "SMS";
  target: string;
  sentAt: string;
  status: CommStatus;
  openRate?: string;
  subject?: string;
  recipients: number;
}

/* ─────────────────────────── Mock Data ─────────────────────── */
const BRANCHES = ["CSE", "IT", "ECE", "Mechanical", "Civil", "MBA"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const DRIVES = [
  "TCS Campus Drive 2026",
  "Infosys Hiring",
  "Google Summer Internship",
  "Wipro ProGrad",
  "Deloitte Analyst Drive",
];

const historyData: CommHistory[] = [
  {
    id: "c1",
    type: "Email",
    target: "All Eligible Students",
    sentAt: "04 Mar 2026, 10:30 AM",
    status: "Sent",
    openRate: "68%",
    subject: "TCS Campus Drive — Application Deadline Reminder",
    recipients: 948,
  },
  {
    id: "c2",
    type: "SMS",
    target: "CSE + IT — 3rd Year",
    sentAt: "02 Mar 2026, 02:15 PM",
    status: "Sent",
    recipients: 312,
  },
  {
    id: "c3",
    type: "Email",
    target: "All Students",
    sentAt: "08 Mar 2026, 09:00 AM",
    status: "Scheduled",
    subject: "Google SWE Intern — Registration Open",
    recipients: 1560,
  },
  {
    id: "c4",
    type: "SMS",
    target: "Mechanical — Final Year",
    sentAt: "28 Feb 2026, 11:45 AM",
    status: "Failed",
    recipients: 80,
  },
  {
    id: "c5",
    type: "Email",
    target: "Amazon Drive Applicants",
    sentAt: "01 Mar 2026, 04:00 PM",
    status: "Sent",
    openRate: "54%",
    subject: "Amazon SDE-1 — Shortlist Released",
    recipients: 120,
  },
];

/* ─────────────────────────── Helpers ──────────────────────── */
const statusStyles: Record<CommStatus, string> = {
  Sent: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
  Failed: "bg-red-50 text-red-600 border border-red-200",
};

const audienceLabels: Record<AudienceType, string> = {
  all_students: "All Students",
  eligible_students: "Eligible Students",
  specific_branch: "Specific Branch",
  specific_year: "Specific Year",
  specific_drive: "Specific Placement Drive",
};

/* ─────────────────────── Sub-components ────────────────────── */

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none hover:border-yellow-400 transition text-left"
      >
        <span className="text-gray-500 truncate">
          {selected.length === 0
            ? `Select ${label.toLowerCase()}...`
            : selected.length === 1
            ? selected[0]
            : `${selected.length} selected`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-yellow-50 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${
                  selected.includes(opt)
                    ? "bg-yellow-400 border-yellow-400"
                    : "border-gray-300"
                }`}
              >
                {selected.includes(opt) && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-gray-700">{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium border border-yellow-200"
            >
              {s}
              <button
                onClick={() => toggle(s)}
                className="ml-0.5 hover:text-yellow-900 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfirmSendModal({
  summary,
  onConfirm,
  onCancel,
  scheduled,
  scheduledTime,
}: {
  summary: string;
  onConfirm: () => void;
  onCancel: () => void;
  scheduled: boolean;
  scheduledTime: string;
}) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
      setTimeout(() => {
        onConfirm();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400" />
        <div className="p-6">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {scheduled ? "Message Scheduled!" : "Message Sent!"}
              </h3>
              <p className="text-sm text-gray-500">
                {scheduled ? `Scheduled for ${scheduledTime}` : "Your message has been dispatched."}
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mb-4">
                <Send className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {scheduled ? "Confirm Schedule" : "Confirm Send"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {scheduled
                  ? `This message will be sent on ${scheduledTime}.`
                  : "This will immediately dispatch the message to all selected recipients."}
              </p>

              {/* Summary box */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5 text-sm text-gray-700 leading-relaxed">
                {summary}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={sending}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-yellow-900 text-sm font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-yellow-900/30 border-t-yellow-900 rounded-full animate-spin" />
                      {scheduled ? "Scheduling..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {scheduled ? "Schedule" : "Send Now"}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function MassCommunicationPage() {
  /* Filters */
  const [audience, setAudience] = useState<AudienceType>("all_students");
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedDrives, setSelectedDrives] = useState<string[]>([]);

  /* Composer */
  const [activeTab, setActiveTab] = useState<CommTab>("Email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [smsText, setSmsText] = useState("");
  const SMS_LIMIT = 160;

  /* Scheduling */
  const [sendNow, setSendNow] = useState(true);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");

  /* Preview & Confirm */
  const [preview, setPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* History search */
  const [histSearch, setHistSearch] = useState("");

  const filteredHistory = historyData.filter(
    (c) =>
      c.target.toLowerCase().includes(histSearch.toLowerCase()) ||
      (c.subject ?? "").toLowerCase().includes(histSearch.toLowerCase())
  );

  /* Audience summary */
  const audienceSummary = () => {
    const base = audienceLabels[audience];
    const parts: string[] = [];
    if (selectedBranches.length > 0)
      parts.push(`Branches: ${selectedBranches.join(", ")}`);
    if (selectedYears.length > 0) parts.push(`Year: ${selectedYears.join(", ")}`);
    if (selectedDrives.length > 0) parts.push(`Drives: ${selectedDrives.join(", ")}`);
    return parts.length > 0 ? `${base} — ${parts.join(" | ")}` : base;
  };

  const confirmSummary = () => {
    const lines = [
      `Type: ${activeTab}`,
      `To: ${audienceSummary()}`,
      activeTab === "Email" ? `Subject: ${subject || "(no subject)"}` : null,
      activeTab === "Email"
        ? `Body: ${body.slice(0, 100)}${body.length > 100 ? "…" : ""}`
        : `SMS: ${smsText.slice(0, 80)}${smsText.length > 80 ? "…" : ""}`,
      sendNow ? "Delivery: Immediately" : `Delivery: ${schedDate} at ${schedTime}`,
    ]
      .filter(Boolean)
      .join("\n");
    return lines;
  };

  const handleSent = () => {
    setShowConfirm(false);
    setSubject("");
    setBody("");
    setSmsText("");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Outreach & Announcements
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Mass Communication
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Send targeted emails and SMS to students for placement announcements
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-blue-800">3</span>
              <span className="text-blue-600">Sent Today</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-xl text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-yellow-800">1</span>
              <span className="text-yellow-600">Scheduled</span>
            </div>
          </div>
        </div>

        {/* ── FILTER + COMPOSER GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.6fr] gap-6">

          {/* LEFT: Filters */}
          <div className="space-y-5">
            {/* Filter Card */}
            <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <Filter className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Target Audience</h2>
                  <p className="text-xs text-gray-400">Define who receives this message</p>
                </div>
              </div>

              {/* Primary Audience */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Audience Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => setAudienceOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm hover:border-yellow-400 transition text-left"
                  >
                    <span className="text-gray-800 font-medium">
                      {audienceLabels[audience]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${audienceOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {audienceOpen && (
                    <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {(Object.entries(audienceLabels) as [AudienceType, string][]).map(
                        ([key, label]) => (
                          <button
                            key={key}
                            onClick={() => {
                              setAudience(key);
                              setAudienceOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                              audience === key
                                ? "bg-yellow-50 text-yellow-800"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {audience === key && (
                              <CheckCircle2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            )}
                            {audience !== key && (
                              <span className="w-4 h-4 flex-shrink-0" />
                            )}
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Conditional filters */}
              {(audience === "specific_branch" || audience === "eligible_students" || audience === "specific_drive") && (
                <div className="mb-4">
                  <MultiSelect
                    label="Branch"
                    options={BRANCHES}
                    selected={selectedBranches}
                    onChange={setSelectedBranches}
                  />
                </div>
              )}

              {(audience === "specific_year" || audience === "specific_branch") && (
                <div className="mb-4">
                  <MultiSelect
                    label="Year"
                    options={YEARS}
                    selected={selectedYears}
                    onChange={setSelectedYears}
                  />
                </div>
              )}

              {audience === "specific_drive" && (
                <div className="mb-4">
                  <MultiSelect
                    label="Placement Drive"
                    options={DRIVES}
                    selected={selectedDrives}
                    onChange={setSelectedDrives}
                  />
                </div>
              )}

              {/* Audience Summary */}
              <div className="bg-yellow-50/80 border border-yellow-100 rounded-2xl p-4">
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-800 mb-0.5">
                      Sending To
                    </p>
                    <p className="text-xs text-yellow-700 leading-relaxed">
                      {audienceSummary()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Card */}
            <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Delivery Schedule</h2>
                  <p className="text-xs text-gray-400">Choose when to send</p>
                </div>
              </div>

              {/* Send Now Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Send Now</p>
                  <p className="text-xs text-gray-400 mt-0.5">Dispatch immediately on submit</p>
                </div>
                <button
                  onClick={() => setSendNow((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    sendNow ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      sendNow ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Date/Time Picker */}
              {!sendNow && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Schedule Date
                    </label>
                    <input
                      type="date"
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Schedule Time
                    </label>
                    <input
                      type="time"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
                    />
                  </div>
                  {schedDate && schedTime && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      Will send on {schedDate} at {schedTime}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Composer */}
          <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl p-6 shadow-sm flex flex-col">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {(["Email", "SMS"] as CommTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "Email" ? (
                      <Mail
                        className={`w-4 h-4 ${activeTab === tab ? "text-yellow-600" : ""}`}
                      />
                    ) : (
                      <MessageSquare
                        className={`w-4 h-4 ${activeTab === tab ? "text-yellow-600" : ""}`}
                      />
                    )}
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPreview((v) => !v)}
                className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                  preview
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {preview ? "Edit" : "Preview"}
              </button>
            </div>

            {/* Email Composer */}
            {activeTab === "Email" && (
              <div className="flex-1 flex flex-col gap-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Subject Line <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. TCS Campus Drive — Application Now Open"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
                  />
                </div>

                {/* Toolbar */}
                {!preview && (
                  <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-100 rounded-xl">
                    {[
                      { icon: Bold, label: "Bold" },
                      { icon: Italic, label: "Italic" },
                      { icon: List, label: "List" },
                      { icon: AlignLeft, label: "Align" },
                      { icon: Link2, label: "Link" },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        title={label}
                        className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-yellow-700 transition"
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                    <div className="ml-auto text-xs text-gray-400 pr-1">
                      Rich Text Editor
                    </div>
                  </div>
                )}

                {/* Body */}
                {preview ? (
                  <div className="flex-1 min-h-[280px] bg-white border border-gray-100 rounded-2xl p-5 overflow-y-auto">
                    <div className="mb-3 pb-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Subject</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {subject || "(No subject)"}
                      </p>
                    </div>
                    <div className="mb-2 text-xs text-gray-400">
                      To: {audienceSummary()}
                    </div>
                    <div
                      className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
                      style={{ minHeight: 120 }}
                    >
                      {body || (
                        <span className="text-gray-300 italic">No body content yet.</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email body here. You can use HTML tags or plain text..."
                    className="flex-1 min-h-[280px] w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition resize-none"
                  />
                )}
              </div>
            )}

            {/* SMS Composer */}
            {activeTab === "SMS" && (
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-600">
                      SMS Message <span className="text-red-400">*</span>
                    </label>
                    <span
                      className={`text-xs font-semibold ${
                        smsText.length > SMS_LIMIT
                          ? "text-red-500"
                          : smsText.length > SMS_LIMIT * 0.85
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    >
                      {smsText.length} / {SMS_LIMIT}
                    </span>
                  </div>
                  <textarea
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value.slice(0, SMS_LIMIT))}
                    placeholder="Keep it short and clear. No links unless necessary. E.g.: 'Dear [Name], TCS Campus Drive registration is now open. Visit the portal to apply. — Placement Cell'"
                    rows={8}
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition resize-none"
                  />
                </div>

                {/* Character progress bar */}
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        smsText.length > SMS_LIMIT * 0.85
                          ? "bg-yellow-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${Math.min((smsText.length / SMS_LIMIT) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {SMS_LIMIT - smsText.length} characters remaining
                  </p>
                </div>

                {/* SMS Preview */}
                {preview && smsText && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-gray-500 mb-3">SMS Preview</p>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-xs mx-auto shadow-sm">
                      <p className="text-xs text-gray-400 mb-1">Placement Cell</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{smsText}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Send Button */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-yellow-900 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <Zap className="w-5 h-5" />
                {sendNow ? "Send Message Now" : "Schedule Message"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                You'll be asked to confirm before sending.
              </p>
            </div>
          </div>
        </div>

        {/* ── COMMUNICATION HISTORY TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                <History className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Communication History</h2>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                {historyData.length}
              </span>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={histSearch}
                onChange={(e) => setHistSearch(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Type", "Subject / Target", "Recipients", "Sent At", "Status", "Open Rate", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((comm) => (
                  <tr
                    key={comm.id}
                    className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Type */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          comm.type === "Email"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-violet-50 text-violet-700 border border-violet-200"
                        }`}
                      >
                        {comm.type === "Email" ? (
                          <Mail className="w-3 h-3" />
                        ) : (
                          <MessageSquare className="w-3 h-3" />
                        )}
                        {comm.type}
                      </span>
                    </td>

                    {/* Subject / Target */}
                    <td className="py-4 px-5 max-w-[220px]">
                      {comm.subject ? (
                        <>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {comm.subject}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{comm.target}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700 truncate">{comm.target}</p>
                      )}
                    </td>

                    {/* Recipients */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          {comm.recipients.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Sent At */}
                    <td className="py-4 px-5 text-xs text-gray-500">{comm.sentAt}</td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[comm.status]}`}
                      >
                        {comm.status}
                      </span>
                    </td>

                    {/* Open Rate */}
                    <td className="py-4 px-5">
                      {comm.openRate ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: comm.openRate }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">
                            {comm.openRate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-100 transition">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                      No communications match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing {filteredHistory.length} of {historyData.length} communications
            </p>
          </div>
        </div>

      </div>

      {/* ── CONFIRM SEND MODAL ── */}
      {showConfirm && (
        <ConfirmSendModal
          summary={confirmSummary()}
          onConfirm={handleSent}
          onCancel={() => setShowConfirm(false)}
          scheduled={!sendNow}
          scheduledTime={`${schedDate} at ${schedTime}`}
        />
      )}
    </div>
  );
}
