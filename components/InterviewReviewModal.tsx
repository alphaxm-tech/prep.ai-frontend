"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useGetInterviewReview } from "@/server-api/queries/ai-interview.queries";

type InterviewReviewModalProps = {
  assessmentId: number | null;
  onClose: () => void;
};

function formatDate(value?: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

export default function InterviewReviewModal({
  assessmentId,
  onClose,
}: InterviewReviewModalProps) {
  const isOpen = assessmentId !== null;

  const {
    data: review,
    isLoading,
    isError,
    error,
  } = useGetInterviewReview(assessmentId);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const errorMessage =
    (error as any)?.response?.data?.error?.message ??
    "Could not load this interview's review.";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 flex flex-col max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-6 bg-white border-b border-gray-200">
            <div>
              <div className="text-xl font-bold text-gray-900 tracking-tight">
                {review?.title ?? "Interview Review"}
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                Your answers and AI feedback for this interview
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto bg-gray-50">
            {isLoading && (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Loading review...</p>
              </div>
            )}

            {isError && !isLoading && (
              <div className="py-16 text-center text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {review && !isLoading && !isError && (
              <div className="grid grid-cols-1 gap-6">
                {/* Summary */}
                <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-2">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Status
                      </div>
                      <div className="text-base font-medium text-gray-900 mt-1 capitalize">
                        {review.status.replace("_", " ")}
                      </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-gray-200 mx-auto" />
                    <div className="md:col-span-2">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Score
                      </div>
                      <div className="text-base font-medium text-gray-900 mt-1">
                        {review.total_score} / {review.max_score}
                      </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-gray-200 mx-auto" />
                    <div className="md:col-span-3">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Started
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(review.started_at)}
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Evaluated
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(review.evaluated_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {review.overall_feedback && (
                  <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      Overall Feedback
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.overall_feedback}
                    </p>
                  </div>
                )}

                {/* Per-question breakdown */}
                <div className="space-y-4">
                  {review.questions.length === 0 && (
                    <div className="py-10 text-center text-sm text-gray-500">
                      No answered questions were recorded for this attempt.
                    </div>
                  )}

                  {review.questions.map((q) => (
                    <div
                      key={q.question_id}
                      className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                          {q.question_text}
                        </h3>
                        <div className="flex flex-col items-end shrink-0">
                          <div className="text-xl font-bold text-gray-900">
                            {q.score_awarded}
                            <span className="text-gray-400 text-sm">
                              {" "}
                              /{q.max_score}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                            Score
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                          Your Answer{" "}
                          {q.duration_sec > 0 && (
                            <span className="normal-case font-normal text-gray-400">
                              ({q.duration_sec}s)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-3">
                          {q.transcript?.trim() || "No answer recorded."}
                        </p>
                      </div>

                      {(q.strengths?.length > 0 || q.improvements?.length > 0) && (
                        <div className="space-y-2">
                          {q.strengths?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {q.strengths.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200"
                                >
                                  + {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {q.improvements?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {q.improvements.map((imp, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200"
                                >
                                  ⚠ {imp}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
