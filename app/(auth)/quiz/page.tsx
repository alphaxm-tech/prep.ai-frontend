"use client";

import React from "react";
import { StatCard } from "../../../components/StatCard";
import { useRouter } from "next/navigation";

const userStats = {
  quizzesTaken: 24,
  bestScore: 92,
  totalTime: "12h",
  avgScore: 78,
};

const leaderboard = [
  { name: "Alex Johnson", score: 2450 },
  { name: "Sarah Chen", score: 2380 },
  { name: "Mike Rodriguez", score: 2290 },
  { name: "Emily Davis", score: 2180 },
  { name: "You", score: 1950 },
];

type Quiz = {
  title: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  attempts: number;
  bestScore: number;
};

const quizzes: Quiz[] = [
  {
    title: "JavaScript Fundamentals",
    questions: 20,
    duration: "30 minutes",
    difficulty: "Easy",
    attempts: 156,
    bestScore: 85,
  },
  {
    title: "React Basics",
    questions: 25,
    duration: "40 minutes",
    difficulty: "Medium",
    attempts: 102,
    bestScore: 78,
  },
  {
    title: "Data Structures & Algorithms",
    questions: 30,
    duration: "60 minutes",
    difficulty: "Hard",
    attempts: 85,
    bestScore: 92,
  },
  {
    title: "TypeScript Essentials",
    questions: 18,
    duration: "25 minutes",
    difficulty: "Easy",
    attempts: 134,
    bestScore: 88,
  },
  {
    title: "Node.js & Express",
    questions: 22,
    duration: "35 minutes",
    difficulty: "Medium",
    attempts: 97,
    bestScore: 81,
  },
];

export default function Quiz() {
  const router = useRouter();
  const handleStartQuiz = () => {
    router.push("/quiz/test");
  };
  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="w-full md:w-auto">
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{
              fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
              WebkitFontVariantLigatures: "none",
              fontVariantLigatures: "none",
              letterSpacing: "-0.0625rem",
              lineHeight: "1.2",
              color: "#1a1a1a",
            }}
          >
            Quizzes
          </h1>
          <p className="text-lg text-yellow-900">
            Test your knowledge and compete with others
          </p>
        </div>
        <button className="bg-yellow-300 hover:bg-yellow-200 transition px-6 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0">
          🏆 Compete on Leaderboard
        </button>
      </div>

      {/* Stats */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Quizzes Taken"
          value={userStats.quizzesTaken}
          variant="green"
        />
        <StatCard
          label="Best Score"
          value={userStats.bestScore + "%"}
          variant="yellow"
        />
        <StatCard
          label="Total Time"
          value={userStats.totalTime}
          variant="purple"
        />
        <StatCard
          label="Avg Score"
          value={userStats.avgScore + "%"}
          variant="blue"
        />
      </section>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto flex flex-wrap space-x-2 mb-8">
        <button className="bg-yellow-200 text-yellow-900 font-bold py-2 px-4 rounded shadow-md">
          All Categories
        </button>
        <button className="hover:bg-yellow-100 py-2 px-4 rounded">
          JavaScript
        </button>
        <button className="hover:bg-yellow-100 py-2 px-4 rounded">React</button>
        <button className="hover:bg-yellow-100 py-2 px-4 rounded">
          Python
        </button>
        <button className="hover:bg-yellow-100 py-2 px-4 rounded">
          Algorithms
        </button>
        <button className="hover:bg-yellow-100 py-2 px-4 rounded">
          System Design
        </button>
      </div>

      {/* Main Content + Leaderboard */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left: Quiz Section */}
        <section className="flex-1 flex flex-col gap-6">
          {/* <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                JavaScript Fundamentals
              </h2>
              <p className="text-gray-600 mb-1">
                20 questions &nbsp;|&nbsp; 30 minutes &nbsp;|&nbsp;{" "}
                <span className="text-green-600 font-medium">Easy</span>
              </p>
              <p className="text-yellow-900">
                156 attempts{" "}
                <span className="text-green-700 font-bold ml-1">Best: 85%</span>
              </p>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-300 transition px-8 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0">
              Start Quiz
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                JavaScript Fundamentals
              </h2>
              <p className="text-gray-600 mb-1">
                20 questions &nbsp;|&nbsp; 30 minutes &nbsp;|&nbsp;{" "}
                <span className="text-green-600 font-medium">Easy</span>
              </p>
              <p className="text-yellow-900">
                156 attempts{" "}
                <span className="text-green-700 font-bold ml-1">Best: 85%</span>
              </p>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-300 transition px-8 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0">
              Start Quiz
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                JavaScript Fundamentals
              </h2>
              <p className="text-gray-600 mb-1">
                20 questions &nbsp;|&nbsp; 30 minutes &nbsp;|&nbsp;{" "}
                <span className="text-green-600 font-medium">Easy</span>
              </p>
              <p className="text-yellow-900">
                156 attempts{" "}
                <span className="text-green-700 font-bold ml-1">Best: 85%</span>
              </p>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-300 transition px-8 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0">
              Start Quiz
            </button>
          </div> */}

          <div className="overflow-x-auto space-y-4 max-h-[600px] p-4">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between min-w-[350px]"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    {quiz.questions} questions &nbsp;|&nbsp; {quiz.duration}{" "}
                    &nbsp;|&nbsp;{" "}
                    <span
                      className={`font-medium ${
                        quiz.difficulty === "Easy"
                          ? "text-green-600"
                          : quiz.difficulty === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </p>
                  <p className="text-yellow-900">
                    {quiz.attempts} attempts{" "}
                    <span className="text-green-700 font-bold ml-1">
                      Best: {quiz.bestScore}%
                    </span>
                  </p>
                </div>
                <button
                  className="bg-yellow-400 hover:bg-yellow-300 transition px-8 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Leaderboard */}
        <aside className="w-full lg:w-64 bg-yellow-100 rounded-2xl shadow-xl p-6 self-start sticky top-24 ml-auto">
          <h3 className="font-bold text-yellow-700 text-xl mb-4">
            Leaderboard
          </h3>
          <ol>
            {leaderboard.map((user, idx) => (
              <li
                key={user.name}
                className={`flex justify-between items-center p-2 rounded-lg mb-2 ${
                  user.name === "You" ? "bg-yellow-200 font-semibold" : ""
                }`}
              >
                <span>
                  {idx + 1 === 1
                    ? "🥇 "
                    : idx + 1 === 2
                    ? "🥈 "
                    : idx + 1 === 3
                    ? "🥉 "
                    : ""}
                  {user.name}
                </span>
                <span>{user.score}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
