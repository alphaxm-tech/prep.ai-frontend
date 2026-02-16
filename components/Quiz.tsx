"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type Option = { id: string; text: string };

export type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId?: string;
};

type QuizPageProps = {
  questions?: Question[];
  durationMinutes?: number;
  title?: string;
};

export default function QuizPage({
  questions = [],
  durationMinutes = 20,
  title = "Quiz",
}: QuizPageProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const t = window.setInterval(() => {
      setTimeLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [isRunning, timeLeft]);

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });

    const total = questions.length;

    return {
      total,
      correct,
      percent: total ? Math.round((correct / total) * 100) : 0,
    };
  }, [questions, answers]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0",
    )}`;

  const selectOption = (qid: string, oid: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: oid,
    }));
  };

  const handleSubmit = () => {
    setIsRunning(false);
    setShowSummary(true);
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No questions available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
      <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {questions.length} Questions • {durationMinutes} Minutes
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-2 rounded-full bg-white/80 shadow text-lg font-semibold">
              ⏱ {fmt(timeLeft)}
            </div>

            <button
              onClick={() => setIsRunning((s) => !s)}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
            >
              {isRunning ? "Pause" : "Resume"}
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold shadow-lg"
            >
              Submit
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8 p-8">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <span className="text-sm font-medium text-gray-700">
                  Answered: {Object.keys(answers).length}
                </span>
              </div>

              <div className="text-lg font-semibold mb-6 leading-relaxed">
                {questions[currentIndex]?.text}
              </div>

              <div className="space-y-3">
                {questions[currentIndex]?.options?.map((opt) => {
                  const selected =
                    answers[questions[currentIndex].id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        selectOption(questions[currentIndex].id, opt.id)
                      }
                      className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-200 ${
                        selected
                          ? "bg-yellow-100 border-yellow-400 shadow-md"
                          : "bg-white border-gray-200 hover:shadow-md"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg bg-white border disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1),
                    )
                  }
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2 rounded-lg bg-white border disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <aside className="space-y-6">
            {/* Navigator */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Question Navigator
              </h3>

              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, i) => {
                  const attempted = !!answers[q.id];
                  const isCurrent = i === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-10 rounded-lg text-sm font-medium transition ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : attempted
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Panel */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Progress
              </h3>

              <div className="text-2xl font-bold">
                {Object.keys(answers).length} / {questions.length}
              </div>

              <div className="text-sm text-gray-600 mt-3">Current Score</div>

              <div className="text-2xl font-bold text-yellow-600">
                {score.percent}%
              </div>
            </div>

            {showSummary && (
              <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p>
                  Correct: {score.correct} / {score.total}
                </p>
                <p>Score: {score.percent}%</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
