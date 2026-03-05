// app/ai-interview/page.tsx
"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type LearningPath = {
  title: string;
  description: string;
  color: string;
};

type Module = {
  id: number;
  title: string;
  time: string;
  materials: number;
  topics: string[];
  completed?: boolean;
  cta?: string;
};

export default function AIInterviewPage() {
  const [selectedPath, setSelectedPath] = useState("Frontend Development");

  const learningPaths: LearningPath[] = [
    {
      title: "Front end Web Development",
      description: "Build and deploy scalable web applications",
      color: "border-blue-300 bg-blue-50",
    },
    {
      title: "Full-Stack Web Development",
      description: "Build and deploy scalable web applications",
      color: "border-blue-300 bg-blue-50",
    },
    {
      title: "AI & Machine Learning",
      description: "Master data-driven models and AI-powered solutions",
      color: "border-purple-300 bg-purple-50",
    },
    {
      title: "Blockchain & Web3 Development",
      description: "Develop decentralized applications and smart contracts",
      color: "border-green-300 bg-green-50",
    },
    {
      title: "Cloud Computing & DevOps",
      description: "Deploy, scale, and monitor cloud-native applications",
      color: "border-yellow-300 bg-yellow-50",
    },
    {
      title: "Cybersecurity & Ethical Hacking",
      description: "Protect systems and networks from security threats",
      color: "border-red-300 bg-red-50",
    },
  ];

  const modules: Module[] = [
    {
      id: 1,
      title: "HTML & CSS Fundamentals",
      time: "4 hours",
      materials: 4,
      topics: [
        "HTML Basics",
        "CSS Styling",
        "Responsive Design",
        "Flexbox & Grid",
      ],
      completed: true,
      cta: "Completed",
    },
    {
      id: 2,
      title: "JavaScript Essentials",
      time: "8 hours",
      materials: 4,
      topics: [
        "Variables & Functions",
        "DOM Manipulation",
        "ES6+ Features",
        "Async Programming",
      ],
      cta: "Continue",
    },
    {
      id: 3,
      title: "React Development",
      time: "12 hours",
      materials: 4,
      topics: ["Components", "Hooks", "State Management", "Routing"],
      cta: "Start",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col items-start justify-start gap-2 pb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Level Up Your Tech Skills
          </h1>
          <p className="text-lg text-yellow-900">
            Curated guides, coding challenges, and resources to help you land
            your dream tech role
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 space-y-3">
            {learningPaths.map((path) => (
              <div
                key={path.title}
                onClick={() => setSelectedPath(path.title)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  selectedPath === path.title
                    ? `${path.color} shadow-sm`
                    : "bg-white border-gray-200 hover:shadow-sm"
                }`}
              >
                <h3 className="font-semibold text-gray-800">{path.title}</h3>
                <p className="text-sm text-gray-600">{path.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">{selectedPath}</h2>
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-5 rounded-xl border bg-white hover:shadow-md transition relative ${
                    module.completed ? "border-green-300" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium">
                        {module.id}
                      </span>
                      <h3 className="font-semibold text-gray-800">
                        {module.title}
                      </h3>
                    </div>
                    {module.completed ? (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircleIcon className="w-5 h-5 mr-1" /> Completed
                      </span>
                    ) : (
                      <button className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition">
                        {module.cta}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{module.time}</span>
                    <span>{module.materials} materials</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {module.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
