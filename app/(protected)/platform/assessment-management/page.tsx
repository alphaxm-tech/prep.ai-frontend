"use client";

import { useMemo, useRef, useState } from "react";
import {
  PlusIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentIcon,
  XMarkIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components/toast/ToastContext";
import { ToastStates } from "@/enums/enums";

/* ─── Types ──────────────────────────────────────────────────────────── */

type AssessmentStatus = "Published" | "Draft" | "Archived";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type Assessment = {
  id: number;
  title: string;
  category: string;
  questions: number;
  duration: number;
  difficulty: Difficulty;
  status: AssessmentStatus;
  updated: string;
  bar: string;
};

type FileStatus = "Processing" | "Completed" | "Failed";
type FileKind = "xlsx" | "docx" | "pdf";

type UploadedFile = {
  id: number;
  name: string;
  kind: FileKind;
  size: string;
  status: FileStatus;
  extracted?: number;
  error?: string;
  time: string;
  progress?: number;
};

type QuestionRowData = {
  id: number;
  text: string;
  category: string;
  difficulty: Difficulty;
  type: "MCQ" | "Subjective" | "Coding";
  source: string;
};

/* ─── Dummy data ─────────────────────────────────────────────────────── */

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: "Frontend Developer Screening",
    category: "Software Engineering",
    questions: 45,
    duration: 60,
    difficulty: "Intermediate",
    status: "Published",
    updated: "2 days ago",
    bar: "from-amber-400 to-amber-500",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    questions: 60,
    duration: 90,
    difficulty: "Advanced",
    status: "Published",
    updated: "5 days ago",
    bar: "from-blue-500 to-sky-500",
  },
  {
    id: 3,
    title: "Aptitude & Reasoning",
    category: "General Aptitude",
    questions: 30,
    duration: 45,
    difficulty: "Beginner",
    status: "Draft",
    updated: "1 day ago",
    bar: "from-purple-500 to-violet-500",
  },
  {
    id: 4,
    title: "Java Backend Assessment",
    category: "Software Engineering",
    questions: 50,
    duration: 75,
    difficulty: "Advanced",
    status: "Published",
    updated: "1 week ago",
    bar: "from-green-500 to-emerald-500",
  },
  {
    id: 5,
    title: "Communication Skills",
    category: "Soft Skills",
    questions: 20,
    duration: 30,
    difficulty: "Beginner",
    status: "Archived",
    updated: "3 weeks ago",
    bar: "from-rose-500 to-pink-500",
  },
  {
    id: 6,
    title: "SQL & Database Fundamentals",
    category: "Computer Science",
    questions: 35,
    duration: 50,
    difficulty: "Intermediate",
    status: "Draft",
    updated: "6 hrs ago",
    bar: "from-teal-500 to-cyan-500",
  },
];

const INITIAL_UPLOADS: UploadedFile[] = [
  {
    id: 1,
    name: "DSA_Question_Set_Q3.xlsx",
    kind: "xlsx",
    size: "2.4 MB",
    status: "Completed",
    extracted: 120,
    time: "10 min ago",
  },
  {
    id: 2,
    name: "Aptitude_Bank_v2.docx",
    kind: "docx",
    size: "1.1 MB",
    status: "Processing",
    time: "just now",
    progress: 64,
  },
  {
    id: 3,
    name: "SystemDesign_Questions.pdf",
    kind: "pdf",
    size: "3.8 MB",
    status: "Completed",
    extracted: 48,
    time: "1 hr ago",
  },
  {
    id: 4,
    name: "HR_Interview_Qs.xlsx",
    kind: "xlsx",
    size: "640 KB",
    status: "Failed",
    error: "Invalid template format",
    time: "2 hrs ago",
  },
];

const QUESTION_BANK: QuestionRowData[] = [
  {
    id: 1,
    text: "Explain the difference between == and .equals() in Java.",
    category: "Java",
    difficulty: "Intermediate",
    type: "Subjective",
    source: "Java Backend Assessment",
  },
  {
    id: 2,
    text: "What is the average-case time complexity of quicksort?",
    category: "DSA",
    difficulty: "Intermediate",
    type: "MCQ",
    source: "DSA_Question_Set_Q3.xlsx",
  },
  {
    id: 3,
    text: "Write a function to reverse a linked list in-place.",
    category: "DSA",
    difficulty: "Advanced",
    type: "Coding",
    source: "DSA_Question_Set_Q3.xlsx",
  },
  {
    id: 4,
    text: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    category: "Aptitude",
    difficulty: "Beginner",
    type: "MCQ",
    source: "Aptitude_Bank_v2.docx",
  },
  {
    id: 5,
    text: "Design a URL shortening service — outline the key components.",
    category: "System Design",
    difficulty: "Advanced",
    type: "Subjective",
    source: "SystemDesign_Questions.pdf",
  },
  {
    id: 6,
    text: "Which SQL clause is used to filter grouped results?",
    category: "SQL",
    difficulty: "Beginner",
    type: "MCQ",
    source: "SQL & Database Fundamentals",
  },
];

