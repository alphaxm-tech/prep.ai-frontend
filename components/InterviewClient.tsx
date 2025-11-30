"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "@/components/QuestionCard";

import {
  PlayIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  MicrophoneIcon,
  PauseCircleIcon,
  CheckCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

/**
 * InterviewClient + Recorder with Whisper transcription upload + evaluation
 *
 * Notes:
 * - When a recording completes, it uploads the blob to /api/transcribe as `file`.
 * - The server route forwards to OpenAI (whisper) and returns { text }.
 * - Evaluation happens via /api/evaluate after the interview ends.
 *
 * Changes in this file (minimal, preserves existing flow):
 * - Adds a live camera preview (asks user to enable camera when the interview starts).
 * - Displays a small "robot interviewer" window in the top-right.
 * - Adds a persistent bottom bar that shows the current question text and quick controls
 *   (read aloud toggle, mute, etc.).
 * - Keeps the original recording/transcription/evaluation flow intact.
 */

type Q = {
  id: number;
  text: string;
  note?: string;
  suggestedTimeSec?: number;
};

const QUESTIONS_MAP: Record<string, Q[]> = {
  Google: [
    {
      id: 1,
      text: "Tell me about yourself (30 seconds).",
      suggestedTimeSec: 30,
    },
  ],
};

const DEFAULT_QUESTIONS: Q[] = [{ id: 1, text: "Tell me about yourself." }];

function parseQueryParams(search: string) {
  try {
    const sp = new URLSearchParams(search);
    return {
      company: sp.get("company") ?? "",
      title: sp.get("title") ?? "",
    };
  } catch {
    return { company: "", title: "" };
  }
}

/* ---------------------- Recorder ---------------------- */
type RecorderProps = {
  questionId: number;
  maxSeconds?: number;
  startTrigger?: number | null;
  onComplete: (data: { blob: Blob; url: string; durationSec: number }) => void;
};

export function InterviewRecorder({
  questionId,
  maxSeconds = 45,
  startTrigger = null,
  onComplete,
}: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (startTrigger == null) return;
    (async () => {
      try {
        await startRecording();
      } catch (err: any) {
        setMediaError(String(err?.message ?? err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTrigger]);

  useEffect(() => {
    return () => {
      clearTick();
      clearStopTimeout();
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        )
          mediaRecorderRef.current.stop();
      } catch {}
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  function clearTick() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }
  function clearStopTimeout() {
    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  }

  async function startRecording() {
    if (recording) return;
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = elapsedSec;
        onComplete({ blob, url, durationSec: duration });
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
      };

      mr.start();
      setRecording(true);
      setElapsedSec(0);

      tickRef.current = window.setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);

      stopTimeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxSeconds * 1000);
    } catch (err: any) {
      setMediaError(err?.message ?? "Microphone access denied");
      throw err;
    }
  }

  function stopRecording() {
    clearTick();
    clearStopTimeout();
    if (!mediaRecorderRef.current) {
      setRecording(false);
      return;
    }
    try {
      if (mediaRecorderRef.current.state !== "inactive")
        mediaRecorderRef.current.stop();
    } catch (e) {
      console.warn("stop error", e);
    }
    setRecording(false);
  }

  const remaining = Math.max(0, maxSeconds - elapsedSec);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
            recording
              ? "bg-red-50 border border-red-200"
              : "bg-gray-50 border border-gray-100"
          }`}
        >
          <div
            className={`${
              recording
                ? "w-3 h-3 rounded-full animate-pulse bg-red-500"
                : "w-3 h-3 rounded-full bg-gray-300"
            }`}
          />
          <div className="flex flex-col">
            <div className="text-base font-semibold">
              {recording ? "Recording answer" : "Ready to record"}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {recording ? `Remaining: ${remaining}s` : `Max ${maxSeconds}s`}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!recording ? (
            <div className="text-xs text-gray-600 px-3 py-2 rounded-md border border-gray-100 bg-white">
              Waiting to start
            </div>
          ) : (
            <button
              onClick={() => stopRecording()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200"
            >
              <ClockIcon className="w-4 h-4 text-red-500" /> Stop & Next
            </button>
          )}
        </div>
      </div>

      {mediaError && (
        <div className="mt-2 text-sm text-red-600">{mediaError}</div>
      )}
    </div>
  );
}

/* ---------------------- InterviewClient ---------------------- */

export default function InterviewClient() {
  const [companyParam, setCompanyParam] = useState<string>("");
  const [titleParam, setTitleParam] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { company, title } = parseQueryParams(window.location.search || "");
    setCompanyParam(company);
    setTitleParam(title);
  }, []);

  const companyKey = useMemo(() => {
    if (!companyParam) return null;
    const k = Object.keys(QUESTIONS_MAP).find(
      (c) => c.toLowerCase() === companyParam.toLowerCase()
    );
    return k ?? null;
  }, [companyParam]);

  const interviewQuestions = useMemo<Q[]>(() => {
    if (companyKey) return QUESTIONS_MAP[companyKey];
    return DEFAULT_QUESTIONS;
  }, [companyKey]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false); // top-level start
  const [bigCountdown, setBigCountdown] = useState<number | null>(null); // big 3-2-1 overlay
  const [smallCountdown, setSmallCountdown] = useState<number | null>(null); // small 3-2-1 before answer
  const [recorderStartTrigger, setRecorderStartTrigger] = useState<
    number | null
  >(null); // send to recorder to auto-start
  const [mute, setMute] = useState(false);
  const [rate, setRate] = useState(1);

  // camera states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  // transcription states
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  // answers collection & evaluation states
  const [answers, setAnswers] = useState<
    {
      questionId: number;
      questionText: string;
      transcript: string;
      durationSec?: number;
      suggestedTimeSec?: number;
    }[]
  >([]);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluateError, setEvaluateError] = useState<string | null>(null);

  // show results modal
  const [showResultsModal, setShowResultsModal] = useState(false);

  // speech synthesis refs
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // --- NEW: auto-start interview on mount ---
  useEffect(() => {
    // start the interview flow as soon as the component mounts
    setInterviewStarted(true);
    setBigCountdown(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start camera when interview starts (non-blocking)
  useEffect(() => {
    if (!interviewStarted) return;
    // attempt to get camera without forcing the user; if it fails we show a button
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraStream(stream);
        setCameraOn(true);
        setCameraError(null);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err: any) {
        setCameraError(err?.message ?? "Camera access denied");
        setCameraOn(false);
      }
    })();
  }, [interviewStarted]);

  // cleanup camera on unmount
  useEffect(() => {
    return () => {
      try {
        cameraStream?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, [cameraStream]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = Math.max(0.6, Math.min(1.6, rate));
      utterRef.current = u;
      synthRef.current.speak(u);
    } catch (e) {
      console.warn("speech synth error", e);
    }
  };

  const stopSpeaking = () => {
    try {
      synthRef.current?.cancel();
    } catch {}
    utterRef.current = null;
  };

  const onPressStartInterview = () => {
    setInterviewStarted(true);
    setBigCountdown(3);
  };

  // big countdown effect
  useEffect(() => {
    if (bigCountdown == null) return;
    let sec = bigCountdown;
    const iv = window.setInterval(() => {
      sec -= 1;
      setBigCountdown((prev) =>
        prev == null ? null : Math.max(0, (prev ?? 0) - 1)
      );
      if (sec <= 0) {
        clearInterval(iv);
        setTimeout(() => setBigCountdown(null), 250);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [bigCountdown]);

  const total = interviewQuestions.length;
  const currentQuestion = interviewQuestions[currentIndex];

  const progress = Math.round(
    ((currentIndex + (interviewStarted ? 1 : 0)) / total) * 100
  );

  useEffect(() => {
    if (!interviewStarted) return;
    if (bigCountdown !== null) return;

    const t = setTimeout(() => {
      if (!mute) speakText(currentQuestion.text);
      setSmallCountdown(3);
    }, 200);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewStarted, bigCountdown, currentIndex, mute, rate]);

  // small countdown effect
  useEffect(() => {
    if (smallCountdown == null) return;
    let seconds = smallCountdown;
    const iv = window.setInterval(() => {
      seconds -= 1;
      setSmallCountdown((prev) =>
        prev == null ? null : Math.max(0, (prev ?? 0) - 1)
      );
      if (seconds <= 0) {
        clearInterval(iv);
        setTimeout(() => setSmallCountdown(null), 150);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [smallCountdown]);

  // when smallCountdown becomes null, start recorder
  useEffect(() => {
    if (smallCountdown !== null) return;
    if (!interviewStarted) return;
    setTimeout(() => {
      setRecorderStartTrigger(Date.now());
    }, 150);
  }, [smallCountdown, interviewStarted]);

  // --- upload helper (returns transcript) ---
  async function uploadForTranscription(blob: Blob): Promise<string> {
    setTranscribing(true);
    setTranscribeError(null);
    setTranscript(null);

    try {
      const fd = new FormData();
      fd.append("file", blob, "answer.webm");
      fd.append("questionId", String(currentQuestion.id));

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Transcription failed: ${res.status} ${text}`);
      }

      const body = await res.json();
      const text = body.text ?? "";
      setTranscript(text);
      return text;
    } catch (err: any) {
      console.error("upload/transcribe error", err);
      setTranscribeError(err?.message ?? "Unknown error");
      return "";
    } finally {
      setTranscribing(false);
    }
  }

  // frontend evaluation caller
  async function evaluateInterview(answersPayload: any[]) {
    setEvaluating(true);
    setEvaluateError(null);
    setEvaluation(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyKey ?? companyParam,
          title: titleParam,
          questions: answersPayload,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Evaluate failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      setEvaluation(json);
      // show modal when evaluation arrives
      setShowResultsModal(true);
    } catch (err: any) {
      console.error("evaluate error", err);
      setEvaluateError(err?.message ?? String(err));
      // still show modal so user can see partial/failed state
      setShowResultsModal(true);
    } finally {
      setEvaluating(false);
    }
  }

  const handleRecordingComplete = async ({
    blob,
    url,
    durationSec,
  }: {
    blob: Blob;
    url: string;
    durationSec: number;
  }) => {
    console.log("Recording finished", {
      questionId: currentQuestion.id,
      durationSec,
      blob,
      url,
    });

    stopSpeaking();

    // upload and await transcript (you now return the text)
    let text = "";
    try {
      text = await uploadForTranscription(blob);
    } catch (e) {
      // upload helper captures error
    }

    // Save the answer for later evaluation
    const newAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      transcript: text,
      durationSec,
      suggestedTimeSec: currentQuestion.suggestedTimeSec ?? 45,
    };
    setAnswers((prev) => [...prev, newAnswer]);

    // advance to next question after brief delay
    setTimeout(async () => {
      if (currentIndex < total - 1) {
        setCurrentIndex((s) => s + 1);
        setSmallCountdown(null);
        setRecorderStartTrigger(null);
        // clear previous transcript for next question
        setTranscript(null);
        setTranscribeError(null);
      } else {
        console.log("Interview complete");
        setInterviewStarted(false);
        setRecorderStartTrigger(null);

        // show the modal immediately (it will show "Evaluating..." until evaluation arrives)
        setShowResultsModal(true);

        // INTERVIEW FINISHED -> call evaluation
        try {
          // include the final answer (we already appended to state above, but setState is async)
          const answersForEval = [...answers, newAnswer];
          await evaluateInterview(answersForEval);
        } catch (e) {
          console.error("evaluation failed", e);
          // ensure modal is visible even on failure
          setShowResultsModal(true);
        }
      }
    }, 350);
  };

  const handleManualNext = () => {
    stopSpeaking();
    setSmallCountdown(null);
    setRecorderStartTrigger(null);
    if (currentIndex < total - 1) {
      setCurrentIndex((s) => s + 1);
    } else {
      setInterviewStarted(false);
      setShowResultsModal(true);
    }
  };

  useEffect(() => {
    if (mute) stopSpeaking();
  }, [mute]);

  const toggleCamera = async () => {
    if (cameraOn) {
      try {
        cameraStream?.getTracks().forEach((t) => t.stop());
      } catch {}
      setCameraStream(null);
      setCameraOn(false);
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOn(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(null);
    } catch (err: any) {
      setCameraError(err?.message ?? "Camera access denied");
      setCameraOn(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50/60 py-10 px-4 sm:px-8">
      {/* Results Modal - MODERN & CLASSY STYLING */}
      {showResultsModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center px-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-transparent backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl mx-auto">
            <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden ring-1 ring-black/5">
              {/* header */}
              <div className="flex items-center justify-between gap-4 p-5 bg-gradient-to-r from-yellow-200 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white shadow-md">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      Interview Results
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Summary & personalised feedback
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:3000/ai-interview")
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium shadow hover:brightness-105 transition"
                  >
                    Back to interviews
                  </button>
                </div>
              </div>

              {/* body */}
              <div className="p-6 grid grid-cols-1 gap-6 max-h-[68vh] overflow-auto">
                {/* ===== UPDATED TOP STATUS ROW (improved layout & wrapping) ===== */}
                <div className="w-full">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Status */}
                    <div className="col-span-2 flex items-start">
                      <div>
                        <div className="text-xs text-slate-400">Status</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                          {evaluating
                            ? "Evaluating…"
                            : evaluation
                            ? "Completed"
                            : evaluateError
                            ? "Error"
                            : "Waiting"}
                        </div>
                      </div>
                    </div>

                    {/* vertical separator */}
                    <div className="col-span-0.5 hidden sm:block">
                      <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 ml-2" />
                    </div>

                    {/* Questions */}
                    <div className="col-span-2 flex items-start">
                      <div>
                        <div className="text-xs text-slate-400">Questions</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                          {answers.length} answered
                        </div>
                      </div>
                    </div>

                    {/* Feedback (long text) */}
                    <div className="col-span-8">
                      <div className="text-xs text-slate-400 mb-1">
                        Feedback
                      </div>
                      <div
                        className="text-sm text-slate-700 dark:text-slate-300 leading-6 break-words max-w-full"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {/* prefer evaluation.overallFeedback when available, otherwise fallback to hint text */}
                        {evaluation?.overallFeedback ??
                          (evaluateError
                            ? ""
                            : "The response provided a solid overview of background and skills but could benefit from more relevance to the specific role and examples of impact.")}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ===== end updated top row ===== */}

                {/* Per-question cards */}
                <div className="grid grid-cols-1 gap-3">
                  {evaluation && evaluation.perQuestion?.length > 0 ? (
                    evaluation.perQuestion.map((pq: any) => (
                      <div
                        key={pq.questionId}
                        className="p-4 rounded-xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800 border border-gray-100 dark:border-slate-800 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                Q#{pq.questionId}
                              </div>
                              <div className="text-xs text-slate-400">
                                • {pq.shortQuestion ?? ""}
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                              {pq.summary ?? pq.excerpt ?? ""}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {pq.strengths?.length > 0 && (
                                <span className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100">
                                  Strengths: {pq.strengths.join(", ")}
                                </span>
                              )}
                              {pq.improvements?.length > 0 && (
                                <span className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                                  Improve: {pq.improvements.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {pq.score}/10
                            </div>
                            <div className="text-xs text-slate-400 mt-2">
                              {pq.category ?? ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : evaluating ? (
                    <div className="p-4 rounded-xl bg-white/60 border border-dashed border-slate-100 text-sm text-slate-500">
                      Evaluating — hang tight (this updates automatically).
                    </div>
                  ) : evaluateError ? (
                    <div className="p-4 rounded-xl bg-white/60 border border-red-100 text-sm text-red-600">
                      {evaluateError}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/60 border border-slate-100 text-sm text-slate-500">
                      No per-question results yet.
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Raw answers grid */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Your answers
                    </div>
                    <div className="text-xs text-slate-400">
                      {answers.length} total
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {answers.map((a) => (
                      <div
                        key={a.questionId}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              Q#{a.questionId} • {a.questionText}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Duration: {a.durationSec}s • Suggested:{" "}
                              {a.suggestedTimeSec}s
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">
                              Transcript
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                          {a.transcript ? (
                            a.transcript
                          ) : (
                            <span className="text-slate-400">
                              (No transcript)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {answers.length === 0 && (
                      <div className="text-sm text-slate-500">
                        No answers recorded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Big overlay countdown when starting interview */}
      {bigCountdown !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative pointer-events-auto">
            <div className="flex flex-col items-center justify-center">
              <div className="text-white text-9xl font-extrabold drop-shadow-lg transform animate-pulse">
                {bigCountdown > 0 ? bigCountdown : "Go!"}
              </div>
              <div className="mt-4 text-white text-sm text-center">
                Interview starting — get ready
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto relative">
        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-1">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  AI Interview
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  {companyKey
                    ? `${companyKey} • ${titleParam}`
                    : "Custom interview"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Camera toggle and quick controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCamera()}
                    className={`px-3 py-2 rounded-md text-sm border transition ${
                      cameraOn
                        ? "bg-white border-yellow-200 text-yellow-700"
                        : "bg-white border-gray-100 text-gray-700"
                    }`}
                  >
                    {cameraOn ? "Camera On" : "Enable Camera"}
                  </button>

                  {/* <button
                    onClick={() => setMute((s) => !s)}
                    className="px-3 py-2 rounded-md text-sm border bg-white border-gray-100"
                  >
                    {mute ? "Muted" : "Speak"}
                  </button> */}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6 relative">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      stopSpeaking();
                      currentIndex > 0 && setCurrentIndex((s) => s - 1);
                    }}
                    disabled={currentIndex === 0}
                    className={`p-2 rounded-lg border transition ${
                      currentIndex === 0
                        ? "border-gray-100 text-gray-300"
                        : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    }`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Question</div>
                    <div className="font-medium text-gray-800">
                      {currentIndex + 1} / {total}
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-4">
                  <div className="w-full bg-yellow-50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-yellow-400 shadow-sm transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-right">
                    Progress: {progress}%
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500 text-right">
                    <div>Recording status</div>
                    <div className="font-medium text-gray-700">
                      {interviewStarted ? "In Interview" : "Idle"}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6">
                <div className="relative">
                  {/* Small 3-2-1 (appears near question) */}
                  {smallCountdown !== null && (
                    <div className="absolute right-4 top-2 z-10">
                      <div className="bg-white/90 px-3 py-2 rounded-md border border-gray-100 shadow">
                        {smallCountdown > 0 ? smallCountdown : "Go"}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Camera preview column */}
                    <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
                      <div className="w-full bg-slate-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                        {cameraOn ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded-lg h-44 object-cover"
                          />
                        ) : (
                          <div className="w-full h-44 flex items-center justify-center text-sm text-gray-500">
                            Camera is off
                          </div>
                        )}
                      </div>

                      {/* small camera status */}
                      <div className="text-xs text-gray-500">
                        {cameraOn
                          ? "You are on camera"
                          : cameraError
                          ? cameraError
                          : "Camera off"}
                      </div>
                    </div>

                    {/* Question and recorder column */}
                    <div className="flex-1">
                      <QuestionCard
                        question={currentQuestion.text}
                        index={currentIndex + 1}
                        total={total}
                      />

                      <div className="mt-6">
                        <InterviewRecorder
                          questionId={currentQuestion.id}
                          maxSeconds={currentQuestion.suggestedTimeSec ?? 45}
                          startTrigger={recorderStartTrigger}
                          onComplete={handleRecordingComplete}
                        />
                      </div>

                      {/* Transcription status / output */}
                      <div className="mt-4">
                        {transcribing && (
                          <div className="text-sm text-gray-600">
                            Transcribing...
                          </div>
                        )}

                        {transcribeError && (
                          <div className="text-sm text-red-600">
                            Error: {transcribeError}
                          </div>
                        )}

                        {transcript && (
                          <div className="mt-2 bg-gray-50 border border-gray-100 rounded-md p-3 text-sm text-gray-800">
                            <div className="text-xs text-gray-500 mb-1">
                              Transcript
                            </div>
                            <div>{transcript}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Robot interviewer window - small decorative box in top-right of the interview card */}
                  <div className="absolute right-6 top-6 z-20">
                    <div className="w-32 h-20 rounded-lg bg-white/90 border border-gray-100 shadow p-2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-gradient-to-tr from-slate-700 to-slate-500 flex items-center justify-center text-white">
                        {/* simple robot icon */}
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="7"
                            width="18"
                            height="10"
                            rx="2"
                            fill="white"
                            opacity="0.06"
                          />
                          <path
                            d="M7 11.5C7 12.3284 6.32843 13 5.5 13C4.67157 13 4 12.3284 4 11.5C4 10.6716 4.67157 10 5.5 10C6.32843 10 7 10.6716 7 11.5Z"
                            fill="white"
                          />
                          <path
                            d="M20 11.5C20 12.3284 19.3284 13 18.5 13C17.6716 13 17 12.3284 17 11.5C17 10.6716 17.6716 10 18.5 10C19.3284 10 20 10.6716 20 11.5Z"
                            fill="white"
                          />
                          <rect
                            x="8"
                            y="3"
                            width="8"
                            height="2"
                            rx="1"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-semibold text-slate-700">
                          Automated interviewer
                        </div>
                        <div className="text-xs text-slate-500">
                          Listening & scoring
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent + Evaluation panel */}
            <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Recent Interviews</div>
                  <div className="text-sm text-gray-700">
                    No recent interviews found.
                  </div>
                </div>

                <div className="text-sm text-yellow-600">View history</div>
              </div>

              {/* Evaluation panel */}
              <div className="mt-4">
                {evaluating && (
                  <div className="text-sm text-gray-600">
                    Evaluating interview...
                  </div>
                )}
                {evaluateError && (
                  <div className="text-sm text-red-600">
                    Error: {evaluateError}
                  </div>
                )}
                {evaluation && (
                  <div className="mt-2">
                    <div className="text-sm font-medium">
                      Overall Score: {evaluation.overallScore}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {evaluation.overallFeedback}
                    </div>

                    <div className="space-y-3 mt-3">
                      {evaluation.perQuestion.map((pq: any) => (
                        <div
                          key={pq.questionId}
                          className="p-3 border rounded-md bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              Q#{pq.questionId}
                            </div>
                            <div className="text-sm font-semibold">
                              {pq.score}/10
                            </div>
                          </div>
                          {pq.strengths?.length > 0 && (
                            <div className="text-xs text-green-600 mt-2">
                              <strong>Strengths:</strong>{" "}
                              {pq.strengths.join(", ")}
                            </div>
                          )}
                          {pq.improvements?.length > 0 && (
                            <div className="text-xs text-yellow-700 mt-1">
                              <strong>Improve:</strong>{" "}
                              {pq.improvements.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom sticky question bar - shows full question text and quick controls */}
        <div className="fixed left-0 right-0 bottom-4 z-40 flex items-center justify-center px-4">
          <div className="max-w-screen-lg w-full bg-white/95 border border-gray-100 rounded-2xl p-3 shadow-lg flex items-center gap-3">
            <div
              className="flex-1 text-sm text-slate-800 break-words"
              style={{ whiteSpace: "pre-wrap" }}
            >
              <div className="text-xs text-gray-500">Current question</div>
              <div className="font-medium">{currentQuestion.text}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!mute) speakText(currentQuestion.text);
                }}
                className="px-3 py-2 rounded-md border bg-white border-gray-100 flex items-center gap-2"
              >
                <PlayIcon className="w-4 h-4" /> Read
              </button>

              <button
                onClick={() => setMute((s) => !s)}
                className="px-3 py-2 rounded-md border bg-white border-gray-100"
              >
                {mute ? "Unmute TTS" : "Mute TTS"}
              </button>

              <button
                onClick={handleManualNext}
                className="px-3 py-2 rounded-md bg-amber-600 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
