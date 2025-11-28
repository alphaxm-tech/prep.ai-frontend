"use client";

import { useState } from "react";
import { PlayIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

import QuestionCard from "@/components/QuestionCard";
import InterviewRecorder from "@/components/InterviewRecorder";
import { useRouter } from "next/navigation";

type InterviewType = {
  company: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  difficultyColor: string;
  iconColor: string;
};

type PastInterview = {
  id: string;
  company: string;
  title: string;
  date: string; // ISO or display-friendly
  duration: string; // e.g. "35m"
  scorePct: number; // 0-100
  notes?: string;
};

const questions = [
  { id: 1, text: "Tell me about yourself." },
  { id: 2, text: "What was the most challenging project you worked on?" },
  { id: 3, text: "Explain a system design of URL Shortener." },
];

export default function AIInterviewPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  // NEW: selected interview
  const [selected, setSelected] = useState<InterviewType | null>(null);

  // Sample past interviews (dummy data) — replace with real data from your backend
  const [pastInterviews] = useState<PastInterview[]>([
    {
      id: "p1",
      company: "Google",
      title: "Google Coding Round",
      date: "2025-11-20",
      duration: "42m",
      scorePct: 82,
      notes: "Good algorithmic reasoning; improve edge case handling",
    },
    {
      id: "p2",
      company: "Amazon",
      title: "Amazon Leadership + Coding Round",
      date: "2025-11-15",
      duration: "58m",
      scorePct: 74,
      notes: "Strong behavioral answers; optimize runtime on Q2",
    },
    {
      id: "p3",
      company: "Meta",
      title: "Meta System Design Round",
      date: "2025-10-30",
      duration: "65m",
      scorePct: 90,
      notes: "Excellent tradeoffs and scalability reasoning",
    },
  ] as PastInterview[]);

  const currentQuestion = questions[currentIndex];

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Blockchain Developer",
  ];

  const interviewTypes: InterviewType[] = [
    {
      company: "Google",
      title: "Google Coding Round",
      description: "Data structures, algorithms, and problem-solving.",
      time: "45 min",
      difficulty: "Hard",
      difficultyColor: "bg-red-100 text-red-800",
      iconColor: "bg-yellow-100 text-yellow-600",
    },
    {
      company: "Amazon",
      title: "Amazon Leadership + Coding Round",
      description: "Coding + Amazon LP-focused behavioral questions.",
      time: "60 min",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      iconColor: "bg-orange-100 text-orange-600",
    },
    {
      company: "Meta",
      title: "Meta System Design Round",
      description: "High-level architecture + scalability problems.",
      time: "60–75 min",
      difficulty: "Hard",
      difficultyColor: "bg-purple-100 text-purple-800",
      iconColor: "bg-purple-50 text-purple-600",
    },
    {
      company: "Microsoft",
      title: "Microsoft Technical + Problem Solving",
      description: "Conceptual problem-solving + coding questions.",
      time: "45–60 min",
      difficulty: "Medium",
      difficultyColor: "bg-blue-100 text-blue-800",
      iconColor: "bg-blue-50 text-blue-600",
    },
    {
      company: "Apple",
      title: "Apple Behavioral & Culture Fit",
      description: "Deep behavioral + team fit evaluation.",
      time: "30–45 min",
      difficulty: "Easy",
      difficultyColor: "bg-green-100 text-green-800",
      iconColor: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-12 py-8">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-start gap-2 pb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Smart Interview Coach
        </h1>
        <p className="text-lg text-yellow-900">
          Practice, improve, and ace every interview with AI guidance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Start Interview Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Start New Interview</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            {/* Left hint */}
            <span className="text-gray-700 font-medium">
              Start by choosing an interview from your assigned sessions.
            </span>

            {/* Show selected label (if any) */}
            <div className="ml-auto">
              {selected ? (
                <div className="text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-semibold text-gray-800">
                    {selected.company} — {selected.title}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  No interview selected
                </div>
              )}
            </div>
          </div>

          {/* Interview Types */}
          <div className="overflow-x-auto -mx-2 px-2 mb-6">
            <div className="flex gap-4 snap-x snap-mandatory pb-2">
              {interviewTypes.map((type) => {
                const isSelected =
                  selected?.company === type.company &&
                  selected?.title === type.title;
                return (
                  <div
                    key={`${type.company}-${type.title}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(type)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(type);
                      }
                    }}
                    aria-pressed={isSelected}
                    className={`relative min-w-[260px] snap-start bg-white rounded-xl p-5 border transition cursor-pointer
                      ${
                        isSelected
                          ? "border-yellow-300 shadow-xl ring-2 ring-yellow-200"
                          : "border-gray-100 shadow-sm hover:shadow-lg"
                      }
                    `}
                  >
                    {/* Selected check badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                        <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                      </div>
                    )}

                    {/* Company Logo Bubble */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${type.iconColor}`}
                    >
                      <PlayIcon className="w-6 h-6" />
                    </div>

                    {/* Company Name */}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {type.company}
                    </span>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 mt-1">
                      {type.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mt-1">
                      {type.description}
                    </p>

                    {/* Footer: Time + Difficulty */}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{type.time}</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.difficultyColor}`}
                      >
                        {type.difficulty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Interview Button */}
          <button
            onClick={() => {
              if (!selected) return;
              // navigate with selected info in query params
              const qs = `?company=${encodeURIComponent(
                selected.company
              )}&title=${encodeURIComponent(selected.title)}`;
              router.push(`/ai-interview/interview${qs}`);
            }}
            disabled={!selected}
            aria-disabled={!selected}
            className={`w-full transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2
              ${
                selected
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <PlayIcon className={`w-5 h-5 ${selected ? "" : "opacity-60"}`} />{" "}
            {selected ? "Start Interview" : "Select an interview to start"}
          </button>
        </div>

        {/* Performance + Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">Performance</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between">
                <span>Average Score</span>
                <span className="font-semibold">85%</span>
              </li>
              <li className="flex justify-between">
                <span>Interviews Taken</span>
                <span className="font-semibold">12</span>
              </li>
              <li className="flex justify-between">
                <span>Total Time</span>
                <span className="font-semibold">8h 45m</span>
              </li>
              <li className="flex justify-between">
                <span>Improvement</span>
                <span className="font-semibold text-green-500">+15%</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">Interview Tips</h3>

            {/* Scrollable tips list */}
            <div className="space-y-3 text-sm h-48 overflow-y-auto pr-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                Practice the STAR method for behavioral questions
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                Research the company before starting
              </div>
              <div className="bg-pink-50 p-3 rounded-lg">
                Think out loud during technical problems
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                Manage your time effectively during coding rounds
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                Ask clarifying questions before solving problems
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                Review your past interview mistakes and improve
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-screen-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Interviews</h2>

        {/* If you have no backend yet, show the sample items */}
        <div className="space-y-3">
          {pastInterviews.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    {p.company[0]}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {p.company} — {p.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(p.date).toLocaleDateString()} • {p.duration}
                  </div>
                  {p.notes && (
                    <div className="text-xs text-gray-600 mt-1">{p.notes}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold">{p.scorePct}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      // replay the same interview (navigate to interview page with company + title)
                      const qs = `?company=${encodeURIComponent(
                        p.company
                      )}&title=${encodeURIComponent(p.title)}`;
                      router.push(`/ai-interview/interview${qs}`);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm"
                  >
                    <PlayIcon className="w-4 h-4" /> Replay
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pastInterviews.length === 0 && (
            <div className="text-gray-500 text-sm">
              No recent interviews found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
