"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { codeEditorService } from "@/utils/services/code-editor.service";
import {
  AssessmentSessionQuestion,
  ExecutionResult,
  ExecutionStatus,
  QuestionStatus,
} from "@/utils/api/types/code-editor.types";
import { useToast } from "@/components/toast/ToastContext";
import Loader from "@/components/Loader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OutputState =
  | { phase: "idle" }
  | { phase: "running"; mode: "run" | "submit" }
  | {
      phase: "done";
      mode: "run" | "submit";
      status: ExecutionStatus;
      result: ExecutionResult;
      score?: number;
    }
  | { phase: "error"; message: string };

interface QuestionDetail {
  question_id: number;
  title: string;
  question_text: string;
  difficulty: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  languages_allowed: string[];
  starter_code: Record<string, string>;
  test_cases: { test_case_id: number; input_data: string; expected_output: string }[];
}

// ---------------------------------------------------------------------------
// Status config for sidebar badges
// ---------------------------------------------------------------------------

const Q_STATUS: Record<
  QuestionStatus,
  { label: string; bgClass: string; textClass: string; isSpinner: boolean; symbol: string }
> = {
  not_started:       { label: "Not Started",   bgClass: "bg-gray-100",   textClass: "text-gray-500",   isSpinner: false, symbol: "○" },
  pending:           { label: "Evaluating",     bgClass: "bg-yellow-50",  textClass: "text-yellow-600", isSpinner: true,  symbol: "" },
  running:           { label: "Running",        bgClass: "bg-yellow-50",  textClass: "text-yellow-600", isSpinner: true,  symbol: "" },
  accepted:          { label: "Accepted",       bgClass: "bg-green-50",   textClass: "text-green-700",  isSpinner: false, symbol: "✓" },
  wrong_answer:      { label: "Wrong Answer",   bgClass: "bg-red-50",     textClass: "text-red-700",    isSpinner: false, symbol: "✗" },
  runtime_error:     { label: "Runtime Error",  bgClass: "bg-red-50",     textClass: "text-red-700",    isSpinner: false, symbol: "✗" },
  tle:               { label: "TLE",            bgClass: "bg-orange-50",  textClass: "text-orange-700", isSpinner: false, symbol: "✗" },
  compilation_error: { label: "Compile Error",  bgClass: "bg-red-50",     textClass: "text-red-700",    isSpinner: false, symbol: "✗" },
};

