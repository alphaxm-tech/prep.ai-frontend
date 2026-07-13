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
  ArchiveBoxIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components/toast/ToastContext";
import { ToastStates } from "@/enums/enums";
import UploadReviewModal from "@/components/admin/UploadReviewModal";
import { useGetAllGroups } from "@/server-api/queries/ccg.queries";
import { useGetAssessmentsForAdmin } from "@/server-api/queries/assessment-admin.queries";
import {
  useListQuestions,
  useListUploadJobs,
} from "@/server-api/queries/question-bank-admin.queries";
import {
  useCreateAssessmentAdmin,
  useDeleteAssessmentAdmin,
  useUpdateAssessmentStatus,
} from "@/server-api/mutations/assessment-admin.mutation";
import { useUploadDocument } from "@/server-api/mutations/question-bank-admin.mutation";
import {
  AdminAssessmentResponse,
  AssessmentStatus,
} from "@/server-api/api/types/assessment-admin.types";
import {
  QuestionRow as QBQuestionRow,
  QuestionType,
  UploadJobStatusResponse,
} from "@/server-api/api/types/question-bank-admin.types";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: "Beginner",
  MEDIUM: "Intermediate",
  HARD: "Advanced",
};

const BARS = [
  "from-amber-400 to-amber-500",
  "from-blue-500 to-sky-500",
  "from-purple-500 to-violet-500",
  "from-green-500 to-emerald-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-cyan-500",
];

