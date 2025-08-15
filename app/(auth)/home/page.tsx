"use client";

import { useState } from "react";
import Card from "../../../components/Card";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const stats = [
    {
      label: "Days Active",
      value: "15",
      icon: <CalendarDaysIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Quizzes Completed",
      value: "8",
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Study Hours",
      value: "24",
      icon: <ClockIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Improvement",
      value: "85%",
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-500" />,
    },
  ];

  const handleCardClick = (cardTitle: string) => {
    console.log(cardTitle);
    let route;
    if (cardTitle === "Home") {
      route = "home";
    } else if (cardTitle === "Quizzes") {
      route = "quiz";
    } else if (cardTitle === "Resume Builder") {
      route = "resume-builder";
    } else if (cardTitle === "AI Interviews") {
      route = "ai-interview";
    } else if (cardTitle === "Study Materials") {
      route = "study-material";
    }
    router.push(`/${route}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <section className="text-center py-12 px-4">
        <h2
          className="text-3xl md:text-4xl font-normal mb-4"
          style={{
            fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
            WebkitFontVariantLigatures: "none",
            fontVariantLigatures: "none",
            letterSpacing: "-0.0625rem",
            lineHeight: "1.2",
            color: "#1a1a1a", // Adjust to match --heading-color or theme
          }}
        >
          Empower Your Career with AI
        </h2>

        <p
          className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6"
          style={{
            color: "#1a1a1a", // Adjust to match --heading-color or theme
          }}
        >
          prep.ai helps students master resumes, mock interviews, and skills —
          using the power of AI to land their dream job faster.
        </p>
      </section>

      {/* Dashboard Content */}
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card
            title="Build Resume"
            description="Create a professional resume with AI assistance"
            variant="yellow"
            onClick={() => handleCardClick("Resume Builder")}
          />
          <Card
            title="Mock Interview"
            description="Practice with AI interviewer"
            variant="green"
            onClick={() => handleCardClick("AI Interviews")}
          />
          <Card
            title="Take Quiz"
            description="Test your knowledge"
            variant="purple"
            onClick={() => handleCardClick("Quizzes")}
          />
          <Card
            title="Study Materials"
            description="Access learning resources"
            variant="blue"
            onClick={() => handleCardClick("Study Materials")}
          />
        </div>

        {/* <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              👋 Hello Sanket
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Here's a quick look at your progress so far.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: any) => (
              <div
                key={stat.label}
                className="flex items-center space-x-4 p-4 bg-white/40 backdrop-blur-md border border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div>{stat.icon}</div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-700">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-sm bg-gray-50 p-5 border border-gray-200 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <p>
            <span className="font-medium">College:</span> Sample College
          </p>
          <p>
            <span className="font-medium">Year:</span> 2024
          </p>
          <p>
            <span className="font-medium">Stream:</span> Computer Science
          </p>
          <button className="mt-4 w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg">
            View Profile
          </button>
        </div> */}
      </main>
    </div>
  );
}
