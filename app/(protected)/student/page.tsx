"use client";

import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useContext } from "react";
import { AuthContext } from "@/app/provider";
import { STUDENT_ROUTE } from "@/utils/CONSTANTS";

export default function Dashboard() {
  const router = useRouter();
  const userDetailsMain = useContext(AuthContext);

  // useEffect(() => {
  //   console.log(userDetailsMain);
  // }, [userDetailsMain]);

  const user = userDetailsMain?.user;
  const services = userDetailsMain?.services ?? [];

  const firstName =
    user?.full_name?.split(/[, ]+/)?.filter(Boolean)[1] ?? "there";

  console.log(user?.full_name);
  console.log(firstName);

  const handleCardClick = (cardTitle: string) => {
    let route;
    if (cardTitle === "Quizzes") route = "quiz";
    else if (cardTitle === "Resume Builder") route = "resume-builder";
    else if (cardTitle === "AI Interviews") route = "ai-interview";
    else if (cardTitle === "Study Materials") route = "study-material";
    else if (cardTitle === "Code Editor") route = "study-material";

    if (route) router.push(`${STUDENT_ROUTE}/${route}`);
  };

  // if (isLoading) {
  //   return <Loader show={isLoading} message="Loading your profile" />;
  // }

  // if (isError) {
  //   return <div className="p-8 text-red-500">Failed to load dashboard</div>;
  // }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* MASTER LAYOUT CONTAINER */}
      <div className="max-w-[1450px] mx-auto px-4">
        {/* ================= WELCOME ================= */}
        {user && (
          <section className="pt-10 pb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Welcome back, {firstName} 👋
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>
                <strong className="text-gray-700">Email:</strong> {user.email}
              </span>

              <span>
                <strong className="text-gray-700">Location:</strong>{" "}
                {user.location ?? "—"}
              </span>

              <span className="flex items-center gap-1">
                <strong className="text-gray-700">Email:</strong>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <CheckCircleIcon className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <XCircleIcon className="h-4 w-4" />
                    Not verified
                  </span>
                )}
              </span>
            </div>
          </section>
        )}

        {/* ================= HERO (ADJUSTED FOR DASHBOARD) ================= */}
        <section className="pt-6 pb-10">
          <h2
            className="text-2xl md:text-3xl font-normal mb-3 text-center"
            style={{
              fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
              letterSpacing: "-0.04rem",
              lineHeight: "1.25",
              color: "#1a1a1a",
            }}
          >
            Empower your career with AI
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto text-center">
            Build resumes, practice interviews, and sharpen skills — faster and
            smarter with prep.ai.
          </p>
        </section>

        {/* ================= ACTION CARDS ================= */}
        <section className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card
              title="Build Resume"
              description="Create a professional resume with AI assistance"
              variant="yellow"
              onClick={() => handleCardClick("Resume Builder")}
            />
            <Card
              title="Take Quiz"
              description="Test your knowledge"
              variant="purple"
              onClick={() => handleCardClick("Quizzes")}
            />
            <Card
              title="Take Coding Test"
              description="Practise data structures and algorithm"
              variant="blue"
              onClick={() => handleCardClick("Study Materials")}
            />
            <Card
              title="AI Interview"
              description="Practice with AI interviewer"
              variant="green"
              onClick={() => handleCardClick("AI Interviews")}
            />
            <Card
              title="Study Materials"
              description="Access learning resources"
              variant="blue"
              onClick={() => handleCardClick("Study Materials")}
            />
          </div>
        </section>

        <section className="py-16">
          <div className="relative overflow-hidden rounded-[36px] border border-yellow-100 bg-gradient-to-br from-[#fffdf7] via-white to-[#fff8e7] p-10 md:p-14">
            {/* subtle glow */}
            <div className="absolute -top-10 right-0 h-72 w-72 rounded-full bg-yellow-100 blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-50 blur-3xl opacity-70" />

            <div className="relative z-10">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1 text-sm font-medium text-yellow-700">
                  AI-powered interview preparation
                </span>

                <h2
                  className="mt-6 text-4xl md:text-5xl font-normal text-gray-900 leading-tight"
                  style={{
                    fontFamily:
                      'Means Web, Georgia, Times, "Times New Roman", serif',
                    letterSpacing: "-0.04rem",
                  }}
                >
                  Getting interview-ready
                  <br />
                  shouldn’t feel overwhelming.
                </h2>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Most students struggle not because they lack potential, but
                  because preparation feels confusing and unstructured.
                </p>

                <p className="mt-4 text-lg leading-8 text-gray-600">
                  prep.ai helps you prepare with clarity through AI interviews,
                  resume feedback, coding practice, and guided learning — all
                  designed to help you feel confident before real interviews.
                </p>
              </div>

              {/* feature pills */}
              <div className="mt-12 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-5 py-3 shadow-sm text-gray-700">
                  AI Mock Interviews
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-5 py-3 shadow-sm text-gray-700">
                  ATS Resume Feedback
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-5 py-3 shadow-sm text-gray-700">
                  Coding Practice
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-5 py-3 shadow-sm text-gray-700">
                  Structured Preparation
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
