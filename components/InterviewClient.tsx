// components/InterviewClient.tsx
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
    {
      id: 2,
      text: "What is HTTP? Give a one-sentence answer.",
      suggestedTimeSec: 20,
    },
    {
      id: 3,
      text: "What is JSON used for?",
      suggestedTimeSec: 20,
    },
    {
      id: 4,
      text: "What's the difference between REST and GraphQL (one short example)?",
      suggestedTimeSec: 30,
    },
    {
      id: 5,
      text: "What is SQL vs NoSQL — a one-paragraph answer.",
      suggestedTimeSec: 30,
    },
  ],
};

const DEFAULT_QUESTIONS: Q[] = [
  { id: 1, text: "Tell me about yourself." },
  { id: 2, text: "What was the most challenging project you worked on?" },
  { id: 3, text: "Explain a system design of URL Shortener." },
  {
    id: 4,
    text: "How would you design a safe mechanism to run untrusted code in production?",
  },
  { id: 5, text: "Tell me about a production incident you handled." },
];

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
            <div className="text-sm font-medium">
              {recording ? "Recording answer" : "Ready to record"}
            </div>
            <div className="text-xs text-gray-500">
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
    } catch (err: any) {
      console.error("evaluate error", err);
      setEvaluateError(err?.message ?? String(err));
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

        // INTERVIEW FINISHED -> call evaluation
        try {
          // include the final answer (we already appended to state above, but setState is async)
          const answersForEval = [...answers, newAnswer];
          await evaluateInterview(answersForEval);
        } catch (e) {
          console.error("evaluation failed", e);
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
    }
  };

  useEffect(() => {
    if (mute) stopSpeaking();
  }, [mute]);

  return (
    <div className="min-h-screen bg-yellow-50/60 py-10 px-4 sm:px-8">
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

      <div className="max-w-screen-xl mx-auto">
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

              <div className="hidden md:flex items-center">
                <div className="w-36 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center text-sm text-yellow-800">
                  Preview
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
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

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!interviewStarted) {
                          onPressStartInterview();
                        } else {
                          setInterviewStarted(true);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        interviewStarted
                          ? "bg-white border border-gray-200 text-yellow-600 hover:bg-yellow-50"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      <PlayIcon className="w-5 h-5 flex-none" />
                      <span className="whitespace-nowrap">
                        {interviewStarted
                          ? "Interview Running"
                          : "Start Interview"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        stopSpeaking();
                        handleManualNext();
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-white border border-gray-200 text-gray-700 hover:bg-yellow-50`}
                    >
                      <PauseCircleIcon className="w-5 h-5" />
                      Next
                    </button>

                    <button
                      onClick={() => {
                        setMute((m) => !m);
                        if (!mute) stopSpeaking();
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white"
                    >
                      {mute ? (
                        <SpeakerXMarkIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <SpeakerWaveIcon className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-xs text-gray-700">
                        {mute ? "Muted" : "Audio"}
                      </span>
                    </button>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-white ml-2">
                      <label htmlFor="rate" className="text-xs text-gray-500">
                        Rate
                      </label>
                      <input
                        id="rate"
                        type="range"
                        min={0.6}
                        max={1.6}
                        step={0.1}
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-28"
                      />
                      <div className="text-xs text-gray-600 w-8 text-right">
                        {rate.toFixed(1)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        stopSpeaking();
                        handleManualNext();
                      }}
                      disabled={currentIndex >= total - 1}
                      className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium"
                    >
                      Skip/Next <ArrowRightIcon className="w-4 h-4" />
                    </button>
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
      </div>
    </div>
  );
}
