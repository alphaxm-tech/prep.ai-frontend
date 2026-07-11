"use client";

import { useParams } from "next/navigation";
import QuizPage from "@/components/Quiz";

export default function QuizTestPage() {
  const params = useParams();

  // Attempt Id
  const id = Number(params.id as string);

  return <QuizPage title={`Mock Test ${id}`} attemptId={id} />;
}

// we will call the following apis in QuizPage on load
// 1. GetQuizSession
// 2. GetQuestion