const EXECUTION_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: string }
> = {
  Accepted:           { label: "Accepted",              className: "text-green-700 bg-green-100",  icon: "✅" },
  "Wrong Answer":     { label: "Wrong Answer",          className: "text-red-700 bg-red-100",      icon: "❌" },
  "Runtime Error":    { label: "Runtime Error",         className: "text-red-700 bg-red-100",      icon: "❌" },
  TLE:                { label: "Time Limit Exceeded",   className: "text-orange-700 bg-orange-100",icon: "⏱" },
  "Compilation Error":{ label: "Compilation Error",     className: "text-red-700 bg-red-100",      icon: "❌" },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

const MAX_POLL_RETRIES = 60;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AssessmentTestPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const assessmentId = Number(params.id);
  const urlTitle = decodeURIComponent(params.title as string).replace(/-/g, " ");

  // Session
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionQuestions, setSessionQuestions] = useState<AssessmentSessionQuestion[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState(urlTitle);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // Selected question
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null);
  const [questionDetailLoading, setQuestionDetailLoading] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);

  // Per-question code persistence: { [questionId]: { [language]: code } }
  const codePerQuestionRef = useRef<Record<number, Record<string, string>>>({});
  const editorStateRef = useRef<{ code: string; language: string }>({
    code: "",
    language: "javascript",
  });
  const [effectiveStarterCode, setEffectiveStarterCode] = useState<
    Record<string, string> | undefined
  >(undefined);

  // Output panel
  const [outputState, setOutputState] = useState<OutputState>({ phase: "idle" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  // Description tab
  const [activeTab, setActiveTab] = useState("Description");

  // Finalize modal
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  useEffect(() => {
    startSession();
    return () => clearPolling();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      );
      setTimeLeft(Math.max(0, remaining));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // Update effective starter code whenever question or selection changes
  useEffect(() => {
    if (!questionDetail || selectedQuestionId === null) return;
    const saved = codePerQuestionRef.current[selectedQuestionId] ?? {};
    setEffectiveStarterCode({ ...questionDetail.starter_code, ...saved });
  }, [questionDetail, selectedQuestionId]);

  // ---------------------------------------------------------------------------
  // Session start
  // ---------------------------------------------------------------------------

  async function startSession() {
    setSessionLoading(true);
    try {
      const res = await codeEditorService.startAssessment(assessmentId);
      const { expires_at, questions, assessment_title } = res.data;
      setExpiresAt(expires_at);
      setSessionQuestions(questions);
      if (assessment_title) setAssessmentTitle(assessment_title);
      if (questions.length > 0) {
        await loadQuestion(questions[0].question_id);
      }
    } catch {
      showToast("error", "Failed to start assessment. Please refresh and try again.");
    } finally {
      setSessionLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Question loading
  // ---------------------------------------------------------------------------

  async function loadQuestion(qId: number) {
    if (qId === selectedQuestionId) return;
    setSelectedQuestionId(qId);
    setActiveTab("Description");
    setOutputState({ phase: "idle" });
    clearPolling();
    setQuestionDetailLoading(true);
    try {
      const res = await codeEditorService.getCodingQuestionDetails(qId);
      setQuestionDetail(res.question as QuestionDetail);
    } catch {
      showToast("error", "Failed to load question. Please try again.");
    } finally {
      setQuestionDetailLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Polling helpers
  // ---------------------------------------------------------------------------

  function clearPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollCountRef.current = 0;
  }

  // ---------------------------------------------------------------------------
  // Run
  // ---------------------------------------------------------------------------

  async function handleRun() {
    if (!selectedQuestionId) return;
    const { code, language } = editorStateRef.current;
    clearPolling();
    setOutputState({ phase: "running", mode: "run" });

    try {
      const res = await codeEditorService.runCode(selectedQuestionId, {
        language,
        source_code: code,
      });
      const jobId = res.data.job_id;

      pollRef.current = setInterval(async () => {
        pollCountRef.current++;
        if (pollCountRef.current >= MAX_POLL_RETRIES) {
          clearPolling();
          setOutputState({
            phase: "error",
            message: "Evaluation taking longer than expected. Please try again.",
          });
          return;
        }
        try {
          const poll = await codeEditorService.getRunJob(jobId);
          const { status, execution_result } = poll.data;
          if (status !== "pending" && status !== "running") {
            clearPolling();
            setOutputState({
              phase: "done",
              mode: "run",
              status,
              result: execution_result!,
            });
          }
        } catch {
          clearPolling();
          setOutputState({ phase: "error", message: "Failed to poll run job." });
        }
      }, 2000);
    } catch (err: any) {
      setOutputState({
        phase: "error",
        message: err?.response?.data?.error ?? "Failed to run code.",
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Submit question
  // ---------------------------------------------------------------------------

  async function handleSubmitQuestion() {
    if (!selectedQuestionId) return;
    const { code, language } = editorStateRef.current;
    clearPolling();
    setOutputState({ phase: "running", mode: "submit" });

    try {
      const res = await codeEditorService.submitCode(selectedQuestionId, {
        language,
        source_code: code,
      });
      const submissionId = res.submission.submission_id;

      pollRef.current = setInterval(async () => {
        pollCountRef.current++;
        if (pollCountRef.current >= MAX_POLL_RETRIES) {
          clearPolling();
          setOutputState({
            phase: "error",
            message: "Evaluation taking longer than expected. Please try again.",
          });
          return;
        }
        try {
          const poll = await codeEditorService.getSubmission(submissionId);
          const { status, execution_result, score_awarded } = poll.data;
          if (status !== "pending" && status !== "running") {
            clearPolling();
            setOutputState({
              phase: "done",
              mode: "submit",
              status,
              result: execution_result!,
              score: score_awarded,
            });
            refreshSidebarStatuses();
          }
        } catch {
          clearPolling();
          setOutputState({ phase: "error", message: "Failed to poll submission." });
        }
      }, 2000);
    } catch (err: any) {
      setOutputState({
        phase: "error",
        message: err?.response?.data?.error ?? "Failed to submit question.",
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Sidebar refresh
  // ---------------------------------------------------------------------------

  async function refreshSidebarStatuses() {
    try {
      const res = await codeEditorService.getAssessmentQuestions(assessmentId);
      setSessionQuestions(res.data.questions);
    } catch {
      // non-critical — sidebar stays stale, user can still submit
    }
  }

  // ---------------------------------------------------------------------------
  // Finalize test
  // ---------------------------------------------------------------------------

  async function handleFinalizeTest() {
    setFinalizing(true);
    try {
      await codeEditorService.finalizeAssessment(assessmentId);
      setShowFinalizeModal(false);
      router.push(`/student/code-editor/${params.title}/${assessmentId}/result`);
    } catch (err: any) {
      showToast(
        "error",
        err?.response?.data?.error ?? "Failed to finalize test. Please try again.",
      );
    } finally {
      setFinalizing(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Timer helpers
  // ---------------------------------------------------------------------------

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  const isTimeCritical = timeLeft <= 60 && timeLeft > 0;
  const isTimeUp = expiresAt !== null && timeLeft === 0;
  const isRunning = outputState.phase === "running";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <Loader show={sessionLoading} />

      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* ─── TOP BAR ─────────────────────────────────────────────────── */}
        <div className="h-14 flex-shrink-0 flex items-center justify-between px-5 bg-white border-b border-gray-200/70">
          {/* Assessment title */}
          <h1 className="text-sm font-semibold text-gray-800 truncate max-w-xs capitalize">
            {assessmentTitle}
          </h1>

          {/* Timer */}
          {expiresAt && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tabular-nums ${
                isTimeUp
                  ? "bg-red-100 text-red-700"
                  : isTimeCritical
                  ? "bg-orange-100 text-orange-700 animate-pulse"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span>⏱</span>
              <span>{isTimeUp ? "Time's up" : formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Submit Complete Test */}
          <button
            onClick={() => setShowFinalizeModal(true)}
            disabled={sessionLoading || isTimeUp}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-gray-900 text-white hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Complete Test
          </button>
        </div>

        {/* ─── MAIN ────────────────────────────────────────────────────── */}
        {!sessionLoading && (
          <div className="flex flex-1 overflow-hidden">
            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <div className="w-[220px] flex-shrink-0 border-r border-gray-200/70 bg-white flex flex-col overflow-y-auto">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Questions
                </p>
              </div>

              {sessionQuestions.map((q, i) => {
                const cfg = Q_STATUS[q.status] ?? Q_STATUS.not_started;
                const isSelected = selectedQuestionId === q.question_id;

                return (
                  <button
                    key={q.question_id}
                    onClick={() => loadQuestion(q.question_id)}
                    className={`w-full text-left px-3 py-3 border-b border-gray-100 transition ${
                      isSelected
                        ? "bg-yellow-50 border-l-2 border-l-yellow-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-800 leading-tight">
                      {i + 1}. {q.title}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between gap-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${cfg.bgClass} ${cfg.textClass}`}
                      >
                        {cfg.isSpinner ? (
                          <span className="animate-spin w-2.5 h-2.5 border border-current border-t-transparent rounded-full inline-block" />
                        ) : (
                          <span>{cfg.symbol}</span>
                        )}
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {q.marks}pts
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── DESCRIPTION PANEL ───────────────────────────────────── */}
            <div className="w-[42%] flex-shrink-0 border-r border-gray-200/70 bg-white flex flex-col overflow-hidden">
              {/* Tab bar */}
              <div className="h-10 flex items-center px-5 bg-gray-50/70 gap-5 border-b border-gray-200/70 flex-shrink-0">
                {["Description", "Editorial", "Solutions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`h-full flex items-center text-xs font-medium border-b-2 transition ${
                      activeTab === tab
                        ? "text-gray-900 border-yellow-400"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-gray-700 leading-relaxed">
                {questionDetailLoading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full inline-block" />
                    <span>Loading question...</span>
                  </div>
                )}

                {!questionDetailLoading && !questionDetail && (
                  <p className="text-gray-400">Select a question from the sidebar.</p>
                )}

                {!questionDetailLoading && questionDetail && activeTab === "Description" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-gray-900">
                        {questionDetail.title}
                      </h2>
                      {questionDetail.difficulty && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${
                            DIFFICULTY_STYLES[questionDetail.difficulty] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {questionDetail.difficulty}
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-line">{questionDetail.question_text}</p>

                    {questionDetail.test_cases?.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 text-sm">Examples:</h3>
                        {questionDetail.test_cases.map((tc) => (
                          <div
                            key={tc.test_case_id}
                            className="bg-gray-50 px-4 py-3 rounded-lg text-xs font-mono space-y-1"
                          >
                            <div>
                              <span className="font-semibold">Input:</span>{" "}
                              {tc.input_data}
                            </div>
                            <div>
                              <span className="font-semibold">Output:</span>{" "}
                              {tc.expected_output}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {questionDetail.time_limit_ms && (
                      <p className="text-xs text-gray-400">
                        Time limit: {questionDetail.time_limit_ms}ms &middot; Memory:{" "}
                        {questionDetail.memory_limit_mb}MB
                      </p>
                    )}
                  </div>
                )}

                {!questionDetailLoading && activeTab === "Editorial" && (
                  <p className="text-gray-400">Editorial coming soon...</p>
                )}
                {!questionDetailLoading && activeTab === "Solutions" && (
                  <p className="text-gray-400">Solutions coming soon...</p>
                )}
              </div>
            </div>

            {/* ── EDITOR PANEL ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Action buttons row */}
              <div className="h-10 flex-shrink-0 flex items-center justify-end gap-2 px-4 bg-gray-50/70 border-b border-gray-200/70">
                <button
                  disabled={isRunning || !selectedQuestionId || isTimeUp}
                  onClick={handleRun}
                  className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning && outputState.mode === "run" ? "Running..." : "Run"}
                </button>

                <button
                  disabled={isRunning || !selectedQuestionId || isTimeUp}
                  onClick={handleSubmitQuestion}
                  className="px-4 py-1.5 text-xs font-semibold rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning && outputState.mode === "submit"
                    ? "Submitting..."
                    : "Submit Question"}
                </button>
              </div>

              {/* Monaco editor */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  key={selectedQuestionId ?? "none"}
                  starterCode={effectiveStarterCode}
                  allowedLanguages={questionDetail?.languages_allowed}
                  onCodeChange={(code, language) => {
                    editorStateRef.current = { code, language };
                    if (selectedQuestionId !== null) {
                      if (!codePerQuestionRef.current[selectedQuestionId]) {
                        codePerQuestionRef.current[selectedQuestionId] = {};
                      }
                      codePerQuestionRef.current[selectedQuestionId][language] = code;
                    }
                  }}
                />
              </div>

              {/* Output panel */}
              <div className="h-40 flex-shrink-0 border-t border-gray-200/70 bg-gray-50 text-xs px-4 py-3 overflow-y-auto">
                {outputState.phase === "idle" && (
                  <span className="text-gray-400">
                    Test results will appear here after you run or submit.
                  </span>
                )}

                {outputState.phase === "running" && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full" />
                    <span>
                      {outputState.mode === "run"
                        ? "Running your code..."
                        : "Submitting question..."}
                    </span>
                  </div>
                )}

                {outputState.phase === "error" && (
                  <span className="text-red-500">{outputState.message}</span>
                )}

                {outputState.phase === "done" &&
                  (() => {
                    const { status, result, mode, score } = outputState;
                    const cfg = EXECUTION_STATUS_CONFIG[status] ?? {
                      label: status,
                      className: "text-gray-700 bg-gray-100",
                      icon: "ℹ️",
                    };
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] ${cfg.className}`}
                          >
                            {cfg.icon} {cfg.label}
                          </span>

                          {result && (
                            <span className="text-gray-500">
                              {result.test_cases_passed} / {result.total_test_cases} test
                              cases passed
                            </span>
                          )}

                          {result?.execution_time_ms !== undefined && (
                            <span className="text-gray-400">
                              Ran in {result.execution_time_ms}ms
                            </span>
                          )}

                          {mode === "submit" && score !== undefined && (
                            <span className="text-yellow-600 font-semibold">
                              +{score} pts
                            </span>
                          )}
                        </div>

                        {result?.output && (
                          <div>
                            <span className="font-semibold text-gray-600">Output: </span>
                            <span className="font-mono text-gray-700 whitespace-pre-wrap">
                              {result.output}
                            </span>
                          </div>
                        )}

                        {result?.error && (
                          <div>
                            <span className="font-semibold text-red-500">Error: </span>
                            <span className="font-mono text-red-600 whitespace-pre-wrap">
                              {result.error}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        )}

        {/* ─── FINALIZE MODAL ──────────────────────────────────────────── */}
        {showFinalizeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
              <h2 className="text-base font-semibold text-gray-900">Submit Complete Test?</h2>
              <p className="text-sm text-gray-600 mt-2">
                You cannot change your answers after submission. Make sure you have
                submitted all the questions you want graded.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowFinalizeModal(false)}
                  disabled={finalizing}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeTest}
                  disabled={finalizing}
                  className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {finalizing ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
