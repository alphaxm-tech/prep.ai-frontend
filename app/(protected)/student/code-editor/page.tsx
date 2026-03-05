"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Difficulty = "Easy" | "Medium" | "Hard";

type Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  acceptance: string;
};

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "56.9%",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    acceptance: "47.7%",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    acceptance: "38.3%",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    acceptance: "45.7%",
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack"],
    acceptance: "41.5%",
  },
  {
    id: 6,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers"],
    acceptance: "54.2%",
  },
  {
    id: 7,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Stack", "Two Pointers"],
    acceptance: "59.3%",
  },
  {
    id: 8,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "56.9%",
  },
  {
    id: 9,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    acceptance: "47.7%",
  },
  {
    id: 9,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    acceptance: "38.3%",
  },
  {
    id: 10,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    acceptance: "45.7%",
  },
  {
    id: 11,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack"],
    acceptance: "41.5%",
  },
  {
    id: 12,
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers"],
    acceptance: "54.2%",
  },
  {
    id: 13,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Stack", "Two Pointers"],
    acceptance: "59.3%",
  },
];

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

  const filteredProblems = PROBLEMS.filter((p) => {
    if (difficultyFilter !== "All" && p.difficulty !== difficultyFilter)
      return false;
    if (category !== "All" && !p.tags.includes(category)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Coding Problems
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Practice interview-style problems and track your progress
          </p>
        </div>

        {/* Stats (Quiz-style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Solved" value="23" color="green" />
          <StatCard title="Accuracy" value="74%" color="blue" />
          <StatCard title="Total Time" value="16h" color="purple" />
          <StatCard title="Current Streak" value="6 days" color="orange" />
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level as any)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition
                ${
                  difficultyFilter === level
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Category Pills (Quiz-style) */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  category === cat
                    ? "bg-yellow-400 text-gray-900 shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[70px_1fr_160px_120px] px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50/70">
            <div>#</div>
            <div>Problem</div>
            <div>Difficulty</div>
            <div>Acceptance</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100/60">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => router.push(`/problems/${problem.id}`)}
                className="
                  group grid grid-cols-[70px_1fr_160px_120px]
                  px-6 py-4 items-center
                  text-sm cursor-pointer
                  transition-all duration-200
                  hover:bg-gray-50/70 hover:-translate-y-[1px]
                "
              >
                <div className="text-gray-400 font-medium">{problem.id}</div>

                <div>
                  <div className="font-semibold text-gray-900 group-hover:underline">
                    {problem.title}
                  </div>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className={`
                      inline-flex px-3 py-1 rounded-full text-xs font-bold
                      ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <div className="text-gray-500 font-semibold">
                  {problem.acceptance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small helper ---------- */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "green" | "blue" | "purple" | "orange";
}) {
  return (
    <div
      className={`rounded-2xl p-6 bg-${color}-50 text-${color}-700 shadow-sm`}
    >
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-sm font-medium mt-1">{title}</div>
    </div>
  );
}
