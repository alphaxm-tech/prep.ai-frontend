// components/QuizModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

export type Option = { id: string; text: string };
export type Question = {
  id: string;
  text: string;
  options: Option[]; // expects length = 4 (but will render any length)
  correctOptionId?: string; // optional, used for client-side scoring preview
};

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[]; // supply 20 questions (or any count)
  durationMinutes?: number; // default 20
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

  // initialize/reset when opened/closed
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setTimeLeft(durationMinutes * 60);
      setIsRunning(true);
      setShowSummary(false);
    } else {
      // Pause timer when closed
      setIsRunning(false);
    }
  }, [isOpen, durationMinutes]);

  // timer effect
  useEffect(() => {
    if (!isOpen) return;
    if (!isRunning) return;
    if (timeLeft <= 0) {
      // auto-submit on timeout
      handleSubmit();
      return;
    }
    const t = window.setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, timeLeft, isOpen]);

  // Score calculation (client-side preview)
  const score = useMemo(() => {
    if (!questions || questions.length === 0)
      return { total: 0, correct: 0, percent: 0 };
    let correct = 0;
    for (const q of questions) {
      const chosen = answers[q.id];
      if (chosen && q.correctOptionId && chosen === q.correctOptionId)
        correct++;
    }
    const total = questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, percent };
  }, [questions, answers]);

  // format mm:ss
  const fmt = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // select option
  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const gotoQuestion = (idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    setCurrentIndex(idx);
  };

  const handleSubmit = () => {
    setIsRunning(false);
    setShowSummary(true);
    if (onSubmit) {
      onSubmit(answers, score);
    }
  };

  const handleClose = () => {
    // if quiz is running, confirm with user (you can change behaviour)
    if (isRunning && !showSummary) {
      const ok = confirm(
        "Are you sure you want to close? Your progress will be lost."
      );
      if (!ok) return;
    }
    setIsRunning(false);
    setShowSummary(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-500">
              {questions.length} questions
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-md bg-gray-100 text-sm font-medium">
              Time left:{" "}
              <span className="font-semibold ml-2">{fmt(timeLeft)}</span>
            </div>

            <button
              onClick={() => setIsRunning((s) => !s)}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
              aria-pressed={!isRunning ? "false" : "true"}
            >
              {isRunning ? "Pause" : "Resume"}
            </button>

            <button
              onClick={handleClose}
              className="px-3 py-2 rounded-md bg-gray-100 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
          {/* left: question */}
          <div>
            {/* progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(
                    ((currentIndex + 1) / Math.max(1, questions.length)) * 100
                  )}
                  %
                </div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-yellow-400"
                  style={{
                    width: `${
                      ((currentIndex + 1) / Math.max(1, questions.length)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* question card */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="text-lg font-semibold text-gray-800 mb-3">
                {questions[currentIndex]?.text}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentIndex]?.options?.map((opt) => {
                  const selected =
                    answers[questions[currentIndex].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        selectOption(questions[currentIndex].id, opt.id)
                      }
                      className={`text-left w-full p-3 rounded-md border flex items-center justify-between focus:outline-none focus:ring-2 ${
                        selected
                          ? "bg-yellow-50 border-yellow-300 ring-yellow-200"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                      }`}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            selected
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {opt.text.charAt(0)}
                        </div>
                        <div className="text-sm text-gray-800">{opt.text}</div>
                      </div>

                      <div className="text-xs text-gray-400">
                        {selected ? "Selected" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => gotoQuestion(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => gotoQuestion(currentIndex + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className="px-3 py-2 rounded-md bg-gray-100 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right: navigator + progress summary */}
          <aside>
            <div className="bg-white rounded-xl p-4 border sticky top-6">
              <div className="text-sm text-gray-600 mb-3">Navigator</div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((qq, idx) => {
                  const answered = !!answers[qq.id];
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={qq.id}
                      onClick={() => gotoQuestion(idx)}
                      className={`p-2 rounded-md text-xs ${
                        isCurrent
                          ? "bg-yellow-400 text-white"
                          : answered
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                      aria-current={isCurrent ? "true" : undefined}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t pt-3">
                <div className="text-sm text-gray-600">Quick actions</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setAnswers({})}
                    className="flex-1 px-3 py-2 rounded-md bg-gray-100 text-sm"
                  >
                    Clear answers
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-3 py-2 rounded-md bg-yellow-400 text-sm text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="mt-2 text-lg font-semibold text-gray-800">
                {Object.keys(answers).length} / {questions.length} answered
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Score preview (client-side):
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600">
                {score.percent}%
              </div>
            </div>
          </aside>
        </div>

        {/* summary overlay after submit */}
        {showSummary && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[28rem] shadow-xl">
              <h3 className="text-xl font-semibold">Quiz Results</h3>
              <p className="text-sm text-gray-500 mt-2">
                Your score below is computed client-side if the quiz contains
                `correctOptionId` for each question.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xs text-gray-500">Correct</div>
                  <div className="text-2xl font-bold text-green-600">
                    {score.correct}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-2xl font-bold">{score.total}</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-4xl font-extrabold text-amber-600">
                  {score.percent}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Well done — review your answers or retry the quiz.
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowSummary(false);
                  }}
                  className="px-3 py-2 rounded-md bg-gray-100"
                >
                  Close summary
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowSummary(false);
                      setIsRunning(false);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-md bg-gray-100"
                  >
                    Back to list
                  </button>

                  <button
                    onClick={() => {
                      setShowSummary(false);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-md bg-blue-600 text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