const CATEGORIES = [
  "Software Engineering",
  "Computer Science",
  "General Aptitude",
  "Soft Skills",
];

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AssessmentManagementPage() {
  const { showToast } = useToast();

  const [tab, setTab] = useState<"assessments" | "questions">("assessments");
  const [assessments, setAssessments] =
    useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [uploads, setUploads] = useState<UploadedFile[]>(INITIAL_UPLOADS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AssessmentStatus>(
    "All",
  );

  const [questionSearch, setQuestionSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assessments, search, statusFilter]);

  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter(
      (q) =>
        q.text.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.category.toLowerCase().includes(questionSearch.toLowerCase()),
    );
  }, [questionSearch]);

  const kpis = [
    {
      label: "Total Assessments",
      value: String(assessments.length),
      delta: "+3 this month",
      bar: "from-amber-400 to-amber-500",
    },
    {
      label: "Published",
      value: String(assessments.filter((a) => a.status === "Published").length),
      delta: "live for candidates",
      bar: "from-green-500 to-emerald-500",
    },
    {
      label: "Questions in Bank",
      value: "3,842",
      delta: "+210 this week",
      bar: "from-blue-500 to-sky-500",
    },
    {
      label: "Processing Uploads",
      value: String(uploads.filter((u) => u.status === "Processing").length),
      delta: "being parsed by AI",
      bar: "from-purple-500 to-violet-500",
    },
  ];

  const handleCreateAssessment = (data: {
    title: string;
    category: string;
    difficulty: Difficulty;
    duration: number;
    questions: number;
    publish: boolean;
  }) => {
    const bars = [
      "from-amber-400 to-amber-500",
      "from-blue-500 to-sky-500",
      "from-purple-500 to-violet-500",
      "from-green-500 to-emerald-500",
      "from-rose-500 to-pink-500",
      "from-teal-500 to-cyan-500",
    ];
    setAssessments((prev) => [
      {
        id: Date.now(),
        title: data.title,
        category: data.category,
        questions: data.questions,
        duration: data.duration,
        difficulty: data.difficulty,
        status: data.publish ? "Published" : "Draft",
        updated: "just now",
        bar: bars[prev.length % bars.length],
      },
      ...prev,
    ]);
    setShowCreateModal(false);
    showToast(ToastStates.SUCCESS, "Assessment created successfully");
  };

  const handleUploadFiles = (files: File[]) => {
    const kindFromName = (name: string): FileKind => {
      if (/\.(xlsx|xls|csv)$/i.test(name)) return "xlsx";
      if (/\.(docx?|rtf)$/i.test(name)) return "docx";
      return "pdf";
    };

    const newEntries: UploadedFile[] = files.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      kind: kindFromName(f.name),
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Processing",
      time: "just now",
      progress: 10,
    }));

    setUploads((prev) => [...newEntries, ...prev]);
    setShowUploadModal(false);
    showToast(
      ToastStates.SUCCESS,
      `${files.length} file${files.length > 1 ? "s" : ""} uploaded — processing started`,
    );

    newEntries.forEach((entry) => {
      setTimeout(
        () => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === entry.id
                ? {
                    ...u,
                    status: "Completed",
                    extracted: Math.floor(Math.random() * 80) + 20,
                    progress: 100,
                  }
                : u,
            ),
          );
        },
        1800 + Math.random() * 1200,
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              ⚡ Super Admin · Assessment Control
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Assessment Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create assessments and build your question bank from Excel,
              Word, or PDF files.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Upload Questions
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:from-amber-600 hover:to-amber-700"
            >
              <PlusIcon className="h-4 w-4" />
              Create Assessment
            </button>
          </div>
        </div>

        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((k, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${k.bar}`}
              />
              <div className="truncate text-xs uppercase tracking-wide text-gray-400">
                {k.label}
              </div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">
                {k.value}
              </div>
              <div className="mt-1 text-xs font-medium text-amber-600">
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="inline-flex rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          <button
            onClick={() => setTab("assessments")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "assessments"
                ? "bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Assessments
          </button>
          <button
            onClick={() => setTab("questions")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "questions"
                ? "bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Question Bank
          </button>
        </div>

        {/* ── Assessments Tab ── */}
        {tab === "assessments" && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assessments..."
                  className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-9 pr-4 text-sm shadow-sm placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="flex items-center gap-2">
                {(["All", "Published", "Draft", "Archived"] as const).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        statusFilter === s
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.map((a) => (
                <AssessmentCard
                  key={a.id}
                  assessment={a}
                  onDelete={() =>
                    setAssessments((prev) =>
                      prev.filter((x) => x.id !== a.id),
                    )
                  }
                  onArchive={() =>
                    setAssessments((prev) =>
                      prev.map((x) =>
                        x.id === a.id ? { ...x, status: "Archived" } : x,
                      ),
                    )
                  }
                />
              ))}

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex min-h-[210px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-6 text-amber-600 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                  <PlusIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">
                  Create New Assessment
                </span>
              </button>
            </div>

            {filteredAssessments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
                No assessments match your search.
              </div>
            )}
          </div>
        )}

        {/* ── Question Bank Tab ── */}
        {tab === "questions" && (
          <div className="space-y-8">
            {/* Upload dropzone */}
            <UploadDropzone
              onOpenModal={() => setShowUploadModal(true)}
              onFiles={handleUploadFiles}
            />

            {/* Recent uploads */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="font-semibold text-gray-900">Recent Uploads</h3>
                <span className="text-xs text-gray-400">
                  {uploads.length} file{uploads.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {uploads.map((f) => (
                  <FileRow key={f.id} file={f} />
                ))}
              </div>
            </div>

            {/* Question table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-gray-900">
                  Question Bank ({filteredQuestions.length})
                </h3>
                <div className="relative w-full sm:max-w-xs">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full rounded-xl border border-transparent bg-gray-50 py-2 pl-9 pr-4 text-sm shadow-sm placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-gray-400">
                      <th className="px-6 py-3 font-medium">Question</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Difficulty</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Source</th>
                      <th className="px-6 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredQuestions.map((q) => (
                      <QuestionRow key={q.id} question={q} />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredQuestions.length === 0 && (
                <div className="p-10 text-center text-sm text-gray-500">
                  No questions match your search.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateAssessmentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAssessment}
        />
      )}

      {showUploadModal && (
        <UploadQuestionsModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadFiles}
        />
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: AssessmentStatus }) {
  const styles: Record<AssessmentStatus, string> = {
    Published: "bg-green-100 text-green-700",
    Draft: "bg-amber-100 text-amber-700",
    Archived: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AssessmentCard({
  assessment,
  onDelete,
  onArchive,
}: {
  assessment: Assessment;
  onDelete: () => void;
  onArchive: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${assessment.bar}`}
      />

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-gray-900">
          {assessment.title}
        </h4>
        <StatusBadge status={assessment.status} />
      </div>

      <p className="mt-1 text-xs text-gray-500">{assessment.category}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <DocumentTextIcon className="h-3.5 w-3.5" />
          {assessment.questions} questions
        </span>
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="h-3.5 w-3.5" />
          {assessment.duration} min
        </span>
        <DifficultyBadge difficulty={assessment.difficulty} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-xs text-gray-400">
          Updated {assessment.updated}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            title="Edit"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            title="Duplicate"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
          <button
            title="Archive"
            onClick={onArchive}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
          >
            <ArchiveBoxIcon className="h-4 w-4" />
          </button>
          <button
            title="Delete"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ kind }: { kind: FileKind }) {
  const styles: Record<FileKind, string> = {
    xlsx: "bg-green-100 text-green-700",
    docx: "bg-blue-100 text-blue-700",
    pdf: "bg-rose-100 text-rose-700",
  };
  const Icon = kind === "xlsx" ? TableCellsIcon : DocumentIcon;
  return (
    <div
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${styles[kind]}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

function FileRow({ file }: { file: UploadedFile }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <FileIcon kind={file.kind} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900">
          {file.name}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {file.size} · {file.time}
        </div>
        {file.status === "Processing" && (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
              style={{ width: `${file.progress ?? 50}%` }}
            />
          </div>
        )}
        {file.status === "Failed" && file.error && (
          <div className="mt-1 text-xs text-rose-600">{file.error}</div>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {file.status === "Completed" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            {file.extracted} questions
          </span>
        )}
        {file.status === "Processing" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            <ClockIcon className="h-3.5 w-3.5 animate-spin" />
            Processing
          </span>
        )}
        {file.status === "Failed" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
            <ExclamationTriangleIcon className="h-3.5 w-3.5" />
            Failed
          </span>
        )}
      </div>
    </div>
  );
}

