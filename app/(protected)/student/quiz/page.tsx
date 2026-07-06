"use client";

import React, { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/provider";
import { useGetAllAssessments } from "@/utils/queries/assessment.queries";
import Loader from "@/components/Loader";
import { QUIZ_ROUTE, QUIZ_TEST } from "@/utils/CONSTANTS";
import { createQuizAssessment } from "@/utils/mutations/quiz.mutation";
import {
  ASSESSMENT_TYPES,
  AssessmentResponse,
} from "@/utils/api/types/assessment.types";
import WorkInProgressBanner from "@/components/WorkInProgressBanner";
import { StatCard } from "../../../../components/StatCard";
import QuizPage from "@/components/Quiz";
import AssessmentRow from "@/components/AssessmentRow";
import CompactAssessmentRow from "@/components/CompactAssessmentRow";
export default function Quiz() {
  const router = useRouter();
  const userDetailsMain = useContext(AuthContext);

  const { data: untakenAssessments, isLoading: isUntakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.MCQ,
      hasTaken: false,
      pageNo: 1,
      count: 10,
    });

  const { data: takenAssessments, isLoading: isTakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.MCQ,
      hasTaken: true,
      pageNo: 1,
      count: 10,
    });

  console.log(takenAssessments?.assessments);

  const startQuizMutation = createQuizAssessment();
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  const handleStartQuiz = (quiz: AssessmentResponse) => {
    startQuizMutation.mutate(quiz.assessment_id, {
      onSuccess: (data) => {
        const attemptId = data.attempt.AttemptID;
        router.push(`${QUIZ_ROUTE}${QUIZ_TEST}/${attemptId}`);
      },
    });
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
      {/* <WorkInProgressBanner /> */}
      <Loader
        show={isUntakenLoading || startQuizMutation.isPending || isTakenLoading}
      />

      <div className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Quizzes
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Sharpen your skills. Track your growth.
            </p>
          </div>

          {/* <button className="bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 px-6 py-3 text-yellow-900 font-semibold rounded-xl shadow-md hover:shadow-lg">
            🏆 Leaderboard
          </button> */}
        </div>

        {/* 🔥 STAT CARDS BACK AGAIN */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard label="Total Quizzes" value={total} variant="blue" />
          <StatCard
            label="Quizzes Taken"
            value={completed ? completed : 0}
            variant="green"
          />
          <StatCard label="Best Score" value={"92%"} variant="yellow" />
          <StatCard label="Avg Score" value={"78%"} variant="purple" />
        </section>

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
              {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => {
                const active = difficultyFilter === level;

                const colors = {
                  ALL: active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700",
                  EASY: active
                    ? "bg-green-500 text-white"
                    : "bg-green-50 text-green-700",
                  MEDIUM: active
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-50 text-yellow-700",
                  HARD: active
                    ? "bg-red-500 text-white"
                    : "bg-red-50 text-red-700",
                };

                return (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`
          px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-200
          hover:scale-105
          ${colors[level as keyof typeof colors]}
        `}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              {filteredQuizzes.length} quizzes found
            </p>
          </div>
        </div>
        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE — EXPLORE */}
          <section className="lg:col-span-2 space-y-6">
            {filteredQuizzes?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl">
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
            ) : (
              filteredQuizzes.map((quiz) => (
                <AssessmentRow
                  quiz={quiz}
                  index={quiz.assessment_id}
                  onStartQuiz={handleStartQuiz}
                ></AssessmentRow>
              ))
            )}
          </section>

          {/* RIGHT SIDE — GLASS PANEL */}
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
    </>
  );
}
