"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAssessmentResult } from "@/utils/queries/code-editor.queries";
import Loader from "@/components/Loader";
import { QuestionStatus } from "@/utils/api/types/code-editor.types";

const STATUS_STYLES: Record<QuestionStatus, { label: string; className: string }> = {
  accepted:          { label: "Accepted",      className: "text-green-700 bg-green-100" },
  wrong_answer:      { label: "Wrong Answer",  className: "text-red-700 bg-red-100" },
  runtime_error:     { label: "Runtime Error", className: "text-red-700 bg-red-100" },
  tle:               { label: "TLE",           className: "text-orange-700 bg-orange-100" },
  compilation_error: { label: "Compile Error", className: "text-red-700 bg-red-100" },
  not_started:       { label: "Not Attempted", className: "text-gray-600 bg-gray-100" },
  pending:           { label: "Pending",       className: "text-yellow-700 bg-yellow-100" },
  running:           { label: "Running",       className: "text-yellow-700 bg-yellow-100" },
};

export default function AssessmentResultPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = Number(params.id);

  const { data, isLoading, isError } = useGetAssessmentResult(assessmentId);
  const result = data?.data;

  const scorePercent =
    result && result.max_score > 0
      ? Math.round((result.total_score / result.max_score) * 100)
      : 0;

  return (
    <>
      <Loader show={isLoading} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {isError && (
            <div className="text-center text-red-500 text-sm">
              Failed to load results. Please refresh the page.
            </div>
          )}

          {!isLoading && result && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Test Complete
                </h1>
                <p className="text-sm text-gray-500 capitalize">{result.assessment_title}</p>
              </div>

              {/* Score card */}
              <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm px-8 py-8 flex flex-col items-center gap-3">
                <div className="text-5xl font-extrabold text-gray-900 tabular-nums">
                  {result.total_score}
                  <span className="text-2xl text-gray-400 font-semibold">
                    /{result.max_score}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Total Score</p>

                {/* Progress bar */}
                <div className="w-full max-w-xs mt-2">
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        scorePercent >= 70
                          ? "bg-green-400"
                          : scorePercent >= 40
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-1">
                    {scorePercent}%
                  </p>
                </div>
              </div>

              {/* Per-question breakdown */}
              <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_80px_80px_120px] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50/70 border-b border-gray-200/70">
                  <div>Question</div>
                  <div className="text-right">Score</div>
                  <div className="text-right">Max</div>
                  <div className="text-right">Status</div>
                </div>

                {result.questions.map((q, i) => {
                  const cfg = STATUS_STYLES[q.status] ?? STATUS_STYLES.not_started;
                  return (
                    <div
                      key={q.question_id}
                      className={`grid grid-cols-[1fr_80px_80px_120px] px-5 py-3.5 items-center text-sm border-b border-gray-100 last:border-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <div className="font-medium text-gray-800 truncate pr-4">
                        {i + 1}. {q.title}
                      </div>
                      <div className="text-right font-semibold text-gray-900">
                        {q.score}
                      </div>
                      <div className="text-right text-gray-500">{q.max_score}</div>
                      <div className="flex justify-end">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => router.push("/student/code-editor")}
                  className="px-6 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Assessments
                </button>
                <button
                  onClick={() => router.push("/student")}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
