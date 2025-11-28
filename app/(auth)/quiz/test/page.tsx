// app/quiz/test/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QuizModal, { Question } from "../../../../components/QuizModal";

export default function QuizTestPage() {
  const router = useRouter();

  // generate 20 sample questions (replace with API)
  const SAMPLE_QUESTIONS = useMemo<Question[]>(
    () =>
      Array.from({ length: 20 }).map((_, i) => {
        const qId = `q-${i + 1}`;
        const opts = [
          { id: `${qId}-a`, text: `Option A for question ${i + 1}` },
          { id: `${qId}-b`, text: `Option B for question ${i + 1}` },
          { id: `${qId}-c`, text: `Option C for question ${i + 1}` },
          { id: `${qId}-d`, text: `Option D for question ${i + 1}` },
        ];
        return {
          id: qId,
          text: `Sample question ${i + 1}: Brief, clear prompt here.`,
          options: opts,
          correctOptionId: opts[0].id,
        };
      }),
    []
  );

  const [open, setOpen] = useState(true);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/quiz")}
          className="flex items-center gap-2 text-yellow-900 bg-yellow-200 hover:bg-yellow-300 transition px-4 py-2 rounded-lg shadow mb-8"
        >
          <span className="text-xl">←</span>
          Back to Quizzes
        </button>

        <h1 className="text-3xl font-bold mb-4">Quiz — Test Page</h1>
        <p className="mb-6 text-gray-600">
          This page opens the QuizModal automatically for testing.
        </p>

        {/* Manual open button */}
        <button
          onClick={() => setOpen(true)}
          className="mb-6 px-4 py-2 bg-yellow-400 rounded-md shadow"
        >
          Open Quiz Modal
        </button>

        {/* Modal */}
        <QuizModal
          isOpen={open}
          questions={SAMPLE_QUESTIONS}
          durationMinutes={20}
          title="JavaScript Fundamentals — Demo"
          onClose={() => setOpen(false)}
          onSubmit={(answers: any, score: any) => {
            console.log("Submitted answers:", answers);
            console.log("Score:", score);
            setOpen(false);
          }}
        />
      </div>
    </main>
  );
}
