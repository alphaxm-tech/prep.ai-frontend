"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/StatCard";

import { useGetAllAssessments } from "@/server-api/queries/assessment.queries";
import { useGetCodeEditorStats } from "@/server-api/queries/code-editor.queries";
import {
  ASSESSMENT_TYPES,
  AssessmentResponse,
} from "@/server-api/api/types/assessment.types";
import AssessmentRow from "@/components/AssessmentRow";
import CodeEditorProgressRow from "@/components/CodeEditorProgressRow";
import EmptyStateCard from "@/components/EmptyStateCard";
import { CODE_EDITOR_INSTRUCTIONS, CODE_EDITOR_ROUTE } from "@/constants/ui-routes";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Cap on how many assessments each list query pulls back. There's no
// pagination UI on this page, so this is a practical ceiling rather than
// real pagination — the stats cards above (tests_assigned/tests_taken) come
// from a dedicated backend aggregate and are correct regardless of this cap.
const LIST_PAGE_SIZE = 50;

function formatScore(score: number | null | undefined) {
  if (score === null || score === undefined) return "—";
  return `${Math.round(score)}%`;
}

export default function CodeEditorListPage() {
  const router = useRouter();
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  const { data: statsResponse } = useGetCodeEditorStats();
  const stats = statsResponse?.data;

  const { data: untakenAssessments, isLoading: isUntakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.CODING,
      hasTaken: false,
      pageNo: 1,
      count: LIST_PAGE_SIZE,
    });

  const { data: takenAssessments, isLoading: isTakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.CODING,
      hasTaken: true,
      pageNo: 1,
      count: LIST_PAGE_SIZE,
    });

  const handleStartCodingTest = (assessment: AssessmentResponse) => {
    const slug = slugify(assessment.title);
    router.push(
      `${CODE_EDITOR_ROUTE}${CODE_EDITOR_INSTRUCTIONS}/${assessment.assessment_id}?title=${encodeURIComponent(
        assessment.title,
      )}&total_questions=${assessment.total_questions}&duration_sec=${assessment.duration_sec}`,
    );
  };

  const notTakenTests = untakenAssessments?.assessments ?? [];

  const filteredTests =
    difficultyFilter === "ALL"
      ? notTakenTests
      : notTakenTests.filter((q) => q.difficulty === difficultyFilter);

  const loadingMessageMain = useMemo(() => {
    if (isUntakenLoading || isTakenLoading) return "Loading tests..";
  }, [isUntakenLoading, isTakenLoading]);

  return (
    <>
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

              {/* Question Bank is out of scope for now — hover tooltip only,
                  no navigation, nothing built out behind it. */}
              <div className="relative group">
                <button
                  className="
        px-4 py-2
        rounded-lg
        text-sm font-medium
        text-gray-600
        hover:text-gray-900
        cursor-not-allowed
      "
                >
                  Question Bank
                </button>
                <div className="pointer-events-none absolute right-0 top-full mt-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
                  Work in progress
                </div>
              </div>
            </div>
          </div>

          {/* STAT CARDS — real data from GET /code-editor/stats */}
          <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              label="Tests Assigned"
              value={stats?.tests_assigned ?? "—"}
              variant="blue"
            />
            <StatCard
              label="Tests Taken"
              value={stats?.tests_taken ?? "—"}
              variant="green"
            />
            <StatCard
              label="Best Score"
              value={formatScore(stats?.best_score)}
              variant="yellow"
            />
            <StatCard
              label="Avg Score"
              value={formatScore(stats?.average_score)}
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
              px-4 py-2
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
                {loadingMessageMain ?? `${filteredTests.length} tests found`}
              </p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              {!isUntakenLoading && filteredTests.length === 0 && (
                <EmptyStateCard
                  title="No assessments found"
                  subtitle="No coding assessments match the selected difficulty filter."
                />
              )}
              {filteredTests.map((test) => (
                <AssessmentRow
                  key={test.assessment_id}
                  quiz={test}
                  index={test.assessment_id}
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
                      No tests attempted yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {takenAssessments?.assessments?.map((test) => (
                      <CodeEditorProgressRow
                        key={test.assessment_id}
                        quiz={test}
                      />
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
