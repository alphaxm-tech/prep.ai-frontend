"use client";

import { useParams } from "next/navigation";
import QuizPage, { Question } from "@/components/Quiz";
import {
  infosysQuestions,
  tcsQuestions,
  wiproQuestions,
  accentureQuestions,
} from "@/app/(protected)/student/quiz/questionBank";

function mapToQuizQuestions(
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

export default function QuizTestPage() {
  const params = useParams();
  const id = params.id as string;

  let questions: Question[] = [];

  if (id === "1") questions = mapToQuizQuestions(tcsQuestions, "TCS");

  if (id === "2") questions = mapToQuizQuestions(infosysQuestions, "Infosys");

  if (id === "3") questions = mapToQuizQuestions(wiproQuestions, "Wipro");

  if (id === "4")
    questions = mapToQuizQuestions(accentureQuestions, "Accenture");

  return (
    <QuizPage
      questions={questions}
      title={`Mock Test ${id}`}
      durationMinutes={25}
    />
  );
}