function QuestionRow({ question }: { question: QuestionRowData }) {
  const typeStyles: Record<QuestionRowData["type"], string> = {
    MCQ: "bg-blue-100 text-blue-700",
    Subjective: "bg-purple-100 text-purple-700",
    Coding: "bg-teal-100 text-teal-700",
  };

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="max-w-sm px-6 py-4 text-sm text-gray-900">
        {question.text}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">{question.category}</td>
      <td className="px-4 py-4">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="px-4 py-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyles[question.type]}`}
        >
          {question.type}
        </span>
      </td>
      <td className="px-4 py-4 text-xs text-gray-400">{question.source}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            title="Edit"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            title="Delete"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function UploadDropzone({
  onOpenModal,
  onFiles,
}: {
  onOpenModal: () => void;
  onFiles: (files: File[]) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-10 text-center transition ${
        dragActive
          ? "border-amber-400 bg-amber-50"
          : "border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.doc,.docx,.pdf"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-lg shadow-amber-200">
        <ArrowUpTrayIcon className="h-6 w-6 text-white" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-gray-900">
        Drag & drop Excel, Word, or PDF files
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Questions are auto-extracted and added to your question bank
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:from-amber-600 hover:to-amber-700"
        >
          Browse Files
        </button>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Advanced Upload
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">
          .xlsx
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">
          .csv
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">
          .docx
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">
          .pdf
        </span>
        <span className="text-gray-300">·</span>
        <button className="font-medium text-amber-600 hover:underline">
          Download sample template
        </button>
      </div>
    </div>
  );
}

function CreateAssessmentModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    category: string;
    difficulty: Difficulty;
    duration: number;
    questions: number;
    publish: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState(30);
  const [passingScore, setPassingScore] = useState(60);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const titleInvalid = touched && !title.trim();

  const handleSubmit = (publish: boolean) => {
    setTouched(true);
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      category,
      difficulty,
      duration,
      questions,
      publish,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Assessment
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Set up the assessment, then add questions from your bank or a
              file upload.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assessment Name <span className="text-rose-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Frontend Developer Screening"
              className={`mt-2 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm shadow-sm placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                titleInvalid ? "border-2 border-rose-300" : "border border-transparent"
              }`}
            />
            {titleInvalid && (
              <p className="mt-1 text-xs text-rose-600">
                Assessment name is required.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                type="number"
                min={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. of Questions
              </label>
              <input
                type="number"
                min={1}
                value={questions}
                onChange={(e) => setQuestions(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description of this assessment"
              className="mt-2 w-full resize-none rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Negative Marking
              </div>
              <div className="text-xs text-gray-500">
                Deduct points for incorrect answers
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNegativeMarking((s) => !s)}
              aria-pressed={negativeMarking}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                negativeMarking ? "bg-amber-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                  negativeMarking ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full rounded-full border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 sm:w-auto"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-amber-600 hover:to-amber-700 sm:w-auto"
          >
            Publish Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadQuestionsModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (files: File[]) => void;
}) {
  const [targetAssessment, setTargetAssessment] = useState("Unassigned (Question Bank only)");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) addFiles(files);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Questions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Import questions from Excel, Word, or PDF files.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add to Assessment
            </label>
            <select
              value={targetAssessment}
              onChange={(e) => setTargetAssessment(e.target.value)}
              className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option>Unassigned (Question Bank only)</option>
              {INITIAL_ASSESSMENTS.map((a) => (
                <option key={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-amber-400 bg-amber-50"
                : "border-gray-200 bg-gray-50/60"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv,.doc,.docx,.pdf"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) addFiles(files);
                e.target.value = "";
              }}
            />
            <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-amber-500" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              Drop files here or{" "}
              <button
                onClick={() => inputRef.current?.click()}
                className="text-amber-600 hover:underline"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Supports .xlsx, .csv, .docx, .pdf up to 10 MB each
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span className="truncate text-sm text-gray-700">
                      {f.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="ml-3 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedFiles.length === 0}
            onClick={() => onUpload(selectedFiles)}
            className={`w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition sm:w-auto ${
              selectedFiles.length === 0
                ? "cursor-not-allowed bg-amber-200"
                : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            }`}
          >
            Upload & Process
          </button>
        </div>
      </div>
    </div>
  );
}
