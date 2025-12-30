"use client";

import React, { useEffect, useMemo, useState } from "react";

export type Option = { id: string; text: string };
export type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId?: string;
};

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  durationMinutes?: number;
  title?: string;
  onSubmit?: (
    answers: Record<string, string>,
    score?: { correct: number; total: number; percent: number }
  ) => void;
};

export default function QuizModal({
  isOpen,
  onClose,
  questions,
  durationMinutes = 20,
  title = "Quiz",
  onSubmit,
}: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setTimeLeft(durationMinutes * 60);
      setIsRunning(true);
      setShowSummary(false);
    } else {
      setIsRunning(false);
    }
  }, [isOpen, durationMinutes]);

  useEffect(() => {
    if (!isOpen || !isRunning) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = window.setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, timeLeft, isOpen]);

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] && answers[q.id] === q.correctOptionId) correct++;
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
      "0"
    )}`;

  const selectOption = (qid: string, oid: string) =>
    setAnswers((p) => ({ ...p, [qid]: oid }));

  const handleSubmit = () => {
    setIsRunning(false);
    setShowSummary(true);
    onSubmit?.(answers, score);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-yellow-50 to-white border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">
              {questions.length} questions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-yellow-100 text-sm font-semibold">
              ⏱ {fmt(timeLeft)}
            </div>

            <button
              onClick={() => setIsRunning((s) => !s)}
              className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
            >
              {isRunning ? "Pause" : "Resume"}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8">
          {/* Question Area */}
          <div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-yellow-400"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                {questions[currentIndex]?.text}
              </h3>

              <div className="space-y-3">
                {questions[currentIndex]?.options.map((opt) => {
                  const selected =
                    answers[questions[currentIndex].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        selectOption(questions[currentIndex].id, opt.id)
                      }
                      className={`w-full text-left px-4 py-3 rounded-xl border transition
                        ${
                          selected
                            ? "bg-yellow-50 border-yellow-400 shadow-sm"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }
                      `}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1)
                    )
                  }
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border p-4">
              <div className="text-sm text-gray-500 mb-3">Navigator</div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`p-2 rounded-lg text-xs font-medium
                      ${
                        i === currentIndex
                          ? "bg-yellow-400 text-white"
                          : answers[questions[i].id]
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-4">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {Object.keys(answers).length} / {questions.length}
              </div>
              <div className="mt-2 text-sm text-gray-500">Score preview</div>
              <div className="text-3xl font-extrabold text-yellow-600">
                {score.percent}%
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              Submit Quiz
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