const DEFAULT_PAGE_SIZE = 12;

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AssessmentManagementPage() {
  const { showToast } = useToast();

  const [tab, setTab] = useState<"assessments" | "questions">("assessments");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AssessmentStatus>("All");
  const [page, setPage] = useState(1);

  const [questionSearch, setQuestionSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<number | null>(null);

  const { data: assessmentsData, isLoading: isAssessmentsLoading } =
    useGetAssessmentsForAdmin({
      search,
      status: statusFilter,
      pageNo: page,
      count: DEFAULT_PAGE_SIZE,
    });
  const { data: groups = [] } = useGetAllGroups();
  const { data: uploadJobs = [] } = useListUploadJobs();
  const { data: questionsData } = useListQuestions({
    page: 1,
    limit: 50,
  });

  const createAssessmentMutation = useCreateAssessmentAdmin();
  const updateStatusMutation = useUpdateAssessmentStatus();
  const deleteAssessmentMutation = useDeleteAssessmentAdmin();
  const uploadDocumentMutation = useUploadDocument();

  const assessments = assessmentsData?.assessments ?? [];
  const totalAssessments = assessmentsData?.total_count ?? 0;
  const publishedCount = assessments.filter((a) => a.status === "published").length;
  const questionsInBank = questionsData?.total_count ?? 0;
  const processingUploads = uploadJobs.filter((j) => j.status === "processing").length;

  const filteredQuestions = useMemo(() => {
    const all = questionsData?.questions ?? [];
    if (!questionSearch.trim()) return all;
    const needle = questionSearch.toLowerCase();
    return all.filter(
      (q) =>
        q.question_text.toLowerCase().includes(needle) ||
        (q.title ?? "").toLowerCase().includes(needle),
    );
  }, [questionsData, questionSearch]);

  const kpis = [
    {
      label: "Total Assessments",
      value: String(totalAssessments),
      delta: `${publishedCount} published`,
      bar: "from-amber-400 to-amber-500",
    },
    {
      label: "Published",
      value: String(publishedCount),
      delta: "live for candidates",
      bar: "from-green-500 to-emerald-500",
    },
    {
      label: "Questions in Bank",
      value: String(questionsInBank),
      delta: "across all types",
      bar: "from-blue-500 to-sky-500",
    },
    {
      label: "Processing Uploads",
      value: String(processingUploads),
      delta: "being parsed by AI",
      bar: "from-purple-500 to-violet-500",
    },
  ];

  const handleCreateAssessment = (data: {
    title: string;
    groupId: number;
    assessmentType: string;
    difficulty: Difficulty;
    durationSec: number;
    maxAttempts: number;
    publish: boolean;
  }) => {
    createAssessmentMutation.mutate(
      {
        group_id: data.groupId,
        title: data.title,
        assessment_type: data.assessmentType as
          | "MCQ"
          | "CODING"
          | "DESCRIPTIVE"
          | "MIXED",
        duration_seconds: data.durationSec,
        max_attempts: data.maxAttempts,
        difficulty: data.difficulty,
        status: data.publish ? "published" : "draft",
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          showToast(ToastStates.SUCCESS, "Assessment created successfully");
        },
        onError: () => {
          showToast(ToastStates.ERROR, "Could not create assessment");
        },
      },
    );
  };

  const handleUploadFile = (file: File, questionType: QuestionType) => {
    uploadDocumentMutation.mutate(
      { file, questionType },
      {
        onSuccess: (job) => {
          setShowUploadModal(false);
          showToast(ToastStates.SUCCESS, "File uploaded — processing started");
          setReviewJobId(job.job_id);
        },
        onError: () => {
          showToast(ToastStates.ERROR, "Upload failed — please try again");
        },
      },
    );
  };

  const handleArchive = (assessmentId: number) => {
    updateStatusMutation.mutate(
      { assessmentId, req: { status: "archived" } },
      {
        onSuccess: () => showToast(ToastStates.SUCCESS, "Assessment archived"),
        onError: () => showToast(ToastStates.ERROR, "Could not archive assessment"),
      },
    );
  };

  const handlePublish = (assessmentId: number) => {
    updateStatusMutation.mutate(
      { assessmentId, req: { status: "published" } },
      {
        onSuccess: () => showToast(ToastStates.SUCCESS, "Assessment published"),
        onError: () => showToast(ToastStates.ERROR, "Could not publish assessment"),
      },
    );
  };

  const handleDelete = (assessmentId: number) => {
    deleteAssessmentMutation.mutate(assessmentId, {
      onSuccess: () => showToast(ToastStates.SUCCESS, "Assessment deleted"),
      onError: (err: any) => {
        const message =
          err?.response?.data?.error?.message ?? "Could not delete assessment";
        showToast(ToastStates.ERROR, message);
      },
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search assessments..."
                  className="w-full rounded-xl border border-transparent bg-gray-50 py-2.5 pl-9 pr-4 text-sm shadow-sm placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="flex items-center gap-2">
                {(["All", "draft", "published", "archived"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s as "All" | AssessmentStatus);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                      statusFilter === s
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {isAssessmentsLoading ? (
              <div className="py-20 text-center text-sm text-gray-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assessments.map((a, i) => (
                  <AssessmentCard
                    key={a.assessment_id}
                    assessment={a}
                    bar={BARS[i % BARS.length]}
                    onDelete={() => handleDelete(a.assessment_id)}
                    onArchive={() => handleArchive(a.assessment_id)}
                    onPublish={() => handlePublish(a.assessment_id)}
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
            )}

            {!isAssessmentsLoading && assessments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
                No assessments match your search.
              </div>
            )}

            {totalAssessments > DEFAULT_PAGE_SIZE && (
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {Math.ceil(totalAssessments / DEFAULT_PAGE_SIZE)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(totalAssessments / DEFAULT_PAGE_SIZE)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Question Bank Tab ── */}
        {tab === "questions" && (
          <div className="space-y-8">
            <UploadDropzone
              onOpenModal={() => setShowUploadModal(true)}
            />

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="font-semibold text-gray-900">Recent Uploads</h3>
                <span className="text-xs text-gray-400">
                  {uploadJobs.length} file{uploadJobs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {uploadJobs.map((job) => (
                  <FileRow
                    key={job.job_id}
                    job={job}
                    onReview={() => setReviewJobId(job.job_id)}
                  />
                ))}
                {uploadJobs.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-gray-500">
                    No uploads yet.
                  </p>
                )}
              </div>
            </div>

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
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Difficulty</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredQuestions.map((q) => (
                      <QuestionRowItem key={q.question_id} question={q} />
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
          groups={groups}
          isSubmitting={createAssessmentMutation.isPending}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAssessment}
        />
      )}

      {showUploadModal && (
        <UploadQuestionsModal
          isUploading={uploadDocumentMutation.isPending}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadFile}
        />
      )}

      <UploadReviewModal jobId={reviewJobId} onClose={() => setReviewJobId(null)} />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    EASY: "bg-green-100 text-green-700",
    easy: "bg-green-100 text-green-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    medium: "bg-amber-100 text-amber-700",
    HARD: "bg-rose-100 text-rose-700",
    hard: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[difficulty] ?? "bg-gray-100 text-gray-600"}`}
    >
      {(DIFFICULTY_LABEL as Record<string, string>)[difficulty] ?? difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: AssessmentStatus }) {
  const styles: Record<AssessmentStatus, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-amber-100 text-amber-700",
    archived: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AssessmentCard({
  assessment,
  bar,
  onDelete,
  onArchive,
  onPublish,
}: {
  assessment: AdminAssessmentResponse;
  bar: string;
  onDelete: () => void;
  onArchive: () => void;
  onPublish: () => void;
}) {
  const minutes = Math.max(1, Math.round(assessment.duration_sec / 60));

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${bar}`} />

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-gray-900">
          {assessment.title}
        </h4>
        <StatusBadge status={assessment.status} />
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {assessment.group_name} · {assessment.assessment_type}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <DocumentTextIcon className="h-3.5 w-3.5" />
          {assessment.total_questions} questions
        </span>
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="h-3.5 w-3.5" />
          {minutes} min
        </span>
        <DifficultyBadge difficulty={assessment.difficulty} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-xs text-gray-400">
          {new Date(assessment.created_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {assessment.status !== "published" && (
            <button
              title="Publish"
              onClick={onPublish}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600"
            >
              <RocketLaunchIcon className="h-4 w-4" />
            </button>
          )}
          {assessment.status !== "archived" && (
            <button
              title="Archive"
              onClick={onArchive}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
            >
              <ArchiveBoxIcon className="h-4 w-4" />
            </button>
          )}
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

function FileIcon({ kind }: { kind: string }) {
  const styles: Record<string, string> = {
    xlsx: "bg-green-100 text-green-700",
    docx: "bg-blue-100 text-blue-700",
    pdf: "bg-rose-100 text-rose-700",
  };
  const Icon = kind === "xlsx" ? TableCellsIcon : DocumentIcon;
  return (
    <div
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${styles[kind] ?? "bg-gray-100 text-gray-600"}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

function FileRow({
  job,
  onReview,
}: {
  job: UploadJobStatusResponse;
  onReview: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <FileIcon kind={job.file_type} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900">
          {job.file_name}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {job.question_type} · {new Date(job.created_at).toLocaleString()}
        </div>
        {job.status === "processing" && (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-amber-500" />
          </div>
        )}
        {job.status === "failed" && job.error_message && (
          <div className="mt-1 text-xs text-rose-600">{job.error_message}</div>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {job.status === "completed" && (
          <button
            onClick={onReview}
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200"
          >
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Review {job.extracted_questions?.length ?? ""} questions
          </button>
        )}
        {job.status === "committed" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Added to bank
          </span>
        )}
        {job.status === "processing" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            <ClockIcon className="h-3.5 w-3.5 animate-spin" />
            Processing
          </span>
        )}
        {job.status === "failed" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
            <ExclamationTriangleIcon className="h-3.5 w-3.5" />
            Failed
          </span>
        )}
      </div>
    </div>
  );
}

function QuestionRowItem({ question }: { question: QBQuestionRow }) {
  return (
    <tr className="transition hover:bg-gray-50">
      <td className="max-w-sm px-6 py-4 text-sm text-gray-900">
        {question.title || question.question_text}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">{question.question_type}</td>
      <td className="px-4 py-4">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="px-4 py-4 text-xs text-gray-400 capitalize">{question.status}</td>
    </tr>
  );
}

function UploadDropzone({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-lg shadow-amber-200">
        <ArrowUpTrayIcon className="h-6 w-6 text-white" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-gray-900">
        Upload Excel, Word, or PDF files
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Questions are auto-extracted, shown for review, and only added to the
        bank once you accept them.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:from-amber-600 hover:to-amber-700"
        >
          Upload Questions
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">.xlsx</span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">.csv</span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">.docx</span>
        <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">.pdf</span>
      </div>
    </div>
  );
}

function CreateAssessmentModal({
  groups,
  isSubmitting,
  onClose,
  onCreate,
}: {
  groups: { group_id: number; name: string }[];
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    groupId: number;
    assessmentType: string;
    difficulty: Difficulty;
    durationSec: number;
    maxAttempts: number;
    publish: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState<number | "">(groups[0]?.group_id ?? "");
  const [assessmentType, setAssessmentType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [durationMin, setDurationMin] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [touched, setTouched] = useState(false);

  const titleInvalid = touched && !title.trim();
  const groupInvalid = touched && !groupId;

  const handleSubmit = (publish: boolean) => {
    setTouched(true);
    if (!title.trim() || !groupId) return;
    onCreate({
      title: title.trim(),
      groupId: Number(groupId),
      assessmentType,
      difficulty,
      durationSec: durationMin * 60,
      maxAttempts,
      publish,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Assessment
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Assign it to a group, then attach questions from the bank
              afterward.
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
                Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(Number(e.target.value))}
                className={`mt-2 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                  groupInvalid ? "border-2 border-rose-300" : "border border-transparent"
                }`}
              >
                <option value="">Select a group</option>
                {groups.map((g) => (
                  <option key={g.group_id} value={g.group_id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {groupInvalid && (
                <p className="mt-1 text-xs text-rose-600">A group is required.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assessment Type
              </label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="MCQ">MCQ</option>
                <option value="CODING">Coding</option>
                <option value="DESCRIPTIVE">Descriptive</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="EASY">Beginner</option>
                <option value="MEDIUM">Intermediate</option>
                <option value="HARD">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                type="number"
                min={5}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Attempts
              </label>
              <input
                type="number"
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
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
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="w-full rounded-full border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-60 sm:w-auto"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="w-full rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Publish Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadQuestionsModal({
  isUploading,
  onClose,
  onUpload,
}: {
  isUploading: boolean;
  onClose: () => void;
  onUpload: (file: File, questionType: QuestionType) => void;
}) {
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

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
              Question Type <span className="text-rose-500">*</span>
            </label>
            <p className="mt-1 text-xs text-gray-400">
              Picking the type upfront keeps extraction accurate — especially
              for Word/PDF files.
            </p>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="mt-2 w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="MCQ">MCQ</option>
              <option value="CODING">Coding</option>
              <option value="DESCRIPTIVE">Descriptive</option>
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
              accept=".xlsx,.xls,.csv,.docx,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
                e.target.value = "";
              }}
            />
            <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-amber-500" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              Drop a file here or{" "}
              <button
                onClick={() => inputRef.current?.click()}
                className="text-amber-600 hover:underline"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Supports .xlsx, .csv, .docx, .pdf up to 20 MB
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <span className="truncate text-sm text-gray-700">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="ml-3 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
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
            disabled={!selectedFile || isUploading}
            onClick={() => selectedFile && onUpload(selectedFile, questionType)}
            className={`w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition sm:w-auto ${
              !selectedFile || isUploading
                ? "cursor-not-allowed bg-amber-200"
                : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload & Process"}
          </button>
        </div>
      </div>
    </div>
  );
}
