"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QuizModal, { Question } from "../../../../components/QuizModal";

export default function QuizTestPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState<{
    score: number;
    total: number;
  } | null>(null);

  /**
   * Real JavaScript questions (Demo-ready)
   */
  const QUESTIONS = useMemo<Question[]>(
    () => [
      {
        id: "q1",
        text: "What is the output of `typeof null` in JavaScript?",
        options: [
          { id: "q1-a", text: "null" },
          { id: "q1-b", text: "object" },
          { id: "q1-c", text: "undefined" },
          { id: "q1-d", text: "number" },
        ],
        correctOptionId: "q1-b",
      },
      {
        id: "q2",
        text: "Which keyword is used to declare a constant in JavaScript?",
        options: [
          { id: "q2-a", text: "var" },
          { id: "q2-b", text: "let" },
          { id: "q2-c", text: "const" },
          { id: "q2-d", text: "static" },
        ],
        correctOptionId: "q2-c",
      },
      {
        id: "q3",
        text: "What does `===` operator do?",
        options: [
          { id: "q3-a", text: "Compares value only" },
          { id: "q3-b", text: "Compares type only" },
          { id: "q3-c", text: "Compares value and type" },
          { id: "q3-d", text: "Assignment" },
        ],
        correctOptionId: "q3-c",
      },
      {
        id: "q4",
        text: "Which method converts JSON string into a JavaScript object?",
        options: [
          { id: "q4-a", text: "JSON.stringify()" },
          { id: "q4-b", text: "JSON.parse()" },
          { id: "q4-c", text: "JSON.object()" },
          { id: "q4-d", text: "JSON.convert()" },
        ],
        correctOptionId: "q4-b",
      },
      {
        id: "q5",
        text: "What will `Boolean([])` return?",
        options: [
          { id: "q5-a", text: "false" },
          { id: "q5-b", text: "true" },
          { id: "q5-c", text: "undefined" },
          { id: "q5-d", text: "null" },
        ],
        correctOptionId: "q5-b",
      },
      {
        id: "q6",
        text: "Which of the following is NOT a primitive type?",
        options: [
          { id: "q6-a", text: "string" },
          { id: "q6-b", text: "number" },
          { id: "q6-c", text: "object" },
          { id: "q6-d", text: "boolean" },
        ],
        correctOptionId: "q6-c",
      },
      {
        id: "q7",
        text: "What is the scope of variables declared with `let`?",
        options: [
          { id: "q7-a", text: "Function scope" },
          { id: "q7-b", text: "Block scope" },
          { id: "q7-c", text: "Global scope only" },
          { id: "q7-d", text: "Module scope only" },
        ],
        correctOptionId: "q7-b",
      },
      {
        id: "q8",
        text: "Which array method creates a new array with filtered values?",
        options: [
          { id: "q8-a", text: "map()" },
          { id: "q8-b", text: "filter()" },
          { id: "q8-c", text: "reduce()" },
          { id: "q8-d", text: "forEach()" },
        ],
        correctOptionId: "q8-b",
      },
      {
        id: "q9",
        text: "What is a closure in JavaScript?",
        options: [
          { id: "q9-a", text: "A function inside another function" },
          {
            id: "q9-b",
            text: "A function that remembers its lexical scope",
          },
          { id: "q9-c", text: "A block of code" },
          { id: "q9-d", text: "An object reference" },
        ],
        correctOptionId: "q9-b",
      },
      {
        id: "q10",
        text: "Which statement is true about `var`?",
        options: [
          { id: "q10-a", text: "Block scoped" },
          { id: "q10-b", text: "Function scoped" },
          { id: "q10-c", text: "Cannot be redeclared" },
          { id: "q10-d", text: "Immutable" },
        ],
        correctOptionId: "q10-b",
      },
    ],
    []
  );

  /**
   * Compute score
   */
  const calculateScore = (answers: Record<string, string>) => {
    let score = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) score++;
    });
    return score;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/quiz")}
          className="
      inline-flex items-center gap-2 mb-10
      text-sm font-semibold text-yellow-800
      bg-yellow-100/70 hover:bg-yellow-200
      px-4 py-2 rounded-full
      shadow-sm hover:shadow-md
      transition-all
    "
        >
          <span className="text-lg leading-none">←</span>
          Back to Quizzes
        </button>

        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
            JavaScript Fundamentals
            <span className="block text-yellow-600 text-lg font-semibold mt-1">
              Demo Test
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl">
            Answer all questions and submit to instantly evaluate your
            JavaScript fundamentals.
          </p>
        </div>

        {/* RESULT */}
        {result && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white to-yellow-50 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Your Score
                </h2>
                <p className="text-gray-500 mt-1">
                  Based on your quiz performance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-4xl font-extrabold text-yellow-600">
                  {result.score}
                </div>
                <div className="text-gray-400 text-lg font-semibold">
                  / {result.total}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-base text-gray-700 font-medium">
                {result.score >= 8
                  ? "Excellent! Strong JavaScript fundamentals 🚀"
                  : result.score >= 5
                  ? "Good attempt! Keep improving 👍"
                  : "Needs more practice 💪"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ MODAL (portal-controlled, no wrapper) */}
      <QuizModal
        isOpen={open}
        questions={QUESTIONS}
        durationMinutes={20}
        title="JavaScript Fundamentals"
        onClose={() => setOpen(false)}
        onSubmit={(answers: Record<string, string>) => {
          const score = calculateScore(answers);
          setResult({ score, total: QUESTIONS.length });
          setOpen(false);
        }}
      />
    </main>
  );
}
