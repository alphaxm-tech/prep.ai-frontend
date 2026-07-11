"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/provider";
import { useGetAllAssessments } from "@/utils/queries/assessment.queries";
import { useGetQuizStats } from "@/utils/queries/quiz.queries";
import Loader from "@/components/Loader";
import { QUIZ_ROUTE, QUIZ_TEST } from "@/utils/CONSTANTS";
import { createQuizAssessment } from "@/utils/mutations/quiz.mutation";
import {
  ASSESSMENT_TYPES,
  AssessmentResponse,
} from "@/utils/api/types/assessment.types";
import WorkInProgressBanner from "@/components/WorkInProgressBanner";
import { StatCard } from "../../../../components/StatCard";
import AssessmentRow from "@/components/AssessmentRow";
import CompactAssessmentRow from "@/components/CompactAssessmentRow";
import Pagination from "@/components/Pagination";

const DEFAULT_PAGE_SIZE = 10;

export default function Quiz() {
  const router = useRouter();
  const userDetailsMain = useContext(AuthContext);

  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  const [notTakenPage, setNotTakenPage] = useState(1);
  const [notTakenPageSize, setNotTakenPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [takenPage, setTakenPage] = useState(1);
  const [takenPageSize, setTakenPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: untakenAssessments, isLoading: isUntakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.MCQ,
      hasTaken: false,
      pageNo: notTakenPage,
      count: notTakenPageSize,
      difficulty: difficultyFilter,
    });

  const { data: takenAssessments, isLoading: isTakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.MCQ,
      hasTaken: true,
      pageNo: takenPage,
      count: takenPageSize,
    });

  const { data: quizStats } = useGetQuizStats();

  const startQuizMutation = createQuizAssessment();

  const handleStartQuiz = (quiz: AssessmentResponse) => {
    startQuizMutation.mutate(quiz.assessment_id, {
      onSuccess: (data) => {
        const attemptId = data.attempt.AttemptID;
        router.push(`${QUIZ_ROUTE}${QUIZ_TEST}/${attemptId}`);
      },
    });
  };

  const handleDifficultyChange = (level: string) => {
    setDifficultyFilter(level);
    setNotTakenPage(1);
  };

  const notTakenQuizzes = untakenAssessments?.assessments || [];
  const takenQuizzes = takenAssessments?.assessments || [];

  const notTakenTotal =
    untakenAssessments?.total_count ?? notTakenQuizzes.length;
  const takenTotal = takenAssessments?.total_count ?? takenQuizzes.length;
  const totalQuizzes = notTakenTotal + takenTotal;

  const formatScore = (value?: number | null) =>
    value === null || value === undefined ? "—" : `${Math.round(value)}%`;

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
        </div>

        {/* STAT CARDS */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard label="Total Quizzes" value={totalQuizzes} variant="blue" />
          <StatCard label="Quizzes Taken" value={takenTotal} variant="green" />
          <StatCard
            label="Best Score"
            value={formatScore(quizStats?.best_score)}
            variant="yellow"
          />
          <StatCard
            label="Avg Score"
            value={formatScore(quizStats?.average_score)}
            variant="purple"
          />
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
                    onClick={() => handleDifficultyChange(level)}
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
              {notTakenTotal} quizzes found
            </p>
          </div>
        </div>
        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE — EXPLORE */}
          <section className="lg:col-span-2 space-y-6">
            {notTakenQuizzes.length === 0 ? (
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
              <>
                {notTakenQuizzes.map((quiz) => (
                  <AssessmentRow
                    key={quiz.assessment_id}
                    quiz={quiz}
                    index={quiz.assessment_id}
                    onStartQuiz={handleStartQuiz}
                  ></AssessmentRow>
                ))}
                <Pagination
                  page={notTakenPage}
                  pageSize={notTakenPageSize}
                  totalCount={notTakenTotal}
                  onPageChange={setNotTakenPage}
                  onPageSizeChange={(size) => {
                    setNotTakenPageSize(size);
                    setNotTakenPage(1);
                  }}
                />
              </>
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
                    {takenTotal} completed assessments
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {takenQuizzes.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🚀</div>

                  <p className="text-sm text-gray-500">
                    No quizzes attempted yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {takenQuizzes.map((quiz) => (
                    <CompactAssessmentRow
                      key={quiz.assessment_id}
                      quiz={quiz}
                    />
                  ))}
                  <Pagination
                    page={takenPage}
                    pageSize={takenPageSize}
                    totalCount={takenTotal}
                    onPageChange={setTakenPage}
                    onPageSizeChange={(size) => {
                      setTakenPageSize(size);
                      setTakenPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
