"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { PlayIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

/**
 * Types
 */
type Q = {
  id: number;
  text: string;
  note?: string;
  suggestedTimeSec?: number;
};

type EvaluationAnswer = {
  questionId: number;
  questionText: string;
  transcript: string;
  durationSec?: number;
  suggestedTimeSec?: number;
};

/**
 *  🔴 IMPORTANT:
 *  Replace the question text below with the real questions from your Excel.
 *  Each interview (1, 2, 3) has exactly 7 questions.
 */

const INTERVIEW_1_QUESTIONS: Q[] = [
  { id: 1, text: "What is data abstraction", suggestedTimeSec: 60 },
  {
    id: 2,
    text: "What are the three levels of data abstraction with Example",
    suggestedTimeSec: 60,
  },
  { id: 3, text: "What is command line argument)", suggestedTimeSec: 60 },
  {
    id: 4,
    text: "Advantages of a macro over a function",
    suggestedTimeSec: 60,
  },
  {
    id: 5,
    text: "What are the different storage classes in C",
    suggestedTimeSec: 60,
  },
  { id: 6, text: "Why do you want to join TCS", suggestedTimeSec: 60 },
  {
    id: 7,
    text: "What are your strengths and weaknesses",
    suggestedTimeSec: 60,
  },
];

const INTERVIEW_2_QUESTIONS: Q[] = [
  { id: 1, text: "What is trigger", suggestedTimeSec: 60 },
  { id: 2, text: "What do you mean by joins in SQL", suggestedTimeSec: 60 },
  { id: 3, text: "How can VoLTE work in a 4G mobile", suggestedTimeSec: 60 },
  { id: 4, text: "What is an IP address", suggestedTimeSec: 60 },
  { id: 5, text: "What is Cloud Computing", suggestedTimeSec: 60 },
  { id: 6, text: "Tell me about yourself", suggestedTimeSec: 60 },
  { id: 7, text: "How you handle the pressure", suggestedTimeSec: 60 },
];

const INTERVIEW_3_QUESTIONS: Q[] = [
  {
    id: 1,
    text: "What do you know about the garbage collector",
    suggestedTimeSec: 60,
  },
  { id: 2, text: "Write a Binary Search program", suggestedTimeSec: 60 },
  { id: 3, text: "What are enumerations", suggestedTimeSec: 60 },
  { id: 4, text: "What is a static identifier", suggestedTimeSec: 60 },
  { id: 5, text: "What is Cryptography", suggestedTimeSec: 60 },
  {
    id: 6,
    text: "How to connect nine dots using three straight lines",
    suggestedTimeSec: 60,
  },
  {
    id: 7,
    text: "Are you comfortable working in night shift",
    suggestedTimeSec: 60,
  },
];

const DEFAULT_QUESTIONS: Q[] = [
  { id: 1, text: "Tell me about yourself.", suggestedTimeSec: 60 },
];

/**
 * Map of question sets.
 */
const QUESTION_SETS: Record<string, Q[]> = {
  "interview-1": INTERVIEW_1_QUESTIONS,
  "interview-2": INTERVIEW_2_QUESTIONS,
  "interview-3": INTERVIEW_3_QUESTIONS,
};

/**
 * Parse query params
 */
function parseQueryParams(search: string) {
  try {
    const sp = new URLSearchParams(search);
    return {
      interviewId: sp.get("interviewId") ?? "",
      company: sp.get("company") ?? "",
      title: sp.get("title") ?? "",
    };
  } catch {
    return { interviewId: "", company: "", title: "" };
  }
}

/* ---------------------- Recorder ---------------------- */

type RecorderOnCompletePayload = {
  blob: Blob;
  url: string;
  durationSec: number;
  questionId: number;
};

type RecorderProps = {
  questionId: number;
  maxSeconds?: number;
  startTrigger?: number | null;
  /** signal from parent to force-stop and finalize recording */
  forceStopTrigger?: number | null;
  onComplete: (data: RecorderOnCompletePayload) => void;
};

