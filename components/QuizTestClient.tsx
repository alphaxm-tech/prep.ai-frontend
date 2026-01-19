"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizModal, { Question } from "@/components/QuizModal";

import {
  infosysQuestions,
  tcsQuestions,
  wiproQuestions,
  accentureQuestions,
} from "@/app/(auth)/quiz/questionBank";

/**
 * Convert QuestionBank question → QuizModal question
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
      correctOptionId: `${id}-0`,
    };
  });
}

export default function QuizTestClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const company = searchParams.get("company") || "Quiz";

  const [open, setOpen] = useState(true);
  const [result, setResult] = useState<{
    score: number;
    total: number;
  } | null>(null);

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
        <button
          onClick={() => router.push("/quiz")}
          className="mb-10 px-4 py-2 rounded-full bg-yellow-100"
        >
          ← Back to Quizzes
        </button>

        <h1 className="text-4xl font-bold">{company} Mock Test</h1>

        {result && (
          <div className="mt-6">
            Score: {result.score} / {result.total}
          </div>
        )}
      </div>

      <QuizModal
        isOpen={open}
        questions={QUESTIONS}
        durationMinutes={25}
        title={company}
        onClose={() => setOpen(false)}
        onSubmit={(answers) => {
          const score = calculateScore(answers);
          setResult({ score, total: QUESTIONS.length });
          setOpen(false);
        }}
      />
    </main>
  );
}
