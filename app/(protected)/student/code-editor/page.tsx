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
      (takenAssessments?.assessments.length ?? 0) +
      (untakenAssessments?.assessments.length ?? 0);
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

  return (
    <>
      <Loader show={isLoading} />
      <div className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Coding Assessments
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Timed coding tests — solve all questions before the clock runs out
            </p>
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

          {/* PROGRESS + FILTER BAR */}
          <div className="max-w-6xl mx-auto mb-8">
            <div
              className="
              flex flex-col lg:flex-row
              lg:items-center lg:justify-between
              gap-6
              bg-white/70 backdrop-blur-md
              border border-white/40
              rounded-2xl
              px-6 py-4
              shadow-sm
            "
            >
              {/* LEFT SIDE — Filters */}
              <div className="flex flex-wrap gap-3">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      difficultyFilter === level
                        ? "bg-yellow-400 text-yellow-900 shadow-md"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              {filteredQuizzes?.map((quiz) => (
                <AssessmentRow
                  quiz={quiz}
                  index={quiz.assessment_id}
                  onStartQuiz={handleStartCodingTest}
                ></AssessmentRow>
              ))}
            </section>

            <aside className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl sticky top-24 h-fit max-h-[650px] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Your Progress
              </h3>

              {takenAssessments?.assessments?.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No quizzes attempted yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {takenAssessments?.assessments?.map((quiz) => (
                    <CompactAssessmentRow quiz={quiz}></CompactAssessmentRow>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