export function InterviewRecorder({
  questionId,
  maxSeconds = 45,
  startTrigger = null,
  forceStopTrigger = null,
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

  // Prevent duplicate starts (React Strict Mode / double effects)
  const startingRef = useRef(false);
  // Ensure we call onComplete only once per recording
  const completedRef = useRef(false);

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

  function internalStopRecorder() {
    clearTick();
    clearStopTimeout();

    const mr = mediaRecorderRef.current;
    if (!mr) {
      setRecording(false);
      return;
    }

    try {
      if (mr.state !== "inactive") {
        mr.stop();
      }
    } catch (e) {
      console.warn("stop error", e);
    }
    setRecording(false);
  }

  async function startRecording() {
    if (recording || startingRef.current) return;
    startingRef.current = true;
    completedRef.current = false;
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
        if (completedRef.current) return;
        completedRef.current = true;

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = elapsedSec;

        onComplete({ blob, url, durationSec: duration, questionId });

        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
        try {
          mediaRecorderRef.current = null;
          chunksRef.current = [];
        } catch {}
      };

      mr.start();
      setRecording(true);
      setElapsedSec(0);

      tickRef.current = window.setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);

      stopTimeoutRef.current = window.setTimeout(() => {
        internalStopRecorder();
      }, maxSeconds * 1000);
    } catch (err: any) {
      setMediaError(err?.message ?? "Microphone access denied");
      throw err;
    } finally {
      startingRef.current = false;
    }
  }

  useEffect(() => {
    if (startTrigger == null) return;
    (async () => {
      try {
        await startRecording();
      } catch (err: any) {
        setMediaError(String(err?.message ?? err));
      }
    })();
  }, [startTrigger]);

  useEffect(() => {
    if (forceStopTrigger == null) return;
    if (recording && mediaRecorderRef.current) {
      internalStopRecorder();
    }
  }, [forceStopTrigger]);

  useEffect(() => {
    clearTick();
    clearStopTimeout();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    setRecording(false);
    setElapsedSec(0);
  }, [questionId]);

  useEffect(() => {
    return () => {
      clearTick();
      clearStopTimeout();
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
      } catch {}
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  const remaining = Math.max(0, maxSeconds - elapsedSec);

  return (
    <div className="mt-4 w-full">
      <div
        className={`flex items-center justify-between rounded-xl px-4 py-2.5 border shadow-sm transition-all ${
          recording ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              recording ? "bg-red-500 animate-ping" : "bg-gray-400"
            }`}
          />
          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
            {recording ? "Recording" : "Ready"} •{" "}
            <span
              className={
                recording ? "text-red-600 font-semibold" : "text-gray-500"
              }
            >
              {recording ? `${remaining}s left` : `${maxSeconds}s max`}
            </span>
          </div>
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
  const [interviewIdParam, setInterviewIdParam] = useState<string>("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [bigCountdown, setBigCountdown] = useState<number | null>(null);
  const [smallCountdown, setSmallCountdown] = useState<number | null>(null);
  const [recorderStartTrigger, setRecorderStartTrigger] = useState<
    number | null
  >(null);
  const [recorderForceStopTrigger, setRecorderForceStopTrigger] = useState<
    number | null
  >(null);
  const [processingAnswer, setProcessingAnswer] = useState(false); // 🔧 NEW: Prevent race conditions

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

  // answers & evaluation
  const [answers, setAnswers] = useState<EvaluationAnswer[]>([]);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluateError, setEvaluateError] = useState<string | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // speech synthesis
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stable questions ref
  const interviewQuestionsRef = useRef<Q[]>([]);
  const totalRef = useRef(0);

  // Update refs
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // init speech synth
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // parse query params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { interviewId, company, title } = parseQueryParams(
      window.location.search || ""
    );
    setInterviewIdParam(interviewId);
    setCompanyParam(company);
    setTitleParam(title);
  }, []);

  const questionKey = useMemo(() => {
    if (interviewIdParam) {
      if (QUESTION_SETS[interviewIdParam]) return interviewIdParam;
      const numericMatch = `interview-${interviewIdParam}`;
      if (QUESTION_SETS[numericMatch]) return numericMatch;
    }
    if (companyParam) {
      const k = Object.keys(QUESTION_SETS).find(
        (c) => c.toLowerCase() === companyParam.toLowerCase()
      );
      if (k) return k;
    }
    return "";
  }, [interviewIdParam, companyParam]);

  const interviewQuestions: Q[] = useMemo(() => {
    if (questionKey && QUESTION_SETS[questionKey])
      return QUESTION_SETS[questionKey];
    return DEFAULT_QUESTIONS;
  }, [questionKey]);

  useEffect(() => {
    interviewQuestionsRef.current = interviewQuestions;
    totalRef.current = interviewQuestions.length;
  }, [interviewQuestions]);

  const total = totalRef.current;
  const currentQuestion =
    interviewQuestionsRef.current[currentIndex] ?? DEFAULT_QUESTIONS[0];

  // Debug logging
  useEffect(() => {
    console.log({
      interviewIdParam,
      companyParam,
      questionKey,
      totalQuestions: total,
      currentIndex,
      currentQuestionId: currentQuestion.id,
      answersLength: answers.length,
      processingAnswer,
    });
  }, [
    currentIndex,
    total,
    currentQuestion.id,
    answers.length,
    processingAnswer,
  ]);

  // auto-start interview
  useEffect(() => {
    setInterviewStarted(true);
    setBigCountdown(3);
  }, []);

  // start camera
  useEffect(() => {
    if (!interviewStarted) return;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setCameraStream(stream);
        setCameraOn(true);
        setCameraError(null);
      } catch (err: any) {
        setCameraError(err?.message ?? "Camera access denied");
        setCameraOn(false);
      }
    })();
  }, [interviewStarted]);

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

  // big countdown
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

  // read question + small countdown
  useEffect(() => {
    if (!interviewStarted || bigCountdown !== null || processingAnswer) return;

    const t = setTimeout(() => {
      if (!mute) speakText(currentQuestion.text);
      setSmallCountdown(3);
    }, 200);

    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [interviewStarted, bigCountdown, currentIndex, mute, processingAnswer]);

  // small countdown
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

  // start recorder when smallCountdown ends
  useEffect(() => {
    if (smallCountdown !== null || !interviewStarted || processingAnswer)
      return;

    const t = setTimeout(() => {
      setRecorderStartTrigger(Date.now());
    }, 150);

    return () => clearTimeout(t);
  }, [smallCountdown, interviewStarted, processingAnswer]);

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

  async function evaluateInterview(answersPayload: EvaluationAnswer[]) {
    setEvaluating(true);
    setEvaluateError(null);
    setEvaluation(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interviewIdParam,
          company: companyParam,
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
      setShowResultsModal(true);
    }
  }

  /**
   * 🔧 FIXED: Single source of truth with processingAnswer lock
   */
  const handleRecordingComplete = useCallback(
    async (payload: RecorderOnCompletePayload) => {
      console.log("🔴 RECORDING COMPLETE:", {
        payloadQuestionId: payload.questionId,
        currentIndex: currentIndexRef.current,
        expectedQuestionId:
          interviewQuestionsRef.current[currentIndexRef.current]?.id,
        processingAnswer,
        answersLength: answers.length,
      });

      // 🔧 CRITICAL: Ignore if already processing or wrong question
      if (processingAnswer) {
        console.log("⏳ Already processing answer, ignoring");
        return;
      }

      const expectedQ = interviewQuestionsRef.current[currentIndexRef.current];
      if (!expectedQ || payload.questionId !== expectedQ.id) {
        console.log(
          "❌ Question ID mismatch, ignoring:",
          payload.questionId,
          "≠",
          expectedQ?.id
        );
        return;
      }

      // 🔧 LOCK: Prevent multiple processing
      setProcessingAnswer(true);
      stopSpeaking();
      setRecorderForceStopTrigger(null);

      let text = "";
      if (payload.blob.size > 0) {
        try {
          text = await uploadForTranscription(payload.blob);
        } catch (e) {
          console.error("Transcription failed:", e);
        }
      }

      const newAnswer: EvaluationAnswer = {
        questionId: expectedQ.id,
        questionText: expectedQ.text,
        transcript: text,
        durationSec: payload.durationSec,
        suggestedTimeSec: expectedQ.suggestedTimeSec ?? 45,
      };

      setAnswers((prev) => {
        if (prev.some((a) => a.questionId === newAnswer.questionId)) {
          console.log("🔄 Duplicate answer ignored:", newAnswer.questionId);
          setProcessingAnswer(false);
          return prev;
        }

        const updated = [...prev, newAnswer];
        const answerCount = updated.length;
        const totalQuestions = totalRef.current;

        console.log("✅ Added answer", answerCount, "/", totalQuestions);

        if (answerCount === totalQuestions) {
          console.log("🎉 ALL QUESTIONS COMPLETE!");
          setInterviewStarted(false);
          setRecorderStartTrigger(null);
          evaluateInterview(updated);
        } else {
          // 🔧 Move to next question AFTER state update
          setTimeout(() => {
            const nextIndex = Math.min(
              currentIndexRef.current + 1,
              totalQuestions - 1
            );
            console.log("➡️ Moving to question index:", nextIndex);
            setCurrentIndex(nextIndex);
            setSmallCountdown(null);
            setRecorderStartTrigger(null);
            setTranscript(null);
            setTranscribeError(null);
            setProcessingAnswer(false);
          }, 500);
        }

        return updated;
      });
    },
    []
  );

  const handleManualNext = () => {
    if (processingAnswer) return;
    stopSpeaking();
    setSmallCountdown(null);
    setRecorderForceStopTrigger(Date.now());
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
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOn(true);
      setCameraError(null);
    } catch (err: any) {
      setCameraError(err?.message ?? "Camera access denied");
      setCameraOn(false);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (cameraStream) (videoRef.current as any).srcObject = cameraStream;
    else (videoRef.current as any).srcObject = null;
  }, [cameraStream]);

  return (
    <div className="h-screen w-full bg-white text-gray-900 overflow-hidden flex font-sans selection:bg-amber-500/30">
      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
          <div className="relative w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 flex flex-col max-h-full">
              <div className="flex items-center justify-between gap-4 p-6 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-white shadow-md">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 tracking-tight">
                      Interview Results
                    </div>
                    <div className="text-sm text-gray-600">
                      Performance summary & feedback
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:3000/ai-interview")
                  }
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition shadow-lg"
                >
                  Back to Hub
                </button>
              </div>

              <div className="p-6 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 gap-6">
                  <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-2">
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          Status
                        </div>
                        <div className="text-base font-medium text-gray-900 mt-1">
                          {evaluating
                            ? "Analyzing..."
                            : evaluation
                            ? "Complete"
                            : "Pending"}
                        </div>
                      </div>
                      <div className="hidden md:block w-px h-10 bg-gray-200 mx-auto" />
                      <div className="md:col-span-2">
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          Answered
                        </div>
                        <div className="text-base font-medium text-gray-900 mt-1">
                          {answers.length} Questions
                        </div>
                      </div>
                      <div className="md:col-span-7">
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                          Overview
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {evaluation?.overallFeedback ??
                            (evaluateError
                              ? "Error generating feedback."
                              : "Your responses have been recorded.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {evaluation && evaluation.perQuestion?.length > 0 ? (
                      evaluation.perQuestion.map((pq: any) => (
                        <div
                          key={pq.questionId}
                          className="group p-5 rounded-xl bg-white border border-gray-200 hover:border-amber-300 transition-colors shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row gap-5 justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">
                                  Q{pq.questionId}
                                </span>
                                <span className="text-sm text-gray-600 font-medium truncate max-w-md">
                                  {pq.shortQuestion}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {pq.summary}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {pq.strengths?.map((s: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200"
                                  >
                                    + {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 min-w-[80px]">
                              <div className="text-2xl font-bold text-gray-900">
                                {pq.score}
                                <span className="text-gray-400 text-lg">
                                  {" "}
                                  /10
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-widest">
                                Score
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : evaluating ? (
                      <div className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 text-sm animate-pulse">
                          Consulting AI Model...
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {bigCountdown !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="text-amber-500 text-[12rem] leading-none font-bold tracking-tighter tabular-nums animate-pulse drop-shadow-md">
              {bigCountdown > 0 ? bigCountdown : "GO"}
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDE: Question & Recorder */}
      <div className="w-[35%] h-full flex flex-col bg-neutral-50 border-r border-gray-200 p-8 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

        <div className="relative z-10 flex-shrink-0 mb-6">
          <div
            className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border mb-4 ${
              interviewStarted
                ? "bg-red-100 border-red-300 text-red-600"
                : "bg-amber-100 border-amber-300 text-amber-700"
            }`}
          >
            {interviewStarted ? "● Live" : "○ Ready"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight truncate">
            {companyParam || "Mock Interview"}
          </h1>
          <p className="text-sm text-gray-500 font-medium truncate mt-1">
            {titleParam || "Standard Proficiency Test"}
          </p>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              Question {currentIndex + 1}{" "}
              <span className="text-gray-400">/ {total}</span>
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="overflow-hidden">
            <h2 className="text-2xl lg:text-3xl leading-snug font-medium text-gray-900">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>
              Duration:{" "}
              <span className="text-gray-700">
                {currentQuestion.suggestedTimeSec ?? 45}s
              </span>
            </span>
          </div>
        </div>

        <div className="h-[20%] bg-white px-8 flex flex-col justify-center relative z-20 border-t border-gray-200 shadow-lg">
          <div className="w-full flex items-center gap-6">
            <div className="flex-1 h-14 bg-gray-50 rounded-xl border border-gray-300 relative overflow-hidden flex items-center px-2 shadow-inner">
              <InterviewRecorder
                key={`recorder-${currentQuestion.id}`} // 🔧 Force remount on question change
                questionId={currentQuestion.id}
                maxSeconds={currentQuestion.suggestedTimeSec ?? 45}
                startTrigger={recorderStartTrigger}
                forceStopTrigger={recorderForceStopTrigger}
                onComplete={handleRecordingComplete}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleManualNext}
                disabled={processingAnswer}
                className={`h-14 px-8 rounded-xl font-bold text-sm uppercase tracking-wide transition-all hover:translate-y-[-1px] shadow-lg flex items-center gap-2 ${
                  processingAnswer
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-amber-500 hover:bg-amber-400 text-gray-900 shadow-amber-500/30"
                }`}
              >
                {processingAnswer ? "Processing..." : "Next"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-8">
            <button
              onClick={() => setMute((s) => !s)}
              className="text-[10px] text-gray-400 hover:text-gray-600 uppercase tracking-widest transition flex items-center gap-2"
            >
              {mute ? (
                <span className="line-through">Sound</span>
              ) : (
                <span>Sound On</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Camera */}
      <div className="w-[65%] h-full flex flex-col bg-neutral-100 relative">
        <div className="h-[80%] relative w-full overflow-hidden flex items-center justify-center p-4">
          <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-300 shadow-xl">
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                <div className="p-4 rounded-full bg-gray-800 mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => toggleCamera()}
                  className="text-sm font-medium text-amber-400 hover:text-amber-300 transition"
                >
                  Enable Camera
                </button>
                {cameraError && (
                  <p className="mt-2 text-xs text-red-300">{cameraError}</p>
                )}
              </div>
            )}

            <div className="absolute top-6 right-6 z-20">
              {smallCountdown !== null && (
                <div className="text-5xl font-bold text-white drop-shadow-md font-mono">
                  {smallCountdown > 0 ? smallCountdown : ""}
                </div>
              )}
            </div>

            <div className="absolute top-6 left-6 z-20">
              {cameraOn && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-wider">
                    REC
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
