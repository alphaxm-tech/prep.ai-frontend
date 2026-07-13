"use client";

import { useEffect } from "react";
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useGetQuizResults } from "@/server-api/queries/quiz.queries";

type QuizResultsModalProps = {
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

export default function QuizResultsModal({
  assessmentId,
  onClose,
}: QuizResultsModalProps) {
  const isOpen = assessmentId !== null;

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useGetQuizResults(assessmentId);

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
    "Could not load this quiz's results.";

  const scorePercent =
    results && results.max_score > 0
      ? Math.round((Math.max(results.total_score, 0) / results.max_score) * 100)
      : 0;

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
                {results?.title ?? "Quiz Results"}
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                Your answers and score for this quiz
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
                <p className="text-gray-500 text-sm">Loading results...</p>
              </div>
            )}

            {isError && !isLoading && (
              <div className="py-16 text-center text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {results && !isLoading && !isError && (
              <div className="grid grid-cols-1 gap-6">
                {/* Summary */}
                <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
                    <div className="md:col-span-1">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Score
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 mt-1">
                        {scorePercent}%
                      </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-gray-200 mx-auto" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Marks
                      </div>
                      <div className="text-base font-medium text-gray-900 mt-1">
                        {results.total_score} / {results.max_score}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-green-600 font-semibold">
                        Correct
                      </div>
                      <div className="text-base font-medium text-green-700 mt-1">
                        {results.correct}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-red-500 font-semibold">
                        Wrong
                      </div>
                      <div className="text-base font-medium text-red-600 mt-1">
                        {results.wrong}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                        Unanswered
                      </div>
                      <div className="text-base font-medium text-gray-500 mt-1">
                        {results.unanswered}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Submitted
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(results.submitted_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Per-question breakdown */}
                <div className="space-y-4">
                  {results.questions.length === 0 && (
                    <div className="py-10 text-center text-sm text-gray-500">
                      No questions were recorded for this attempt.
                    </div>
                  )}

                  {results.questions.map((q, i) => (
                    <div
                      key={q.question_id}
                      className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                          {i + 1}. {q.question_text}
                        </h3>
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1">
                            {!q.answered ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                                Unanswered
                              </span>
                            ) : q.is_correct ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {q.score_awarded}
                            <span className="text-gray-400 text-sm"> /{q.max_score}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = opt.option_id === q.selected_option_id;
                          const isCorrectOption = opt.is_correct;

                          let classes =
                            "w-full text-left px-4 py-2.5 rounded-lg border text-sm flex items-center justify-between";
                          if (isCorrectOption) {
                            classes +=
                              " bg-green-50 border-green-300 text-green-800";
                          } else if (isSelected && !isCorrectOption) {
                            classes += " bg-red-50 border-red-300 text-red-800";
                          } else {
                            classes += " bg-gray-50 border-gray-200 text-gray-700";
                          }

                          return (
                            <div key={opt.option_id} className={classes}>
                              <span>{opt.option_text}</span>
                              <span className="flex items-center gap-2 text-xs font-medium shrink-0">
                                {isSelected && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/60 border border-current">
                                    Your answer
                                  </span>
                                )}
                                {isCorrectOption && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/60 border border-current">
                                    Correct
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
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
