"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { AI_INTERVIEW_ROUTE } from "@/constants/ui-routes";
import { useGetInterviewSession } from "@/server-api/queries/ai-interview.queries";
import {
  useFinishInterview,
  useSubmitInterviewAnswer,
} from "@/server-api/mutations/ai-interview.mutation";
import { aiInterviewService } from "@/server-api/services/ai-interview.service";
import {
  FinishInterviewResponse,
  InterviewQuestion,
} from "@/server-api/api/types/ai-interview.types";

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
  maxSeconds = 120,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTrigger]);

  useEffect(() => {
    if (forceStopTrigger == null) return;
    if (recording && mediaRecorderRef.current) {
      internalStopRecorder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

/* ---------------------- helpers ---------------------- */

function parseAttemptId(search: string): number | null {
  try {
    const sp = new URLSearchParams(search);
    const raw = sp.get("attemptId");
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function formatClock(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function isExpiredError(err: any): boolean {
  const message = err?.response?.data?.error?.message ?? err?.message ?? "";
  return (
    typeof message === "string" && message.toLowerCase().includes("expired")
  );
}

/* ---------------------- InterviewClient ---------------------- */

export default function InterviewClient() {
  const router = useRouter();

  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [attemptIdResolved, setAttemptIdResolved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAttemptId(parseAttemptId(window.location.search || ""));
    setAttemptIdResolved(true);
  }, []);

  const { data: session, isLoading: isSessionLoading } = useGetInterviewSession(
    attemptId ?? 0,
  );

  const submitAnswerMutation = useSubmitInterviewAnswer(attemptId ?? 0);
  const finishInterviewMutation = useFinishInterview(attemptId ?? 0);

  /* 🔒 TAB SWITCH GUARD */
  const tabExitHandledRef = useRef(false);

  const forceExitInterview = useCallback(() => {
    if (tabExitHandledRef.current) return;
    tabExitHandledRef.current = true;

    console.warn("🚨 Interview terminated: tab/window change detected");

    try {
      window.speechSynthesis?.cancel();
    } catch {}

    router.replace(AI_INTERVIEW_ROUTE);
  }, [router]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        forceExitInterview();
      }
    };
    const onWindowBlur = () => {
      forceExitInterview();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [forceExitInterview]);

  /* ---------------------- camera gate (mandatory) ---------------------- */

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [cameraGatePassed, setCameraGatePassed] = useState(false);

  const requestCamera = async () => {
    setRequestingCamera(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOn(true);
      setCameraGatePassed(true);
    } catch (err: any) {
      setCameraError(
        err?.message ??
          "Camera access denied. Camera access is mandatory to start this AI interview.",
      );
      setCameraOn(false);
    } finally {
      setRequestingCamera(false);
    }
  };

  useEffect(() => {
    return () => {
      try {
        cameraStream?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
  }, [cameraStream]);

  useEffect(() => {
    if (!videoRef.current) return;
    (videoRef.current as any).srcObject = cameraStream ?? null;
  }, [cameraStream]);

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

  /* ---------------------- interview flow state ---------------------- */

  const [currentIndex, setCurrentIndex] = useState(1);
  const currentIndexRef = useRef(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [bigCountdown, setBigCountdown] = useState<number | null>(null);
  const [smallCountdown, setSmallCountdown] = useState<number | null>(null);
  const [recorderStartTrigger, setRecorderStartTrigger] = useState<
    number | null
  >(null);
  const [recorderForceStopTrigger, setRecorderForceStopTrigger] = useState<
    number | null
  >(null);
  const [processingAnswer, setProcessingAnswer] = useState(false);

  const [mute, setMute] = useState(false);
  const rate = 1;

  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [answeredCount, setAnsweredCount] = useState(0);
  const [finishResult, setFinishResult] =
    useState<FinishInterviewResponse | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // speech synthesis
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const showGlobalLoader =
    processingAnswer ||
    questionLoading ||
    submitAnswerMutation.isPending ||
    finishInterviewMutation.isPending;

  const loaderMessage = finishInterviewMutation.isPending
    ? "Evaluating your interview..."
    : submitAnswerMutation.isPending
      ? "Transcribing your answer..."
      : processingAnswer || questionLoading
        ? "Processing..."
        : "Loading...";

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synthRef.current = synth;

      const loadVoices = () => {
        voicesRef.current = synth.getVoices();
      };
      loadVoices();
      synth.addEventListener("voiceschanged", loadVoices);
      return () => synth.removeEventListener("voiceschanged", loadVoices);
    }
  }, []);

  // Prefer a clear, local (non-network) English voice — remote/compressed
  // "network" voices are the usual cause of muffled/tinny TTS playback.
  const pickBestVoice = () => {
    const voices = voicesRef.current;
    if (!voices.length) return null;
    const englishVoices = voices.filter((v) =>
      v.lang?.toLowerCase().startsWith("en"),
    );
    const pool = englishVoices.length ? englishVoices : voices;

    const preferredNames = [
      "Google US English",
      "Samantha",
      "Microsoft Aria Online (Natural)",
      "Microsoft Jenny Online (Natural)",
      "Microsoft Guy Online (Natural)",
    ];
    for (const name of preferredNames) {
      const match = pool.find((v) => v.name === name);
      if (match) return match;
    }

    const localVoice = pool.find((v) => v.localService);
    if (localVoice) return localVoice;

    return pool[0];
  };

  // Initialize total questions + resume position once session loads
  useEffect(() => {
    if (!session) return;
    if (session.status !== "in_progress") return; // already finalized, handled below
    setTotalQuestions(session.total_questions);
    const resumeIndex = Math.max(1, session.last_visited_index || 1);
    setCurrentIndex(resumeIndex);
  }, [session]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = Math.max(0.6, Math.min(1.6, rate));
      u.pitch = 1;
      u.volume = 1;
      const voice = pickBestVoice();
      if (voice) u.voice = voice;
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

  // Start the interview once the camera gate is passed
  useEffect(() => {
    if (
      cameraGatePassed &&
      !interviewStarted &&
      session?.status === "in_progress"
    ) {
      setInterviewStarted(true);
      setBigCountdown(3);
    }
  }, [cameraGatePassed, interviewStarted, session]);

  /* ---------------------- server-authoritative timer ---------------------- */

  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const expiredHandledRef = useRef(false);

  useEffect(() => {
    if (!session?.expires_at) return;
    const expiresAtMs = new Date(session.expires_at).getTime();

    const tick = () => {
      const remaining = Math.max(0, (expiresAtMs - Date.now()) / 1000);
      setRemainingSec(remaining);
      if (remaining <= 0 && !expiredHandledRef.current && interviewStarted) {
        expiredHandledRef.current = true;
        handleFinish();
      }
    };

    tick();
    const iv = window.setInterval(tick, 1000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.expires_at, interviewStarted]);

  /* ---------------------- question loading ---------------------- */

  useEffect(() => {
    if (!interviewStarted || !attemptId || bigCountdown !== null) return;

    let cancelled = false;
    setQuestionLoading(true);
    aiInterviewService
      .getQuestion(attemptId, currentIndex)
      .then((question) => {
        if (cancelled) return;
        setCurrentQuestion(question);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isExpiredError(err)) {
          handleFinish();
        } else {
          console.error("failed to load question", err);
        }
      })
      .finally(() => {
        if (!cancelled) setQuestionLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewStarted, attemptId, currentIndex, bigCountdown]);

  // big countdown
  useEffect(() => {
    if (bigCountdown == null) return;
    let sec = bigCountdown;
    const iv = window.setInterval(() => {
      sec -= 1;
      setBigCountdown((prev) =>
        prev == null ? null : Math.max(0, (prev ?? 0) - 1),
      );
      if (sec <= 0) {
        clearInterval(iv);
        setTimeout(() => setBigCountdown(null), 250);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [bigCountdown]);

  // read question + small countdown once it's loaded (skip if already answered)
  useEffect(() => {
    if (
      !interviewStarted ||
      bigCountdown !== null ||
      processingAnswer ||
      questionLoading ||
      !currentQuestion
    )
      return;

    if (currentQuestion.already_answered) {
      // Resuming a refreshed session past this question — move on without re-recording.
      advanceOrFinish();
      return;
    }

    const t = setTimeout(() => {
      if (!mute) speakText(currentQuestion.question_text);
      setSmallCountdown(3);
    }, 200);

    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interviewStarted,
    bigCountdown,
    currentQuestion,
    mute,
    processingAnswer,
    questionLoading,
  ]);

  // small countdown
  useEffect(() => {
    if (smallCountdown == null) return;
    let seconds = smallCountdown;
    const iv = window.setInterval(() => {
      seconds -= 1;
      setSmallCountdown((prev) =>
        prev == null ? null : Math.max(0, (prev ?? 0) - 1),
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
    if (!currentQuestion || currentQuestion.already_answered) return;

    const t = setTimeout(() => {
      setRecorderStartTrigger(Date.now());
    }, 150);

    return () => clearTimeout(t);
  }, [smallCountdown, interviewStarted, processingAnswer, currentQuestion]);

  function advanceOrFinish() {
    const nextIndex = currentIndexRef.current + 1;
    if (totalQuestions > 0 && nextIndex > totalQuestions) {
      setInterviewStarted(false);
      setRecorderStartTrigger(null);
      handleFinish();
    } else {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(null);
      setSmallCountdown(null);
      setRecorderStartTrigger(null);
      setProcessingAnswer(false);
    }
  }

  async function handleFinish() {
    if (!attemptId || finishInterviewMutation.isPending || finishResult) return;
    stopSpeaking();
    try {
      const result = await finishInterviewMutation.mutateAsync();
      setFinishResult(result);
    } catch (err: any) {
      console.error("finish interview error", err);
      setFinishError(
        err?.response?.data?.error?.message ??
          err?.message ??
          "Could not evaluate interview",
      );
    } finally {
      setShowResultsModal(true);
    }
  }

  const handleRecordingComplete = useCallback(
    async (payload: RecorderOnCompletePayload) => {
      if (processingAnswer) return;
      if (
        !currentQuestion ||
        payload.questionId !== currentQuestion.question_id
      )
        return;
      if (!attemptId) return;

      setProcessingAnswer(true);
      stopSpeaking();
      setRecorderForceStopTrigger(null);

      if (payload.blob.size > 0) {
        try {
          await submitAnswerMutation.mutateAsync({
            questionId: currentQuestion.question_id,
            audio: payload.blob,
            durationSec: Math.max(1, payload.durationSec),
          });
          setAnsweredCount((c) => c + 1);
        } catch (err: any) {
          console.error("submit answer failed:", err);
          if (isExpiredError(err)) {
            setProcessingAnswer(false);
            handleFinish();
            return;
          }
        }
      }

      setTimeout(() => {
        advanceOrFinish();
      }, 400);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processingAnswer, currentQuestion, attemptId, totalQuestions],
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

  /* ---------------------- render guards ---------------------- */

  if (attemptIdResolved && !attemptId) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white text-gray-900">
        <p className="text-lg font-medium">No interview attempt specified.</p>
        <button
          onClick={() => router.push(AI_INTERVIEW_ROUTE)}
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  if (isSessionLoading || !attemptIdResolved) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader show message="Loading your interview session..." />
      </div>
    );
  }

  if (session && session.status !== "in_progress" && !showResultsModal) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white text-gray-900">
        <CheckCircleIcon className="w-12 h-12 text-amber-500" />
        <p className="text-lg font-medium">
          This interview has already been completed.
        </p>
        <button
          onClick={() => router.push(AI_INTERVIEW_ROUTE)}
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  if (!cameraGatePassed) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-white text-gray-900 px-6 text-center">
        <div className="p-5 rounded-full bg-amber-100">
          <svg
            className="w-10 h-10 text-amber-600"
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
        <h1 className="text-2xl font-bold">Camera access required</h1>
        <p className="text-gray-600 max-w-md">
          {session?.title ?? "This AI interview"} requires your camera to be on
          for the full session. Camera access is mandatory and cannot be
          skipped.
        </p>
        <button
          onClick={requestCamera}
          disabled={requestingCamera}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold shadow-lg disabled:opacity-60"
        >
          {requestingCamera ? "Requesting access..." : "Enable Camera & Start"}
        </button>
        {cameraError && (
          <p className="text-sm text-red-600 max-w-md">{cameraError}</p>
        )}
      </div>
    );
  }

  const total = totalQuestions;
  const questionText = currentQuestion?.question_text ?? "Loading question...";
  const maxDurationSec = currentQuestion?.max_duration_sec ?? 120;

  return (
    <>
      <Loader show={showGlobalLoader} message={loaderMessage} />
      <div className="h-screen w-full bg-white text-gray-900 overflow-hidden flex font-sans selection:bg-amber-500/30">
        {/* TAB SWITCH WARNING */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="px-6 py-3 rounded-full bg-amber-100 text-amber-800 text-sm md:text-base font-bold tracking-wide border-2 border-amber-300 shadow-md">
            ⚠️ Leaving this tab will automatically end the interview
          </div>
        </div>

        {/* SERVER-AUTHORITATIVE TIMER */}
        {remainingSec !== null && interviewStarted && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div
              className={`px-6 py-2.5 rounded-full text-lg md:text-xl font-bold tracking-wide border-2 shadow-md font-mono ${
                remainingSec < 60
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Time Remaining: {formatClock(remainingSec)}
            </div>
          </div>
        )}

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
                        {session?.title ?? "Interview"} — Results
                      </div>
                      <div className="text-sm text-gray-600">
                        Performance summary & feedback
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(AI_INTERVIEW_ROUTE)}
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
                            {finishInterviewMutation.isPending
                              ? "Analyzing..."
                              : finishResult
                                ? "Complete"
                                : "Pending"}
                          </div>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-gray-200 mx-auto" />
                        <div className="md:col-span-2">
                          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            Score
                          </div>
                          <div className="text-base font-medium text-gray-900 mt-1">
                            {finishResult
                              ? `${finishResult.total_score} / ${finishResult.max_score}`
                              : "—"}
                          </div>
                        </div>
                        <div className="md:col-span-7">
                          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                            Overview
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {finishResult?.overall_feedback ??
                              (finishError
                                ? "Error generating feedback."
                                : "Your responses have been recorded.")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {finishResult && finishResult.per_question?.length > 0 ? (
                        finishResult.per_question.map((pq) => (
                          <div
                            key={pq.question_id}
                            className="group p-5 rounded-xl bg-white border border-gray-200 hover:border-amber-300 transition-colors shadow-sm"
                          >
                            <div className="flex flex-col md:flex-row gap-5 justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">
                                    Q{pq.question_id}
                                  </span>
                                  <span className="text-sm text-gray-600 font-medium truncate max-w-md">
                                    {pq.question_text}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {pq.strengths?.map((s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200"
                                    >
                                      + {s}
                                    </span>
                                  ))}
                                </div>
                                {pq.improvements?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {pq.improvements.map((imp, i) => (
                                      <span
                                        key={i}
                                        className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200"
                                      >
                                        ⚠ {imp}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 min-w-[80px]">
                                <div className="text-2xl font-bold text-gray-900">
                                  {pq.score_awarded}
                                  <span className="text-gray-400 text-lg">
                                    {" "}
                                    /{pq.max_score}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest">
                                  Score
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : finishInterviewMutation.isPending ? (
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
              {session?.title ?? "AI Interview"}
            </h1>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
                Question {currentIndex}{" "}
                <span className="text-gray-400">/ {total || "?"}</span>
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="overflow-hidden">
              <h2 className="text-2xl lg:text-3xl leading-snug font-medium text-gray-900">
                {questionText}
              </h2>
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                Duration:{" "}
                <span className="text-gray-700">{maxDurationSec}s</span>
              </span>
            </div>
          </div>

          <div className="h-[20%] bg-white px-8 flex flex-col justify-center relative z-20 border-t border-gray-200 shadow-lg">
            <div className="w-full flex items-center gap-6">
              <div className="flex-1 h-14 bg-gray-50 rounded-xl border border-gray-300 relative overflow-hidden flex items-center px-2 shadow-inner">
                {currentQuestion && (
                  <InterviewRecorder
                    key={`recorder-${currentQuestion.question_id}`}
                    questionId={currentQuestion.question_id}
                    maxSeconds={maxDurationSec}
                    startTrigger={recorderStartTrigger}
                    forceStopTrigger={recorderForceStopTrigger}
                    onComplete={handleRecordingComplete}
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleManualNext}
                  disabled={processingAnswer || !currentQuestion}
                  className={`h-14 px-8 rounded-xl font-bold text-sm uppercase tracking-wide transition-all hover:translate-y-[-1px] shadow-lg flex items-center gap-2 ${
                    processingAnswer || !currentQuestion
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
                  <p className="text-sm text-red-300 font-medium mb-1">
                    Camera is required for this interview
                  </p>
                  <button
                    onClick={() => toggleCamera()}
                    className="text-sm font-medium text-amber-400 hover:text-amber-300 transition"
                  >
                    Re-enable Camera
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
    </>
  );
}
