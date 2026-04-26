"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { StatCard } from "@/components/StatCard";
import { Funnel } from "lucide-react";
import { useGetCodingQuestions } from "@/utils/queries/code-editor.queries";
import Loader from "@/components/Loader";

type Difficulty = "Easy" | "Medium" | "Hard";

type Problem = {
  question_id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  acceptance: string;
};

const CATEGORIES = [
  "All",
  "Array",
  "String",
  "Linked List",
  "Stack",
  "DP",
  "Graph",
];

export default function ProblemsPage() {
  const router = useRouter();
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>(
    "All",
  );
  const [category, setCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const {
    data: codingQuestionData,
    isLoading: codingQuestionLoading,
    isError,
    error,
    refetch,
  } = useGetCodingQuestions();

  const allQuestions =
    codingQuestionData?.response?.assessments?.flatMap(
      (assessment: any) => assessment.questions,
    ) || [];

  console.log(allQuestions);

  const CATEGORIES = ["Arrays", "Graphs", "DP", "Strings"];

  // Temporary static counts (replace with dynamic later)
  const CATEGORY_COUNT: Record<string, number> = {
    Arrays: 120,
    Graphs: 45,
    DP: 32,
    Strings: 28,
  };

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function handleProblemClick(problem: Problem) {
    const slug = slugify(problem.title);
    router.push(`/student/code-editor/${slug}/${problem.question_id}`);
  }

  return (
    <>
      <Loader show={codingQuestionLoading} />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Coding Problems
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Practice interview-style problems and track your progress
            </p>
          </div>

          {/* Stats (Quiz-style) */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard label="Solved" value="23" variant="blue" />
            <StatCard label="Accuracy" value="74%" variant="green" />
            <StatCard label="Total Time" value="16h" variant="yellow" />
            <StatCard label="Current Streak" value="6 days" variant="purple" />
          </div> */}

          {/* CATEGORY / TOPICS CONTAINER */}
          <div className="mb-4 px-4 py-3 rounded-lg border border-gray-200/70 bg-white/50 backdrop-blur-md shadow-sm">
            {/* 🔹 HEADER */}
            <div className="flex items-center justify-between mb-3">
              {/* LEFT: Title */}
              <h2 className="text-s font-semibold tracking-wide text-gray-600 uppercase">
                Topics
              </h2>

              {/* RIGHT: Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200/70 bg-white/60 hover:bg-gray-100/70 transition text-s font-medium text-gray-600"
                >
                  <Funnel size={14} />
                  <span>
                    {difficultyFilter !== "All" ? difficultyFilter : "Filter"}
                  </span>
                </button>

                {showFilter && (
                  <div className="absolute right-0 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-md p-1.5 z-10">
                    {["All", "Easy", "Medium", "Hard"].map((level) => {
                      const isActive = difficultyFilter === level;

                      return (
                        <button
                          key={level}
                          onClick={() => {
                            setDifficultyFilter(level as any);
                            setShowFilter(false);
                          }}
                          className={`
                  w-full text-left px-2.5 py-1.5 rounded-md text-s transition
                  ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 🔹 TOPICS */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const count = CATEGORY_COUNT[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`
            flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
            border transition-all duration-150

            ${
              isActive
                ? "bg-yellow-400/90 text-gray-900 border-yellow-400 shadow-sm"
                : "bg-white/60 text-gray-600 border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 hover:text-gray-900"
            }
          `}
                  >
                    <span>{cat}</span>

                    {/* COUNT */}
                    <span
                      className={`
              text-[10px] px-1.5 py-[1px] rounded-full
              ${
                isActive
                  ? "bg-yellow-200 text-gray-900"
                  : "bg-gray-100 text-gray-500"
              }
            `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Problems List */}
          <div className="bg-white rounded-xl border border-gray-200/70 shadow-sm overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-[60px_1fr_140px_110px] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50/70">
              {/* <div>#</div> */}
              <div>Problem</div>
              <div>Difficulty</div>
              <div>Acceptance</div>
            </div>

            {/* Rows */}
            <div>
              {allQuestions.map((problem, index) => (
                <div
                  key={problem.id}
                  onClick={() => handleProblemClick(problem)}
                  className={`
                          group grid grid-cols-[60px_1fr_140px_110px]
                          px-5 py-3 items-center
                          text-sm cursor-pointer
                          transition-all duration-150

                          ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                          hover:bg-gray-100/60
                        `}
                >
                  {/* ID */}
                  <div className="text-gray-400 text-xs font-medium">
                    {problem.id}
                  </div>

                  {/* Problem Title + Tags */}
                  <div>
                    <div className="font-semibold text-[14px] text-gray-900 group-hover:underline">
                      {problem.title}
                    </div>

                    {/* <div className="flex gap-1.5 mt-1 flex-wrap">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-[1px] rounded-md bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div> */}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <span
                      className={`
              inline-flex px-2.5 py-[3px] rounded-full text-[11px] font-semibold
              ${
                problem.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : problem.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }
            `}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Acceptance */}
                  <div className="text-gray-500 text-xs font-semibold">
                    {problem.acceptance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
