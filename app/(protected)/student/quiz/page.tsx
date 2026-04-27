"use client";

import React, { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/provider";
import { useGetAllAssessments } from "@/utils/queries/assessment.queries";
import Loader from "@/components/Loader";
import { QUIZ_ROUTE, QUIZ_TEST } from "@/utils/CONSTANTS";
import { createQuizAssessment } from "@/utils/mutations/quiz.mutation";
import { AssessmentResponse } from "@/utils/api/types/assessment.types";
import WorkInProgressBanner from "@/components/WorkInProgressBanner";
import { StatCard } from "../../../../components/StatCard";
import QuizPage from "@/components/Quiz";
import QuizRow from "@/components/QuizRow";
import CompactQuizRow from "@/components/CompactQuizRow";

export default function Quiz() {
  const router = useRouter();
  const userDetailsMain = useContext(AuthContext);

  const { data: assessmentData, isLoading } = useGetAllAssessments({
    assessmentType: "MCQ",
  });

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
    const assessments = assessmentData?.assessments || [];
    return {
      takenQuizzes: assessments.filter((q) => q.has_taken),
      notTakenQuizzes: assessments.filter((q) => !q.has_taken),
    };
  }, [assessmentData]);

  const filteredQuizzes =
    difficultyFilter === "ALL"
      ? notTakenQuizzes
      : notTakenQuizzes.filter((q) => q.difficulty === difficultyFilter);

  const total = assessmentData?.assessments?.length || 0;
  const completed = takenQuizzes.length;
  const completionPercent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <WorkInProgressBanner />
      <Loader show={isLoading || startQuizMutation.isPending} />

      <div className="min-h-screen  px-4 md:px-8 py-10">
        {/* HEADER */}
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Quizzes
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Sharpen your skills. Track your growth.
            </p>
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 px-6 py-3 text-yellow-900 font-semibold rounded-xl shadow-md hover:shadow-lg">
            🏆 Leaderboard
          </button>
        </div>

        {/* 🔥 STAT CARDS BACK AGAIN */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard label="Total Quizzes" value={total} variant="blue" />
          <StatCard label="Quizzes Taken" value={completed} variant="green" />
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
          {/* LEFT SIDE — EXPLORE */}
          <section className="lg:col-span-2 space-y-6">
            {filteredQuizzes.map((quiz) => (
              <QuizRow
                quiz={quiz}
                index={quiz.assessment_id}
                onStartQuiz={handleStartQuiz}
              ></QuizRow>
            ))}
          </section>

          {/* RIGHT SIDE — GLASS PANEL */}
          <aside className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl sticky top-24 h-fit max-h-[650px] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Your Progress
            </h3>

            {takenQuizzes.length === 0 ? (
              <p className="text-sm text-gray-500">No quizzes attempted yet.</p>
            ) : (
              <div className="space-y-5">
                {takenQuizzes.map((quiz) => (
                  <CompactQuizRow quiz={quiz}></CompactQuizRow>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
