"use client";

import { useParams } from "next/navigation";
import QuizPage, { Question } from "@/components/Quiz";

export default function QuizTestPage() {
  const params = useParams();

  // Attempt Id
  const id = Number(params.id as string);

  return (
    <QuizPage title={`Mock Test ${id}`} durationMinutes={25} attemptId={id} />
  );
}

// we will call the following apis in QuizPage on load
// 1. GetQuizSession
// 2. GetQuestion
