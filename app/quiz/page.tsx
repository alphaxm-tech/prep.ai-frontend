import React from "react";
import { StatCard } from "../../components/StatCard";

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

export default function Quiz() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8 font-sans">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{
              fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
              WebkitFontVariantLigatures: "none",
              fontVariantLigatures: "none",
              letterSpacing: "-0.0625rem",
              lineHeight: "1.2",
              color: "#1a1a1a", // Adjust to match --heading-color or theme
            }}
          >
            Quizzes
          </h1>
          <p className="text-lg text-yellow-900">
            Test your knowledge and compete with others
          </p>
        </div>
        <button
          className="bg-yellow-300 hover:bg-yellow-200 transition px-6 py-3 text-yellow-900 font-semibold rounded-lg shadow-lg text-lg mt-4 md:mt-0"
          style={{
            color: "#1a1a1a", // Adjust to match --heading-color or theme
          }}
        >
          🏆 Compete on Leaderboard
        </button>
      </div>

      {/* Stats */}
      <section className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Quizzes Taken" value={userStats.quizzesTaken} />
        <StatCard label="Best Score" value={userStats.bestScore + "%"} />
        <StatCard label="Total Time" value={userStats.totalTime} />
        <StatCard label="Avg Score" value={userStats.avgScore + "%"} />
      </section>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-8">
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

      {/* Quiz Section */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center justify-between">
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
      </section>

      {/* Leaderboard */}
      <section className="w-full max-w-xs bg-yellow-100 rounded-2xl shadow-xl p-6">
        <h3 className="font-bold text-yellow-700 text-xl mb-4">Leaderboard</h3>
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
      </section>
    </div>
  );
}
