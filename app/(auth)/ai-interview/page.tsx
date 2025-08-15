"use client";

import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function AIInterviewPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Blockchain Developer",
  ];

  const interviewTypes = [
    {
      title: "Technical Interview",
      description: "Coding problems and system design questions",
      time: "45-60 min",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "Behavioral Interview",
      description: "Situational and behavioral questions",
      time: "30-45 min",
      difficulty: "Easy",
      difficultyColor: "bg-green-100 text-green-800",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      title: "System Design",
      description: "Architecture and scalability discussions",
      time: "60-90 min",
      difficulty: "Hard",
      difficultyColor: "bg-red-100 text-red-800",
      iconColor: "bg-red-100 text-red-600",
    },
    {
      title: "Technical Interview",
      description: "Coding problems and system design questions",
      time: "45-60 min",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "Behavioral Interview",
      description: "Situational and behavioral questions",
      time: "30-45 min",
      difficulty: "Easy",
      difficultyColor: "bg-green-100 text-green-800",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      title: "System Design",
      description: "Architecture and scalability discussions",
      time: "60-90 min",
      difficulty: "Hard",
      difficultyColor: "bg-red-100 text-red-800",
      iconColor: "bg-red-100 text-red-600",
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Company Dropdown */}
            <div className="relative inline-block w-full md:w-1/2">
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all cursor-pointer hover:shadow-md w-full"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Role Dropdown */}
            <div className="relative inline-block w-full md:w-1/2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all cursor-pointer hover:shadow-md w-full"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Interview Types */}
          <div className="overflow-x-auto -mx-2 px-2 mb-6">
            <div className="flex gap-4 snap-x snap-mandatory pb-2">
              {interviewTypes.map((type) => (
                <div
                  key={type.title}
                  className="min-w-[250px] snap-start bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${type.iconColor}`}
                  >
                    <PlayIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{type.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">{type.time}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.difficultyColor}`}
                    >
                      {type.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Interview Button */}
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
            <PlayIcon className="w-5 h-5" /> Start Interview
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
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Interviews</h2>
        <p className="text-gray-500 text-sm">No recent interviews found.</p>
      </div>
    </div>
  );
}
