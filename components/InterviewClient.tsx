// components/InterviewClient.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import QuestionCard from "@/components/QuestionCard";
import InterviewRecorder from "@/components/InterviewRecorder";

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

import { useSearchParams } from "next/navigation";

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
      text: "Tell me about yourself — highlight recent work and impact.",
      suggestedTimeSec: 60,
    },
    {
      id: 2,
      text: "Given a sorted array rotated at an unknown pivot, how do you find an element? Explain complexity.",
      suggestedTimeSec: 120,
    },
    {
      id: 3,
      text: "Design a URL shortener. How will you generate short IDs and handle collisions?",
      suggestedTimeSec: 180,
    },
    {
      id: 4,
      text: "Explain how you'd optimize a hot read-heavy endpoint with caching and invalidation.",
      suggestedTimeSec: 150,
    },
    {
      id: 5,
      text: "Tell me about a time you improved performance in production — what did you change and what measured impact?",
      suggestedTimeSec: 90,
    },
  ],
  Amazon: [
    {
      id: 1,
      text: "Introduce yourself and mention a time you showed leadership.",
      suggestedTimeSec: 60,
    },
    {
      id: 2,
      text: "Implement an LRU cache — describe data structures and complexity.",
      suggestedTimeSec: 120,
    },
    {
      id: 3,
      text: "Design a scalable order ingestion system for spikes during peak shopping.",
      suggestedTimeSec: 180,
    },
    {
      id: 4,
      text: "How would you ensure durability and exactly-once processing when receiving events from unreliable clients?",
      suggestedTimeSec: 150,
    },
    {
      id: 5,
      text: "Tell me about a time you owned a postmortem and the changes you implemented after an incident.",
      suggestedTimeSec: 90,
    },
  ],
  Meta: [
    {
      id: 1,
      text: "Quickly introduce yourself and a project relevant to platform scale.",
      suggestedTimeSec: 60,
    },
    {
      id: 2,
      text: "How would you detect and deduplicate duplicate content at scale? Discuss algorithms and tradeoffs.",
      suggestedTimeSec: 120,
    },
    {
      id: 3,
      text: "Design a highly available URL shortener, including replication and partitioning strategy.",
      suggestedTimeSec: 180,
    },
    {
      id: 4,
      text: "Describe an approach to safely run third-party or user code in an isolated environment.",
      suggestedTimeSec: 150,
    },
    {
      id: 5,
      text: "Describe a time you had to convince stakeholders to adopt a technical change — how did you present tradeoffs?",
      suggestedTimeSec: 90,
    },
  ],
  Microsoft: [
    {
      id: 1,
      text: "Introduce yourself and mention cross-team collaboration examples.",
      suggestedTimeSec: 60,
    },
    {
      id: 2,
      text: "Explain how you'd find cycles in a directed graph and give complexity.",
      suggestedTimeSec: 120,
    },
    {
      id: 3,
      text: "Design a URL shortener focusing on maintainability and testability.",
      suggestedTimeSec: 180,
    },
    {
      id: 4,
      text: "How would you design monitoring and alerting for a critical microservice?",
      suggestedTimeSec: 150,
    },
    {
      id: 5,
      text: "Tell me about a time you mentored someone — what was your approach and outcome?",
      suggestedTimeSec: 90,
    },
  ],
  Apple: [
    {
      id: 1,
      text: "Tell me about yourself and why you care about craftsmanship.",
      suggestedTimeSec: 60,
    },
    {
      id: 2,
      text: "Explain a clean, efficient approach to string manipulation problems.",
      suggestedTimeSec: 120,
    },
    {
      id: 3,
      text: "Design a URL shortener with privacy and security considerations.",
      suggestedTimeSec: 180,
    },
    {
      id: 4,
      text: "How would you ensure secure CI/CD pipelines and guardrails?",
      suggestedTimeSec: 150,
    },
    {
      id: 5,
      text: "Tell me about a time you built something elegant under constraints.",
      suggestedTimeSec: 90,
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

export default function InterviewClient() {
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company") ?? "";
  const titleParam = searchParams.get("title") ?? "";

  // select questions based on company (case-insensitive match)
  const companyKey = useMemo(() => {
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
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mute, setMute] = useState(false);
  const [rate, setRate] = useState(1);

  const [countdown, setCountdown] = useState<number | null>(3);

  useEffect(() => {
    setCurrentIndex(0);
    setStarted(false);
    setPaused(false);
    setMute(false);
    setRate(1);
    setCountdown(3);
  }, [companyParam, titleParam]);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const total = interviewQuestions.length;
  const currentQuestion = interviewQuestions[currentIndex];

  const progress = useMemo(() => {
    return Math.round(((currentIndex + (started ? 1 : 0)) / total) * 100);
  }, [currentIndex, started, total]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    let seconds = countdown;
    const iv = setInterval(() => {
      seconds = seconds - 1;
      setCountdown((prev) => {
        if (prev === null) return null;
        return Math.max(0, (prev ?? 0) - 1);
      });

      if (seconds <= 0) {
        clearInterval(iv);
        setTimeout(() => {
          setCountdown(null);
          setStarted(true);
        }, 250);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [countdown]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = Math.max(0.5, Math.min(2, rate));

    utterRef.current = u;
    synthRef.current.speak(u);
  };

  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel();
    utterRef.current = null;
  };

  useEffect(() => {
    if (!started || paused || mute) {
      stopSpeaking();
      return;
    }

    const t = setTimeout(() => speakText(currentQuestion.text), 200);
    return () => clearTimeout(t);
  }, [currentIndex, started, paused, mute, rate, currentQuestion.text]);

  useEffect(() => stopSpeaking, []);

  const nextQuestion = () => {
    stopSpeaking();
    if (currentIndex < total - 1) setCurrentIndex((s) => s + 1);
  };

  const prevQuestion = () => {
    stopSpeaking();
    if (currentIndex > 0) setCurrentIndex((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-yellow-50/60 py-10 px-4 sm:px-8">
      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative pointer-events-auto">
            <div className="flex flex-col items-center justify-center">
              <div className="text-white text-9xl font-extrabold drop-shadow-lg transform animate-pulse">
                {countdown > 0 ? countdown : "Go!"}
              </div>
              <div className="mt-4 text-white text-sm text-center">
                {companyKey
                  ? `Starting ${companyKey} — ${titleParam || ""} interview`
                  : "Get ready — interview starts automatically"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-1" />

          <div className="col-span-1 lg:col-span-10">
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
                <div className="relative w-36 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  <Image
                    src={"/mnt/data/Screenshot 2025-11-26 at 1.59.34 AM.png"}
                    alt="preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevQuestion}
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
                      {started ? (paused ? "Paused" : "Active") : "Idle"}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="font-mono text-gray-700">00:00</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <QuestionCard
                    question={currentQuestion.text}
                    index={currentIndex + 1}
                    total={total}
                  />

                  <div className="mt-6">
                    <InterviewRecorder
                      questionId={currentQuestion.id}
                      onComplete={() => setTimeout(() => nextQuestion(), 350)}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const next = !started;
                        setStarted(next);
                        if (!next) stopSpeaking();
                        if (next && !mute && !paused)
                          setTimeout(
                            () => speakText(currentQuestion.text),
                            200
                          );
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        started
                          ? "bg-white border border-gray-200 text-yellow-600 hover:bg-yellow-50"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      <PlayIcon className="w-5 h-5 flex-none" />
                      <span className="whitespace-nowrap">
                        {started ? "Resume" : "Start Interview"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        const next = !paused;
                        setPaused(next);
                        if (next) stopSpeaking();
                        else if (!mute && started)
                          speakText(currentQuestion.text);
                      }}
                      disabled={!started}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        !started
                          ? "bg-gray-50 text-gray-300 border border-gray-100"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-yellow-50"
                      }`}
                    >
                      <PauseCircleIcon className="w-5 h-5" />
                      {paused ? "Unpause" : "Pause"}
                    </button>

                    <button
                      onClick={() => {
                        const next = !mute;
                        setMute(next);
                        if (next) stopSpeaking();
                        else if (started && !paused)
                          speakText(currentQuestion.text);
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
                      onClick={() => nextQuestion()}
                      disabled={currentIndex >= total - 1}
                      className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium"
                    >
                      Next <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <aside className="lg:col-span-4 space-y-4">
                  <div className="sticky top-28 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-md border border-gray-100">
                          <MicrophoneIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Live Tips</div>
                          <div className="text-sm font-medium text-gray-800">
                            Speak clearly and structure your answers
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="text-xs text-gray-500">
                        Session Summary
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        In progress
                      </div>

                      <ul className="mt-4 text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-400" />
                          Recorded: {currentIndex}
                        </li>
                        <li className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />{" "}
                          Elapsed: 00:00
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-100 p-4 rounded-xl">
                      <div className="font-medium text-gray-800 mb-2">
                        Preparedness
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                          <span className="text-xs text-gray-700">
                            Microphone
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            ✓
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                          <span className="text-xs text-gray-700">
                            Quiet room
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            —
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                          <span className="text-xs text-gray-700">
                            Stable connection
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            —
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

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
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />
        </div>
      </div>
    </div>
  );
}
