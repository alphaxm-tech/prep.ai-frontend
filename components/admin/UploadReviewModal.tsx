"use client";

import { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TagPicker from "./TagPicker";
import {
  useGetUploadJob,
  useListTags,
} from "@/server-api/queries/question-bank-admin.queries";
import { useAcceptUploadJob } from "@/server-api/mutations/question-bank-admin.mutation";
import { useToast } from "@/components/toast/ToastContext";
import { ToastStates } from "@/enums/enums";
import {
  ExtractedQuestionCandidate,
  ReviewedQuestionInput,
  TagOption,
} from "@/server-api/api/types/question-bank-admin.types";

type UploadReviewModalProps = {
  jobId: number | null;
  onClose: () => void;
};

function candidateToReviewed(
  c: ExtractedQuestionCandidate,
  allTags: TagOption[],
): ReviewedQuestionInput {
  const suggestedIds = (c.suggested_tag_names ?? [])
    .map((name) => allTags.find((t) => t.name.toLowerCase() === name.toLowerCase()))
    .filter((t): t is TagOption => !!t)
    .map((t) => t.tag_id);

  return {
    title: c.title,
    question_text: c.question_text,
    difficulty: c.difficulty || "medium",
    tag_ids: suggestedIds,
    options: c.options,
    correct_option: c.correct_option,
    languages_allowed: c.languages_allowed,
    time_limit_ms: c.time_limit_ms,
    memory_limit_mb: c.memory_limit_mb,
    evaluation_mode: c.evaluation_mode,
  };
}

export default function UploadReviewModal({
  jobId,
  onClose,
}: UploadReviewModalProps) {
  const isOpen = jobId !== null;
  const { showToast } = useToast();

  const { data: job, isLoading: isJobLoading } = useGetUploadJob(jobId);
  const { data: tags = [] } = useListTags();
  const acceptMutation = useAcceptUploadJob(jobId ?? 0);

  const [questions, setQuestions] = useState<ReviewedQuestionInput[]>([]);
  const initializedForJob = useRef<number | null>(null);

  // Initialize editable rows once the job's extraction completes — guarded
  // so re-polling/refetching doesn't stomp on the admin's in-progress edits.
  useEffect(() => {
    if (!job || job.status !== "completed" || !job.extracted_questions) return;
    if (initializedForJob.current === job.job_id) return;
    initializedForJob.current = job.job_id;
    setQuestions(job.extracted_questions.map((c) => candidateToReviewed(c, tags)));
  }, [job, tags]);

  useEffect(() => {
    if (!isOpen) {
      initializedForJob.current = null;
      setQuestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateQuestion = (index: number, patch: Partial<ReviewedQuestionInput>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const canAccept =
    questions.length > 0 &&
    questions.every((q) => q.question_text.trim() && q.tag_ids.length > 0);

  const handleAccept = () => {
    if (!canAccept) {
      showToast(
        ToastStates.ERROR,
        "Every question needs text and at least one tag before it can be added.",
      );
      return;
    }
    acceptMutation.mutate(
      { questions },
      {
        onSuccess: (result) => {
          showToast(
            ToastStates.SUCCESS,
            `${result.imported} question${result.imported === 1 ? "" : "s"} added to the bank`,
          );
          onClose();
        },
        onError: () => {
          showToast(ToastStates.ERROR, "Could not add these questions — please try again.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Review Extracted Questions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {job?.file_name ?? "Loading..."} — edit as needed, assign tags, then add
              to the question bank.
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

        {(isJobLoading || job?.status === "processing") && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <p className="text-sm text-gray-500">
              Extracting questions from your file — this can take a minute for
              PDF/Word documents.
            </p>
          </div>
        )}

        {job?.status === "failed" && (
          <div className="py-16 text-center text-sm text-rose-600">
            {job.error_message || "Extraction failed for this file."}
          </div>
        )}

        {job?.status === "committed" && (
          <div className="py-16 text-center text-sm text-gray-500">
            These questions have already been added to the bank.
          </div>
        )}

        {job?.status === "completed" && (
          <>
            <div className="space-y-5">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="mt-2 text-xs font-semibold text-gray-400">
                      Q{index + 1}
                    </span>
                    <textarea
                      value={q.question_text}
                      onChange={(e) =>
                        updateQuestion(index, { question_text: e.target.value })
                      }
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                    <button
                      onClick={() => removeQuestion(index)}
                      title="Remove"
                      className="mt-1 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-gray-500">
                      Difficulty
                    </label>
                    <select
                      value={q.difficulty}
                      onChange={(e) =>
                        updateQuestion(index, { difficulty: e.target.value })
                      }
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  {q.options && (
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={q.correct_option === optIndex + 1}
                            onChange={() =>
                              updateQuestion(index, { correct_option: optIndex + 1 })
                            }
                          />
                          <input
                            value={opt}
                            onChange={(e) => {
                              const nextOptions = [...(q.options ?? [])];
                              nextOptions[optIndex] = e.target.value;
                              updateQuestion(index, { options: nextOptions });
                            }}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.languages_allowed && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-gray-500">Languages</label>
                        <input
                          value={q.languages_allowed?.join(", ") ?? ""}
                          onChange={(e) =>
                            updateQuestion(index, {
                              languages_allowed: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500">Time limit (ms)</label>
                        <input
                          type="number"
                          value={q.time_limit_ms ?? 2000}
                          onChange={(e) =>
                            updateQuestion(index, {
                              time_limit_ms: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500">Memory (MB)</label>
                        <input
                          type="number"
                          value={q.memory_limit_mb ?? 256}
                          onChange={(e) =>
                            updateQuestion(index, {
                              memory_limit_mb: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                      Tags <span className="text-rose-500">*</span>
                    </label>
                    <TagPicker
                      tags={tags}
                      selectedTagIds={q.tag_ids}
                      onChange={(ids) => updateQuestion(index, { tag_ids: ids })}
                    />
                    {q.tag_ids.length === 0 && (
                      <p className="mt-1 text-xs text-rose-500">
                        At least one tag is required.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                  No questions left to review.
                </p>
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
                disabled={!canAccept || acceptMutation.isPending}
                onClick={handleAccept}
                className={`w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition sm:w-auto ${
                  !canAccept || acceptMutation.isPending
                    ? "cursor-not-allowed bg-amber-200"
                    : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                }`}
              >
                {acceptMutation.isPending
                  ? "Adding..."
                  : `Accept & Add ${questions.length} to Bank`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
