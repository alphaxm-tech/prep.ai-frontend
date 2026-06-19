"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCodingQuestions } from "@/utils/queries/code-editor.queries";
import { useToast } from "@/components/toast/ToastContext";
import Loader from "@/components/Loader";
import { Assessment } from "@/utils/api/types/code-editor.types";
import { StatCard } from "@/components/StatCard";

import { useGetAllAssessments } from "@/utils/queries/assessment.queries";
import {
  ASSESSMENT_TYPES,
  AssessmentResponse,
} from "@/utils/api/types/assessment.types";
import AssessmentRow from "@/components/AssessmentRow";
import CompactAssessmentRow from "@/components/CompactAssessmentRow";

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
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [totalQuizzes, setTotalQuizzes] = useState<any>();

  const {
    data: codingQuestionData,
    isLoading,
    isError,
  } = useGetCodingQuestions();

  const { data: untakenAssessments, isLoading: isUntakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.CODING,
      hasTaken: false,
      pageNo: 1,
      count: 10,
    });

  const { data: takenAssessments, isLoading: isTakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.CODING,
      hasTaken: true,
      pageNo: 1,
      count: 10,
    });

  const assessments: Assessment[] =
    codingQuestionData?.response?.assessments ?? [];

  useEffect(() => {
    let totalAssessments =
      (takenAssessments?.assessments?.length ?? 0) +
      (untakenAssessments?.assessments?.length ?? 0);
    setTotalQuizzes(totalAssessments);
  }, [takenAssessments, untakenAssessments]);

  useEffect(() => {
    if (!isLoading && isError) {
      showToast("error", "Failed to load assessments. Please try again.");
    } else if (
      !isLoading &&
      !isError &&
      assessments.length === 0 &&
      codingQuestionData
    ) {
      showToast(
        "info",
        "No coding assessments are available for you right now.",
      );
    }
  }, [isLoading, isError, codingQuestionData]);

  const handleStartCodingTest = (assessment: AssessmentResponse) => {
    console.log("Test", assessment);
    const slug = slugify(assessment.title);
    router.push(`/student/code-editor/${slug}/${assessment.assessment_id}`);
  };

  const { takenQuizzes, notTakenQuizzes } = useMemo(() => {
    const assessments = untakenAssessments?.assessments || [];
    return {
      takenQuizzes: assessments.filter((q) => q.has_taken),
      notTakenQuizzes: assessments.filter((q) => !q.has_taken),
    };
  }, [untakenAssessments]);

  const filteredQuizzes =
    difficultyFilter === "ALL"
      ? notTakenQuizzes
      : notTakenQuizzes.filter((q) => q.difficulty === difficultyFilter);

  const total = untakenAssessments?.assessments?.length || 0;
  const completed = takenAssessments?.assessments?.length as number;
  const completionPercent = total ? Math.round((completed! / total) * 100) : 0;

  const loadingMessageMain = useMemo(() => {
    if (isUntakenLoading || isTakenLoading) return "Loading tests..";
    if (isError) return "";
  }, [isUntakenLoading, isError]);

  const getDifficultyStyles = (level: string, active: boolean) => {
    if (active) {
      switch (level) {
        case "EASY":
          return "bg-green-500/10 text-green-700 border border-green-200 shadow-sm";

        case "MEDIUM":
          return "bg-yellow-500/10 text-yellow-700 border border-yellow-200 shadow-sm";

        case "HARD":
          return "bg-red-500/10 text-red-700 border border-red-200 shadow-sm";

        default:
          return "bg-slate-900 text-white border border-slate-900 shadow-sm";
      }
    }

    return `
    bg-white/70
    backdrop-blur-sm
    border border-gray-200
    text-gray-600
    hover:bg-gray-50
    hover:border-gray-300
  `;
  };

  return (
    <>
      <Loader
        show={isLoading || isUntakenLoading || isTakenLoading}
        message={loadingMessageMain}
      />
      <div className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Coding Assessments
              </h1>

              <p className="text-lg text-gray-600 mt-1">
                Timed coding tests, solve all questions before the clock runs
                out
              </p>
            </div>

            <div className="flex items-center rounded-xl bg-gray-100 p-1">
              <button
                className="
        px-4 py-2
        rounded-lg
        text-sm font-medium
        bg-white
        text-gray-900
        shadow-sm
      "
              >
                Coding Tests
              </button>

              <button
                className="
        px-4 py-2
        rounded-lg
        text-sm font-medium
        text-gray-600
        hover:text-gray-900
      "
              >
                Question Bank
              </button>
            </div>
          </div>

          {/* 🔥 STAT CARDS BACK AGAIN */}
          <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              label="Total Quizzes"
              value={totalQuizzes}
              variant="blue"
            />
            <StatCard label="Quizzes Taken" value={0} variant="green" />
            <StatCard label="Best Score" value={"92%"} variant="yellow" />
            <StatCard label="Avg Score" value={"78%"} variant="purple" />
          </section>
          {!isLoading && assessments.length === 0 && (
            <div className="py-20 text-center text-gray-500 text-sm">
              No assessments available right now.
            </div>
          )}

          {/* Filters */}
          <div
            className="
    flex items-center justify-between
    bg-white/70
    backdrop-blur-xl
    border border-white/60
    rounded-xl
    px-5 py-3
    my-6
    shadow-[0_4px_20px_rgba(0,0,0,0.04)]
  "
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span className="text-sm font-medium text-gray-500">
                  Difficulty
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => {
                  const active = difficultyFilter === level;

                  const styles = active
                    ? level === "EASY"
                      ? "bg-green-500/10 text-green-700 border border-green-200 shadow-sm"
                      : level === "MEDIUM"
                        ? "bg-yellow-500/10 text-yellow-700 border border-yellow-200 shadow-sm"
                        : level === "HARD"
                          ? "bg-red-500/10 text-red-700 border border-red-200 shadow-sm"
                          : "bg-slate-900 text-white border border-slate-900 shadow-sm"
                    : `
              bg-white/70
              backdrop-blur-sm
              border border-gray-200
              text-gray-600
              hover:bg-gray-50
              hover:border-gray-300
            `;

                  return (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      className={`
              px-3 py-1.5
              rounded-2xl
              text-sm
              font-medium
              transition-all
              duration-200
              hover:scale-[1.02]
              ${styles}
            `}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-5 w-px bg-gray-300 mr-1" />

              <span className="text-sm font-semibold text-gray-700">
                {filteredQuizzes.length}
              </span>

              <span className="text-sm text-gray-500">
                {filteredQuizzes.length === 1
                  ? "active quiz"
                  : "active quizzes"}
              </span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              {filteredQuizzes?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <span className="text-xl">🔍</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    No assessments found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
                    No coding assessments match the selected difficulty filter.
                  </p>
                </div>
              )}
              {filteredQuizzes?.map((quiz) => (
                <AssessmentRow
                  quiz={quiz}
                  index={quiz.assessment_id}
                  onStartQuiz={handleStartCodingTest}
                ></AssessmentRow>
              ))}
            </section>

            <aside className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl sticky top-24 h-fit max-h-[650px] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm">
                    📈
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Your Progress
                    </h3>

                    <p className="text-sm text-gray-500">
                      {takenAssessments?.assessments?.length || 0} completed
                      assessments
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {takenAssessments?.assessments?.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🚀</div>

                    <p className="text-sm text-gray-500">
                      No quizzes attempted yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {takenAssessments?.assessments?.map((quiz) => (
                      <CompactAssessmentRow quiz={quiz} />
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
