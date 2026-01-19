"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizModal, { Question } from "../../../../components/QuizModal";

// ✅ IMPORT REAL QUESTION BANK
import {
  infosysQuestions,
  tcsQuestions,
  wiproQuestions,
  accentureQuestions,
} from "../questionBank";

/**
 * Convert QuestionBank question → QuizModal question
 * (minimal & deterministic, no randomness)
 */
function mapToQuizModalQuestions(
  questions: {
    id: number;
    question: string;
    answer: string | number;
    options?: string[];
    correctOptionIndex?: number;
  }[],
  prefix: string,
): Question[] {
  return questions.map((q) => {
    const id = `${prefix}-q${q.id}`;

    // CASE 1: options already exist in questionBank
    if (q.options && typeof q.correctOptionIndex === "number") {
      return {
        id,
        text: q.question,
        options: q.options.map((opt, idx) => ({
          id: `${id}-${idx}`,
          text: opt,
        })),
        correctOptionId: `${id}-${q.correctOptionIndex}`,
      };
    }

    // CASE 2: no options → generate numeric options
    const base =
      typeof q.answer === "number" ? q.answer : Number(q.answer) || 10;

    const generatedOptions = [base, base + 1, base - 1, base + 2];

    return {
      id,
      text: q.question,
      options: generatedOptions.map((opt, idx) => ({
        id: `${id}-${idx}`,
        text: String(opt),
      })),
      correctOptionId: `${id}-0`, // first one is always correct
    };
  });
}

export default function QuizTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const company = searchParams.get("company") || "Quiz";

  const [open, setOpen] = useState(true);
  const [result, setResult] = useState<{
    score: number;
    total: number;
  } | null>(null);

  /**
   * ✅ Company-wise REAL questions
   */
  const QUESTIONS = useMemo<Question[]>(() => {
    if (company.includes("TCS"))
      return mapToQuizModalQuestions(tcsQuestions, "TCS");

    if (company.includes("Infosys"))
      return mapToQuizModalQuestions(infosysQuestions, "Infosys");

    if (company.includes("Wipro"))
      return mapToQuizModalQuestions(wiproQuestions, "Wipro");

    if (company.includes("Accenture"))
      return mapToQuizModalQuestions(accentureQuestions, "Accenture");

    return [];
  }, [company]);

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

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
            {company}
            <span className="block text-yellow-600 text-lg font-semibold mt-1">
              Mock Test
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl">
            25 questions · 25 minutes · Company-style assessment
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
                {result.score >= 18
                  ? "Excellent performance 🚀"
                  : result.score >= 12
                    ? "Good attempt 👍"
                    : "Needs more practice 💪"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* QUIZ MODAL */}
      <QuizModal
        isOpen={open}
        questions={QUESTIONS}
        durationMinutes={25}
        title={company}
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
