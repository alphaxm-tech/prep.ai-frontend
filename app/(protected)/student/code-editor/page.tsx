"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCodingQuestions } from "@/utils/queries/code-editor.queries";
import { useToast } from "@/components/toast/ToastContext";
import Loader from "@/components/Loader";
import { Assessment } from "@/utils/api/types/code-editor.types";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function CodeEditorListPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    data: codingQuestionData,
    isLoading,
    isError,
  } = useGetCodingQuestions();

  const assessments: Assessment[] =
    codingQuestionData?.response?.assessments ?? [];

  useEffect(() => {
    if (!isLoading && isError) {
      showToast("error", "Failed to load assessments. Please try again.");
    } else if (!isLoading && !isError && assessments.length === 0 && codingQuestionData) {
      showToast("info", "No coding assessments are available for you right now.");
    }
  }, [isLoading, isError, codingQuestionData]);

  function handleStartAssessment(assessment: Assessment) {
    const slug = slugify(assessment.title);
    router.push(`/student/code-editor/${slug}/${assessment.assessment_id}`);
  }

  return (
    <>
      <Loader show={isLoading} />
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Coding Assessments
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Timed coding tests — solve all questions before the clock runs out
            </p>
          </div>

          {!isLoading && assessments.length === 0 && (
            <div className="py-20 text-center text-gray-500 text-sm">
              No assessments available right now.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {assessments.map((assessment) => {
              const totalMarks = assessment.questions.reduce(
                (sum, q) => sum + q.marks,
                0,
              );
              const difficultyCounts = assessment.questions.reduce(
                (acc, q) => {
                  acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              );

              return (
                <div
                  key={assessment.assessment_id}
                  className="bg-white rounded-xl border border-gray-200/70 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 leading-tight">
                      {assessment.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {assessment.questions.length} question
                      {assessment.questions.length !== 1 ? "s" : ""} &middot; {totalMarks} marks total
                    </p>
                  </div>

                  {/* Difficulty breakdown */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(difficultyCounts).map(([diff, count]) => (
                      <span
                        key={diff}
                        className={`text-[11px] px-2 py-0.5 rounded-full capitalize font-medium ${DIFFICULTY_COLORS[diff] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {count} {diff}
                      </span>
                    ))}
                  </div>

                  {/* Question titles preview */}
                  <ul className="space-y-1">
                    {assessment.questions.slice(0, 3).map((q, i) => (
                      <li key={q.question_id} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="text-gray-400 font-medium w-4 text-right">{i + 1}.</span>
                        <span className="truncate">{q.title}</span>
                      </li>
                    ))}
                    {assessment.questions.length > 3 && (
                      <li className="text-xs text-gray-400 pl-6">
                        +{assessment.questions.length - 3} more
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={() => handleStartAssessment(assessment)}
                    className="mt-auto w-full py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold transition shadow-sm"
                  >
                    Start Test
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
