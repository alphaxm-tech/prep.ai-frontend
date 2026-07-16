"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAttemptQuestion,
  useGetQuizSession,
} from "@/server-api/queries/quiz.queries";
import {
  useAbandonAttempt,
  useMarkForReview,
  useSaveAttemptAnswer,
  useSubmitAttempt,
} from "@/server-api/mutations/quiz.mutation";
import {
  QuestionStatus,
  SubmitAttemptResponse,
} from "@/server-api/api/types/quiz.types";
import Loader from "@/components/Loader";
import QuizResultsModal from "@/components/QuizResultsModal";
import { QUIZ_ROUTE, QUIZ_TERMINATED } from "@/constants/ui-routes";

type QuizPageProps = {
  title?: string;
  attemptId: number;
};

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function statusClasses(status: QuestionStatus | undefined, isCurrent: boolean) {
  if (isCurrent) return "bg-blue-600 text-white";
  if (!status || !status.visited) return "bg-gray-100 text-gray-500";
  if (status.answered && status.marked_for_review)
    return "bg-teal-200 text-teal-900";
  if (status.marked_for_review) return "bg-purple-200 text-purple-900";
  if (status.answered) return "bg-green-200 text-green-800";
  return "bg-amber-100 text-amber-800";
}

export default function QuizPage({ title = "Quiz", attemptId }: QuizPageProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [results, setResults] = useState<SubmitAttemptResponse | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const confirmedLeaveRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const abandonedRef = useRef(false);

  const { data: quizSession, isLoading: quizSessionLoading } =
    useGetQuizSession(attemptId);

  useEffect(() => {
    if (quizSession && currentIndex === null) {
      setCurrentIndex(Math.max(1, quizSession.current_index || 1));
    }
  }, [quizSession, currentIndex]);

  const attemptFinalized =
    !!quizSession && quizSession.status !== "in_progress";

  const {
    data: questionData,
    isLoading: questionLoading,
    isFetching: questionFetching,
  } = useGetAttemptQuestion({
    AttemptID: attemptId,
    Index: currentIndex ?? 0,
  });

  const saveAnswerMutation = useSaveAttemptAnswer(attemptId);
  const markForReviewMutation = useMarkForReview(attemptId);
  const submitMutation = useSubmitAttempt(attemptId);
  const abandonMutation = useAbandonAttempt(attemptId);

  // Prefill the selected option whenever the displayed question changes.
  useEffect(() => {
    setSelectedOptionId(questionData?.question?.marked_option_id ?? null);
  }, [questionData?.question?.question_id]);

  // Server-anchored countdown: recompute remaining time from expires_at every tick.
  useEffect(() => {
    if (!quizSession?.expires_at || attemptFinalized) return;
    const expiresAt = new Date(quizSession.expires_at).getTime();

    const tick = () => {
      const remaining = Math.round((expiresAt - Date.now()) / 1000);
      setRemainingSeconds(remaining);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [quizSession?.expires_at, attemptFinalized]);

  const handleSubmit = () => {
    if (submitMutation.isPending || results) return;
    submitMutation.mutate(undefined, {
      onSuccess: (data) => {
        setResults(data);
        setShowSubmitConfirm(false);
      },
    });
  };

  // Auto-submit once the server-derived timer hits zero.
  useEffect(() => {
    if (
      remainingSeconds !== null &&
      remainingSeconds <= 0 &&
      !results &&
      !autoSubmittedRef.current &&
      !attemptFinalized
    ) {
      autoSubmittedRef.current = true;
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, results, attemptFinalized]);

  // Anti-cheating: if the student switches tabs or leaves for another
  // window/app while the quiz is actively in progress, immediately
  // terminate the attempt server-side (scored from whatever was answered
  // so far, same as a timeout) and redirect to a page explaining why.
  // Page Visibility API only — deliberately not window.blur, which also
  // fires on plenty of legitimate in-page interactions (browser chrome,
  // permission dialogs, devtools) and would cause false-positive closures.
  useEffect(() => {
    if (attemptFinalized || results || terminating) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) return;
      if (abandonedRef.current) return;
      abandonedRef.current = true;
      setTerminating(true);

      const goToTerminatedPage = () => {
        const params = quizSession?.title
          ? `?title=${encodeURIComponent(quizSession.title)}`
          : "";
        router.push(`${QUIZ_ROUTE}${QUIZ_TERMINATED}${params}`);
      };

      abandonMutation.mutate(undefined, {
        onSuccess: goToTerminatedPage,
        // Even if the server call fails (e.g. the attempt had already been
        // finalized by a timeout that raced with the tab switch), still
        // pull the student out of the live quiz UI rather than leaving it
        // interactive in a hidden tab.
        onError: goToTerminatedPage,
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptFinalized, results, terminating]);

  // Block refresh / tab close while quiz is active
  useEffect(() => {
    if (results) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [results]);

  // Block browser back button while quiz is active
  useEffect(() => {
    if (results) return;
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      if (confirmedLeaveRef.current) return;
      window.history.pushState(null, "", window.location.href);
      setShowLeaveWarning(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [results]);

  const confirmLeave = () => {
    confirmedLeaveRef.current = true;
    setShowLeaveWarning(false);
    router.back();
  };

  const totalQuestions = quizSession?.total_questions ?? 0;

  const answeredCount = useMemo(
    () => quizSession?.question_statuses?.filter((s) => s.answered).length ?? 0,
    [quizSession?.question_statuses],
  );

  const currentStatus = useMemo(
    () => quizSession?.question_statuses?.find((s) => s.index === currentIndex),
    [quizSession?.question_statuses, currentIndex],
  );

  const selectOption = (optionId: number) => {
    if (!questionData?.question) return;
    setSelectedOptionId(optionId);
    saveAnswerMutation.mutate({
      question_id: questionData.question.question_id,
      selected_option_id: optionId,
    });
  };

  const toggleMarkForReview = () => {
    if (!questionData?.question) return;
    const nextMarked = !(currentStatus?.marked_for_review ?? false);
    markForReviewMutation.mutate({
      questionId: questionData.question.question_id,
      payload: { marked_for_review: nextMarked },
    });
  };

  const goToIndex = (index: number) => {
    if (index < 1 || index > totalQuestions) return;
    setCurrentIndex(index);
  };

  if (quizSessionLoading || currentIndex === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader show message="Loading quiz..." />
      </div>
    );
  }

  if (terminating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-500">
        <Loader show message="Closing your quiz..." />
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Quiz Submitted</h2>
          <div className="text-5xl font-bold text-yellow-600">
            {results.total > 0
              ? Math.round((Math.max(results.score, 0) / results.total) * 100)
              : 0}
            %
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mt-4">
            <div>
              <div className="text-lg font-semibold text-green-700">
                {results.correct}
              </div>
              <div>Correct</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">
                {results.wrong}
              </div>
              <div>Wrong</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-500">
                {results.unanswered}
              </div>
              <div>Unanswered</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Score: {results.score} / {results.total}
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setShowResultsModal(true)}
              className="px-6 py-2 rounded-xl bg-white border border-yellow-300 text-yellow-800 font-semibold shadow hover:bg-yellow-50"
            >
              View Full Results
            </button>
            <button
              onClick={() => router.push(QUIZ_ROUTE)}
              className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold shadow-lg"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
        {showResultsModal && (
          <QuizResultsModal
            assessmentId={quizSession?.assessment_id ?? null}
            onClose={() => setShowResultsModal(false)}
          />
        )}
      </div>
    );
  }

  if (attemptFinalized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <QuizResultsModal
          assessmentId={quizSession?.assessment_id ?? null}
          onClose={() => router.push(QUIZ_ROUTE)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
      {showLeaveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">
              Are you sure you want to leave?
            </h2>
            <p className="text-gray-600 mb-6">
              Your quiz progress may be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLeaveWarning(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Stay
              </button>
              <button
                onClick={confirmLeave}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Submit the quiz?</h2>
            <p className="text-gray-600 mb-6">
              You have answered {answeredCount} of {totalQuestions} questions.
              This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {quizSession?.title || title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {totalQuestions} Questions
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-5 py-2 rounded-full bg-white/80 shadow text-lg font-semibold ${
                remainingSeconds !== null && remainingSeconds <= 60
                  ? "text-red-600"
                  : ""
              }`}
            >
              ⏱ {formatTime(remainingSeconds ?? 0)}
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
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
                  Question {currentIndex} of {totalQuestions}
                </span>

                <span className="text-sm font-medium text-gray-700">
                  Answered: {answeredCount}
                </span>
              </div>

              {questionLoading || questionFetching || !questionData ? (
                <div className="py-16 text-center text-gray-400">
                  Loading question...
                </div>
              ) : (
                <>
                  <div className="text-lg font-semibold mb-6 leading-relaxed">
                    {questionData.question.question_text}
                  </div>

                  <div className="space-y-3">
                    {questionData.question.options.map((opt) => {
                      const selected = selectedOptionId === opt.option_id;

                      return (
                        <button
                          key={opt.option_id}
                          onClick={() => selectOption(opt.option_id)}
                          className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-200 ${
                            selected
                              ? "bg-yellow-100 border-yellow-400 shadow-md"
                              : "bg-white border-gray-200 hover:shadow-md"
                          }`}
                        >
                          {opt.option_text}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => goToIndex((currentIndex ?? 1) - 1)}
                  disabled={currentIndex === 1}
                  className="px-4 py-2 rounded-lg bg-white border disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={toggleMarkForReview}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    currentStatus?.marked_for_review
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {currentStatus?.marked_for_review
                    ? "Unmark Review"
                    : "Mark for Review"}
                </button>

                <button
                  onClick={() => goToIndex((currentIndex ?? 1) + 1)}
                  disabled={currentIndex === totalQuestions}
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
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                  (index) => {
                    const status = quizSession?.question_statuses?.find(
                      (s) => s.index === index,
                    );
                    const isCurrent = index === currentIndex;

                    return (
                      <button
                        key={index}
                        onClick={() => goToIndex(index)}
                        className={`h-10 rounded-lg text-sm font-medium transition ${statusClasses(status, isCurrent)}`}
                      >
                        {index}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  Not visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                  Visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                  Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-300" />
                  Marked
                </span>
              </div>
            </div>

            {/* Progress Panel */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Progress
              </h3>

              <div className="text-2xl font-bold">
                {answeredCount} / {totalQuestions}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
